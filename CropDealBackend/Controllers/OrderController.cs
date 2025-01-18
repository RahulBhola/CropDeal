using System.Security.Claims;
using CropDealBackend.Dtos;
using CropDealBackend.Interface;
using CropDealBackend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CropDealBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderTransaction _orderTransactionRepository;
        private readonly IInvoice _invoiceRepository;
        private readonly IAddress _addressRepository;
        private readonly IFarmer _cropDetailsRepository;
        private readonly IBankAccount _bankAccountRepository;
        private readonly IUserRepository _userRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public OrderController(
            IOrderTransaction orderTransactionRepository,
            IInvoice invoiceRepository,
            IAddress addressRepository,
            IFarmer cropDetailsRepository,
            IBankAccount bankAccountRepository,
            UserManager<ApplicationUser> userManager
            )
        {
            _orderTransactionRepository = orderTransactionRepository;
            _invoiceRepository = invoiceRepository;
            _addressRepository = addressRepository;
            _cropDetailsRepository = cropDetailsRepository;
            _bankAccountRepository = bankAccountRepository;
            _userManager = userManager;
        }

        [HttpGet("get-order-details/{orderId}")]
        public async Task<IActionResult> GetOrderDetails(int orderId)
        {
            // Fetch the order transaction by ID
            var orderTransaction = await _orderTransactionRepository.GetOrderTransactionById(orderId);
            if (orderTransaction == null)
            {
                return NotFound(new { Message = "Order transaction not found." });
            }

            // Fetch the associated invoice
            var invoice = await _invoiceRepository.GetInvoiceById(orderTransaction.InvoiceId ?? 0);
            if (invoice == null)
            {
                return NotFound(new { Message = "Invoice not found for the order." });
            }

            // Fetch the user details
            var user = await _userManager.FindByIdAsync(orderTransaction.UserId);
            if (user == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            // Fetch the bank account details
            var bankAccount = await _bankAccountRepository.GetBankAccountDetails(orderTransaction.UserId);
            if (bankAccount == null)
            {
                return NotFound(new { Message = "Bank account not found." });
            }

            // Fetch crop details
            var cropIds = invoice.CropIds; // Assuming CropIds is an array
            var cropDetailsList = new List<CropDetailsDto>();
            foreach (var cropId in cropIds)
            {
                var cropDetails = await _cropDetailsRepository.GetCropById(cropId);
                if (cropDetails != null)
                {
                    cropDetailsList.Add(new CropDetailsDto
                    {
                        CropId = cropDetails.CropId,
                        Type = cropDetails.Type,
                        CropName = cropDetails.CropName,
                        AvailableQuantity = cropDetails.AvailableQuantity,
                        PricePerKg = cropDetails.PricePerKg,
                        Description = cropDetails.Description,
                        UserId = cropDetails.UserId,
                        ImageData = cropDetails.ImageData != null ? Convert.ToBase64String(cropDetails.ImageData) : null
                    });
                }
            }

            // Return the complete order details
            return Ok(new
            {
                OrderTransactionId = orderTransaction.OrderTransactionId,
                OrderQuantity = orderTransaction.OrderQuantity,
                TotalPrice = orderTransaction.TotalPrice,
                OrderDate = orderTransaction.OrderDate,
                DeliveryDate = orderTransaction.DeliveryDate,
                OrderTransactionStatus = orderTransaction.OrderTransactionStatus,
                Invoice = new
                {
                    InvoiceId = invoice.InvoiceId,
                    BillingTo = invoice.BillingTo,
                    DeliveryAddress = invoice.DeliveryAddress,
                    OrderDate = invoice.OrderDate,
                    DeliveryDate = invoice.DeliveryDate,
                    AccountId = invoice.AccountId
                },
                User = new
                {
                    UserId = user.Id,
                    UserName = user.UserName,
                    Email = user.Email
                },
                BankAccount = new
                {
                    AccountId = bankAccount.AccountId,
                    BankName = bankAccount.BankName,
                    AccountNumber = bankAccount.AccountNumber
                },
                Crops = cropDetailsList
            });
        }

        [HttpPost("create-order")]
        public async Task<IActionResult> CreateOrder([FromBody] OrderTransactionDto orderTransactionDto)
        {
            // Fetch the Address based on UserId
            var userAddress = await _addressRepository.GetAddress(orderTransactionDto.UserId);
            if (userAddress == null)
            {
                return BadRequest("Address not found for the user.");
            }

            // Fetch User details to use in invoice creation
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { Message = "User ID not found in claims." });
            }
            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                return NotFound(new { Message = "User not found." });
            }

            // Fetch Bank Account details based on UserId
            var bankAccount = await _bankAccountRepository.GetBankAccountDetails(orderTransactionDto.UserId);
            if (bankAccount == null)
            {
                return BadRequest("Bank account not found for the user.");
            }

            // Process crops from Cart
            var cropIds = orderTransactionDto.CropId;
            if (cropIds == null || cropIds.Length == 0)
            {
                return BadRequest("No crops selected for the order.");
            }

            // Create the OrderTransaction
            var orderTransaction = new OrderTransaction
            {
                OrderQuantity = orderTransactionDto.OrderQuantity,
                TotalPrice = orderTransactionDto.TotalPrice,
                DeliveryDate = orderTransactionDto.DeliveryDate,
                UserId = orderTransactionDto.UserId,
                OrderDate = DateTime.Now
            };

            var createdOrderTransaction = await _orderTransactionRepository.CreateOrderTransactionAsync(orderTransaction);

            // Create a single invoice for all selected crops
            var invoice = new Invoice
            {
                BillingTo = user.UserName,
                DeliveryAddress = $"{userAddress.LandMark}, {userAddress.City}, {userAddress.District}, {userAddress.State}, {userAddress.Country} - {userAddress.PinCode}",
                OrderDate = DateTime.Now,
                DeliveryDate = orderTransaction.DeliveryDate.AddDays(7),
                CropIds = cropIds, // Store the CropIds array
                AccountId = bankAccount.AccountId,
            };

            var createdInvoice = await _invoiceRepository.CreateInvoice(invoice);

            // Link the Invoice to the OrderTransaction
            createdOrderTransaction.InvoiceId = createdInvoice.InvoiceId;
            await _orderTransactionRepository.UpdateOrderTransaction(createdOrderTransaction);

            return Ok(new
            {
                OrderTransactionId = createdOrderTransaction.OrderTransactionId,
                InvoiceId = createdInvoice.InvoiceId,
                Message = "Order and Invoice created successfully."
            });
        }

        [HttpGet("get-orders-by-user")]
        public async Task<IActionResult> GetOrdersByUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { Message = "User ID not found in claims." });
            }

            // Fetch all orders for the user
            var orderTransactions = await _orderTransactionRepository.GetOrdersByUserId(userId);
            if (orderTransactions == null || !orderTransactions.Any())
            {
                return NotFound(new { Message = "No orders found for this user." });
            }

            // Create a response with the order and invoice details
            var orderDetails = orderTransactions
                .Where(order => order.Invoice != null)  // Filter orders that have an invoice
                .Select(order => new
                {
                    OrderTransactionId = order.OrderTransactionId,
                    OrderQuantity = order.OrderQuantity,
                    TotalPrice = order.TotalPrice,
                    OrderDate = order.OrderDate,
                    DeliveryDate = order.DeliveryDate,
                    OrderTransactionStatus = order.OrderTransactionStatus,
                    Invoice = new
                    {
                        InvoiceId = order.Invoice.InvoiceId,
                        BillingTo = order.Invoice.BillingTo,
                        DeliveryAddress = order.Invoice.DeliveryAddress,
                        OrderDate = order.Invoice.OrderDate,
                        DeliveryDate = order.Invoice.DeliveryDate,
                        AccountId = order.Invoice.AccountId
                    }
                }).ToList();


            return Ok(orderDetails);
        }

        [HttpGet("get-all-invoices")]
        public async Task<IActionResult> GetAllInvoices()
        {
            var invoices = await _invoiceRepository.GetAllInvoices();
            if (invoices == null || !invoices.Any())
            {
                return NotFound(new { Message = "No invoices found." });
            }

            var invoiceDtos = invoices.Select(invoice => new
            {
                InvoiceId = invoice.InvoiceId,
                BillingTo = invoice.BillingTo,
                DeliveryAddress = invoice.DeliveryAddress,
                OrderDate = invoice.OrderDate,
                DeliveryDate = invoice.DeliveryDate,
                CropIds = invoice.CropIds,
                AccountId = invoice.AccountId
            });

            return Ok(invoiceDtos);
        }

    }
}
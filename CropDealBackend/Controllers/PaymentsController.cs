using CropDealBackend.Interface;
using CropDealBackend.Models;
using Microsoft.AspNetCore.Mvc;

namespace CropDealBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentsController: ControllerBase
    {
        private readonly IStripePaymentService _stripePaymentService;
        private readonly IOrderTransaction _orderTransaction;
        public PaymentsController(IStripePaymentService stripePaymentService, IOrderTransaction orderTransaction){
            _stripePaymentService = stripePaymentService;
            _orderTransaction= orderTransaction;
        }

        [HttpPost("create-payment-intent")]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentRequest request){
            if(request.Amount <= 0){
                return BadRequest("Amount must be greater than zero.");
            }
            var clientSecret = await _stripePaymentService.CreatePaymentIntentAsync(request.Amount);
            return Ok(new {clientSecret});
        }

        [HttpGet("products")]
        public async Task<IActionResult> GetProducts(){
            var products = await _stripePaymentService.GetProductsAsync();
            return Ok(products);
        }

        // [HttpPost("save-order-transaction")]
        // public async Task<IActionResult> SaveOrderTransaction([FromBody] OrderTransactionDto orderTransactionRequest){
        //     if (orderTransactionRequest.TotalPrice <= 0){
        //         return BadRequest("Total Price must be greater than zero.");
        //     }
        //     var orderTransaction = new OrderTransaction{
        //         OrderQuantity = orderTransactionRequest.OrderQuantity,
        //         TotalPrice = orderTransactionRequest.TotalPrice,
        //         OrderDate = DateTime.UtcNow,
        //         DeliveryDate = orderTransactionRequest.DeliveryDate,
        //         OrderTransactionStatus = true,  // assuming the status is 'paid' at this point
        //         // InvoiceId = orderTransactionRequest.InvoiceId,
        //         UserId = orderTransactionRequest.UserId,
        //     };
        //     var createdTransaction = await _orderTransaction.CreateOrderTransactionAsync(orderTransaction);

        //     return Ok(new { OrderTransactionId = createdTransaction.OrderTransactionId });
        // }
    }
}
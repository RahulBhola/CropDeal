using CropDealBackend.Interface;
using CropDealBackend.Models;
using Microsoft.AspNetCore.Mvc;

namespace CropDealBackend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InvoiceController : ControllerBase
    {
        private readonly IInvoice _invoiceRepository;
        private readonly IFarmer _cropDetailsRepository; // Add this to fetch crop details
        private readonly EmailService _emailService;

        public InvoiceController(
            IInvoice invoiceRepository,
            IFarmer cropDetailsRepository, // Inject the crop details repository
            EmailService emailService)
        {
            _invoiceRepository = invoiceRepository;
            _cropDetailsRepository = cropDetailsRepository; // Initialize crop details repository
            _emailService = emailService;
        }

        [HttpPost("SendEmail")]
        public async Task<IActionResult> SendEmail(string email, int invoiceId)
        {
            try
            {
                // Fetch invoice details
                var invoice = await _invoiceRepository.GetInvoiceById(invoiceId);
                if (invoice == null)
                {
                    return NotFound("Invoice not found.");
                }

                // Fetch crop details for the crops in the invoice
                var cropDetails = await _cropDetailsRepository.GetCropDetailsByIds(invoice.CropIds);

                // Generate invoice as HTML table
                var invoiceHtml = GenerateInvoiceHtml(invoice, cropDetails);

                // Send email with crop details
                await _emailService.SendEmailAsync(
                    email,
                    "Your Invoice Details",
                    invoiceHtml,
                    null // No attachment
                );

                return Ok(new { message = "Email sent successfully!" });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.Message}");
                return StatusCode(500, $"Error sending email: {ex.Message}");
            }
        }

        private string GenerateInvoiceHtml(Invoice invoice, IEnumerable<CropDetails> cropDetails)
        {
            var cropDetailsHtml = string.Join("", cropDetails.Select(crop =>
                $@"
                <tr>
                    <td style='text-align: left; padding: 8px;'>{crop.CropName}</td>
                    <td style='text-align: left; padding: 8px;'>{crop.Type}</td>
                    <td style='text-align: left; padding: 8px;'>{crop.PricePerKg:C}</td>
                    <td style='text-align: left; padding: 8px;'>{crop.Description}</td>
                </tr>"));

            return $@"
                <h3>Invoice Details</h3>
                <table border='1' style='border-collapse: collapse; width: 100%;'>
                    <tr>
                        <th style='text-align: left; padding: 8px;'>Invoice ID</th>
                        <td style='text-align: left; padding: 8px;'>{invoice.InvoiceId}</td>
                    </tr>
                    <tr>
                        <th style='text-align: left; padding: 8px;'>Billing To</th>
                        <td style='text-align: left; padding: 8px;'>{invoice.BillingTo}</td>
                    </tr>
                    <tr>
                        <th style='text-align: left; padding: 8px;'>Delivery Address</th>
                        <td style='text-align: left; padding: 8px;'>{invoice.DeliveryAddress}</td>
                    </tr>
                    <tr>
                        <th style='text-align: left; padding: 8px;'>Order Date</th>
                        <td style='text-align: left; padding: 8px;'>{invoice.OrderDate:yyyy-MM-dd}</td>
                    </tr>
                    <tr>
                        <th style='text-align: left; padding: 8px;'>Delivery Date</th>
                        <td style='text-align: left; padding: 8px;'>{invoice.DeliveryDate:yyyy-MM-dd}</td>
                    </tr>
                    <tr>
                        <th colspan='5' style='text-align: left; padding: 8px;'>Crop Details</th>
                    </tr>
                    <tr>
                        <th style='text-align: left; padding: 8px;'>Crop Name</th>
                        <th style='text-align: left; padding: 8px;'>Type</th>
                        <th style='text-align: left; padding: 8px;'>Price</th>
                        <th style='text-align: left; padding: 8px;'>Description</th>
                    </tr>
                    {cropDetailsHtml}
                </table>
                <p>Thank you for your business!</p>";
        }
    }
}

using CropDealBackend.Interface;
using CropDealBackend.Models;
using Microsoft.Extensions.Options;
using Stripe;

namespace CropDealBackend.Repository
{
    public class StripePaymentRepository: IStripePaymentService
    {
        private readonly StripeSettings _stripeSettings;
        public StripePaymentRepository(IOptions<StripeSettings> stripeSettings){
            _stripeSettings = stripeSettings.Value;
            StripeConfiguration.ApiKey = _stripeSettings.SecretKey;
        }

        public async Task<string> CreatePaymentIntentAsync(decimal amount){
            var options = new PaymentIntentCreateOptions{
                Amount = (long)(amount*100),
                Currency = "usd",
                PaymentMethodTypes = new List<string> {"card"},
            };
            var service = new PaymentIntentService();
            var paymentIntent = await service.CreateAsync(options);

            return paymentIntent.ClientSecret;
        }

        public async Task<List<Product>> GetProductsAsync(){
            var productService = new ProductService();
            var options = new ProductListOptions{
                Limit=10,
            };
            var products = await productService.ListAsync(options);
            return products.Data;
        }

        // public async Task SendEmailAsync(string to, string subject, string body, byte[] attachment)
        // {
        //     // Configure email settings (e.g., sender email, SMTP server)
        //     var emailClient = new SmtpClient("your.smtp.server", 587); 
        //     emailClient.Credentials = new NetworkCredential("your_email", "your_email_password"); 
        //     emailClient.EnableSsl = true; 

        //     var message = new MailMessage("your_email", to, subject, body);
        //     message.Attachments.Add(new Attachment(new MemoryStream(attachment), "invoice.pdf")); 

        //     await emailClient.SendMailAsync(message);
        // }
    }
}
using System.Net;
using System.Net.Mail;

public class EmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    // public async Task SendEmailAsync(string to, string subject, string body, byte[] attachment)
    // {
    //     var smtpServer = _configuration["EmailSettings:SmtpServer"]; 
    //     var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"]); 
    //     var fromAddress = _configuration["EmailSettings:FromAddress"]; 
    //     var fromPassword = _configuration["EmailSettings:FromPassword"]; 

    //     using (var client = new SmtpClient(smtpServer, smtpPort))
    //     {
    //         client.Credentials = new NetworkCredential(fromAddress, fromPassword);
    //         client.EnableSsl = true;

    //         var message = new MailMessage(fromAddress, to, subject, body);
    //         message.Attachments.Add(new Attachment(new MemoryStream(attachment), "invoice.pdf")); 

    //         await client.SendMailAsync(message);
    //     }
    // }

    public async Task SendEmailAsync(string to, string subject, string body, byte[] attachment)
    {
        var smtpServer = _configuration["EmailSettings:SmtpServer"];
        var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"]);
        var fromAddress = _configuration["EmailSettings:FromAddress"];
        var fromPassword = _configuration["EmailSettings:FromPassword"];

        using (var client = new SmtpClient(smtpServer, smtpPort))
        {
            client.Credentials = new NetworkCredential(fromAddress, fromPassword);
            client.EnableSsl = true;

            var message = new MailMessage
            {
                From = new MailAddress(fromAddress),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };
            message.To.Add(to);

            // Add attachment if provided
            if (attachment != null)
            {
                message.Attachments.Add(new Attachment(new MemoryStream(attachment), "invoice.pdf"));
            }

            await client.SendMailAsync(message);
        }
    }

}
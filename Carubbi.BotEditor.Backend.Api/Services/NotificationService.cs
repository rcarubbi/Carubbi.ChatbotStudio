using Microsoft.AspNet.Identity;
using System.Net.Mail;
using System.Threading.Tasks;

namespace Carubbi.BotEditor.Backend.Api.Services
{
    public class NotificationService : IIdentityMessageService
    {
        public Task SendAsync(IdentityMessage message)
        {
            // TODO: Referenciar componente
            // IMailSender sender = new SmtpSender();
            var email = new MailMessage
            {
                Body = message.Body,
                Subject = message.Subject
            };

            email.To.Add(message.Destination);

            // sender.Send(email);

            return Task.FromResult<object>(null);
        }
    }
}
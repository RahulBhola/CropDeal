using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CropDealBackend.Filters
{
    public class CustomAuthorizationFilter : IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var authResult = context.HttpContext.User.Identity.IsAuthenticated;
            if (!authResult)
            {
                context.Result = new UnauthorizedObjectResult(new { Message = "You are not authorized to access this resource." });
            }
        }
    }
}

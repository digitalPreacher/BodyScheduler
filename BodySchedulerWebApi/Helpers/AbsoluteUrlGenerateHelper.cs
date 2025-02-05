namespace BodyShedule_v_2_0.Server.Helpers
{
    public static class AbsoluteUrlGenerateHelper
    {
     
        public static string GenerateAbsoluteUrl(string actionName, string controllerName, string token, string domainName, string email)
        {
            var url = $"{domainName}{controllerName}/{actionName}?token={token}&email={email}";

            return url;
        }
    }
}


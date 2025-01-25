using BodyShedule_v_2_0.Server.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BodyShedule_v_2_0.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
    public class AdminUserController : ControllerBase
    {
        private readonly IAdminUserService _service;
        private readonly ILogger<AdminUserController> _logger;  

        public AdminUserController(IAdminUserService service, ILogger<AdminUserController> logger)
        {
            _service = service;
            _logger = logger;
        }

        //Get list of users for admin
        [HttpGet]
        [Route("GetApplicationUsers")]
        public async Task<IActionResult> GetApplicationUsersAsync()
        {
            try
            {
                var usersList = await _service.GetApplicationUsersAsync();

                return Ok(usersList);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message);

                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }

    }
}

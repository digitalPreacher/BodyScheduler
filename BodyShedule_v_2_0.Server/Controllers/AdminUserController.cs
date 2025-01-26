using BodyShedule_v_2_0.Server.DataTransferObjects.AdminUserDTOs;
using BodyShedule_v_2_0.Server.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BodyShedule_v_2_0.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    //[Authorize(AuthenticationSchemes = "Bearer", Roles = "Admin")]
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

        //get application user data by user id 
        [HttpGet]
        [Route("GetApplicationUser/{id}")]
        public async Task<IActionResult> GetApplicationUserAsync(int id)
        {
            try
            {
                var user = await _service.GetApplicationUserAsync(id);

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message);

                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }

        }

        //Update user data
        [HttpPut]
        [Route("UpdateUserData")]
        public async Task<IActionResult> UpdateUserDataAsync(UpdateUserDataDTO updateUserInfo)
        {
            try
            {
                var result = await _service.UpdateUserDataAsync(updateUserInfo);
                if (result)
                {
                    return Ok(new { Message = "Запись успешно изменена" });
                }
                else
                {
                    return BadRequest(new { Message = "Произошла ошибка, повторите запрос" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message);

                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }
    }
}

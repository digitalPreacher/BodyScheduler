using BodySchedulerWebApi.Exceptions;
using BodySchedulerWebApi.Service;
using Microsoft.AspNetCore.Mvc;
using System.Runtime.InteropServices;

namespace BodySchedulerWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AchievementsController : ControllerBase
    {
        private readonly IAchievementService _achievementService;
        private readonly ILogger<AchievementsController> _logger;

        public AchievementsController(IAchievementService achievementService, ILogger<AchievementsController> logger)
        {
            _achievementService = achievementService;
            _logger = logger;
        }

        //update user achievements
        [HttpPut]
        [Route("UpdateAchievements/userId={userId}&achievemetName={achievemetName}")]
        public async Task<IActionResult> UpdateAchievementsAsync([FromRoute]string userId, [FromRoute]string achievemetName)
        {
            try
            {
                await _achievementService.UpdateAchievementsAsync(userId, achievemetName);
                return Ok();
            }
            catch(EntityNotFoundException ex)
            {
                _logger.LogInformation(ex.Message);
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }
    }
}

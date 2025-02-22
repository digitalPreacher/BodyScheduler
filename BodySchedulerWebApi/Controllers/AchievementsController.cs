using BodySchedulerWebApi.DataTransferObjects.AchievenetsDTOs;
using BodySchedulerWebApi.Exceptions;
using BodySchedulerWebApi.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BodySchedulerWebApi.Controllers
{
    [Authorize]
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

        //return user achievement list
        [HttpGet]
        [Route("GetAchievements/{userId}")]
        public async Task<IActionResult> GetAchievementsAsync([FromRoute]string userId)
        {
            try
            {
                var achievenets = await _achievementService.GetAchievementsAsync(userId);
                return Ok(achievenets); 
            }
            catch (EntityNotFoundException ex)
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

        //update user achievements
        [HttpPut]
        [Route("UpdateAchievements")]
        public async Task<IActionResult> UpdateAchievementsAsync([FromBody]UpdateAchievementDTO updateAchievementDTO)
        {
            try
            {
                await _achievementService.UpdateAchievementsAsync(updateAchievementDTO);
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

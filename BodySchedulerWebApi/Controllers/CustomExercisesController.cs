﻿using BodySchedulerWebApi.DataTransferObjects.CustomExercisesDTOs;
using BodySchedulerWebApi.Exceptions;
using BodySchedulerWebApi.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BodySchedulerWebApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class CustomExercisesController : ControllerBase
    {
        private readonly ICustomExercisesService _service;
        private readonly ILogger<CustomExercisesController> _logger;

        public CustomExercisesController(ICustomExercisesService service, ILogger<CustomExercisesController> logger)
        {
            _service = service;
            _logger = logger;
        }

        [HttpGet]
        [Route("GetExercise/{exerciseId}")]
        public async Task<IActionResult> GetCustomExerciseAsync(int exerciseId)
        {
            try
            {
                var customExercise = await _service.GetCustomExerciseAsync(exerciseId);
                return Ok(customExercise);
            }
            catch (EntityNotFoundException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }

        //add exercises by userId
        [HttpGet]
        [Route("GetExercises/{userId}")]
        public async Task<IActionResult> GetExercisesAsync([FromRoute]string userId)
        {
            try
            {
                var exerciseList = await _service.GetCustomExercisesAsync(userId);
                return Ok(exerciseList);
            }
            catch (EntityNotFoundException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }

        //add custom exercise 
        [HttpPost]
        [Route("AddCustomExercises")]
        public async Task<IActionResult> AddCustomExercisesAsync([FromForm]AddCustomExerciseDTO exerciseInfo)
        {
            try
            {
                if(exerciseInfo.Image != null)
                {
                    var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };

                    var extension = Path.GetExtension(exerciseInfo.Image.FileName).ToLowerInvariant();
                    if (!allowedExtensions.Contains(extension))
                    {
                        return BadRequest("Некорректный тип файла");
                    }
                }

                await _service.AddCustomExercisesAsync(exerciseInfo);
                return Ok();
            }
            catch(EntityNotFoundException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }

        //delete custome exercise by userId and exerciseId
        [HttpDelete]
        [Route("DeleteCustomExercise/{userId}&exerciseId={exerciseId}")]
        public async Task<IActionResult> DeleteCustomExerciseAsync([FromRoute]string userId, int exerciseId)
        {
            try
            {
                await _service.DeleteCustomExerciseAsync(userId, exerciseId);
                return Ok();
            }
            catch (EntityNotFoundException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }

        [HttpPut]
        [Route("EditCustomExercise")]
        public async Task<IActionResult> EditCustomExerciseAsync([FromForm]EditCustomExerciseDTO exerciseInfo)
        {
            try
            {
                await _service.EditCustomExerciseAsync(exerciseInfo);
                return Ok();
            }
            catch (EntityNotFoundException ex)
            {
                _logger.LogInformation(ex.Message);
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка, повторите попытку чуть позже" });
            }
        }
    }
}

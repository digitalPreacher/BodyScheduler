﻿using BodyShedule_v_2_0.Server.DataTransferObjects.BodyMeasureDTOs;
using BodyShedule_v_2_0.Server.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BodyShedule_v_2_0.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BodyMeasureController : ControllerBase
    {
        private readonly IBodyMeasureService _bodyMeasureService;
        private readonly ILogger<BodyMeasureController> _logger;

        public BodyMeasureController(IBodyMeasureService bodyMeasureService, ILogger<BodyMeasureController> logger)
        {
            _bodyMeasureService = bodyMeasureService;
            _logger = logger;
        }

        //add new body measure
        [HttpPost]
        [Route("AddBodyMeasure")]
        public async Task<IActionResult> AddBodyMeasureAsync([FromBody]AddBodyMeasureDTO bodyMeasureInfo)
        {
            try
            {
                var result = await _bodyMeasureService.AddBodyMeasureAsync(bodyMeasureInfo);
                if (result)
                {
                    return Ok();
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message);
                return StatusCode(500, new { Message = "Произошла неизвестная ошибка. Повторите попытку чуть позже" });
            }
        }

        //get unique body measure 
        [HttpGet]
        [Route("GetUniqueBodyMeasure/{userId}")]
        public async Task<IActionResult> GetUniqueBodyMeasureAsync(string userId)
        {
            try
            {
                var bodyMeasures = await _bodyMeasureService.GetUniqueBodyMeasureAsync(userId);
                if (bodyMeasures != null)
                {
                    return Ok(bodyMeasures);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message);
                return StatusCode(500, ex.Message);

            }
        }

        //get body measures to line chart 
        [HttpGet]
        [Route("GetBodyMeasuresToLineChart/{userId}")]
        public async Task<IActionResult> GetBodyMeasuresToLineChartAsync(string userId)
        {
            try
            {
                var result = await _bodyMeasureService.GetBodyMeasuresToLineChartAsync(userId);
                if(result != null)
                {
                    return Ok(result);
                }
                else
                {
                    return BadRequest();
                }
            }
            catch (Exception ex)
            {
                _logger.LogInformation(ex.Message);
                return StatusCode(500, ex.Message);
            }
        }
    }
}

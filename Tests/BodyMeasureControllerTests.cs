using BodyShedule_v_2_0.Server.Controllers;
using BodyShedule_v_2_0.Server.DataTransferObjects.BodyMeasureDTOs;
using BodyShedule_v_2_0.Server.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace Tests
{
    public class BodyMeasureControllerTests
    {
        private readonly Mock<IBodyMeasureService> _service;

        private readonly BodyMeasureController _controller;
        private readonly Mock<ILogger<BodyMeasureController>> _logger;

        public BodyMeasureControllerTests()
        {
            _service = new Mock<IBodyMeasureService>();
            _logger = new Mock<ILogger<BodyMeasureController>>();
            _controller = new BodyMeasureController(_service.Object, _logger.Object);
        }

        //testing positive result by adding new body measure
        [Fact]
        public async Task AddBodyMeasureOkResult()
        {
            //arrange
            var bodyMeasureInfo = new AddBodyMeasureDTO
            {
                BodyMeasureSet = new List<BodyMeasureDTO>()
                {
                    new BodyMeasureDTO
                    {
                        MuscleName = "test",
                        MusclesSize = 100,
                    },

                    new BodyMeasureDTO
                    {
                        MuscleName = "test2",
                        MusclesSize = 50,
                    }
                }

            };

            _service.Setup(x => x.AddBodyMeasureAsync(It.IsAny<AddBodyMeasureDTO>())).ReturnsAsync(true);

            //act
            var result = await _controller.AddBodyMeasureAsync(bodyMeasureInfo);

            //assert
            Assert.IsType<OkResult>(result);

        }

        //testing positive result by request list of last unique body measure
        [Fact]
        public async Task GetUniqueBodyMeasureOkResult()
        {
            //arrange
            var uniqueBodyMeasureList = new List<GetUniqueBodyMeasureDTO>()
            {
                new GetUniqueBodyMeasureDTO
                {
                    MuscleName = "Test",
                    MusclesSize = 100,
                    CreateAt = DateTime.Parse("2024-10-15T21:33:29.9291418")
                }
            };

            _service.Setup(x => x.GetUniqueBodyMeasureAsync(It.IsAny<string>())).ReturnsAsync(uniqueBodyMeasureList);

            //act
            var result = await _controller.GetUniqueBodyMeasureAsync("1");

            //assert
            Assert.IsType<OkObjectResult>(result);
            var objectResult = result as ObjectResult;
            Assert.NotNull(objectResult);
            var actualUniqueBodyMeasureList = objectResult.Value as List<GetUniqueBodyMeasureDTO>;
            Assert.NotNull(actualUniqueBodyMeasureList);
            Assert.Equal(actualUniqueBodyMeasureList, uniqueBodyMeasureList);
        }

        //testing positive result by request list data of body measures for line chart
        [Fact]
        public async Task GetBodyMeasuresToLineChartOkResult()
        {
            //arrange

            var bodyMeasuresList = new List<GetBodyMeasuresToLineChartDTO>()
            {
                new GetBodyMeasuresToLineChartDTO
                {
                    Name = "Test",
                    Series =
                    [
                        new MusclesSizeToLineChartDTO
                        {
                            Value = 1.2f,
                            Name = "10/10/2024",
                        }
                    ]
                }
            };

            _service.Setup(x => x.GetBodyMeasuresToLineChartAsync(It.IsAny<string>())).ReturnsAsync(bodyMeasuresList);

            //act
            var result = await _controller.GetBodyMeasuresToLineChartAsync("1");

            //assert
            Assert.IsType<OkObjectResult>(result);
            var objectResult = result as ObjectResult;
            Assert.NotNull(objectResult);
            var actualBodyMeasuresList = objectResult.Value as List<GetBodyMeasuresToLineChartDTO>;
            Assert.NotNull(actualBodyMeasuresList);
            Assert.Equal(actualBodyMeasuresList, bodyMeasuresList);
        }
    }
}

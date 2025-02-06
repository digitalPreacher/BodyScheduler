using BodySchedulerWebApi.Controllers;
using BodySchedulerWebApi.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;

namespace Tests
{
    public class ExerciseTitlesControllerTests
    {
        private readonly Mock<IExportExerciseTitlesService> _service;
        private readonly ExerciseTitlesController _controller;
        private readonly Mock<ILogger<ExerciseTitlesController>> _logger;

        public ExerciseTitlesControllerTests()
        {
            _service = new Mock<IExportExerciseTitlesService>();
            _logger = new Mock<ILogger<ExerciseTitlesController>>();
            _controller = new ExerciseTitlesController(_service.Object, _logger.Object);
        }

        //testing positive reuslt by request data of exercise titles
        [Fact]
        public async Task GetExerciseTitlesOkResult()
        {
            //arrange
            var exerciseTitlesList = new List<string>
             {
                 "test",
                 "test2"
             };

            _service.Setup(x => x.GetExerciseTitlesAsync()).ReturnsAsync(exerciseTitlesList);

            //act
            var result = await _controller.GetExerciseTitlesAsync();

            //Assert
            Assert.IsType<OkObjectResult>(result);
            var objectResult = result as ObjectResult;
            Assert.NotNull(objectResult);
            var actualExerciseTitles = objectResult.Value as List<string>;
            Assert.NotNull(actualExerciseTitles);
            Assert.Equal(exerciseTitlesList, actualExerciseTitles);
        }
    }
}

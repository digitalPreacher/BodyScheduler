using BodySchedulerWebApi.Controllers;
using BodySchedulerWebApi.DataTransferObjects.CustomExercisesDTOs;
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
            var userId = "1";
            //arrange
            var exerciseTitlesList = new List<GetCustomExerciseTitleDTO>
             {
                 new GetCustomExerciseTitleDTO
                 {
                     Title = "test",
                     Image = null
                 }
             };

            _service.Setup(x => x.GetExerciseTitlesAsync(It.IsAny<string>())).ReturnsAsync(exerciseTitlesList);

            //act
            var result = await _controller.GetExerciseTitlesAsync(userId);

            //Assert
            Assert.IsType<OkObjectResult>(result);
            var objectResult = result as ObjectResult;
            Assert.NotNull(objectResult);
            var actualExerciseTitles = objectResult.Value as List<GetCustomExerciseTitleDTO>;
            Assert.NotNull(actualExerciseTitles);
            Assert.Equal(exerciseTitlesList, actualExerciseTitles);
        }
    }
}

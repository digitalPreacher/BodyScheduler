using Moq;
using BodyShedule_v_2_0.Server.Controllers;
using BodyShedule_v_2_0.Server.Service;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using BodyShedule_v_2_0.Server.DataTransferObjects.EventDTOs;
using BodyShedule_v_2_0.Server.DataTransferObjects.TrainingProgramDTOs;

namespace Tests
{
    public class TrainingProgramControllerTests
    {
        private readonly Mock<ITrainingProgramService> _serviceMock;
        private readonly TrainingProgramController _controller;
        private readonly Mock<ILogger<TrainingProgramController>> _loggerMock;

        public TrainingProgramControllerTests()
        {
            _serviceMock = new Mock<ITrainingProgramService>();
            _loggerMock = new Mock<ILogger<TrainingProgramController>>();
            _controller = new TrainingProgramController(_serviceMock.Object, _loggerMock.Object);
        }

        //testing positive result by adding training program
        [Fact]
        public async Task AddTrainingProgramAsyncOkResult()
        {
            //arrange
            var trainingProgram = new AddTrainingProgramDTO
            {
                Title = "Test",
                Description = "Tests",
                UserId = "1",
                Weeks = new List<WeeksTrainingDTO>
                {
                    new WeeksTrainingDTO
                    {
                        WeekNumber = 1,
                        Events = new List<AddEventDTO>
                        {
                            new AddEventDTO
                            {
                                Title = "Test",
                                Description = "Test",
                                StartTime = DateTimeOffset.Now.ToUniversalTime(),
                                Exercises = new List<ExerciseDTO>
                                {
                                    new ExerciseDTO
                                    {
                                        Title = "Title",
                                        QuantityApproaches = 1,
                                        QuantityRepetions = 1,
                                        Weight = 1,
                                    }
                                }
                            }
                        }
                    }
                }
            };

            _serviceMock.Setup(x => x.AddTrainingProgramAsync(It.IsAny<AddTrainingProgramDTO>())).ReturnsAsync(true);

            //act
            var result = await _controller.AddTrainingProgramAsync(trainingProgram);

            //Assert
            Assert.IsType<OkResult>(result);
        }

        //Testing getting positive result by request list of training programs
        [Fact]
        public async Task GetTrainingProgramsAsync()
        {
            //arrange
            var trainingProgramList = new List<GetTrainingProgramsDTO>
            {
                new GetTrainingProgramsDTO
                {
                    Id = 1,
                    Title = "test",
                    Description = "test",
                }
            };

            //act
            _serviceMock.Setup(x => x.GetTrainingProgramsAsync(It.IsAny<string>())).ReturnsAsync(trainingProgramList);

            //assert
            var result = await _controller.GetTrainingProgramsAsync("1");
            Assert.IsType<OkObjectResult>(result);
            var objectResult = result as ObjectResult;
            Assert.NotNull(objectResult);
            var actualTrainingPrograms = objectResult.Value as List<GetTrainingProgramsDTO>;
            Assert.NotNull(actualTrainingPrograms);
            Assert.Equal(trainingProgramList, actualTrainingPrograms);
        }


        //Testing positive result by deleting training program
        [Fact]
        public async Task DeleteTrainingProgramAsyncOkResult()
        {
            //arrange
            _serviceMock.Setup(x => x.DeleteTrainingProgramAsync(It.IsAny<int>())).ReturnsAsync(true);

            //act
            var result = await _controller.DeleteTrainingProgramAsync(1);

            //assert
            Assert.IsType<OkObjectResult>(result);
        }

        //Testing positive result by editing training program
        [Fact]
        public async Task EditTrainingProgramAsyncOkResult()
        {
            //arrange 
            var editTrainingProgram = new EditTrainingProgramDTO
            {
                Id = 1,
                UserId = "1",
                Description = "test",
                Title = "test",
                Weeks = new List<GetWeeksTrainingDTO>
                {
                    new GetWeeksTrainingDTO
                    {
                        Id = 1,
                        WeekNumber = 1,
                        Events = new List<GetEventDTO>
                        {
                            new GetEventDTO
                            {
                                Id = 1,
                                Title = "test",
                                Description = "test",
                                StartTime = DateTimeOffset.Parse("2024-10-15T21:33:29.9291418+03:00"),
                                Status = "inProgress",
                                Exercises = new List<ExerciseDTO>
                                {
                                    new ExerciseDTO
                                    {
                                        Id = 1,
                                        Title = "test",
                                        QuantityApproaches = 1,
                                        QuantityRepetions = 1,
                                        Weight = 1,
                                    }
                                }
                            }
                        }

                    }
                }
            };

            _serviceMock.Setup(x => x.EditTrainingProgramAsync(It.IsAny<EditTrainingProgramDTO>())).ReturnsAsync(true);

            //act
            var result = await _controller.EditTrainingProgramAsync(editTrainingProgram);

            //assert
            Assert.IsType<OkResult>(result);
        }
    }
}

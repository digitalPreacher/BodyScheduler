using BodyShedule_v_2_0.Server.Controllers;
using BodyShedule_v_2_0.Server.DataTransferObjects;
using BodyShedule_v_2_0.Server.Service;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Sprache;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace Tests
{
    public class EventControllerTests
    {
        private readonly Mock<IEventService> _eventServiceMock;
        private readonly EventController _controller;
        private readonly Mock<ILogger<EventController>> _loggerMock;

        public EventControllerTests()
        {
            _eventServiceMock = new Mock<IEventService>();
            _loggerMock = new Mock<ILogger<EventController>>();
            _controller = new EventController(_eventServiceMock.Object, _loggerMock.Object);
        }

        //Testing getting positive result by request list of events
        [Fact]
        public async Task GetEventsOkResult()
        {
            //arrange
            var eventList = new List<GetEventsDTO>()
            {
                new GetEventsDTO
                {
                    Id = "1",
                    Title = "test1",
                    Description = "test",
                    Start = DateTimeOffset.Parse("2024-10-15T21:33:29.9291418+03:00")
                },
                 new GetEventsDTO
                {
                    Id = "2",
                    Title = "test2",
                    Description = "test",
                    Start = DateTimeOffset.Parse("2024-10-15T21:33:29.9291418+03:00")
                }
            };

            _eventServiceMock.Setup(x => x.GetEventsAsync(It.IsAny<string>())).ReturnsAsync(eventList);

            //act
            var result = await _controller.GetEventsAsync("asdasasd123");

            //assert
            Assert.IsType<OkObjectResult>(result);
            var objectResult = result as OkObjectResult;
            Assert.NotNull(objectResult);
            var actualEvents = objectResult.Value as List<GetEventsDTO>;
            Assert.NotNull(actualEvents);
            Assert.Equal(eventList, actualEvents);
        }

        //Testing positive result by adding event
        [Fact]
        public async Task AddEventOkResult()
        {
            //arrange

            var addEvent = new AddEventDTO
            {
                Title = "test1",
                Description = "test",
                StartTime = DateTimeOffset.Now,
                UserId = "1",
                Exercises = new List<ExerciseDTO>()
                {
                    new ExerciseDTO
                    {
                        Title = "Test",
                        QuantityApproaches = 1,
                        QuantityRepetions = 1,
                    }
                }
            };

            _eventServiceMock.Setup(x => x.AddEventAsync(It.IsAny<AddEventDTO>())).ReturnsAsync(true);

            //act
            var result = await _controller.AddEvent(addEvent);

            //assert
            Assert.IsType<OkObjectResult>(result);
            var objectResult = result as OkObjectResult;
            Assert.NotNull(objectResult);
        }

        //Testing positive result by editing event
        [Fact]
        public async Task EditEventOkResult()
        {
            //arrange
            var editEvent = new EditEventDTO
            {
                Id = 1,
                Title = "test1",
                Description = "test",
                StartTime = DateTimeOffset.Now,
                UserId = "1",
                Exercises = new List<ExerciseDTO>()
                {
                    new ExerciseDTO
                    {
                        Id = 1,
                        Title = "Test",
                        QuantityApproaches = 1,
                        QuantityRepetions = 1
                    },
                    new ExerciseDTO
                    {
                        Title = "Test2",
                        QuantityApproaches = 1,
                        QuantityRepetions = 1
                    },
                }
            };

            _eventServiceMock.Setup(x => x.EditEventAsync(It.IsAny<EditEventDTO>())).ReturnsAsync(true);

            //act
            var result = await _controller.EditEvent(editEvent);

            //assert
            Assert.IsType<OkObjectResult>(result); 
        }

        //Testing positive result by get event
        [Fact]
        public async Task GetEventOkResult()
        {
            //arrange
            GetEventDTO[] getEvent = {
                new GetEventDTO {
                    Id = "1", Title = "test1",
                    Description = "test",
                    StartTime = DateTimeOffset.Parse("2024-10-15T21:33:29.9291418+03:00"),
                    Exercises = [new ExerciseDTO
                    {
                        Id = 1,
                        Title = "test1",
                        QuantityApproaches = 0,
                        QuantityRepetions = 0,
                    }]
                }
            };
            _eventServiceMock.Setup(x => x.GetEventAsync(It.IsAny<int>())).ReturnsAsync(getEvent);

            //act
            var result = await _controller.GetEvent(1);

            //Assert
            Assert.IsType<OkObjectResult>(result);
            var objectResult = result as OkObjectResult;
            Assert.NotNull(objectResult);
            var actualEvent = objectResult.Value as GetEventDTO[];
            Assert.NotNull(actualEvent);
            Assert.Equal(getEvent, actualEvent);
        }

        //Testing positive result by deleting event
        [Fact]
        public async Task DeleteEventOkResult()
        {
            //arrange
            _eventServiceMock.Setup(x => x.DeleteEventAsync(It.IsAny<int>())).ReturnsAsync(true);

            //act
            var result = await _controller.DeleteEvent(1);

            //assert
            Assert.IsType<OkObjectResult>(result);
        }
    }
}

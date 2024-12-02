using BodyShedule_v_2_0.Server.Service;
using Microsoft.AspNetCore.Identity;
using Moq;
using BodyShedule_v_2_0.Server.Controllers;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using BodyShedule_v_2_0.Server.DataTransferObjects.AccountDTOs;

namespace Tests;

public class AccountControllerTests
{
    private readonly Mock<IAccountService> _accountServiceMock;
    private readonly AccountController _accountController;
    private readonly Mock<ILogger<AccountController>> _logger;

    public AccountControllerTests()
    {
        _accountServiceMock = new Mock<IAccountService>();
        _logger = new Mock<ILogger<AccountController>>();
        _accountController = new AccountController(_accountServiceMock.Object, _logger.Object);
    }

    //Testing successfully registered of a new user and return result OK on response to client
    [Fact]
    public async Task UserSignUpSuccess()
    {
        //arrange
        _accountServiceMock.Setup(x => x.SignUpAsync(It.IsAny<UserRegistationDTO>())).ReturnsAsync(IdentityResult.Success);

        //act
        var result = await _accountController.UserSignUp(new UserRegistationDTO());

        //Assert
        Assert.IsType<OkResult>(result);
    }

    //Testing successfully log in to the system and return result OK on response to client
    [Fact]
    public async Task UserSignInSuccess()
    {
        //arrange
        Environment.SetEnvironmentVariable("JWTAUTH_ISSUER", "https://localhost:4200/");
        Environment.SetEnvironmentVariable("JWTAUTH_AUDIENCE", "https://localhost:4200/");
        Environment.SetEnvironmentVariable("JWTAUTH_SECRETKEY", "SAIWzvv8atUUGgFgGs+gUMe+iLgkEsva0E/5Un7PBA5PJ4XF4NX+ThibKachx6M3Aytu1sLB4O1+Gkd9gQzXhw==");

        UserLoginDTO user = new UserLoginDTO { Login = "Test", Password = "Test123!" };

        _accountServiceMock.Setup(x => x.GetUserRolesAsync(It.IsAny<UserLoginDTO>()))
            .ReturnsAsync(new List<string>() { "USER" });

        _accountServiceMock.Setup(x => x.GetUserIdAsync(It.IsAny<string>())).ReturnsAsync(1);

        _accountServiceMock.Setup(x => x.SignInAsync(It.IsAny<UserLoginDTO>()))
            .ReturnsAsync(Microsoft.AspNetCore.Identity.SignInResult.Success);

        //act
        var result = await _accountController.UserSignIn(user);

        //Assert
        Assert.IsType<OkObjectResult>(result);
    }
}
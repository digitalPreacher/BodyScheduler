using BodySchedulerWebApi.Data;
using BodySchedulerWebApi.DataTransferObjects.AccountDTOs;
using BodySchedulerWebApi.Events.Register;
using BodySchedulerWebApi.Exceptions;
using BodySchedulerWebApi.Models;
using BodySchedulerWebApi.Service;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace BodySchedulerWebApi.Repository
{
    public class AccountRepository : IAccountRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;  
        private readonly IPublisher _publisher;

        public AccountRepository(ApplicationDbContext db,
            UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IAchievementService service,
                IUserExperienceService userExperienceService, IPublisher publisher)
        {
            _db = db;
            _userManager = userManager;
            _signInManager = signInManager;
            _publisher = publisher;
        }
        
        //create new user in db with return result
        public async Task<IdentityResult> SignUpAsync(UserRegistationDTO userRegistrationData)
        {
            var user = new ApplicationUser
            {
                UserName = userRegistrationData.Login,
                Email = userRegistrationData.Email, 
                AcceptedAgreement = userRegistrationData.AcceptedAgreement,
                CreateAt = DateTime.Now.ToUniversalTime()
            };
            
            var result = await _userManager.CreateAsync(user, userRegistrationData.Password);

            //added roles and achievemets after successful user registration
            if (result.Succeeded)
            {
                //added roles 
                await _userManager.AddToRoleAsync(user, "User"); 

                //Add achievements and experience notifications
                await _publisher.Publish(new UserRegisteredEvent(user));
            }
            
            return result;
        }

        //return user logining result
        public async Task<SignInResult> SignInAsync(UserLoginDTO userCredentials)
        {
            return await _signInManager.PasswordSignInAsync(userCredentials.Login, userCredentials.Password, false, false);
        }

        //get user roles
        public async Task<IList<string>> GetUserRolesAsync(UserLoginDTO userCredentials)
        {
            var user = await _userManager.FindByNameAsync(userCredentials.Login);
            if (user == null)
            {
                throw new EntityNotFoundException("Пользователь не найден");
            }

            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Count == 0)
            {
                throw new EntityNotFoundException("У пользователя отсутствуют роли");
            }

            return roles;
        }

        //get user id 
        public async Task<int> GetUserIdAsync(string userLogin)
        {
            var user = await _userManager.FindByNameAsync(userLogin);
            if (user == null)
            {
                throw new EntityNotFoundException("Пользователь не найден");
            }

            return user.Id;
        }

        //change user password
        public async Task<IdentityResult> ChangeUserPasswordAsync(ChangeUserPasswordDTO changePasswordInfo)
        {
            var user = await _userManager.FindByNameAsync(changePasswordInfo.UserLogin);
            if (user == null)
            {
                throw new EntityNotFoundException("Пользователь не найден");
            }

            var result = await _userManager.ChangePasswordAsync(user, changePasswordInfo.OldPassword, changePasswordInfo.NewPassword);
            return result;
        }

        //return generate token for reset user password
        public async Task<string> GenerateTokenAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                throw new EntityNotFoundException("Пользователь не найден");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            return token;
        }

        //reset user password if forgot it
        public async Task<IdentityResult> ResetUserPasswordAsync(ResetUserPasswordDTO resetPasswordInfo)
        {
            var user = await _userManager.FindByEmailAsync(resetPasswordInfo.Email);
            if (user == null)
            {
                throw new EntityNotFoundException("Пользователь не найден");
            }

            var result = await _userManager.ResetPasswordAsync(user, resetPasswordInfo.Token, resetPasswordInfo.Password);
            return result;
        }
    }
}

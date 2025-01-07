using BodyShedule_v_2_0.Server.Data;
using BodyShedule_v_2_0.Server.DataTransferObjects.AccountDTOs;
using BodyShedule_v_2_0.Server.Helpers;
using BodyShedule_v_2_0.Server.Models;
using BodyShedule_v_2_0.Server.Utilities;
using Microsoft.AspNetCore.Identity;
using System.Diagnostics;

namespace BodyShedule_v_2_0.Server.Repository
{
    public class AccountRepository : IAccountRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;   

        public AccountRepository(ApplicationDbContext db,
            UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, ILogger<AccountRepository> logger)
        {
            _db = db;
            _userManager = userManager;
            _signInManager = signInManager;
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
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "User");
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

            var roles = await _userManager.GetRolesAsync(user ?? throw new InvalidOperationException("User not found"));

            return roles;
        }

        //get user id 
        public async Task<int> GetUserIdAsync(string userLogin)
        {
            var user = await _userManager.FindByNameAsync(userLogin) ?? throw new InvalidOperationException($"User {userLogin} not found");  

            return user.Id;
        }

        //change user password
        public async Task<IdentityResult> ChangeUserPasswordAsync(ChangeUserPasswordDTO changePasswordInfo)
        {
            var user = await _userManager.FindByNameAsync(changePasswordInfo.UserLogin) ?? throw new InvalidOperationException($"User {changePasswordInfo.UserLogin} not found");
           
            var result = await _userManager.ChangePasswordAsync(user, changePasswordInfo.OldPassword, changePasswordInfo.NewPassword);

            return result;
        }

        //forgot user password
        public async Task<bool> ForgotUserPasswordAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            
            if(user == null)
            {
                throw new ArgumentNullException("Пользователь не найден");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var domainName = Environment.GetEnvironmentVariable("DOMAIN_NAME");
            var link = AbsoluteUrlGenerateHelper.GenerateAbsoluteUrl("reset-password", "account", token, domainName, email);

            var result = EmailSender.SendEmailPasswordReset(email, link);
            if (result)
            {
                return true;
            }
            else
            {
                return false;
            }
        }


        //reset user password if forgot it
        public async Task<bool> ResetUserPasswordAsync(ResetUserPasswordDTO resetPasswordInfo)
        {
            var user = await _userManager.FindByEmailAsync(resetPasswordInfo.Email);
            if(user != null)
            {
                var result = await _userManager.ResetPasswordAsync(user, resetPasswordInfo.Token, resetPasswordInfo.Password);
                if (result.Succeeded)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            }

            return false;
        }
    }
}

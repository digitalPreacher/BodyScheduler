using BodyShedule_v_2_0.Server.DataTransferObjects.AccountDTOs;
using Microsoft.AspNetCore.Identity;

namespace BodyShedule_v_2_0.Server.Service
{
    public interface IAccountService
    {
        public Task<IdentityResult> SignUpAsync(UserRegistationDTO userRegistrationData);
        public Task<SignInResult> SignInAsync(UserLoginDTO userCredentials);
        public Task<IList<string>> GetUserRolesAsync(UserLoginDTO userCredentials);
        public Task<int> GetUserIdAsync(string userLogin);
        public Task<IdentityResult> ChangeUserPasswordAsync(ChangeUserPasswordDTO changePasswordInfo);
        public Task<string> GenerateTokenAsync(string email);
        public Task<IdentityResult> ResetUserPasswordAsync(ResetUserPasswordDTO resetPasswordInfo);
    }
}

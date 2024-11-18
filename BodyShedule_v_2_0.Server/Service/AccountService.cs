using BodyShedule_v_2_0.Server.DataTransferObjects;
using BodyShedule_v_2_0.Server.Repository;
using Microsoft.AspNetCore.Identity;

namespace BodyShedule_v_2_0.Server.Service
{
    public class AccountService : IAccountService
    {
        private readonly IAccountRepository _repository;

        public AccountService(IAccountRepository repository)
        {
            _repository = repository;
        }

        public async Task<IdentityResult> SignUpAsync(UserRegistationDTO userRegistrationData)
        {
            return await _repository.SignUpAsync(userRegistrationData);
        }
        public async Task<SignInResult> SignInAsync(UserLoginDTO userCredentials)
        {
            return await _repository.SignInAsync(userCredentials);
        }
        public async Task<IList<string>> GetUserRolesAsync(UserLoginDTO userCredentials)
        {
            return await _repository.GetUserRolesAsync(userCredentials);
        }

        public async Task<int> GetUserIdAsync(string userLogin)
        {
            return await _repository.GetUserIdAsync(userLogin);
        }

        public async Task<IdentityResult> ChangeUserPasswordAsync(ChangeUserPasswordDTO changePasswordInfo)
        {
            return await _repository.ChangeUserPasswordAsync(changePasswordInfo);
        }

        public async Task<bool> ForgotUserPasswordAsync(string email)
        {
            return await _repository.ForgotUserPasswordAsync(email);
        }

        public async Task<bool> ResetUserPasswordAsync(ResetUserPasswordDTO resetPasswordInfo)
        {
            return await _repository.ResetUserPasswordAsync(resetPasswordInfo);
        }
    }
}

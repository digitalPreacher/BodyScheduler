using BodySchedulerWebApi.DataTransferObjects.AccountDTOs;
using BodySchedulerWebApi.Repository;
using Microsoft.AspNetCore.Identity;

namespace BodySchedulerWebApi.Service
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

        public async Task<string> GenerateTokenAsync(string email)
        {
            return await _repository.GenerateTokenAsync(email);
        }

        public async Task<IdentityResult> ResetUserPasswordAsync(ResetUserPasswordDTO resetPasswordInfo)
        {
            return await _repository.ResetUserPasswordAsync(resetPasswordInfo);
        }
    }
}

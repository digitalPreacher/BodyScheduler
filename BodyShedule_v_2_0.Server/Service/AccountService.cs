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
    }
}

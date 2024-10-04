using BodyShedule_v_2_0.Server.DataTransferObjects;
using Microsoft.AspNetCore.Identity;

namespace BodyShedule_v_2_0.Server.Repository
{
    public interface IAccountRepository
    {
        public Task<IdentityResult> SignUpAsync(UserRegistationDTO userRegistrationData);
        public Task<SignInResult> SignInAsync(UserLoginDTO userCredentials);

        public Task<IList<string>> GetUserRolesAsync(UserLoginDTO userCredentials);

    }
}

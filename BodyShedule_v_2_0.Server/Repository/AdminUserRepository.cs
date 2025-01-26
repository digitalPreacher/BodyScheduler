using BodyShedule_v_2_0.Server.Data;
using BodyShedule_v_2_0.Server.DataTransferObjects.AdminUserDTOs;
using BodyShedule_v_2_0.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace BodyShedule_v_2_0.Server.Repository
{
    public class AdminUserRepository: IAdminUserRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public AdminUserRepository(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _db = context;
            _userManager = userManager;
        }

        //Return list of users for administration
        public async Task<List<GetApplicationUsersDTO>> GetApplicationUsersAsync()
        {
            var usersList = await _db.Users.Select(x => new GetApplicationUsersDTO
            {
                Id = x.Id,
                UserName = x.UserName,
                Email = x.Email
            })
            .ToListAsync();
            
            return usersList;
        }

        //Return user data by user id 
        public async Task<GetApplicationUsersDTO> GetApplicationUserAsync(int id)
        {
            var user = await _db.Users.Select(x => new GetApplicationUsersDTO
            {
                Id = x.Id,
                UserName = x.UserName,
                Email = x.Email
            })
            .FirstOrDefaultAsync(x => x.Id == id);

            return user;
        }

        //Update user data
        public async Task<bool> UpdateUserDataAsync(UpdateUserDataDTO updateUserInfo)
        {
            var user = await _userManager.FindByIdAsync(updateUserInfo.Id.ToString());
            if(user != null)
            {
                user.UserName = updateUserInfo.UserName;
                user.Email = updateUserInfo.Email;

                if(updateUserInfo.Password != "")
                {
                    user.PasswordHash = _userManager.PasswordHasher.HashPassword(user, updateUserInfo.Password);
                }

                _db.Users.Attach(user);
                _db.Entry(user).State = EntityState.Modified;

                _db.SaveChanges();

                return true;    
            }

            return false;
        }
    }
}

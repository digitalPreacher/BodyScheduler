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

        //Return list of users for admin
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
    }
}

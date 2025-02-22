using BodySchedulerWebApi.Data;
using BodySchedulerWebApi.Exceptions;
using BodySchedulerWebApi.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;

namespace BodySchedulerWebApi.Repository
{
    public class UserExperienceRepository : IUserExperienceRepository
    {
        private readonly ApplicationDbContext _db;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserExperienceRepository(ApplicationDbContext db, UserManager<ApplicationUser> userManager)
        {
            _db = db;
            _userManager = userManager;
        }

        //add user experience
        public async Task AddUserExperienceAsync(ApplicationUser user)
        {
            var userExperience = new UserExperience
            {
                CurrentExperienceValue = (int)UserExperienceValue.Initial,
                GoalExperienceValue = (int)UserExperienceValue.Goal,
                CreateAt = DateTime.Now,
                ModTime = DateTime.Now,
                User = user
            };

            await _db.AddAsync(userExperience);
            await _db.SaveChangesAsync();
        }

        //get current user experience by user data
        public async Task<UserExperience> GetUserExperienceAsync(ApplicationUser user)
        {
            var userExperience = await _db.UserExperienceSet.FirstOrDefaultAsync(x => x.User == user);
            if (userExperience == null)
            {
                throw new EntityNotFoundException("У пользователя отсутствует хранилище опыта");
            }

            return userExperience;
        }

        //Increment user experience after completed training
        public async Task IncrementUserExperienceAsync(UserExperience experience)
        {
            _db.Attach(experience);
            _db.Entry(experience).State = EntityState.Modified;
            Debug.WriteLine("START INCREMENT METHOD");
            await _db.SaveChangesAsync();
        }
    }

    enum UserExperienceValue
    {
        Initial = 0,
        Goal = 100,
    }
}

using BodySchedulerWebApi.DataTransferObjects.UserExperienceDTOs;
using BodySchedulerWebApi.Exceptions;
using BodySchedulerWebApi.Models;
using BodySchedulerWebApi.Repository;
using Microsoft.AspNetCore.Identity;
using System.Diagnostics;

namespace BodySchedulerWebApi.Service
{
    public class UserExperienceService : IUserExperienceService
    {
        private readonly IUserExperienceRepository _userExperienceRepository;
        private readonly UserManager<ApplicationUser> _userManager;

        public UserExperienceService(IUserExperienceRepository userExperienceRepository, UserManager<ApplicationUser> userManager)
        {
            _userExperienceRepository = userExperienceRepository;
            _userManager = userManager;
        }

        public async Task<GetUserExperienceDTO> GetUserExperienceAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new EntityNotFoundException("Пользователь не найден");
            }

            var currentUserExperience = await _userExperienceRepository.GetUserExperienceAsync(user);
            
            var convertedCurrentUserExperience = new GetUserExperienceDTO 
            { 
                CurrentExperienceValue = currentUserExperience.CurrentExperienceValue, 
                GoalExperienceValue = currentUserExperience.GoalExperienceValue 
            };

            return convertedCurrentUserExperience;
        }

        //add user experience after registration account
        public async Task AddUserExperienceAsync(ApplicationUser user)
        {
            await _userExperienceRepository.AddUserExperienceAsync(user);
        }


        //increment user experience
        public async Task CalculateUserExperienceAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new EntityNotFoundException("Пользователь не найден");
            }

            var experience = await _userExperienceRepository.GetUserExperienceAsync(user);

            //calculate increment experience value 
            var totalHoursBetweenUpdateExp = (DateTime.Now - experience.ModTime).TotalHours;
            if (totalHoursBetweenUpdateExp > (int)IncrementUserExperienceValue.AmountHoursBeforeIncrement ||  experience?.ModTime == null)
            {
                if (experience!.CurrentExperienceValue < experience.GoalExperienceValue)
                {
                    experience.CurrentExperienceValue += (int)IncrementUserExperienceValue.Increment;
                }

                if (experience.CurrentExperienceValue == experience.GoalExperienceValue)
                {
                    experience.CurrentExperienceValue = (int)IncrementUserExperienceValue.Initial;
                    experience.GoalExperienceValue += (int)IncrementUserExperienceValue.Increment;
                }

                experience.ModTime = DateTime.Now;
            }

            await _userExperienceRepository.IncrementUserExperienceAsync(experience);
        }

        enum IncrementUserExperienceValue
        {
            Initial = 0,
            Increment = 100,
            AmountHoursBeforeIncrement = 24
        }
    }
}

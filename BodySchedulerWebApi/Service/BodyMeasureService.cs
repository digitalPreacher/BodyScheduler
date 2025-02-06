using BodySchedulerWebApi.DataTransferObjects.BodyMeasureDTOs;
using BodySchedulerWebApi.Repository;

namespace BodySchedulerWebApi.Service
{
    public class BodyMeasureService : IBodyMeasureService
    {
        private readonly IBodyMeasureRepository _bodyMeasureRepository;

        public BodyMeasureService(IBodyMeasureRepository bodyMeasureRepository)
        {
            _bodyMeasureRepository = bodyMeasureRepository;
        }
        public async Task<bool> AddBodyMeasureAsync(AddBodyMeasureDTO bodyMeasureInfo)
        {
            return await _bodyMeasureRepository.AddBodyMeasureAsync(bodyMeasureInfo);
        }

        public async Task<List<GetUniqueBodyMeasureDTO>> GetUniqueBodyMeasureAsync(string userId)
        {
            return await _bodyMeasureRepository.GetUniqueBodyMeasureAsync(userId);
        }

        public async Task<List<GetBodyMeasuresToLineChartDTO>> GetBodyMeasuresToLineChartAsync(string userId)
        {
            return await _bodyMeasureRepository.GetBodyMeasuresToLineChartAsync(userId);
        }
    }
}

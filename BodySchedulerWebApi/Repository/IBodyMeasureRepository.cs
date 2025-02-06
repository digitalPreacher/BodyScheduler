using BodySchedulerWebApi.DataTransferObjects.BodyMeasureDTOs;

namespace BodySchedulerWebApi.Repository
{
    public interface IBodyMeasureRepository
    {
        public Task<bool> AddBodyMeasureAsync(AddBodyMeasureDTO bodyMeasureInfo);
        public Task<List<GetUniqueBodyMeasureDTO>> GetUniqueBodyMeasureAsync(string userId);
        public Task<List<GetBodyMeasuresToLineChartDTO>> GetBodyMeasuresToLineChartAsync(string userId);
    }
}

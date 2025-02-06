using BodySchedulerWebApi.DataTransferObjects.BodyMeasureDTOs;

namespace BodySchedulerWebApi.Service
{
    public interface IBodyMeasureService
    {
        public Task<bool> AddBodyMeasureAsync(AddBodyMeasureDTO bodyMeasureInfo);
        public Task<List<GetUniqueBodyMeasureDTO>> GetUniqueBodyMeasureAsync(string userId);

        public Task<List<GetBodyMeasuresToLineChartDTO>> GetBodyMeasuresToLineChartAsync(string userId);
    }
}

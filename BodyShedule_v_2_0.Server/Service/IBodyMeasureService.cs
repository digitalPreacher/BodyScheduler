using BodyShedule_v_2_0.Server.DataTransferObjects;

namespace BodyShedule_v_2_0.Server.Service
{
    public interface IBodyMeasureService
    {
        public Task<bool> AddBodyMeasureAsync(AddBodyMeasureDTO bodyMeasureInfo);
        public Task<List<GetUniqueBodyMeasureDTO>> GetUniqueBodyMeasureAsync(string userId);

        public Task<List<GetBodyMeasuresToLineChartDTO>> GetBodyMeasuresToLineChartAsync(string userId);
    }
}

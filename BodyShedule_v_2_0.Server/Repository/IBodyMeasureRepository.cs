﻿using BodyShedule_v_2_0.Server.DataTransferObjects;

namespace BodyShedule_v_2_0.Server.Repository
{
    public interface IBodyMeasureRepository
    {
        public Task<bool> AddBodyMeasureAsync(AddBodyMeasureDTO bodyMeasureInfo);
        public Task<List<GetUniqueBodyMeasureDTO>> GetUniqueBodyMeasureAsync(string userId);
        public Task<List<GetBodyMeasuresToLineChartDTO>> GetBodyMeasuresToLineChartAsync(string userId);
    }
}

import api from '../api/axios';

const healthLogService = {
  addWeightLog: async (value, notes = '') => {
    return api.post('/health-logs', { value, notes, date: new Date().toISOString() });
  },
  getWeightHistory: async () => {
    return api.get('/health-logs/weight');
  }
};

export default healthLogService;

import api from '../api/axios';

export const getToday = () => api.get('/daily-summaries/today');
export const updateToday = (data) => api.put('/daily-summaries/today', data);
export const getHistory = (params = {}) => api.get('/daily-summaries', { params });

export default { getToday, updateToday, getHistory };

import api from '../api/axios';

export const addMeal = (data) => api.post('/nutrition', data);
export const getHistory = (params = {}) => api.get('/nutrition/history', { params });
export const deleteMeal = (id) => api.delete(`/nutrition/${id}`);
export const getFoods = (q, category) => api.get('/nutrition/foods', { params: { q, category } });
export const createFood = (data) => api.post('/nutrition/foods', data);

export default { addMeal, getHistory, deleteMeal, getFoods, createFood };

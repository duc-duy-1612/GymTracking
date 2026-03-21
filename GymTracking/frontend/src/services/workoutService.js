import api from '../api/axios';

export const getExercises = (params = {}) => api.get('/workouts/exercises', { params });
export const createWorkout = (data) => api.post('/workouts', data);
export const getHistory = () => api.get('/workouts/history');

export default { getExercises, createWorkout, getHistory };

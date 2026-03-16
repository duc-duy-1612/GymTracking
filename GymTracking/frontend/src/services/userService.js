import api from '../api/axios';

export const getMe = () => api.get('/users/me');
export const updateProfile = (data) => api.put('/users/me', data);

export default { getMe, updateProfile };

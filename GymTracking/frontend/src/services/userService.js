import api from '../api/axios';

export const getMe = () => api.get('/users/me');
export const updateProfile = (data) => api.put('/users/me', data);
export const changePassword = (data) => api.put('/users/me/password', data);

export default { getMe, updateProfile, changePassword };

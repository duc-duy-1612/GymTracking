import api from '../api/axios';

const getClasses = () => api.get('/coach/classes');
const getInstructors = () => api.get('/coach/instructors');
const getClassesByInstructor = (instructorId) => api.get(`/coach/classes/by-instructor/${instructorId}`);

export default {
  getClasses,
  getInstructors,
  getClassesByInstructor,
};

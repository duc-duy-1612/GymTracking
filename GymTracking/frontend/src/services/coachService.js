import axios from 'axios';

const API_URL = 'http://localhost:5000/api/coach';

const getClasses = () => axios.get(`${API_URL}/classes`);
const getInstructors = () => axios.get(`${API_URL}/instructors`);
const getBrands = () => axios.get(`${API_URL}/brands`);
const getClassesByInstructor = (instructorId) => axios.get(`${API_URL}/classes/by-instructor/${instructorId}`);

export default {
  getClasses,
  getInstructors,
  getBrands,
  getClassesByInstructor,
};


import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const employeeService = {
  getAll: () => api.get('/employees/'),
  create: (data) => api.post('/employees/', data),
  update: (id, data) => api.put(`/employees/${id}`, data),
  delete: (id) => api.delete(`/employees/${id}`),
};

export const attendanceService = {
  mark: (employeeId, data) => api.post(`/attendance/${employeeId}`, data),
  getForEmployee: (employeeId, params = {}) => api.get(`/attendance/${employeeId}`, { params }),
  getTodaySummary: () => api.get('/attendance/summary/today'),
  checkExists: (employeeId, date) => api.get(`/attendance/check/${employeeId}/${date}`),
};

export default api;

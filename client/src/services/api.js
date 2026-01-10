import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Notes API
export const notesAPI = {
  getAll: (userId) => api.get('/notes', { params: { userId } }),
  getById: (id) => api.get(`/notes/${id}`),
  create: (note) => api.post('/notes', note),
  update: (id, note) => api.put(`/notes/${id}`, note),
  delete: (id) => api.delete(`/notes/${id}`),
  search: (userId, query) => api.get('/notes/search/query', { params: { userId, q: query } }),
  getByTag: (userId, tag) => api.get(`/notes/tags/${tag}`, { params: { userId } }),
  getTimeline: (userId) => api.get('/notes/timeline/data', { params: { userId } })
};

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  updatePreferences: (userId, preferences) => api.put(`/auth/preferences/${userId}`, preferences),
  getBiometricOptions: (userId) => api.post('/auth/biometric/register-options', { userId }),
  verifyBiometric: (userId, credential) => api.post('/auth/biometric/register-verify', { userId, credential })
};

// Sync API
export const syncAPI = {
  syncNotes: (userId, notes, deviceId) => api.post('/sync/notes', { userId, notes, deviceId }),
  getNotes: (userId, since) => api.get('/sync/notes', { params: { userId, since } }),
  syncClipboard: (userId, content, deviceId) => api.post('/sync/clipboard', { userId, content, deviceId }),
  getClipboard: (userId) => api.get(`/sync/clipboard/${userId}`),
  registerDevice: (userId, deviceId, deviceName) => api.post('/sync/device', { userId, deviceId, deviceName })
};

// AI API
export const aiAPI = {
  summarize: (noteId) => api.post(`/ai/summarize/${noteId}`),
  organize: (userId) => api.post(`/ai/organize/${userId}`),
  smartReminder: (noteId) => api.post(`/ai/smart-reminder/${noteId}`),
  getInsights: (userId) => api.get(`/ai/insights/${userId}`)
};

// Email API
export const emailAPI = {
  createFromEmail: (emailData) => api.post('/email/webhook', emailData),
  configure: (userId, emailAddress) => api.post('/email/configure', { userId, emailAddress, forwardingEnabled: true })
};

export default api;

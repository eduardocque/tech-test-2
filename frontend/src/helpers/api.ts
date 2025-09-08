import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8888' // backend Express/Prisma
});

api.interceptors.request.use(config => {
  const sessionId = localStorage.getItem('sessionId');
  if (sessionId) {
    config.headers['x-session-id'] = sessionId;
  }

  return config;
});

export default api;

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4200';
const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response && error.response.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem('refreshToken');
      if (refresh) {
        try {
          const r = await axios.post(`${API_BASE}/api/auth/refresh`, { token: refresh });
          localStorage.setItem('accessToken', r.data.access);
          original.headers.Authorization = `Bearer ${r.data.access}`;
          return axios(original);
        } catch (e) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

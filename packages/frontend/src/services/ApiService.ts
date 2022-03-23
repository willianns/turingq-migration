import axios from 'axios';

const getHeaders = (): Record<string, string> => ({
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
});

const ApiService = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: getHeaders(),
});

ApiService.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('token');

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

export default ApiService;

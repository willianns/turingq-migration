import axios, { AxiosRequestConfig } from 'axios';
import keycloakClient from '../auth';

const getHeaders = (): Record<string, string> => ({
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json',
});

const ApiService = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: getHeaders(),
});

const setAuthorizationToken = (
  config: AxiosRequestConfig,
  token?: string | null
): void => {
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
};

ApiService.interceptors.request.use(
  (config): AxiosRequestConfig | Promise<AxiosRequestConfig> => {
    if (!keycloakClient.authenticated) {
      return config;
    }

    if (keycloakClient?.token) {
      setAuthorizationToken(config, keycloakClient.token);
      return config;
    }

    return new Promise((resolve, reject): void => {
      keycloakClient.onAuthSuccess = () => {
        setAuthorizationToken(config, keycloakClient.token);
        resolve(config);
      };
      keycloakClient.onAuthError = () => {
        reject(config);
      };
    });
  }
);

export default ApiService;

import { AxiosError, AxiosResponse } from 'axios';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

import ApiService from './ApiService';
// eslint-disable-next-line max-len
import FormValidationErrorResponse from '../interfaces/FormValidationErrorResponse';
import LoginResponse from '../interfaces/LoginResponse';
import LogoutResponse from '../interfaces/LogoutResponse';

const login = (email: string, password: string): Promise<LoginResponse> =>
  new Promise(
    (
      // eslint-disable-next-line no-unused-vars
      resolve: (value: LoginResponse | PromiseLike<LoginResponse>) => void,
      // eslint-disable-next-line no-unused-vars
      reject: (reason: Error) => void
    ): void => {
      ApiService.post('/auth/login', {
        email,
        password,
      }).then(
        (result: AxiosResponse<LoginResponse>) => {
          if (result.status === StatusCodes.OK) {
            localStorage.setItem('token', result.data.token);
            resolve(result.data);
          } else {
            reject(new Error(getReasonPhrase(result.status)));
          }
        },
        (error: AxiosError<FormValidationErrorResponse>) => {
          if (
            error.response &&
            error.response.status === StatusCodes.BAD_REQUEST
          ) {
            reject(new Error('Invalid credentials'));
          }
          reject(error);
        }
      );
    }
  );

const logout = (): Promise<LogoutResponse> =>
  new Promise(
    (
      // eslint-disable-next-line no-unused-vars
      resolve: (value: LogoutResponse | PromiseLike<LogoutResponse>) => void,
      // eslint-disable-next-line no-unused-vars
      reject: (reason: Error) => void
    ): void => {
      ApiService.get('/auth/logout').then(
        (result: AxiosResponse<LogoutResponse>) => {
          localStorage.removeItem('token');
          if (result.status === StatusCodes.OK) {
            resolve(result.data);
          } else {
            reject(new Error(getReasonPhrase(result.status)));
          }
        },
        (reason: Error) => {
          localStorage.removeItem('token');
          reject(reason);
        }
      );
    }
  );

const getAuthToken = (): string | undefined =>
  localStorage.getItem('token') || undefined;

const AuthService = {
  login,
  logout,
  getAuthToken,
};

export default AuthService;

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getUserFromStorage, removeUserFromStorage } from './auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8090/api/v1';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
  withCredentials: true,
});

// REQUEST INTERCEPTOR — Add access_token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const user = getUserFromStorage();
    const token = user?.access_token;

    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR — Handle 401 and refresh
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = refreshResponse.data.access_token;
        const user = getUserFromStorage();

        // Save new token
        localStorage.setItem("user", JSON.stringify({
          ...user,
          access_token: newToken,
        }));

        // Retry original request with new token
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        }

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        removeUserFromStorage();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Generic API call handler
 */
export const apiRequest = async <T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any,
  config: AxiosRequestConfig = {},
  withAuth: boolean = true,
  customHeaders?: Record<string, string>
): Promise<T> => {
  try {
    const user = getUserFromStorage();
    const token = user?.access_token;

    const headers = {
      ...(customHeaders ?? { 'Content-Type': 'application/json' }),
      ...(withAuth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...config.headers,
    };

    const url = `${API_BASE_URL}${endpoint}`;

    const requestConfig: AxiosRequestConfig = {
      method,
      url,
      headers,
      withCredentials: true,
      data,
      ...config,
    };

    const response = await axios(requestConfig);
    return response.data;
  } catch (error) {
    console.error(`API Request Error: ${endpoint}`, error);
    throw error;
  }
};

const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  USER: {
    PROFILE: '/user/profile',
  },
};

class UserService {
  static async login(data: any): Promise<any> {
    return apiRequest(
      API_ENDPOINTS.AUTH.LOGIN,
      'POST',
      data,
      { withCredentials: true },
      false,
      { 'Content-Type': 'application/x-www-form-urlencoded' }
    );
  }

  static async getProfile(): Promise<any> {
    return apiRequest(API_ENDPOINTS.USER.PROFILE, 'GET');
  }

  static async logout(): Promise<any> {
    return apiRequest(API_ENDPOINTS.AUTH.LOGOUT, 'POST');
  }
}

export default UserService;
export { axiosInstance };
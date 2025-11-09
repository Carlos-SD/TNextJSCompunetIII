import axiosInstance from '@/lib/api';
import { AxiosRequestConfig } from 'axios';

const apiService = {
  get: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.get<T>(url, config);
    return response.data;
  },

  post: async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    try {
      const response = await axiosInstance.post<T>(url, data, config);
      return response.data;
    } catch (error: any) {
      // Re-lanzar el error para que pueda ser manejado en los componentes
      throw error;
    }
  },

  put: async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.put<T>(url, data, config);
    return response.data;
  },

  patch: async <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.patch<T>(url, data, config);
    return response.data;
  },

  delete: async <T>(url: string, config?: AxiosRequestConfig) => {
    const response = await axiosInstance.delete<T>(url, config);
    return response.data;
  },
};

export default apiService;


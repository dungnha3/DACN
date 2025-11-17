import { apiService } from '@/shared/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

export const authService = {
  /**
   * Login user
   */
  login: async (credentials) => {
    const response = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
    return response;
  },

  /**
   * Logout user
   */
  logout: async () => {
    try {
      await apiService.post(API_ENDPOINTS.AUTH.LOGOUT);
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  /**
   * Refresh token
   */
  refreshToken: async (refreshToken) => {
    const response = await apiService.post(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken,
    });
    return response;
  },

  /**
   * Get user profile
   */
  getProfile: async () => {
    const response = await apiService.get(API_ENDPOINTS.AUTH.PROFILE);
    return response;
  },
};

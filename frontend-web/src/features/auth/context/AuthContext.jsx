import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/auth.service';
import { 
  getToken, 
  setAuthData, 
  removeToken, 
  getUserRole,
  getUsername,
  isTokenValid 
} from '@/shared/utils/storage.utils';
import { ROLE_ROUTES } from '@/shared/constants/roles.constants';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();
      const valid = isTokenValid();

      if (token && valid) {
        // Token exists and valid, fetch user profile
        try {
          const userData = await authService.getProfile();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          removeToken();
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // No valid token
        removeToken();
        setUser(null);
        setIsAuthenticated(false);
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login handler
   */
  const login = useCallback(async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      console.log('Login response:', response); // Debug log
      
      // Response có thể có format: { accessToken, refreshToken, user: { role, username }, expiresIn }
      const userRole = response.user?.role || response.role;
      const userName = response.user?.username || response.username;
      
      // Calculate expiresAt from expiresIn (backend returns ms)
      let expiresAt = response.expiresAt;
      if (!expiresAt && response.expiresIn) {
        expiresAt = Date.now() + response.expiresIn;
      }
      
      // Save auth data to localStorage
      const authData = {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        tokenType: response.tokenType || 'Bearer',
        role: userRole,
        username: userName,
        expiresAt: String(expiresAt),
      };
      
      setAuthData(authData);

      // Set user state
      const userData = {
        userId: response.user?.userId || response.userId,
        username: userName,
        email: response.user?.email || response.email,
        role: userRole,
      };
      
      setUser(userData);
      setIsAuthenticated(true);

      console.log('User logged in:', userData); // Debug log
      console.log('Redirect to:', ROLE_ROUTES[userRole]); // Debug log

      return { 
        success: true, 
        role: userRole,
        redirectTo: ROLE_ROUTES[userRole] || '/'
      };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Đăng nhập thất bại' 
      };
    }
  }, []);

  /**
   * Logout handler
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeToken();
      setUser(null);
      setIsAuthenticated(false);
      window.location.href = '/login';
    }
  }, []);

  /**
   * Get current user from localStorage (for quick access)
   */
  const getCurrentUserFromStorage = useCallback(() => {
    return {
      username: getUsername(),
      role: getUserRole(),
    };
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    getCurrentUserFromStorage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

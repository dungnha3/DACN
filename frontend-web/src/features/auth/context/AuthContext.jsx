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
    const initAuth = () => {
      const token = getToken();
      const valid = isTokenValid();
      const storedRole = getUserRole();
      const storedUsername = getUsername();
      const expiresAt = localStorage.getItem('expiresAt');
      
      console.log('🔄 AuthContext init:', {
        hasToken: !!token,
        isValid: valid,
        storedRole,
        storedUsername,
        expiresAt,
        now: Date.now()
      });

      if (token && valid) {
        // Token exists and valid, restore user from localStorage
        if (storedRole && storedUsername) {
          console.log('✅ Restoring user from localStorage:', { storedUsername, storedRole });
          setUser({
            username: storedUsername,
            role: storedRole,
          });
          setIsAuthenticated(true);
        } else {
          // Token valid but no user data → clear all
          console.log('⚠️ Token valid but no user data, clearing...');
          removeToken();
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // No valid token
        console.log('❌ No valid token, clearing...');
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
      
      // Backend response: { accessToken, refreshToken, tokenType, expiresIn, user: { userId, username, email, role, isActive } }
      const userRole = response.user?.role;
      const userName = response.user?.username;
      
      if (!userRole || !userName) {
        throw new Error('Invalid server response: missing user data');
      }
      
      // Calculate expiresAt from expiresIn (backend returns milliseconds)
      const expiresAt = Date.now() + (response.expiresIn || 3600000); // Default 1h if not provided
      
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
        userId: response.user.userId,
        username: userName,
        email: response.user.email,
        role: userRole,
      };
      
      setUser(userData);
      setIsAuthenticated(true);

      return { 
        success: true, 
        role: userRole,
        redirectTo: ROLE_ROUTES[userRole] || '/'
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Đăng nhập thất bại' 
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

import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Setup axios interceptor for token handling
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, []);

  // Check authentication on initial load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/auth/verify`);

        if (response.data.success) {
          setIsAuthenticated(true);

          try {
            const profileResponse = await axios.get(`${API_URL}/auth/profile`);
            setUser(profileResponse.data);
          } catch (profileError) {
            console.error('Failed to fetch user profile:', profileError);
          }
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const register = async (userData) => {
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/auth/register`, userData);
      
      if (res.data.success) {
        return { success: true, message: 'Registration successful! Please login.' };
      } 
      return { success: false, message: res.data.message || 'Registration failed.' };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  const login = async (email, password, rememberMe = false) => {
    setError(null);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { token, user } = res.data;

      if (token) {
        // Store token based on remember me preference
        if (rememberMe) {
          localStorage.setItem('authToken', token);
          sessionStorage.removeItem('authToken');
        } else {
          sessionStorage.setItem('authToken', token);
          localStorage.removeItem('authToken');
        }

        setUser(user);
        setIsAuthenticated(true);

        return { success: true };
      } else {
        setError('Invalid credentials');
        return { success: false, message: 'Invalid credentials' };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.';
      setError(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  };

  const logout = async () => {
    try {
      // Optional: Call logout endpoint if it exists
      await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      handleLogout();
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading, 
      error,
      login, 
      logout,
      register,
      setError
    }}>
      {children}
    </AuthContext.Provider>
  );
};
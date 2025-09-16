"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = sessionStorage.getItem('authToken');
      const userData = sessionStorage.getItem('userData');
      
      if (token && userData) {
        setUser(JSON.parse(userData));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, token) => {
    sessionStorage.setItem('authToken', token);
    sessionStorage.setItem('userData', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userData');
    setUser(null);
    router.push('/login');
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const isAdmin = () => {
    return user?.tipo === 'admin';
  };

  const isOrganizer = () => {
    return user?.tipo === 'organizador';
  };

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isOrganizer,
    checkAuth
  };
};

export default useAuth;

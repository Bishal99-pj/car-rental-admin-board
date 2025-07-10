'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from './types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in by validating with server
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem('admin_user');
        if (storedUser) {
          // Validate the stored user with the server
          const response = await fetch('/api/listings?page=1&limit=1', {
            credentials: 'include',
          });
          
          if (response.ok) {
            // Server authentication is valid, use stored user
            setUser(JSON.parse(storedUser));
          } else {
            // Server authentication failed, clear stored data
            localStorage.removeItem('admin_user');
            localStorage.removeItem('auth_token');
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear stored data on error
        localStorage.removeItem('admin_user');
        localStorage.removeItem('auth_token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.data?.user) {
        setUser(data.data.user);
        localStorage.setItem('admin_user', JSON.stringify(data.data.user));
        // Store token in localStorage for client-side access
        if (data.data.token) {
          localStorage.setItem('auth_token', data.data.token);
        }
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('admin_user');
      localStorage.removeItem('auth_token');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 
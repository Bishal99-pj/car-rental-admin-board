import { User } from './types';
import { mockUsers } from './mock-data';

// Simple in-memory session storage (in production, use proper session management)
let currentUser: User | null = null;

export const authenticateUser = (email: string, password: string): User | null => {
  // Mock authentication - in production, use proper password hashing
  const user = mockUsers.find(u => u.email === email);
  
  if (user && user.role === 'admin') {
    // Mock password validation (admin123)
    if (password === 'admin123') {
      currentUser = user;
      return user;
    }
  }
  
  return null;
};

export const getCurrentUser = (): User | null => {
  return currentUser;
};

export const logout = (): void => {
  currentUser = null;
};

export const isAuthenticated = (): boolean => {
  return currentUser !== null;
};

export const requireAuth = (): User => {
  if (!currentUser) {
    throw new Error('Authentication required');
  }
  return currentUser;
};

// For API routes, we'll use a simple token-based approach
export const setAuthToken = (user: User): string => {
  // In production, use JWT tokens
  const token = Buffer.from(JSON.stringify(user)).toString('base64');
  return token;
};

export const validateAuthToken = (token: string): User | null => {
  try {
    const userData = JSON.parse(Buffer.from(token, 'base64').toString());
    const user = mockUsers.find(u => u.id === userData.id && u.role === 'admin');
    return user || null;
  } catch {
    return null;
  }
}; 
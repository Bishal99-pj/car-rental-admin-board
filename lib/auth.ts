import { User } from './types';
import { mockUsers } from './mock-data';

let currentUser: User | null = null;

export const authenticateUser = (email: string, password: string): User | null => {
  const user = mockUsers.find(u => u.email === email);
  
  if (user && user.role === 'admin') {
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

export const setAuthToken = (user: User): string => {
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
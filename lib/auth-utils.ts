import { NextRequest } from 'next/server';
import { validateAuthToken } from './auth';
import { User } from './types';

export const getAuthUserFromRequest = (request: NextRequest): User | null => {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }

  return validateAuthToken(token);
};

export const requireAuthFromRequest = (request: NextRequest): User => {
  const user = getAuthUserFromRequest(request);
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}; 
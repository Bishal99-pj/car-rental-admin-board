import { NextResponse } from 'next/server';
import { logout, getCurrentUser } from '@/lib/auth';
import { dataStore } from '@/lib/data-store';
import { ApiResponse } from '@/lib/types';

export async function POST() {
  try {
    const currentUser = getCurrentUser();
    
    logout();
    
    // Log the logout action if there was a user
    if (currentUser) {
      dataStore.addAuditLog({
        action: 'logout',
        adminId: currentUser.id,
        adminName: currentUser.name,
      });
    }
    
    const response = NextResponse.json<ApiResponse<null>>({
      success: true,
      data: null,
    });

    // Clear the auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
    });
    
    return response;
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
} 
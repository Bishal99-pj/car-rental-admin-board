import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, setAuthToken } from '@/lib/auth';
import { dataStore } from '@/lib/data-store';
import { ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Email and password are required',
      }, { status: 400 });
    }

    const user = authenticateUser(email, password);

    if (!user) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Invalid credentials',
      }, { status: 401 });
    }

    const token = setAuthToken(user);

    dataStore.addAuditLog({
      action: 'login',
      adminId: user.id,
      adminName: user.name,
    });

    const response = NextResponse.json<ApiResponse<{ 
      user: { id: string; email: string; name: string; role: string };
      token: string;
    }>>({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        token,
      },
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
} 
import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { ApiResponse } from '@/lib/types';

export async function POST() {
  try {
    dataStore.resetData();
    
    return NextResponse.json<ApiResponse<null>>({
      success: true,
      data: null,
    });
  } catch (error) {
    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
} 
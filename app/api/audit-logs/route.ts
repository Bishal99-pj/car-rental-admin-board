import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { requireAuthFromRequest } from '@/lib/auth-utils';
import { ApiResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    requireAuthFromRequest(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const action = searchParams.get('action');

    let filteredLogs = dataStore.getAllAuditLogs();

    // Filter by action
    if (action) {
      filteredLogs = filteredLogs.filter(log => log.action === action);
    }

    // Sort by timestamp (newest first)
    filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);
    const total = filteredLogs.length;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json<ApiResponse<{
      logs: typeof paginatedLogs;
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>>({
      success: true,
      data: {
        logs: paginatedLogs,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Authentication required',
      }, { status: 401 });
    }

    return NextResponse.json<ApiResponse<null>>({
      success: false,
      error: 'Internal server error',
    }, { status: 500 });
  }
} 
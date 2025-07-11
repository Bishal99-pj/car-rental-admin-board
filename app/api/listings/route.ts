import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { requireAuthFromRequest } from '@/lib/auth-utils';
import { ApiResponse, ListingStatus } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    requireAuthFromRequest(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status') as ListingStatus | null;
    const search = searchParams.get('search') || '';

    let filteredListings = dataStore.getAllListings();

    if (status) {
      filteredListings = filteredListings.filter(listing => listing.status === status);
    }

    if (search) {
      filteredListings = filteredListings.filter(listing =>
        listing.title.toLowerCase().includes(search.toLowerCase()) ||
        listing.carModel.toLowerCase().includes(search.toLowerCase()) ||
        listing.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedListings = filteredListings.slice(startIndex, endIndex);
    const total = filteredListings.length;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json<ApiResponse<{
      listings: typeof paginatedListings;
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>>({
      success: true,
      data: {
        listings: paginatedListings,
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
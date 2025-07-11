import { NextRequest, NextResponse } from 'next/server';
import { dataStore } from '@/lib/data-store';
import { requireAuthFromRequest } from '@/lib/auth-utils';
import { ApiResponse, ListingStatus } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAuthFromRequest(request);
    const { id } = await params;
    
    const listing = dataStore.getListingById(id);
    
    if (!listing) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Listing not found',
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse<typeof listing>>({
      success: true,
      data: listing,
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = requireAuthFromRequest(request);
    const { id } = await params;
    const body = await request.json();
    const { action, ...updateData } = body;
    
    let updatedListing: any = null;

    if (action === 'approve') {
      updatedListing = dataStore.approveListing(id);
      dataStore.addAuditLog({
        action: 'approve',
        adminId: admin.id,
        adminName: admin.name,
        listingId: id,
        listingTitle: updatedListing?.title,
      });
    } else if (action === 'reject') {
      updatedListing = dataStore.rejectListing(id);
      dataStore.addAuditLog({
        action: 'reject',
        adminId: admin.id,
        adminName: admin.name,
        listingId: id,
        listingTitle: updatedListing?.title,
      });
    } else {
      updatedListing = dataStore.updateListing(id, updateData);
      dataStore.addAuditLog({
        action: 'edit',
        adminId: admin.id,
        adminName: admin.name,
        listingId: id,
        listingTitle: updatedListing?.title,
        details: 'Updated listing details',
      });
    }

    if (!updatedListing) {
      return NextResponse.json<ApiResponse<null>>({
        success: false,
        error: 'Listing not found',
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse<typeof updatedListing>>({
      success: true,
      data: updatedListing,
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
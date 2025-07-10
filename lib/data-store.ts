import { Listing, AuditLog } from './types';
import { mockListings, mockAuditLogs } from './mock-data';

// Global data stores (in production, this would be a database)
class DataStore {
  private listings: Listing[] = [...mockListings];
  private auditLogs: AuditLog[] = [...mockAuditLogs];

  // Listings methods
  getAllListings(): Listing[] {
    return [...this.listings];
  }

  getListingById(id: string): Listing | undefined {
    return this.listings.find(l => l.id === id);
  }

  updateListing(id: string, updates: Partial<Listing>): Listing | null {
    const index = this.listings.findIndex(l => l.id === id);
    if (index === -1) return null;

    this.listings[index] = {
      ...this.listings[index],
      ...updates,
      updatedAt: new Date(),
    };

    return this.listings[index];
  }

  approveListing(id: string): Listing | null {
    return this.updateListing(id, { status: 'approved' });
  }

  rejectListing(id: string): Listing | null {
    return this.updateListing(id, { status: 'rejected' });
  }

  // Audit logs methods
  getAllAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const newLog: AuditLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    this.auditLogs.unshift(newLog); // Add to beginning
    return newLog;
  }

  // Reset data (for testing purposes)
  resetData(): void {
    this.listings = [...mockListings];
    this.auditLogs = [...mockAuditLogs];
  }
}

// Export a singleton instance
export const dataStore = new DataStore(); 
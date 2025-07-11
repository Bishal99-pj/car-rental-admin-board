import { Listing, AuditLog } from './types';
import { mockListings, mockAuditLogs } from './mock-data';

class DataStore {
  private listings: Listing[] = [...mockListings];
  private auditLogs: AuditLog[] = [...mockAuditLogs];

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

  getAllAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  addAuditLog(log: Omit<AuditLog, 'id' | 'timestamp'>): AuditLog {
    const newLog: AuditLog = {
      ...log,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    this.auditLogs.unshift(newLog);
    return newLog;
  }
}

export const dataStore = new DataStore(); 
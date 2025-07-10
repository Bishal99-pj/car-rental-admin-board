'use client';

import { useState, useEffect } from 'react';
import { AuditLog } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Activity } from 'lucide-react';

export function AuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState<string>('all');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(actionFilter !== 'all' && { action: actionFilter }),
      });

      const response = await fetch(`/api/audit-logs?${params}`, {
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        setLogs(data.data.logs);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [currentPage, actionFilter]);

  const getActionBadge = (action: string) => {
    const variants = {
      login: 'bg-blue-100 text-blue-800',
      logout: 'bg-gray-100 text-gray-800',
      approve: 'bg-green-100 text-green-800',
      reject: 'bg-red-100 text-red-800',
      edit: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <Badge className={variants[action as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {action.charAt(0).toUpperCase() + action.slice(1)}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString();
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'login':
        return '🔐';
      case 'logout':
        return '🚪';
      case 'approve':
        return '✅';
      case 'reject':
        return '❌';
      case 'edit':
        return '✏️';
      default:
        return '📝';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Audit Trail</span>
        </CardTitle>
        <div className="flex justify-end">
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="logout">Logout</SelectItem>
              <SelectItem value="approve">Approve</SelectItem>
              <SelectItem value="reject">Reject</SelectItem>
              <SelectItem value="edit">Edit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span>{getActionIcon(log.action)}</span>
                        {getActionBadge(log.action)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{log.adminName}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {log.listingTitle && (
                          <div className="text-sm font-medium">{log.listingTitle}</div>
                        )}
                        {log.details && (
                          <div className="text-sm text-gray-500">{log.details}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {formatTimestamp(log.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {logs.length === 0 && !loading && (
              <div className="text-center py-8 text-gray-500">
                No audit logs found
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 
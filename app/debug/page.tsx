'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DebugPage() {
  const { user, login } = useAuth();
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testLogin = async () => {
    setIsLoading(true);
    try {
      const success = await login('admin@carrental.com', 'admin123');
      addResult(success ? 'Login successful' : 'Login failed');
    } catch (error) {
      addResult(`Login error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testListings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/listings?page=1&limit=5', {
        credentials: 'include',
      });
      const data = await response.json();
      addResult(`Listings API: ${response.status} - ${data.success ? 'Success' : data.error}`);
      if (data.success) {
        addResult(`Found ${data.data.listings.length} listings`);
      }
    } catch (error) {
      addResult(`Listings API error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testApprove = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/listings/1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ action: 'approve' }),
      });
      const data = await response.json();
      addResult(`Approve API: ${response.status} - ${data.success ? 'Success' : data.error}`);
      if (data.success) {
        addResult(`Listing status: ${data.data.status}`);
      }
    } catch (error) {
      addResult(`Approve API error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testEdit = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/listings/2', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          title: 'Test Updated Title',
          price: 99,
          description: 'Test updated description',
        }),
      });
      const data = await response.json();
      addResult(`Edit API: ${response.status} - ${data.success ? 'Success' : data.error}`);
      if (data.success) {
        addResult(`Updated title: ${data.data.title}, price: ${data.data.price}`);
      }
    } catch (error) {
      addResult(`Edit API error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Debug Page - Authentication & API Testing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p><strong>Current User:</strong> {user ? `${user.name} (${user.email})` : 'Not logged in'}</p>
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={testLogin} disabled={isLoading}>
                  Test Login
                </Button>
                <Button onClick={testListings} disabled={isLoading}>
                  Test Listings API
                </Button>
                <Button onClick={testApprove} disabled={isLoading}>
                  Test Approve
                </Button>
                <Button onClick={testEdit} disabled={isLoading}>
                  Test Edit
                </Button>
                <Button onClick={clearResults} variant="outline">
                  Clear Results
                </Button>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Test Results:</h3>
                <div className="bg-gray-100 p-4 rounded-md max-h-96 overflow-y-auto">
                  {testResults.length === 0 ? (
                    <p className="text-gray-500">No test results yet. Run some tests above.</p>
                  ) : (
                    <div className="space-y-1">
                      {testResults.map((result, index) => (
                        <div key={index} className="text-sm font-mono">
                          {result}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 
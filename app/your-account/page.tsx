'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Home } from 'lucide-react';

interface AccountData {
  username: string;
  email: string;
  joinDate: string;
  totalTrades: number;
  portfolioValue: number;
}

export default function YourAccount() {
  const [accountData, setAccountData] = useState<AccountData | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Simulating data fetch from an API
    const fetchData = async () => {
      // Replace this with actual API call in production
      const mockData: AccountData = {
        username: "JohnDoe",
        email: "john.doe@example.com",
        joinDate: "2023-01-15",
        totalTrades: 157,
        portfolioValue: 25000.50,
      };
      setAccountData(mockData);
    };

    fetchData();
  }, []);

  if (!accountData) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between mb-4">
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <Button
          variant="ghost"
          onClick={() => router.push('/')}
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
      </div>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Your Account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold">Username</h3>
              <p>{accountData.username}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Email</h3>
              <p>{accountData.email}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Join Date</h3>
              <p>{new Date(accountData.joinDate).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Total Trades</h3>
              <p>{accountData.totalTrades}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold">Portfolio Value</h3>
              <p>${accountData.portfolioValue.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


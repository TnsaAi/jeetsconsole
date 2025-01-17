"use client";

import { X, History, User, Settings, Wallet, TrendingUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';


interface ChatHistoryEntry {
  date: string;
  preview: string;
}

export function Sidebar() {
  const [chatHistory, setChatHistory] = useState<ChatHistoryEntry[]>([]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      const response = await fetch('/api/chat-history');
      if (response.ok) {
        const history = await response.json();
        const processedHistory = history.reduce((acc: ChatHistoryEntry[], message: any, index: number) => {
          if (index % 2 === 0) {
            acc.push({
              date: new Date().toLocaleDateString(),
              preview: message.content.substring(0, 30) + '...',
            });
          }
          return acc;
        }, []);
        setChatHistory(processedHistory);
      }
    };
    fetchChatHistory();
  }, []);

  return (
    <div className="w-64 border-r border-border bg-black p-4 flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="text-xl font-semibold text-orange-500">JeetsConsole</Link>
        <Button variant="ghost" size="icon">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="space-y-4 flex-grow overflow-auto">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
          <History className="h-4 w-4" />
          <span>Chat History</span>
        </div>
        {chatHistory.map((entry, index) => (
          <div key={index} className="text-sm">
            <p className="text-muted-foreground">{entry.date}</p>
            <p className="truncate">{entry.preview}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-auto space-y-2">
        <Link href="/predictions" passHref>
          <Button variant="outline" className="w-full justify-start">
            <TrendingUp className="mr-2 h-4 w-4" />
            Jeets Predictions
          </Button>
        </Link>
        <Link href="/your-account" passHref>
          <Button variant="outline" className="w-full justify-start">
            <User className="mr-2 h-4 w-4" />
            Your Account
          </Button>
        </Link>
        <Link href="/account-settings" passHref>
          <Button variant="default" className="w-full justify-start bg-orange-500 hover:bg-orange-600">
            <Settings className="mr-2 h-4 w-4" />
            Account Settings
          </Button>
        </Link>
        <ConnectButton />
        {/* <Button variant="outline" className="w-full justify-start">
          <Wallet className="mr-2 h-4 w-4" />
          Your Wallet
        </Button> */}
      </div>
    </div>
  );
}


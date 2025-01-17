'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, Home } from 'lucide-react'

export default function AccountSettings() {
  const [activeTab, setActiveTab] = useState("profile")
  const router = useRouter()

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
          <CardTitle className="text-2xl font-bold">Account Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="integration">Integration</TabsTrigger>
            </TabsList>
            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" placeholder="Your username" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Your email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" placeholder="Tell us about yourself" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Profile Picture</Label>
                <Input id="avatar" type="file" accept="image/*" />
              </div>
            </TabsContent>
            {/* Security Tab */}
            <TabsContent value="security" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="Enter new password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" placeholder="Confirm new password" />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="2fa" />
                <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
              </div>
            </TabsContent>
            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="notifications" />
                <Label htmlFor="notifications">Enable Email Notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="dark-mode" />
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Preferred Language</Label>
                <select id="language" className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-background">
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="risk-tolerance">Risk Tolerance</Label>
                <select id="risk-tolerance" className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-background">
                  <option value="conservative">Conservative</option>
                  <option value="moderate">Moderate</option>
                  <option value="aggressive">Aggressive</option>
                </select>
              </div>
            </TabsContent>
            {/* Integration Tab */}
            <TabsContent value="integration" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="exchange">Connected Exchanges</Label>
                <select id="exchange" className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-background">
                  <option value="binance">Binance</option>
                  <option value="coinbase">Coinbase</option>
                  <option value="kraken">Kraken</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <Input id="api-key" type="text" placeholder="Enter your API key" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-secret">API Secret</Label>
                <Input id="api-secret" type="password" placeholder="Enter your API secret" />
              </div>
            </TabsContent>
          </Tabs>
          <Button className="w-full mt-6">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}


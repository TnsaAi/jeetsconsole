'use client'

import { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const cryptocurrencies = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'DOGE' },
  { id: 'ripple', name: 'XRP', symbol: 'XRP' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'litecoin', name: 'Litecoin', symbol: 'LTC' },
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
  { id: 'stellar', name: 'Stellar', symbol: 'XLM' },
]

interface HeaderProps {
  onCryptoChange: (value: string) => void
}

export function Header({ onCryptoChange }: HeaderProps) {
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin')

  const handleCryptoChange = (value: string) => {
    setSelectedCrypto(value)
    onCryptoChange(value)
  }

  return (
    <div className="border-b border-border p-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-semibold text-orange-500">JeetsConsole</h1>
        <Badge variant="secondary">Beta</Badge>
      </div>
      <Select value={selectedCrypto} onValueChange={handleCryptoChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select cryptocurrency" />
        </SelectTrigger>
        <SelectContent>
          {cryptocurrencies.map((crypto) => (
            <SelectItem key={crypto.id} value={crypto.id}>
              {crypto.name} ({crypto.symbol})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}


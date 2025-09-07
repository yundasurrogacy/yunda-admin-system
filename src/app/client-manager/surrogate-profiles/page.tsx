'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import ManagerLayout from '@/components/manager-layout'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

interface Surrogate {
  id: string
  name: string
  location: string
  status: 'Matched' | 'In Progress'
}

const mockSurrogates: Surrogate[] = new Array(12).fill(null).map((_, index) => ({
  id: String(index + 1),
  name: 'John Doe',
  location: 'United States',
  status: index % 3 === 0 ? 'In Progress' : 'Matched'
}))

export default function SurrogateProfiles() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [hovered, setHovered] = React.useState<string | null>(null)
  const router = useRouter()

  return (
    <ManagerLayout>
      <div className="p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold font-serif text-[#271F18]">Surrogate Profile</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="w-[240px] pl-9 bg-white font-serif text-[#271F18] border-none shadow rounded-full focus:ring-0 focus:outline-none"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockSurrogates
            .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((surrogate, idx) => (
              <div
                key={surrogate.id}
                className="rounded-xl bg-[#FBF0DA40] p-6 shadow font-serif text-[#271F18] flex flex-col justify-between min-h-[120px] hover:shadow-lg transition-shadow"
                onMouseEnter={() => setHovered(surrogate.id)}
                onMouseLeave={() => setHovered(null)}
              >
                <div>
                  <div className="text-lg font-serif mb-1">{surrogate.name}</div>
                  <div className="text-sm mb-1">{surrogate.location}</div>
                  <div className="text-sm mb-2">Surrogate</div>
                  <div className="text-sm mb-2">{surrogate.status}</div>
                </div>
                <div className="flex justify-end">
                  <Button
                    className={`rounded bg-[#D9D9D9] text-[#271F18] font-serif px-4 py-1 text-xs shadow-none border border-[#D9D9D9] transition-colors ${hovered === surrogate.id ? 'bg-[#F5E6C8] border-[#271F18]' : ''}`}
                    onClick={() => router.push(`/client-manager/surrogate-profiles/${surrogate.id}`)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </ManagerLayout>
  )
}

'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart,
  Briefcase,
  Users,
  FileText,
  CheckSquare,
  MessageCircle,
  Bell,
  ChevronLeft,
  Menu as MenuIcon,
  LogOut,
} from 'lucide-react'

const navigation = [
  { name: 'DASHBOARD', href: '/client-manager/dashboard', icon: BarChart },
  { name: 'MY CASES', href: '/client-manager/my-cases', icon: Briefcase },
  { name: 'CLIENT PROFILES', href: '/client-manager/client-profiles', icon: Users },
  { name: 'SURROGATE PROFILES', href: '/client-manager/surrogate-profiles', icon: Users },
  { name: 'MEDICAL RECORDS', href: '/client-manager/medical-records', icon: FileText },
  { name: 'COMMUNICATION LOGS', href: '/client-manager/communication-logs', icon: MessageCircle },
  { name: 'DAILY TASKS', href: '/client-manager/daily-tasks', icon: CheckSquare },
  { name: 'NOTIFICATIONS', href: '/client-manager/notifications', icon: Bell },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function ManagerSidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(true)

  const baseStyles = cn(
    'fixed inset-y-0 left-0 z-50 flex h-screen flex-col bg-white shadow transition-all duration-300',
    expanded ? 'w-64' : 'w-20',
    isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
  )

  const overlayStyles = cn(
    'fixed inset-0 bg-black/50 md:hidden transition-opacity duration-300',
    isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
  )

  return (
    <>
      <div className={overlayStyles} onClick={onClose} />
      <aside className={baseStyles}>
        {/* Logo & Toggle */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-3">
            <Image
              src="/yunda-logo.svg"
              alt="Yunda Logo"
              width={32}
              height={32}
            />
            {expanded && <span className="font-semibold text-xl">YUNDA</span>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex"
            onClick={() => setExpanded(!expanded)}
          >
            <ChevronLeft className={cn(
              'h-4 w-4 transition-transform',
              !expanded && 'rotate-180'
            )} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onClose}
          >
            <MenuIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <button
                key={item.name}
                onClick={() => {
                  router.push(item.href)
                  onClose()
                }}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full ${
                  isActive
                    ? 'bg-gray-100 text-gray-900'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`}
                  aria-hidden="true"
                />
                {expanded && item.name}
              </button>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <Select defaultValue="zh" onValueChange={(value) => {}}>
              <SelectTrigger className="w-24">
                <SelectValue placeholder="语言" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">EN</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/client-manager/login')}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

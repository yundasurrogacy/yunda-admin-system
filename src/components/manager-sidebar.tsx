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
  User,
  Route as Road, // 使用 Route 图标代替 Road
  FileText,
  Building2,
  PiggyBank,
  MessageCircle,
  Users,
  LifeBuoy,
  ChevronLeft,
  Menu as MenuIcon,
  LogOut,
} from 'lucide-react'

// 按图片所示分组导航菜单
const navigationGroups = [
  [
    { name: 'DASHBOARD', href: '/client/dashboard', icon: BarChart },
  ],
  [
    { name: 'MY PROFILE', href: '/client/profile', icon: User },
    { name: 'JOURNEY', href: '/client/journey', icon: Road },
    { name: 'MY FILES', href: '/client/files', icon: FileText },
  ],
  [
    { name: 'IVF CLINIC', href: '/client/ivf-clinic', icon: Building2 },
    { name: 'TRUST ACCOUNT', href: '/client/trust-account', icon: PiggyBank },
    { name: 'MESSAGES', href: '/client/messages', icon: MessageCircle },
  ],
  [
    { name: 'SURROGATE MATCH', href: '/client/surrogate-match', icon: Users },
    { name: 'SUPPORT', href: '/client/support', icon: LifeBuoy },
  ],
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
    'fixed inset-y-0 left-0 z-50 flex h-screen flex-col bg-[#BFC9BF] shadow-lg border-r transition-all duration-300',
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
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Image
              src="/yunda-logo.svg"
              alt="Yunda Logo"
              width={32}
              height={32}
              className="brightness-0 invert" // 使logo变成白色
            />
            {expanded && <span className="font-semibold text-xl text-white">YUNDA</span>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex text-white hover:bg-[#A9B5A9] hover:text-white"
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
            className="md:hidden text-white hover:bg-[#A9B5A9] hover:text-white"
            onClick={onClose}
          >
            <MenuIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          {navigationGroups.map((group, groupIndex) => (
            <div 
              key={groupIndex}
              className={cn(
                "space-y-1",
                groupIndex > 0 && "mt-8" // Add spacing between groups
              )}
            >
              {group.map((item) => {
                const isActive = pathname === item.href
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      router.push(item.href)
                      onClose()
                    }}
                    className={cn(
                      "group flex items-center px-4 py-2 text-sm font-medium w-full transition-colors",
                      isActive
                        ? "bg-[#A9B5A9] text-white"
                        : "text-white hover:bg-[#A9B5A9] hover:text-white"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "mr-3 h-5 w-5",
                        isActive ? "text-white" : "text-white/80 group-hover:text-white"
                      )}
                      aria-hidden="true"
                    />
                    {expanded && (
                      <span className={cn(
                        "tracking-wider font-medium",
                        isActive && "text-blue-700"
                      )}>
                        {item.name}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ))}
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
              onClick={() => router.push('/client/login')}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

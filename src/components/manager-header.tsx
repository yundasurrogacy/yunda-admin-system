'use client'

import { Bell, Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from './ui/button'

interface HeaderProps {
  onMenuClick: () => void;
}

export default function ManagerHeader({ onMenuClick }: HeaderProps) {
  const router = useRouter()

  return (
    <header className="bg-white shadow">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex-1 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={onMenuClick}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-bold">经理管理系统</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/client-manager/notifications')}
              >
                <Bell className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  // TODO: 添加登出逻辑
                  router.push('/client-manager/login')
                }}
              >
                登出
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

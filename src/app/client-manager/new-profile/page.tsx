'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ManagerLayout from '@/components/manager-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  UserPlus,
  ArrowLeft,
  FileText
} from 'lucide-react'

export default function NewProfile() {
  const router = useRouter()
  
  return (
    <ManagerLayout>
      <div className="space-y-6">
        {/* 页面标题和返回按钮 */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">新建档案</h1>
            <p className="text-gray-500">选择要创建的档案类型</p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* 客户档案选项 */}
          <Card className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => router.push('/client-manager/client-profiles/new')}>
            <div className="p-8 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">客户档案</h3>
              <p className="text-gray-500 mb-6">
                创建新的客户档案，记录客户的基本信息、联系方式以及服务需求。
              </p>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                新建客户档案
              </Button>
            </div>
          </Card>
          
          {/* 代孕妈妈档案选项 */}
          <Card className="cursor-pointer hover:shadow-md transition-all"
                onClick={() => router.push('/client-manager/surrogate-profiles/new')}>
            <div className="p-8 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-full bg-pink-100 flex items-center justify-center mb-6">
                <UserPlus className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">代孕妈妈档案</h3>
              <p className="text-gray-500 mb-6">
                创建新的代孕妈妈档案，记录基本情况、健康状况以及配对偏好。
              </p>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                新建代孕妈妈档案
              </Button>
            </div>
          </Card>
        </div>
        
        {/* 底部说明 */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
          <p className="font-medium mb-2">提示：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>创建档案后，您可以添加详细信息和上传相关文件</li>
            <li>客户档案可用于创建新案例和跟踪服务进度</li>
            <li>代孕妈妈档案可用于与客户需求进行匹配</li>
            <li>所有档案信息需严格保密，遵循公司隐私政策</li>
          </ul>
        </div>
      </div>
    </ManagerLayout>
  )
}

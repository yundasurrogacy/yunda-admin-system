'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ManagerLayout from '@/components/manager-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { useClients } from '@/hooks/useClients'
import { useSurrogates } from '@/hooks/useSurrogates'
import { 
  ArrowLeft, 
  Save, 
  Users, 
  UserPlus,
  Link as LinkIcon,
  FileText,
  X
} from 'lucide-react'
import { getHasuraClient } from '@/config-lib/hasura-graphql-client/hasura-graphql-client'

export default function NewCase() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedClient, setSelectedClient] = useState<string>('')
  const [selectedSurrogate, setSelectedSurrogate] = useState<string>('')
  const [showClientSearch, setShowClientSearch] = useState(false)
  const [showSurrogateSearch, setShowSurrogateSearch] = useState(false)
  const [clientSearch, setClientSearch] = useState('')
  const [surrogateSearch, setSurrogateSearch] = useState('')
  
  // 假设这些 hooks 返回的数据结构如下所示
  const { clients, loading: clientsLoading } = useClients({ search: clientSearch })
  const { surrogates, loading: surrogatesLoading } = useSurrogates({ 
    search: surrogateSearch,
    status: '可配对'
  })
  
  const [caseData, setCaseData] = useState({
    title: '',
    description: '',
    client_id: '',
    surrogate_id: null as string | null,
  })
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCaseData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleClientSelect = (id: string, name: string) => {
    setCaseData(prev => ({
      ...prev,
      client_id: id
    }))
    setSelectedClient(name)
    setShowClientSearch(false)
  }
  
  const handleSurrogateSelect = (id: string, name: string) => {
    setCaseData(prev => ({
      ...prev,
      surrogate_id: id
    }))
    setSelectedSurrogate(name)
    setShowSurrogateSearch(false)
  }
  
  const handleClearClient = () => {
    setCaseData(prev => ({
      ...prev,
      client_id: ''
    }))
    setSelectedClient('')
  }
  
  const handleClearSurrogate = () => {
    setCaseData(prev => ({
      ...prev,
      surrogate_id: null
    }))
    setSelectedSurrogate('')
  }
  
  const handleCreateCase = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (!caseData.title.trim()) {
        setError('请输入案例标题')
        setLoading(false)
        return
      }
      
      if (!caseData.client_id) {
        setError('请选择客户')
        setLoading(false)
        return
      }
      
      const hasuraClient = getHasuraClient()
      
      try {
        // 创建案例
        // 创建案例
        // 实际项目中应该使用插入API，这里我们使用模拟数据
        // 在真实项目中，替换为实际的数据插入逻辑
        // 由于没有完整的 hasuraClient 实现，暂时使用模拟成功的方式
        console.log('创建案例:', {
          title: caseData.title,
          description: caseData.description,
          client_id: caseData.client_id,
          surrogate_id: caseData.surrogate_id,
          manager_id: 'current_manager_id',
          status: '进行中',
          start_date: new Date().toISOString(),
          last_update: new Date().toISOString()
        });
        
        // 模拟成功创建
        setTimeout(() => {
          router.push('/client-manager/my-cases');
        }, 500);
        
        router.push('/client-manager/my-cases')
      } catch (apiError) {
        console.error('创建案例失败:', apiError)
        setError('创建案例失败，请重试')
      }
    } catch (err) {
      console.error('处理请求失败:', err)
      setError('处理请求失败，请重试')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <ManagerLayout>
      <div className="space-y-6">
        {/* 页面标题和操作区 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">创建新案例</h1>
              <p className="text-gray-500">创建一个新的代孕服务案例</p>
            </div>
          </div>
          <Button
            variant="default"
            onClick={handleCreateCase}
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            保存案例
          </Button>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* 基础信息 */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">基本信息</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">案例标题</Label>
                  <Input
                    id="title"
                    name="title"
                    value={caseData.title}
                    onChange={handleInputChange}
                    placeholder="输入案例标题"
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">案例描述</Label>
                  <textarea
                    id="description"
                    name="description"
                    value={caseData.description}
                    onChange={handleInputChange}
                    placeholder="输入案例详情描述"
                    className="w-full rounded-md border border-gray-300 px-3 py-2 mt-1 min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          </Card>
          
          {/* 关联档案 */}
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold mb-4">关联档案</h2>
              
              <div className="space-y-6">
                {/* 客户选择 */}
                <div>
                  <Label className="block mb-2">选择客户</Label>
                  
                  {selectedClient ? (
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <Users className="h-5 w-5 mr-2 text-blue-500" />
                        <span>{selectedClient}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleClearClient}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowClientSearch(true)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      搜索客户
                    </Button>
                  )}
                  
                  {showClientSearch && (
                    <div className="mt-2 border rounded-md p-4">
                      <Input
                        placeholder="输入客户姓名或手机号搜索"
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                        className="mb-2"
                      />
                      
                      <div className="max-h-[200px] overflow-y-auto mt-2">
                        {clientsLoading ? (
                          <div className="py-4 text-center text-gray-500">加载中...</div>
                        ) : clients.length === 0 ? (
                          <div className="py-4 text-center text-gray-500">未找到客户</div>
                        ) : (
                          <div className="space-y-2">
                            {clients.map((client) => (
                              <div
                                key={client.id}
                                className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                                onClick={() => handleClientSelect(String(client.id), client.name)}
                              >
                                <Users className="h-4 w-4 mr-2 text-blue-500" />
                                <div>
                                  <p className="font-medium">{client.name}</p>
                                  <p className="text-xs text-gray-500">{client.phone}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between mt-3 pt-3 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowClientSearch(false)}
                        >
                          取消
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => router.push('/client-manager/client-profiles/new')}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          添加新客户
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 代孕妈妈选择（可选） */}
                <div>
                  <Label className="block mb-2">选择代孕妈妈（可选）</Label>
                  
                  {selectedSurrogate ? (
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <UserPlus className="h-5 w-5 mr-2 text-pink-500" />
                        <span>{selectedSurrogate}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={handleClearSurrogate}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowSurrogateSearch(true)}
                    >
                      <UserPlus className="h-4 w-4 mr-2" />
                      搜索代孕妈妈
                    </Button>
                  )}
                  
                  {showSurrogateSearch && (
                    <div className="mt-2 border rounded-md p-4">
                      <Input
                        placeholder="输入代孕妈妈姓名或ID搜索"
                        value={surrogateSearch}
                        onChange={(e) => setSurrogateSearch(e.target.value)}
                        className="mb-2"
                      />
                      
                      <div className="max-h-[200px] overflow-y-auto mt-2">
                        {surrogatesLoading ? (
                          <div className="py-4 text-center text-gray-500">加载中...</div>
                        ) : surrogates.length === 0 ? (
                          <div className="py-4 text-center text-gray-500">未找到可用的代孕妈妈</div>
                        ) : (
                          <div className="space-y-2">
                            {surrogates.map((surrogate) => (
                              <div
                                key={surrogate.id}
                                className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer"
                                onClick={() => handleSurrogateSelect(surrogate.id, surrogate.name)}
                              >
                                <UserPlus className="h-4 w-4 mr-2 text-pink-500" />
                                <div>
                                  <p className="font-medium">{surrogate.name}</p>
                                  <p className="text-xs text-gray-500">
                                    {surrogate.age}岁 | {surrogate.health} | {surrogate.experience}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between mt-3 pt-3 border-t">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowSurrogateSearch(false)}
                        >
                          取消
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => router.push('/client-manager/surrogate-profiles')}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          查看所有代孕妈妈
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* 文件上传提示 */}
                <div className="mt-8 text-center text-sm text-gray-500">
                  <p>案例创建后，您可以上传相关文档和添加详细信息</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </ManagerLayout>
  )
}

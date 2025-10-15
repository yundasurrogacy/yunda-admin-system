"use client"

import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { CustomButton } from "../../../components/ui/CustomButton"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { Progress } from "../../../components/ui/progress"
import { Avatar, AvatarFallback } from "../../../components/ui/avatar"
import { 
  AlertTriangle, 
  Users, 
  UserCheck, 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  Settings,
  Shield,
  Database,
  PieChart
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import {getSurrogatesApplications, getParentsApplications } from '@/lib/graphql/applications'
export default function DashboardPage() {
  const router = useRouter()
  const { t } = useTranslation("common")
  // 只认 admin cookie，不依赖 useAuth 的 client session
  function getCookie(name: string) {
    if (typeof document === 'undefined') return undefined;
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? match[2] : undefined;
  }
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [user, setUser] = useState<any>(null)

  // 真实案例数据
  const [cases, setCases] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  // 申请表统计
  const [surrogateApplications, setSurrogateApplications] = useState<any[]>([])
  const [parentApplications, setParentApplications] = useState<any[]>([])
  // GC/IP 总数
  const [gcTotal, setGcTotal] = useState(0)
  const [ipTotal, setIpTotal] = useState(0)

  // 认证检查和 cookie 读取
  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      const userRole = getCookie('userRole_admin')
      const userEmail = getCookie('userEmail_admin')
      const userId = getCookie('userId_admin')
      const authed = !!(userRole && userEmail && userId && userRole === 'admin')
      setIsAuthenticated(authed)
      setUser(authed ? { id: userId, email: userEmail, role: userRole } : null)
      if (!authed) {
        router.replace('/admin/login')
      }
    }
  }, [router])

  // 获取真实案例数据
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true)
      Promise.all([
        fetch("/api/cases-list").then(r => r.json()),
       getSurrogatesApplications(10000, 0),
        getParentsApplications(10000, 0)
      ]).then(([casesData, surrogates, parents]) => {
        setCases(Array.isArray(casesData) ? casesData : casesData.data || [])
        setSurrogateApplications(surrogates || [])
        setParentApplications(parents || [])
        setGcTotal(surrogates.length)
        setIpTotal(parents.length)
      }).finally(() => setLoading(false))
    }
  }, [isAuthenticated])

  // 首屏只渲染 loading，等 cookie 认证完成后再渲染内容
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }
  if (!isAuthenticated) {
    return null
  }

  // 阶段统计
  const stageMap: Record<string, string> = {
    Matching: t("matching"),
    LegalStage: t("legalStage"),
    CyclePrep: t("cyclePrep"),
    Pregnant: t("pregnancy"),
    Transferred: t("transferred"),
  }
  // 统计各阶段数量
  const stageCounts: Record<string, number> = {}
  cases.forEach(c => {
    const status = c.process_status || "Unknown"
    stageCounts[status] = (stageCounts[status] || 0) + 1
  })
  // 构造阶段分布数据
  const stageData = Object.entries(stageCounts).map(([key, value]) => ({
    name: stageMap[key as keyof typeof stageMap] || key,
    value,
    count: `(${value})`,
  }))
  // 总案例数
  const totalCases = cases.length

  // 代孕母申请表统计
  const surrogateStats = {
    total: surrogateApplications.length,
    approved: surrogateApplications.filter((a: any) => a.status === 'approved').length,
    rejected: surrogateApplications.filter((a: any) => a.status === 'rejected').length,
    pending: surrogateApplications.filter((a: any) => a.status === 'pending').length,
  }
  // 准父母申请表统计
  const parentStats = {
    total: parentApplications.length,
    approved: parentApplications.filter((a: any) => a.status === 'approved').length,
    rejected: parentApplications.filter((a: any) => a.status === 'rejected').length,
    pending: parentApplications.filter((a: any) => a.status === 'pending').length,
  }

  // 客户经理活跃案例统计
  const managerCases: Record<string, number> = {}
  cases.forEach(c => {
    const manager = c.client_manager?.email || c.client_manager?.id || t("notAssigned")
    managerCases[manager] = (managerCases[manager] || 0) + 1
  })
  const activeCases = Object.entries(managerCases).map(([manager, count]) => ({
    name: manager,
    count,
  }))

  const chartColors = ["#E8E2D5", "#D4C0A8", "#8B6F47", "#6B4F3A", "#A9907E"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-brand-yellow">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-sage-800 mb-2">{t("dashboard.adminTitle", "Dashboard")}</h1>
            <p className="text-sage-600">{t("dashboard.adminWelcome", "System overview and management controls")}</p>
          </div>
          <CustomButton 
            className="px-6 py-3 bg-sage-600 hover:bg-sage-700 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 cursor-pointer"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-4 h-4" />
            {t('dashboard.refresh', 'Refresh')}
          </CustomButton>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Parent Applications */}
          <Card 
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={() => router.push("/admin/parents-applications")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sage-600 mb-1">{t("ParentApplications", "Parent Applications")}</p>
                  <p className="text-3xl font-bold text-sage-800">{parentStats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-600">{t('approved', 'Approved')}</span>
                  <span className="font-medium">{parentStats.approved}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-yellow-600">{t('pending', 'Pending')}</span>
                  <span className="font-medium">{parentStats.pending}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-red-600">{t('rejected', 'Rejected')}</span>
                  <span className="font-medium">{parentStats.rejected}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Surrogate Applications */}
          <Card 
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={() => router.push("/admin/surrogates-applications")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sage-600 mb-1">{t("SurrogateApplications", "Surrogate Applications")}</p>
                  <p className="text-3xl font-bold text-sage-800">{surrogateStats.total}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-600">{t('approved', 'Approved')}</span>
                  <span className="font-medium">{surrogateStats.approved}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-yellow-600">{t('pending', 'Pending')}</span>
                  <span className="font-medium">{surrogateStats.pending}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-red-600">{t('rejected', 'Rejected')}</span>
                  <span className="font-medium">{surrogateStats.rejected}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Intended Parents */}
          <Card 
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={() => router.push("/admin/client-profiles")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sage-600 mb-1">{t("TotalIP", "Total IP")}</p>
                  <p className="text-3xl font-bold text-sage-800">{ipTotal}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-sage-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Intended parents registered
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Surrogates */}
          <Card 
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={() => router.push("/admin/surrogate-profiles")}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-sage-600 mb-1">{t("TotalGC", "Total GC")}</p>
                  <p className="text-3xl font-bold text-sage-800">{gcTotal}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm text-sage-600">
                  <Activity className="w-4 h-4 mr-1" />
                  Surrogates registered
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cases Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Total Active Cases */}
          <Card 
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={() => router.push("/admin/all-cases")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sage-800">
                <Database className="w-5 h-5" />
                {t("totalActiveCases", "Total Active Cases")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-6xl font-bold text-sage-800 mb-4">
                  {loading ? "..." : totalCases}
                </div>
                <div className="flex items-center justify-center text-sm text-sage-600">
                  <BarChart3 className="w-4 h-4 mr-1" />
                  Active cases in system
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stage Distribution */}
          <Card 
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={() => router.push("/admin/all-cases")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sage-800">
                <PieChart className="w-5 h-5" />
                {t("stageDistribution", "Stage Distribution")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stageData.map((item, index) => {
                  const percentage = totalCases > 0 ? (item.value / totalCases) * 100 : 0;
                  
                  // 根据阶段设置不同的颜色
                  const getStageColor = (stageName: string) => {
                    switch (stageName) {
                      case t("matching", "Matching"):
                        return 'bg-blue-500';
                      case t("legalStage", "Legal Stage"):
                        return 'bg-purple-500';
                      case t("cyclePrep", "Cycle Prep"):
                        return 'bg-orange-500';
                      case t("pregnancy", "Pregnancy"):
                        return 'bg-pink-500';
                      case t("transferred", "Transferred"):
                        return 'bg-green-500';
                      default:
                        return 'bg-gray-500';
                    }
                  };
                  
                  const getStageBgColor = (stageName: string) => {
                    switch (stageName) {
                      case t("matching", "Matching"):
                        return 'bg-blue-100';
                      case t("legalStage", "Legal Stage"):
                        return 'bg-purple-100';
                      case t("cyclePrep", "Cycle Prep"):
                        return 'bg-orange-100';
                      case t("pregnancy", "Pregnancy"):
                        return 'bg-pink-100';
                      case t("transferred", "Transferred"):
                        return 'bg-green-100';
                      default:
                        return 'bg-gray-100';
                    }
                  };
                  
                  return (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getStageColor(item.name)}`}></div>
                          <span className="text-sm font-medium text-sage-700">{item.name}</span>
                        </div>
                        <span className="text-sm text-sage-600">{item.value} ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${getStageColor(item.name)}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sage-800">
                <Settings className="w-5 h-5" />
                {t("dashboard.quickActions", "Quick Actions")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CustomButton 
                className="w-full justify-start px-4 py-3 bg-sage-100 hover:bg-sage-200 text-sage-800 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105"
                onClick={() => router.push('/admin/all-cases')}
              >
                <Database className="w-4 h-4 mr-3" />
                {t("dashboard.manageCases", "Manage Cases")}
              </CustomButton>
              <CustomButton 
                className="w-full justify-start px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105"
                onClick={() => router.push('/admin/managers')}
              >
                <Shield className="w-4 h-4 mr-3" />
                {t("dashboard.adminManagement", "Admin Management")}
              </CustomButton>
              <CustomButton 
                className="w-full justify-start px-4 py-3 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105"
                onClick={() => router.push('/admin/client-manager')}
              >
                <Users className="w-4 h-4 mr-3" />
                {t("dashboard.clientManagerManagement", "Client Manager Management")}
              </CustomButton>
            </CardContent>
          </Card>

          {/* System Status */}
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sage-800">
                <Activity className="w-5 h-5" />
                {t("dashboard.systemStatus", "System Status")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-sage-800">{t("dashboard.systemOnline", "System Online")}</span>
                  </div>
                  <span className="text-xs text-sage-600">{t("dashboard.allServicesRunning", "All services running")}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-yellow-500" />
                    <span className="text-sm font-medium text-sage-800">{t("dashboard.pendingApplications", "Pending Applications")}</span>
                  </div>
                  <span className="text-xs text-sage-600">{parentStats.pending + surrogateStats.pending} {t("dashboard.total", "total")}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-sage-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-sage-800">{t("dashboard.activeCases", "Active Cases")}</span>
                  </div>
                  <span className="text-xs text-sage-600">{totalCases} {t("dashboard.inProgress", "in progress")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
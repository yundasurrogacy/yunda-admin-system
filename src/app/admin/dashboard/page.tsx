"use client"

import { useState, useEffect, useMemo, useCallback, memo } from "react"
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
import {getSurrogatesApplications, getParentsApplications, getIntendedParents, getSurrogateMothers } from '@/lib/graphql/applications'

// 将 getCookie 函数移到组件外部，避免每次渲染重新创建
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

// 提取统计卡片组件，使用 memo 避免不必要的重渲染
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBgColor: string;
  stats?: { label: string; value: number; color: string }[];
  onClick?: () => void;
  subtitle?: React.ReactNode;
}

const StatCard = memo(({ title, value, icon, iconBgColor, stats, onClick, subtitle }: StatCardProps) => {
  return (
    <Card 
      className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-sage-600 mb-1">{title}</p>
            <p className="text-3xl font-bold text-sage-800">{value}</p>
          </div>
          <div className={`w-12 h-12 ${iconBgColor} rounded-lg flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        {stats && (
          <div className="mt-4 space-y-1">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center justify-between text-xs">
                <span className={stat.color}>{stat.label}</span>
                <span className="font-medium">{stat.value}</span>
              </div>
            ))}
          </div>
        )}
        {subtitle && (
          <div className="mt-4">
            <div className="flex items-center text-sm text-sage-600">
              {subtitle}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
});
StatCard.displayName = 'StatCard';

// 提取阶段进度条组件，使用 memo 优化
interface StageProgressItemProps {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

const StageProgressItem = memo(({ name, value, percentage, color }: StageProgressItemProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${color}`}></div>
          <span className="text-sm font-medium text-sage-700">{name}</span>
        </div>
        <span className="text-sm text-sage-600">{value} ({percentage.toFixed(1)}%)</span>
      </div>
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-500 ${color}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
});
StageProgressItem.displayName = 'StageProgressItem';

export default function DashboardPage() {
  const router = useRouter()
  const { t } = useTranslation("common")
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

  // 获取真实案例数据 - 优化：使用 useCallback 避免重复创建函数
  const fetchDashboardData = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const [casesData, surrogates, parents, surrogateUsers, parentUsers] = await Promise.all([
        fetch("/api/cases-list").then(r => r.json()),
        getSurrogatesApplications(10000, 0),
        getParentsApplications(10000, 0),
        getSurrogateMothers(10000, 0),
        getIntendedParents(10000, 0)
      ]);
      
      setCases(Array.isArray(casesData) ? casesData : casesData.data || []);
      setSurrogateApplications(surrogates || []);
      setParentApplications(parents || []);
      // 使用实际的用户数据而不是申请数据
      setGcTotal(surrogateUsers?.length || 0);
      setIpTotal(parentUsers?.length || 0);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData])

  // ⚠️ 重要：所有 Hooks 必须在条件返回之前调用，以保持 Hooks 调用顺序一致
  // 阶段统计 - 使用 useMemo 缓存，避免每次渲染重新计算
  const stageMap = useMemo<Record<string, string>>(() => ({
    Matching: t("matching"),
    LegalStage: t("legalStage"),
    CyclePrep: t("cyclePrep"),
    Pregnant: t("pregnancy"),
    Transferred: t("transferred"),
  }), [t]);

  // 统计各阶段数量和构造阶段分布数据 - 使用 useMemo 缓存（包括百分比计算）
  const { stageCounts, stageData, totalCases } = useMemo(() => {
    const total = cases.length;
    const counts: Record<string, number> = {};
    cases.forEach(c => {
      const status = c.process_status || "Unknown";
      counts[status] = (counts[status] || 0) + 1;
    });
    
    const data = Object.entries(counts).map(([key, value]) => ({
      name: stageMap[key as keyof typeof stageMap] || key,
      value,
      count: `(${value})`,
      percentage: total > 0 ? (value / total) * 100 : 0,
    }));
    
    return {
      stageCounts: counts,
      stageData: data,
      totalCases: total
    };
  }, [cases, stageMap]);

  // 代孕母申请表统计 - 使用 useMemo 缓存
  const surrogateStats = useMemo(() => ({
    total: surrogateApplications.length,
    approved: surrogateApplications.filter((a: any) => a.status === 'approved').length,
    rejected: surrogateApplications.filter((a: any) => a.status === 'rejected').length,
    pending: surrogateApplications.filter((a: any) => a.status === 'pending').length,
  }), [surrogateApplications]);

  // 准父母申请表统计 - 使用 useMemo 缓存
  const parentStats = useMemo(() => ({
    total: parentApplications.length,
    approved: parentApplications.filter((a: any) => a.status === 'approved').length,
    rejected: parentApplications.filter((a: any) => a.status === 'rejected').length,
    pending: parentApplications.filter((a: any) => a.status === 'pending').length,
  }), [parentApplications]);

  // 客户经理活跃案例统计 - 使用 useMemo 缓存
  const activeCases = useMemo(() => {
    const managerCases: Record<string, number> = {};
    cases.forEach(c => {
      const manager = c.client_manager?.email || c.client_manager?.id || t("notAssigned");
      managerCases[manager] = (managerCases[manager] || 0) + 1;
    });
    return Object.entries(managerCases).map(([manager, count]) => ({
      name: manager,
      count,
    }));
  }, [cases, t]);

  const chartColors = useMemo(() => ["#E8E2D5", "#D4C0A8", "#8B6F47", "#6B4F3A", "#A9907E"], []);

  // 使用 useCallback 缓存获取阶段颜色的函数
  const getStageColor = useCallback((stageName: string) => {
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
  }, [t]);

  // 使用 useCallback 缓存导航函数，避免子组件不必要的重渲染
  const navigateToParentsApplications = useCallback(() => router.push("/admin/parents-applications"), [router]);
  const navigateToSurrogatesApplications = useCallback(() => router.push("/admin/surrogates-applications"), [router]);
  const navigateToClientProfiles = useCallback(() => router.push("/admin/client-profiles"), [router]);
  const navigateToSurrogateProfiles = useCallback(() => router.push("/admin/surrogate-profiles"), [router]);
  const navigateToAllCases = useCallback(() => router.push("/admin/all-cases"), [router]);
  const navigateToManagers = useCallback(() => router.push("/admin/managers"), [router]);
  const navigateToClientManager = useCallback(() => router.push("/admin/client-manager"), [router]);
  const handleRefresh = useCallback(() => window.location.reload(), []);

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 条件渲染：loading 状态
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sage-50 to-brand-yellow">
        <div className="text-lg text-sage-700">Loading...</div>
      </div>
    );
  }

  // 条件渲染：未认证状态（已在 useEffect 中处理重定向）
  if (!isAuthenticated) {
    return null;
  }

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
            onClick={handleRefresh}
          >
            <RefreshCw className="w-4 h-4" />
            {t('dashboard.refresh', 'Refresh')}
          </CustomButton>
        </div>

        {/* Key Metrics Cards - 使用优化后的 StatCard 组件 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Parent Applications */}
          <StatCard
            title={t("ParentApplications", "Parent Applications")}
            value={parentStats.total}
            icon={<Users className="w-6 h-6 text-blue-600" />}
            iconBgColor="bg-blue-100"
            stats={[
              { label: t('approved', 'Approved'), value: parentStats.approved, color: 'text-green-600' },
              { label: t('pending', 'Pending'), value: parentStats.pending, color: 'text-yellow-600' },
              { label: t('rejected', 'Rejected'), value: parentStats.rejected, color: 'text-red-600' }
            ]}
            onClick={navigateToParentsApplications}
          />

          {/* Surrogate Applications */}
          <StatCard
            title={t("SurrogateApplications", "Surrogate Applications")}
            value={surrogateStats.total}
            icon={<UserCheck className="w-6 h-6 text-green-600" />}
            iconBgColor="bg-green-100"
            stats={[
              { label: t('approved', 'Approved'), value: surrogateStats.approved, color: 'text-green-600' },
              { label: t('pending', 'Pending'), value: surrogateStats.pending, color: 'text-yellow-600' },
              { label: t('rejected', 'Rejected'), value: surrogateStats.rejected, color: 'text-red-600' }
            ]}
            onClick={navigateToSurrogatesApplications}
          />

          {/* Total Intended Parents */}
          <StatCard
            title={t("TotalIP", "Total IP")}
            value={ipTotal}
            icon={<Users className="w-6 h-6 text-purple-600" />}
            iconBgColor="bg-purple-100"
            subtitle={
              <><TrendingUp className="w-4 h-4 mr-1" />Intended parents registered</>
            }
            onClick={navigateToClientProfiles}
          />

          {/* Total Surrogates */}
          <StatCard
            title={t("TotalGC", "Total GC")}
            value={gcTotal}
            icon={<UserCheck className="w-6 h-6 text-orange-600" />}
            iconBgColor="bg-orange-100"
            subtitle={
              <><Activity className="w-4 h-4 mr-1" />Surrogates registered</>
            }
            onClick={navigateToSurrogateProfiles}
          />
        </div>

        {/* Cases Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Total Active Cases */}
          <Card 
            className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
            onClick={navigateToAllCases}
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
            onClick={navigateToAllCases}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sage-800">
                <PieChart className="w-5 h-5" />
                {t("stageDistribution", "Stage Distribution")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stageData.map((item) => (
                  <StageProgressItem
                    key={item.name}
                    name={item.name}
                    value={item.value}
                    percentage={item.percentage}
                    color={getStageColor(item.name)}
                  />
                ))}
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
                onClick={navigateToAllCases}
              >
                <Database className="w-4 h-4 mr-3" />
                {t("dashboard.manageCases", "Manage Cases")}
              </CustomButton>
              <CustomButton 
                className="w-full justify-start px-4 py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105"
                onClick={navigateToManagers}
              >
                <Shield className="w-4 h-4 mr-3" />
                {t("dashboard.adminManagement", "Admin Management")}
              </CustomButton>
              <CustomButton 
                className="w-full justify-start px-4 py-3 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-all duration-200 cursor-pointer hover:scale-105"
                onClick={navigateToClientManager}
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
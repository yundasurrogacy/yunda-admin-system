"use client"
import React, { useState, Suspense, useMemo, useCallback } from 'react'
import { useEffect } from 'react'
import { FileText, Upload, CheckCircle, AlertCircle } from 'lucide-react'
import { CustomButton } from '../../../components/ui/CustomButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { memo } from 'react';

// 文件工作流状态
type FileWorkflowStatus = 'pending_submit' | 'submitted' | 'under_review' | 'need_supplement' | 'approved' | 'resubmitting';

interface FileWorkflowItem {
  id: string;
  name: string;
  status: FileWorkflowStatus;
  requirement?: string;
  format?: string;
  dueDate?: string;
  uploads: { time: string; version: string }[];
  reviewStatus?: string;
  reviewFeedback?: string;
  reviewTime?: string;
  linkToJourney?: number;
}

// 空状态组件
const EmptyState = memo(({ 
  icon, 
  title, 
  description 
}: { 
  icon: string; 
  title: string; 
  description: string;
}) => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <div className="text-3xl text-gray-400 mb-3">{icon}</div>
    <h3 className="text-base font-medium text-gray-600 mb-2">{title}</h3>
    <p className="text-sm text-gray-500">{description}</p>
  </div>
));

EmptyState.displayName = 'EmptyState';

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

// 提取需要使用 useSearchParams 的逻辑到单独的组件
function IVFClinicContent() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();
  const caseId = searchParams.get('caseId');

  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clinics, setClinics] = useState<any[]>([]);
  const [actualCaseId, setActualCaseId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'clinic' | 'workflow'>('clinic');
  const [workflowFilter, setWorkflowFilter] = useState<FileWorkflowStatus | 'all'>('all');
  const [selectedWorkflowItem, setSelectedWorkflowItem] = useState<FileWorkflowItem | null>(null);
  const [fileWorkflowItems, setFileWorkflowItems] = useState<FileWorkflowItem[]>([]);

  // 认证检查和 cookie 读取
  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      const userRole = getCookie('userRole_surrogacy')
      const userEmail = getCookie('userEmail_surrogacy')
      const userId = getCookie('userId_surrogacy')
      const authed = !!(userRole && userEmail && userId)
      setIsAuthenticated(authed)
      if (!authed) {
        router.replace('/surrogacy/login')
      }
    }
  }, [router]);

  // 数据加载 - 只在认证后执行
  useEffect(() => {
    // 只在认证后才加载数据
    if (!isAuthenticated) return;
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let targetCaseId = caseId;
        
        const surrogacyId = getCookie('userId_surrogacy');
        if (!surrogacyId) {
          setError('缺少代母登录信息');
          return;
        }
        const resCases = await fetch(`/api/cases-by-surrogate?surrogateId=${surrogacyId}`);
        const casesPayload = await resCases.json();
        const cases = Array.isArray(casesPayload)
          ? casesPayload
          : (casesPayload.cases || casesPayload.data || []);
        const sorted = cases.slice().sort((a: any, b: any) => {
          const aTime = a.updated_at ? new Date(a.updated_at).getTime() : 0;
          const bTime = b.updated_at ? new Date(b.updated_at).getTime() : 0;
          return bTime - aTime;
        });
        if (sorted.length === 0) {
          setError('未找到相关案例');
          return;
        }
        if (caseId) {
          const match = sorted.find((c: any) => c.id?.toString() === caseId);
          targetCaseId = match ? match.id : sorted[0].id;
        } else {
          targetCaseId = sorted[0].id;
        }
        
        const ivfRes = await fetch(`/api/ivf-clinic-get?caseId=${targetCaseId}&aboutRole=surrogate_mother`);
        if (!ivfRes.ok) throw new Error('获取代母数据失败');

        const ivfData = await ivfRes.json();
        setClinics(ivfData.ivf_clinics || []);
        setActualCaseId(String(targetCaseId));

        // 与案例旅程一致：含 about_role 为空的历史数据
        const journeyRes = await fetch(`/api/journey-get?caseId=${targetCaseId}`);
        const journeyData = await journeyRes.json();
        const journeys = (journeyData.journeys || []).filter(
          (j: any) => !j.about_role || j.about_role === 'surrogate_mother'
        );
        const items: FileWorkflowItem[] = journeys.map((j: any) => {
          const files = j.cases_files || [];
          const hasFile = files.some((f: any) => f.file_url);
          const status: FileWorkflowStatus = hasFile ? 'submitted' : 'pending_submit';
          return {
            id: String(j.id),
            name: j.title || `Task ${j.stage}`,
            status,
            format: 'PDF, JPG, PNG',
            uploads: files.filter((f: any) => f.file_url).map((f: any) => ({
              time: f.created_at ? new Date(f.created_at).toLocaleString() : '',
              version: 'v1',
            })),
            linkToJourney: j.stage,
          };
        });
        setFileWorkflowItems(items);
        
      } catch (err) {
        console.error('获取数据失败:', err);
        setError(err instanceof Error ? err.message : '获取数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [caseId, isAuthenticated]);

  // 使用 useMemo 缓存各类型数据
  const clinicOverview = useMemo(() => clinics.find(c => c.type === 'ClinicOverview')?.data, [clinics]);
  const embryoJourneyData = useMemo(() => clinics.find(c => c.type === 'EmbryoJourney')?.data, [clinics]);
  const surrogateMedicalRecordsData = useMemo(() => clinics.find(c => c.type === 'SurrogateMedicalRecords')?.data, [clinics]);
  const surrogateScreeningData = useMemo(() => clinics.find(c => c.type === 'SurrogateMedicalScreening')?.data, [clinics]);
  const surrogateEarlyUSData = useMemo(() => clinics.find(c => c.type === 'SurrogatePregnancyConfirmation')?.data, [clinics]);
  const prenatalDeliveryData = useMemo(() => clinics.find(c => c.type === 'SurrogatePrenatalDelivery')?.data, [clinics]);

  // 使用 useMemo 缓存是否有数据
  const hasAnyData = useMemo(() => clinics.length > 0, [clinics.length]);

  // 使用 useCallback 缓存切换面板函数
  const handleToggleSection = useCallback((section: string) => {
    setOpen(open === section ? null : section);
  }, [open]);

  // 使用 useCallback 缓存返回函数
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // 使用 useCallback 缓存重新加载函数
  const handleReload = useCallback(() => {
    window.location.reload();
  }, []);

  // 使用 useMemo 缓存各数据是否存在
  const hasSurrogateMedicalRecords = useMemo(() => 
    Array.isArray(surrogateMedicalRecordsData) && surrogateMedicalRecordsData.length > 0, 
    [surrogateMedicalRecordsData]
  );

  const hasSurrogateScreening = useMemo(() => 
    Array.isArray(surrogateScreeningData) && surrogateScreeningData.length > 0, 
    [surrogateScreeningData]
  );

  const hasSurrogateEarlyUS = useMemo(() => 
    Array.isArray(surrogateEarlyUSData) && surrogateEarlyUSData.length > 0, 
    [surrogateEarlyUSData]
  );

  const hasPrenatalRecords = useMemo(() => 
    Array.isArray(prenatalDeliveryData?.records) && prenatalDeliveryData.records.length > 0, 
    [prenatalDeliveryData?.records]
  );

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查 loading
  if (isAuthenticated === null) {
    return (
      <div className="p-8 min-h-screen bg-main-bg">
        <div className="text-lg text-sage-700">{t('loading')}</div>
      </div>
    );
  }

  // 未认证，等待重定向
  if (!isAuthenticated) {
    return null;
  }

  // 错误状态
  if (error) {
    return (
      <div className="p-8 min-h-screen bg-main-bg">
        {/* <CustomButton
          className="mb-4 px-5 py-2 rounded-full flex items-center gap-2 bg-[#E3E8E3] text-[#271F18] font-serif text-base font-semibold shadow hover:bg-[#f8f8f8] cursor-pointer"
          onClick={handleBack}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}>
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('back', '返回')}
        </CustomButton> */}
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-white rounded-xl">
          <div className="text-4xl text-red-400 mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">{t('loadFailed', '加载失败')}</h3>
          <p className="text-sm text-gray-500 max-w-sm">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-[#C2A87A] text-white rounded-lg hover:bg-[#a88a5c] transition-colors cursor-pointer"
            onClick={handleReload}
          >
            {t('reload', '重新加载')}
          </button>
        </div>
      </div>
    );
  }

  // 加载状态
  if (loading) {
    return (
      <div className="p-8 min-h-screen bg-main-bg">
        {/* <CustomButton
          className="mb-4 px-5 py-2 rounded-full flex items-center gap-2 bg-[#E3E8E3] text-[#271F18] font-serif text-base font-semibold shadow hover:bg-[#f8f8f8] cursor-pointer"
          onClick={handleBack}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}>
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('back', '返回')}
        </CustomButton> */}
        <h1 className="text-2xl font-semibold text-sage-800 mb-2">{t('ivfClinic.title')}</h1>
        <p className="text-sage-800 mb-8 font-medium">{t('ivfClinic.description')}</p>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C2A87A]"></div>
            <span className="text-gray-600">{t('loading', '加载中...')}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-main-bg">
        {/* 返回按钮 */}
        {/* <CustomButton
          className="mb-4 px-5 py-2 rounded-full flex items-center gap-2 bg-[#E3E8E3] text-[#271F18] font-serif text-base font-semibold shadow hover:bg-[#f8f8f8] cursor-pointer"
          onClick={handleBack}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}>
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('back', '返回')}
        </CustomButton> */}
      <h1 className="text-2xl font-semibold text-sage-800 mb-2">{t('ivfClinic.title')}</h1>
      <p className="text-sage-800 mb-6 font-medium">{t('ivfClinic.description')}</p>

      {/* Tab 切换：诊所信息 | 文件工作流 */}
      <div className="flex gap-2 mb-6 border-b border-sage-200">
        <button
          className={`px-4 py-2 font-medium border-b-2 transition-colors -mb-px ${
            activeTab === 'clinic' ? 'border-sage-600 text-sage-800' : 'border-transparent text-sage-500 hover:text-sage-700'
          }`}
          onClick={() => setActiveTab('clinic')}
        >
          {t('dashboard.clinicInfo', 'Clinic Info')}
        </button>
        <button
          className={`px-4 py-2 font-medium border-b-2 transition-colors -mb-px ${
            activeTab === 'workflow' ? 'border-sage-600 text-sage-800' : 'border-transparent text-sage-500 hover:text-sage-700'
          }`}
          onClick={() => setActiveTab('workflow')}
        >
          {t('dashboard.clinicFileWorkflow', 'Clinic File Workflow')}
        </button>
      </div>

      {/* 文件工作流 Tab 内容 */}
      {activeTab === 'workflow' && (
        <div className="mb-8 space-y-4">
          {/* 状态筛选 */}
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending_submit', 'submitted', 'under_review', 'need_supplement', 'approved'] as const).map((key) => (
              <button
                key={key}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  workflowFilter === key ? 'bg-sage-600 text-white' : 'bg-sage-100 text-sage-700 hover:bg-sage-200'
                }`}
                onClick={() => setWorkflowFilter(key)}
              >
                {key === 'all' ? t('dashboard.filterAll', 'All') :
                 key === 'pending_submit' ? t('dashboard.filterPendingSubmit', 'Pending Submit') :
                 key === 'submitted' ? t('dashboard.filterSubmitted', 'Submitted') :
                 key === 'under_review' ? t('dashboard.filterUnderReview', 'Under Review') :
                 key === 'need_supplement' ? t('dashboard.filterNeedSupplement', 'Need Supplement') :
                 t('dashboard.filterApproved', 'Approved')}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 文件任务列表 */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t('dashboard.pendingDocumentsTitle', 'File Tasks')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {fileWorkflowItems
                  .filter((item) => workflowFilter === 'all' || item.status === workflowFilter)
                  .map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedWorkflowItem?.id === item.id ? 'border-sage-600 bg-sage-50' : 'border-sage-200 hover:bg-sage-50'
                      }`}
                      onClick={() => setSelectedWorkflowItem(item)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sage-800">{item.name}</p>
                          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                            item.status === 'pending_submit' ? 'bg-amber-100 text-amber-800' :
                            item.status === 'submitted' || item.status === 'under_review' ? 'bg-blue-100 text-blue-800' :
                            item.status === 'need_supplement' ? 'bg-orange-100 text-orange-800' :
                            item.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-sage-200 text-sage-700'
                          }`}>
                            {item.status === 'pending_submit' ? t('dashboard.filterPendingSubmit') :
                             item.status === 'submitted' ? t('dashboard.filterSubmitted') :
                             item.status === 'under_review' ? t('dashboard.filterUnderReview') :
                             item.status === 'need_supplement' ? t('dashboard.filterNeedSupplement') :
                             item.status === 'approved' ? t('dashboard.filterApproved') : item.status}
                          </span>
                        </div>
                        {item.linkToJourney && (
                          <CustomButton
                            className="text-xs"
                            onClick={(e) => { e.stopPropagation(); router.push('/surrogacy/journey'); }}
                          >
                            {t('dashboard.goToJourney', 'Journey')}
                          </CustomButton>
                        )}
                      </div>
                    </div>
                  ))}
                {fileWorkflowItems.filter((item) => workflowFilter === 'all' || item.status === workflowFilter).length === 0 && (
                  <p className="text-sm text-sage-500 py-4">{t('dashboard.noPendingDocuments', 'No items')}</p>
                )}
              </CardContent>
            </Card>
            {/* 文件详情区 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t('dashboard.fileRequirement', 'Details')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedWorkflowItem ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-sage-600 mb-1">{t('dashboard.pendingDocumentsTitle')}</p>
                      <p className="font-medium text-sage-800">{selectedWorkflowItem.name}</p>
                    </div>
                    {selectedWorkflowItem.requirement && (
                      <div>
                        <p className="text-sm font-medium text-sage-600 mb-1">{t('dashboard.fileRequirement')}</p>
                        <p className="text-sm text-sage-700">{selectedWorkflowItem.requirement}</p>
                      </div>
                    )}
                    {selectedWorkflowItem.format && (
                      <div>
                        <p className="text-sm font-medium text-sage-600 mb-1">{t('dashboard.requiredFormat')}</p>
                        <p className="text-sm text-sage-700">{selectedWorkflowItem.format}</p>
                      </div>
                    )}
                    {selectedWorkflowItem.uploads.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-sage-600 mb-2">{t('dashboard.uploadHistory')}</p>
                        <ul className="space-y-1 text-sm text-sage-700">
                          {selectedWorkflowItem.uploads.map((u, i) => (
                            <li key={i}>{u.time} - {u.version}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {selectedWorkflowItem.reviewFeedback && (
                      <div>
                        <p className="text-sm font-medium text-sage-600 mb-1">{t('dashboard.reviewResult')}</p>
                        <p className="text-sm text-sage-700">{selectedWorkflowItem.reviewFeedback}</p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-2">
                      {selectedWorkflowItem.status === 'pending_submit' && (
                        <CustomButton onClick={() => router.push('/surrogacy/documents')}>
                          <Upload className="w-4 h-4 mr-2" />
                          {t('dashboard.uploadNow')}
                        </CustomButton>
                      )}
                      {selectedWorkflowItem.status === 'need_supplement' && (
                        <CustomButton onClick={() => router.push('/surrogacy/documents')}>
                          {t('dashboard.reupload')}
                        </CustomButton>
                      )}
                      {selectedWorkflowItem.linkToJourney && (
                        <CustomButton className="bg-sage-100 text-sage-800 border border-sage-300" onClick={() => router.push('/surrogacy/journey')}>
                          {t('dashboard.goToJourney')}
                        </CustomButton>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-sage-500">{t('dashboard.noPendingDocuments')}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* 诊所信息 Tab 内容 */}
      {activeTab === 'clinic' && (
        <>
      {/* 调试信息 - 开发环境显示 */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-sm">
          <div className="font-medium text-yellow-800 mb-1">🔧 调试信息</div>
          <div className="text-yellow-700">
            <div>URL中的caseId: {caseId || '无'}</div>
            <div>实际使用的caseId: {actualCaseId || '未获取'}</div>
            <div>数据来源: {!caseId && actualCaseId ? '代母ID' : caseId ? 'URL参数' : '未知'}</div>
          </div>
        </div>
      )} */}
      
      {/* 数据统计信息 */}
      {/* {hasAnyData && (
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-sage-800">{clinics.length}</span> 个数据模块
              </div>
              <div className="text-sm text-gray-600">
                案例ID: <span className="font-medium text-sage-800">{actualCaseId || caseId}</span>
              </div>
              {!caseId && actualCaseId && (
                <div className="text-xs text-blue-600">
                  (通过代母ID获取)
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-500">
                最后更新: {new Date().toLocaleDateString('zh-CN')}
              </div>
              <button 
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                onClick={() => window.print()}
              >
                🖨️ {t('print', '打印')}
              </button>
            </div>
          </div>
        </div>
      )} */}
      
      {/* 若没有任何数据，显示空状态 */}
      {/* {!hasAnyData && (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-white rounded-xl mb-6">
          <div className="text-4xl text-gray-400 mb-4">🏥</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">{t('ivfClinic.noSurrogateData', '暂无代母IVF诊所数据')}</h3>
          <p className="text-sm text-gray-500 max-w-sm">{t('ivfClinic.noSurrogateDataDesc', '该案例尚未添加任何代母IVF诊所相关信息，请联系管理员添加数据。')}</p>
        </div>
      )} */}
      {/* 代母医疗记录与心理评估 */}
  <div className="rounded-xl bg-white p-0 text-sage-800 mb-4">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => handleToggleSection('Surrogate Medical Records')}>
          <span>{t('ivfClinic.surrogateMedicalRecords','代母医疗记录与心理评估')}</span>
          <span className={`text-xl transition-transform ${open === 'Surrogate Medical Records' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
         {open === 'Surrogate Medical Records' && (
           <div className="px-6 py-4">
             {hasSurrogateMedicalRecords ? (
               <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                 <table className="w-full text-sage-800">
                   <thead className="bg-[#F8F9FA] border-b">
                     <tr>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.date','时间')}</th>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.category','类别')}</th>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.summary','简述')}</th>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.file','文件')}</th>
                     </tr>
                   </thead>
                   <tbody>
                     {surrogateMedicalRecordsData!.map((r:any, i:number) => (
                       <tr key={i} className="border-b border-gray-100 last:border-b-0">
                         <td className="py-3 px-6">{r.date}</td>
                         <td className="py-3 px-6">{r.category}</td>
                         <td className="py-3 px-6">{r.summary}</td>
                         <td className="py-3 px-6">{r.fileUrl ? <a className="text-[#C2A87A] underline hover:text-[#a88a5c] cursor-pointer transition-colors" href={r.fileUrl} target="_blank" rel="noreferrer">{t('ivfClinic.view','查看')}</a> : '-'}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             ) : (
               <EmptyState 
                 icon="🏥"
                 title={t('ivfClinic.noMedicalRecords', '暂无代母医疗记录')}
                 description={t('ivfClinic.noMedicalRecordsDesc', '该案例尚未添加代母医疗记录与心理评估相关信息。')}
               />
             )}
           </div>
         )}
      </div>

      {/* 代母医学筛查 */}
  <div className="rounded-xl bg-white p-0 text-sage-800 mb-4">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => handleToggleSection('Surrogate Screening')}>
          <span>{t('ivfClinic.surrogateScreening','代母医学筛查')}</span>
          <span className={`text-xl transition-transform ${open === 'Surrogate Screening' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
         {open === 'Surrogate Screening' && (
           <div className="px-6 py-4">
             {hasSurrogateScreening ? (
               <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                 <table className="w-full text-sage-800">
                   <thead className="bg-[#F8F9FA] border-b">
                     <tr>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.date','时间')}</th>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.category','类别')}</th>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.name','名称')}</th>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.result','结果')}</th>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.file','文件')}</th>
                     </tr>
                   </thead>
                   <tbody>
                     {surrogateScreeningData!.map((r:any, i:number) => (
                       <tr key={i} className="border-b border-gray-100 last:border-b-0">
                         <td className="py-3 px-6">{r.date}</td>
                         <td className="py-3 px-6">{r.category}</td>
                         <td className="py-3 px-6">{r.name}</td>
                         <td className="py-3 px-6">{r.result}</td>
                         <td className="py-3 px-6">{r.fileUrl ? <a className="text-[#C2A87A] underline hover:text-[#a88a5c] cursor-pointer transition-colors" href={r.fileUrl} target="_blank" rel="noreferrer">{t('ivfClinic.view','查看')}</a> : '-'}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             ) : (
               <EmptyState 
                 icon="🔬"
                 title={t('ivfClinic.noScreening', '暂无代母医学筛查')}
                 description={t('ivfClinic.noScreeningDesc', '该案例尚未添加代母医学筛查相关信息。')}
               />
             )}
           </div>
         )}
      </div>

      {/* 代母怀孕确认与早期B超 */}
  <div className="rounded-xl bg-white p-0 text-sage-800 mb-4">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => handleToggleSection('Surrogate Early Ultrasound')}>
          <span>{t('ivfClinic.surrogateEarlyUS','代母怀孕确认与早期B超')}</span>
          <span className={`text-xl transition-transform ${open === 'Surrogate Early Ultrasound' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
         {open === 'Surrogate Early Ultrasound' && (
           <div className="px-6 py-4">
             {hasSurrogateEarlyUS ? (
               <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                 <table className="w-full text-sage-800">
                   <thead className="bg-[#F8F9FA] border-b">
                     <tr>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.date','时间')}</th>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.category','类别')}</th>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.name','名称')}</th>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.result','结果')}</th>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.file','文件')}</th>
                     </tr>
                   </thead>
                   <tbody>
                     {surrogateEarlyUSData!.map((r:any, i:number) => (
                       <tr key={i} className="border-b border-gray-100 last:border-b-0">
                         <td className="py-3 px-6">{r.date}</td>
                         <td className="py-3 px-6">{r.category}</td>
                         <td className="py-3 px-6">{r.name}</td>
                         <td className="py-3 px-6">{r.result}</td>
                         <td className="py-3 px-6">{r.fileUrl ? <a className="text-[#C2A87A] underline hover:text-[#a88a5c] cursor-pointer transition-colors" href={r.fileUrl} target="_blank" rel="noreferrer">{t('ivfClinic.view','查看')}</a> : '-'}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             ) : (
               <EmptyState 
                 icon="👶"
                 title={t('ivfClinic.noPregnancyConfirmation', '暂无代母怀孕确认信息')}
                 description={t('ivfClinic.noPregnancyConfirmationDesc', '该案例尚未添加代母怀孕确认与早期B超相关信息。')}
               />
             )}
           </div>
         )}
            </div>
            
      {/* 代母产检与生产安排 */}
      <div className="rounded-xl bg-white p-0 text-sage-800 mb-8">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => handleToggleSection('Surrogate Prenatal & Delivery')}>
          <span>{t('ivfClinic.surrogatePrenatalDelivery','代母产检与生产安排')}</span>
          <span className={`text-xl transition-transform ${open === 'Surrogate Prenatal & Delivery' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
         {open === 'Surrogate Prenatal & Delivery' && (
           <div className="px-6 py-4 space-y-6">
             {/* 看板 - 只读模式 */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-[#F5F4ED] rounded-lg p-4">
                 <div className="text-sm text-sage-600 mb-2">{t('ivfClinic.obHospital','生产医院')}</div>
                 <div className="text-base text-sage-800">{prenatalDeliveryData?.board?.obHospital || '-'}</div>
                 <div className="text-sm text-sage-600 mt-3 mb-2">{t('ivfClinic.obDoctor','生产医生')}</div>
                 <div className="text-base text-sage-800">{prenatalDeliveryData?.board?.obDoctor || '-'}</div>
               </div>
               <div className="bg-[#F5F4ED] rounded-lg p-4 md:col-span-2">
                 <div className="text-sm text-sage-600 mb-2">{t('ivfClinic.pboProgress','PBO进程')}</div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                   <div className="text-base text-sage-800">{prenatalDeliveryData?.board?.pboStatus || '-'}</div>
                   <div className="text-base text-sage-800">
                     {prenatalDeliveryData?.board?.pboFileUrl ? 
                       <a className="text-[#C2A87A] underline hover:text-[#a88a5c] cursor-pointer transition-colors" href={prenatalDeliveryData.board.pboFileUrl} target="_blank" rel="noreferrer">{t('ivfClinic.view','查看文件')}</a> : 
                       '-'
                     }
                   </div>
                   <div className="text-base text-sage-800">{prenatalDeliveryData?.board?.pboRemark || '-'}</div>
                 </div>
               </div>
             </div>
             {/* 产检与生产记录列表 */}
             {hasPrenatalRecords ? (
               <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                 <table className="w-full text-sage-800">
                   <thead className="bg-[#F8F9FA] border-b">
                     <tr>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.status','状态')}</th>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.date','时间')}</th>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.name','名称')}</th>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.file','文件')}</th>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.remark','备注')}</th>
                     </tr>
                   </thead>
                   <tbody>
                     {prenatalDeliveryData!.records.map((r:any, i:number) => (
                       <tr key={i} className="border-b border-gray-100 last:border-b-0">
                         <td className="py-3 px-6">{r.status}</td>
                         <td className="py-3 px-6">{r.date}</td>
                         <td className="py-3 px-6">{r.name}</td>
                         <td className="py-3 px-6">{r.fileUrl ? <a className="text-[#C2A87A] underline hover:text-[#a88a5c] cursor-pointer transition-colors" href={r.fileUrl} target="_blank" rel="noreferrer">{t('ivfClinic.view','查看')}</a> : '-'}</td>
                         <td className="py-3 px-6">{r.remark}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             ) : (
               <div className="bg-gray-50 rounded-lg">
                 <EmptyState 
                   icon="📋"
                   title={t('ivfClinic.noPrenatalRecords', '暂无产检记录')}
                   description={t('ivfClinic.noPrenatalRecordsDesc', '该案例尚未添加产检与生产记录相关信息。')}
                 />
               </div>
             )}
           </div>
         )}
      </div>
        </>
      )}
    </div>
  )
}

// 主组件使用 Suspense 包装内部组件
export default function IVFClinic() {
  return (
      <Suspense fallback={<div className="p-8 min-h-screen">Loading...</div>}>
        <IVFClinicContent />
      </Suspense>
  )
}

'use client'
import React, { useState, Suspense } from 'react'
import { useEffect } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CustomButton } from '../../../components/ui/CustomButton'
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';

// 提取需要使用 useSearchParams 的逻辑到单独的组件
function IVFClinicContent() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();
  const caseId = searchParams.get('caseId');

  const [open, setOpen] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clinics, setClinics] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let finalCaseId = caseId;
        
        // 如果没有 caseId，尝试从 parentId 获取
        if (!finalCaseId) {
          function getCookie(name: string) {
            if (typeof document === 'undefined') return undefined;
            const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            return match ? match[2] : undefined;
          }
          
          const parentId = typeof document !== 'undefined' ? getCookie('userId_client') : null;
          console.log('No caseId found, trying to get from parentId:', parentId);
          
          if (!parentId) {
            setError('缺少案例ID参数，且无法获取用户信息');
            return;
          }
          
          // 使用 parentId 获取 cases
          const res = await fetch(`/api/cases-by-parent?parentId=${parentId}`);
          if (!res.ok) {
            throw new Error('获取用户案例失败');
          }
          
          const data = await res.json();
          const casesArr = Array.isArray(data) ? data : (data.cases || data.data || []);
          
          console.log('Cases fetched by parentId:', casesArr);
          
          if (casesArr.length === 0) {
            setError('该用户暂无相关案例');
            return;
          }
          
          // 尝试多种可能的 ID 字段名称
          const firstCase = casesArr[0];
          finalCaseId = firstCase.id || firstCase.case_id || firstCase.caseId || firstCase.ID || firstCase.CaseId;
          console.log('Using caseId from first case:', finalCaseId);
        }
        
        if (!finalCaseId) {
          setError('无法获取有效的案例ID');
          return;
        }
        
        console.log('Final caseId to use:', finalCaseId);
        
        // 使用获取到的 caseId 获取 IVF 诊所数据
        const [ip, gc] = await Promise.all([
          fetch(`/api/ivf-clinic-get?caseId=${finalCaseId}&aboutRole=intended_parent`).then(r => {
            if (!r.ok) throw new Error('获取意向父母数据失败');
            return r.json();
          }),
          fetch(`/api/ivf-clinic-get?caseId=${finalCaseId}&aboutRole=surrogate_mother`).then(r => {
            if (!r.ok) throw new Error('获取代母数据失败');
            return r.json();
          })
        ]);
        
        const list = [...(ip?.ivf_clinics || []), ...(gc?.ivf_clinics || [])];
        console.log('IVF clinics data loaded:', list);
        setClinics(list);
        
      } catch (err: any) {
        console.error('获取数据失败:', err);
        setError(err.message || '获取数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [caseId]);

  // 获取各类型数据
  const clinicOverview = clinics.find(c => c.type === 'ClinicOverview')?.data;
  const embryoJourneyData = clinics.find(c => c.type === 'EmbryoJourney')?.data;
  
  const testingReportsData = clinics.find(c => c.type === 'TestingReports')?.data; // array
  const treatmentPlanData = clinics.find(c => c.type === 'TreatmentPlan')?.data; // { timelineImageUrl }
  const pgtResultsData = clinics.find(c => c.type === 'PGTResults')?.data; // array
  const surrogateMedicalRecordsData = clinics.find(c => c.type === 'SurrogateMedicalRecords')?.data; // array
  const surrogateScreeningData = clinics.find(c => c.type === 'SurrogateMedicalScreening')?.data; // array
  const surrogateEarlyUSData = clinics.find(c => c.type === 'SurrogatePregnancyConfirmation')?.data; // array
  const prenatalDeliveryData = clinics.find(c => c.type === 'SurrogatePrenatalDelivery')?.data; // { board, records }

  // 错误状态
  if (error) {
    return (
      <div className="p-8 min-h-screen bg-main-bg">
        <CustomButton
          className="mb-4 px-5 py-2 rounded-full flex items-center gap-2 text-base font-semibold cursor-pointer"
          onClick={() => router.back()}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}>
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('back', '返回')}
        </CustomButton>
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-white rounded-xl">
          <div className="text-4xl text-red-400 mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">加载失败</h3>
          <p className="text-sm text-gray-500 max-w-sm">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-[#C2A87A] text-white rounded-lg hover:bg-[#a88a5c] transition-colors"
            onClick={() => window.location.reload()}
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  // 加载状态
  if (loading) {
    return (
      <div className="p-8 min-h-screen bg-main-bg">
        <CustomButton
          className="mb-4 px-5 py-2 rounded-full flex items-center gap-2 text-base font-semibold cursor-pointer"
          onClick={() => router.back()}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}>
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('back', '返回')}
        </CustomButton>
        <h1 className="text-2xl font-semibold text-sage-800 mb-2">{t('ivfClinic.title')}</h1>
        <p className="text-sage-800 mb-8 font-medium">{t('ivfClinic.description')}</p>
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#C2A87A]"></div>
            <span className="text-gray-600">加载中...</span>
          </div>
        </div>
      </div>
    );
  }

  const hasAnyData = clinics.length > 0;

  return (
    <div className="p-8 min-h-screen bg-main-bg">
        {/* 返回按钮 */}
        <CustomButton
          className="mb-4 px-5 py-2 rounded-full flex items-center gap-2 text-base font-semibold cursor-pointer"
          onClick={() => router.back()}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}>
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('back', '返回')}
        </CustomButton>
      <h1 className="text-2xl font-semibold text-sage-800 mb-2">{t('ivfClinic.title')}</h1>
      <p className="text-sage-800 mb-8 font-medium">{t('ivfClinic.description')}</p>
      
      {/* 数据统计信息 */}
      {/* {hasAnyData && (
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-sm text-gray-600">
                <span className="font-medium text-sage-800">{clinics.length}</span> 个数据模块
              </div>
              <div className="text-sm text-gray-600">
                案例ID: <span className="font-medium text-sage-800">{caseId}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-500">
                最后更新: {new Date().toLocaleDateString('zh-CN')}
              </div>
              <button 
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                onClick={() => window.print()}
              >
                🖨️ 打印
              </button>
            </div>
          </div>
        </div>
      )} */}
      
      {/* 若没有任何数据，显示空状态 */}
      {!hasAnyData && (
        <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-white rounded-xl mb-6">
          <div className="text-4xl text-gray-400 mb-4">🏥</div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">暂无IVF诊所数据</h3>
          <p className="text-sm text-gray-500 max-w-sm">该案例尚未添加任何IVF诊所相关信息</p>
        </div>
      )}

      {/* Clinic Overview 折叠卡片 */}
      <div className="rounded-xl bg-white p-0 text-sage-800 mb-6">
        <button
          className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer"
          style={{cursor:'pointer'}}
          onClick={() => setOpen(open === 'Clinic Overview' ? null : 'Clinic Overview')}
        >
          <span>{t('ivfClinic.clinicOverview')}</span>
          {/* <span className="text-xs">{clinicOverview?.location || ''}</span> */}
          <span className={`ml-2 transition-transform ${open === 'Clinic Overview' ? 'rotate-90' : ''}`}>▼</span>
        </button>
         {open === 'Clinic Overview' && (
           <div className="px-6 py-4">
             {clinicOverview ? (
               <>
                 {/* 顶部医院名称和地址，字体统一，简洁分布 */}
                 <div className="flex justify-between items-center mb-4">
                   <span className="text-lg font-semibold text-[#271F18]">{(clinicOverview.location || '').split(',')[0] || ''}</span>
                   <span className="text-lg font-semibold text-[#271F18]">{(clinicOverview.location || '').split(',')[1] || ''}</span>
                 </div>
                 {/* 医生和协调员卡片，灰色背景，内容严格按设计图，不显示地址 */}
                 <div className="flex gap-4">
                   {/* Doctor */}
                   <div className="flex-1 bg-[#F5F4ED] rounded-lg p-6 flex gap-4 items-center">
                     <Avatar className="w-12 h-12 flex-shrink-0">
                       <AvatarFallback className="bg-[#D9D9D9] text-[#271F18] text-lg font-medium">{clinicOverview?.doctor?.name?.slice(0,2) || 'JD'}</AvatarFallback>
                     </Avatar>
                     <div className="flex-1">
                       <div className="text-lg font-semibold text-[#271F18] mb-1">{clinicOverview?.doctor?.name}</div>
                       <div className="text-sm text-sage-600 mb-1">{clinicOverview?.doctor?.role}</div>
                       <div className="text-sm text-sage-800 mb-1">{clinicOverview?.doctor?.email}</div>
                       <div className="text-sm text-sage-800 mb-1">{clinicOverview?.doctor?.phone}</div>
                       <div className="text-sm text-sage-800 leading-relaxed">{clinicOverview?.doctor?.desc}</div>
                     </div>
                   </div>
                   {/* Coordinator */}
                   <div className="flex-1 bg-[#F5F4ED] rounded-lg p-6 flex gap-4 items-center">
                     <Avatar className="w-12 h-12 flex-shrink-0">
                       <AvatarFallback className="bg-[#D9D9D9] text-[#271F18] text-lg font-medium">{clinicOverview?.coordinator?.name?.slice(0,2) || 'JD'}</AvatarFallback>
                     </Avatar>
                     <div className="flex-1">
                       <div className="text-lg font-semibold text-[#271F18] mb-1">{clinicOverview?.coordinator?.name}</div>
                       <div className="text-sm text-sage-600 mb-1">{clinicOverview?.coordinator?.role}</div>
                       <div className="text-sm text-sage-800 mb-1">{clinicOverview?.coordinator?.email}</div>
                       <div className="text-sm text-sage-800 mb-1">{clinicOverview?.coordinator?.phone}</div>
                       <div className="text-sm text-sage-800 leading-relaxed">{clinicOverview?.coordinator?.desc}</div>
                     </div>
                   </div>
                 </div>
               </>
             ) : (
               <div className="flex flex-col items-center justify-center py-8 text-center">
                 <div className="text-3xl text-gray-400 mb-3">🏥</div>
                 <h3 className="text-base font-medium text-gray-600 mb-2">暂无诊所概览信息</h3>
                 <p className="text-sm text-gray-500">该案例尚未添加诊所概览信息，包括医生和协调员联系方式等。</p>
               </div>
             )}
           </div>
         )}
      </div>
      {/* Testing Reports / 检测报告 */}
  <div className="rounded-xl bg-white p-0 text-sage-800 mb-4">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => setOpen(open === 'Testing Reports' ? null : 'Testing Reports')}>
          <span>{t('ivfClinic.testingReports', '检测报告')}</span>
          <span className={`text-xl transition-transform ${open === 'Testing Reports' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
         {open === 'Testing Reports' && (
           <div className="px-6 py-4">
             {Array.isArray(testingReportsData) && testingReportsData.length > 0 ? (
               <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                 <table className="w-full text-sage-800">
                   <thead className="bg-[#F8F9FA] border-b">
                     <tr>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.reportName','报告名称/类别')}</th>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.reportDate','报告时间')}</th>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.reportExpiry','有效期')}</th>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.clinicReviewedAt','诊所查看时间')}</th>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.remark','备注')}</th>
                       <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.file','文件')}</th>
                     </tr>
                   </thead>
                   <tbody>
                     {testingReportsData.map((r: any, i: number) => (
                       <tr key={i} className="border-b border-gray-100 last:border-b-0">
                         <td className="py-3 px-6 text-base">{r.category}</td>
                         <td className="py-3 px-6 text-base">{r.reportDate}</td>
                         <td className="py-3 px-6 text-base">{r.expiryDate}</td>
                         <td className="py-3 px-6 text-base">{r.clinicReviewedAt}</td>
                         <td className="py-3 px-6 text-base">{r.remark}</td>
                         <td className="py-3 px-6 text-base">
                           {r.fileUrl ? <a className="text-[#C2A87A] underline" href={r.fileUrl} target="_blank" rel="noreferrer">{t('ivfClinic.view','查看')}</a> : '-'}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center py-8 text-center">
                 <div className="text-3xl text-gray-400 mb-3">📋</div>
                 <h3 className="text-base font-medium text-gray-600 mb-2">暂无检测报告</h3>
                 <p className="text-sm text-gray-500">该案例尚未添加任何检测报告，包括血液检查、基因检测等相关报告。</p>
               </div>
             )}
           </div>
         )}
                </div>

      {/* Treatment Plan & IVF Timeline / 治疗方案与时间表 + PGT结果 */}
      <div className="rounded-xl bg-white p-0 text-sage-800 mb-4">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => setOpen(open === 'Treatment Plan' ? null : 'Treatment Plan')}>
          <span>{t('ivfClinic.treatmentPlan','治疗方案与时间表')}</span>
          <span className={`text-xl transition-transform ${open === 'Treatment Plan' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
         {open === 'Treatment Plan' && (
           <div className="px-6 py-4 space-y-6">
             {/* 时间表图片展示 */}
             <div>
               <h3 className="text-lg font-semibold mb-3 text-sage-800">{t('ivfClinic.timelineImage','时间表图片')}</h3>
               {treatmentPlanData?.timelineImageUrl ? (
                 <div className="mb-3">
                   <img src={treatmentPlanData.timelineImageUrl} alt="timeline" className="max-h-80 rounded border" />
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center py-6 text-center bg-gray-50 rounded-lg">
                   <div className="text-2xl text-gray-400 mb-2">📅</div>
                   <p className="text-sm text-gray-500">暂无时间表图片</p>
                 </div>
               )}
             </div>
             {/* PGT结果 */}
             <div>
               <h3 className="text-lg font-semibold mb-3 text-sage-800">{t('ivfClinic.pgtResults','PGT结果')}</h3>
               {Array.isArray(pgtResultsData) && pgtResultsData.length > 0 ? (
                 <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                   <table className="w-full text-sage-800">
                     <thead className="bg-[#F8F9FA] border-b">
                       <tr>
                         <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.subjectType','类型')}</th>
                         <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.count','数量')}</th>
                         <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.result','结果')}</th>
                       </tr>
                     </thead>
                     <tbody>
                       {pgtResultsData.map((p: any, i: number) => (
                         <tr key={i} className="border-b border-gray-100 last:border-b-0">
                           <td className="py-3 px-6 text-base">{p.subjectType}</td>
                           <td className="py-3 px-6 text-base">{p.count}</td>
                           <td className="py-3 px-6 text-base">{p.result}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center py-6 text-center bg-gray-50 rounded-lg">
                   <div className="text-2xl text-gray-400 mb-2">🧬</div>
                   <h3 className="text-base font-medium text-gray-600 mb-1">暂无PGT结果</h3>
                   <p className="text-sm text-gray-500">该案例尚未添加PGT（胚胎植入前遗传学检测）结果信息。</p>
                 </div>
               )}
             </div>
           </div>
         )}
      </div>

      {/* Embryo Journey 折叠卡片 */}
      <div className="rounded-xl bg-white p-0 text-sage-800 mb-4">
  <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => setOpen(open === 'Embryo Journey' ? null : 'Embryo Journey')}>
          <span>{t('ivfClinic.embryoJourney')}</span>
          <span className={`text-xl transition-transform ${open === 'Embryo Journey' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
         {open === 'Embryo Journey' && (
           <div className="px-6 py-4">
             {embryoJourneyData ? (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                 {/* 左侧时间线展示 */}
                 <div className="relative">
                   <h3 className="text-lg font-semibold mb-4 text-sage-800">{t('ivfClinic.timeline')}</h3>
                   {embryoJourneyData?.timeline && embryoJourneyData.timeline.length > 0 ? (
                     <div className="relative pl-8">
                       {/* 竖线 */}
                       <div className="absolute left-4 top-0 bottom-0 w-px bg-[#C2A87A]"></div>
                       {embryoJourneyData.timeline.map((item: any, i: number) => (
                         <div key={i} className="relative mb-6 last:mb-0 flex items-start">
                           {/* 圆点 */}
                           <div className="absolute left-0 w-2 h-2 rounded-full bg-white border-2 border-[#C2A87A] mt-2"></div>
                           <div className="ml-6">
                             <div className="text-base font-medium text-sage-800 mb-1">{item.label}</div>
                             <div className="text-sm text-sage-600">{item.date}</div>
                           </div>
                         </div>
                       ))}
                     </div>
                   ) : (
                     <div className="flex flex-col items-center justify-center py-6 text-center bg-gray-50 rounded-lg">
                       <div className="text-2xl text-gray-400 mb-2">📅</div>
                       <p className="text-sm text-gray-500">暂无时间线数据</p>
                     </div>
                   )}
                 </div>
                 
                 {/* 右侧胚胎表格展示 */}
                 <div>
                   <h3 className="text-lg font-semibold mb-4 text-sage-800">{t('ivfClinic.embryos')}</h3>
                   {embryoJourneyData?.embryos && embryoJourneyData.embryos.length > 0 ? (
                     <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                       <table className="w-full text-sage-800">
                         <thead className="bg-[#F8F9FA] border-b">
                           <tr>
                             <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.grade')}</th>
                             <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.id')}</th>
                             <th className="py-3 px-6 text-left font-semibold text-base">{t('ivfClinic.status')}</th>
                           </tr>
                         </thead>
                         <tbody>
                           {embryoJourneyData.embryos.map((e: any, i: number) => (
                             <tr key={i} className="border-b border-gray-100 last:border-b-0">
                               <td className="py-3 px-6 text-base font-medium">{e.grade}</td>
                               <td className="py-3 px-6 text-base font-medium">{e.id}</td>
                               <td className="py-3 px-6 text-base font-medium">{e.status}</td>
                             </tr>
                           ))}
                         </tbody>
                       </table>
                     </div>
                   ) : (
                     <div className="flex flex-col items-center justify-center py-6 text-center bg-gray-50 rounded-lg">
                       <div className="text-2xl text-gray-400 mb-2">🧬</div>
                       <p className="text-sm text-gray-500">暂无胚胎数据</p>
                     </div>
                   )}
                 </div>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center py-8 text-center">
                 <div className="text-3xl text-gray-400 mb-3">🧬</div>
                 <h3 className="text-base font-medium text-gray-600 mb-2">暂无胚胎旅程信息</h3>
                 <p className="text-sm text-gray-500">该案例尚未添加胚胎旅程相关信息，包括时间线和胚胎状态等。</p>
               </div>
             )}
           </div>
         )}
      </div>
      {/* 代母医疗记录与心理评估 */}
  <div className="rounded-xl bg-white p-0 text-sage-800 mb-4">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => setOpen(open === 'Surrogate Medical Records' ? null : 'Surrogate Medical Records')}>
          <span>{t('ivfClinic.surrogateMedicalRecords','代母医疗记录与心理评估')}</span>
          <span className={`text-xl transition-transform ${open === 'Surrogate Medical Records' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
         {open === 'Surrogate Medical Records' && (
           <div className="px-6 py-4">
             {Array.isArray(surrogateMedicalRecordsData) && surrogateMedicalRecordsData.length > 0 ? (
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
                     {surrogateMedicalRecordsData.map((r:any, i:number) => (
                       <tr key={i} className="border-b border-gray-100 last:border-b-0">
                         <td className="py-3 px-6">{r.date}</td>
                         <td className="py-3 px-6">{r.category}</td>
                         <td className="py-3 px-6">{r.summary}</td>
                         <td className="py-3 px-6">{r.fileUrl ? <a className="text-[#C2A87A] underline" href={r.fileUrl} target="_blank" rel="noreferrer">{t('ivfClinic.view','查看')}</a> : '-'}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center py-8 text-center">
                 <div className="text-3xl text-gray-400 mb-3">🏥</div>
                 <h3 className="text-base font-medium text-gray-600 mb-2">暂无代母医疗记录</h3>
                 <p className="text-sm text-gray-500">该案例尚未添加代母医疗记录与心理评估相关信息。</p>
               </div>
             )}
           </div>
         )}
      </div>

      {/* 代母医学筛查 */}
      <div className="rounded-xl bg-white p-0 text-sage-800 mb-4">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => setOpen(open === 'Surrogate Screening' ? null : 'Surrogate Screening')}>
          <span>{t('ivfClinic.surrogateScreening','代母医学筛查')}</span>
          <span className={`text-xl transition-transform ${open === 'Surrogate Screening' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
         {open === 'Surrogate Screening' && (
           <div className="px-6 py-4">
             {Array.isArray(surrogateScreeningData) && surrogateScreeningData.length > 0 ? (
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
                     {surrogateScreeningData.map((r:any, i:number) => (
                       <tr key={i} className="border-b border-gray-100 last:border-b-0">
                         <td className="py-3 px-6">{r.date}</td>
                         <td className="py-3 px-6">{r.category}</td>
                         <td className="py-3 px-6">{r.name}</td>
                         <td className="py-3 px-6">{r.result}</td>
                         <td className="py-3 px-6">{r.fileUrl ? <a className="text-[#C2A87A] underline" href={r.fileUrl} target="_blank" rel="noreferrer">{t('ivfClinic.view','查看')}</a> : '-'}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center py-8 text-center">
                 <div className="text-3xl text-gray-400 mb-3">🔬</div>
                 <h3 className="text-base font-medium text-gray-600 mb-2">暂无代母医学筛查</h3>
                 <p className="text-sm text-gray-500">该案例尚未添加代母医学筛查相关信息。</p>
               </div>
             )}
           </div>
         )}
      </div>

      {/* 代母怀孕确认与早期B超 */}
  <div className="rounded-xl bg-white p-0 text-sage-800 mb-4">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => setOpen(open === 'Surrogate Early Ultrasound' ? null : 'Surrogate Early Ultrasound')}>
          <span>{t('ivfClinic.surrogateEarlyUS','代母怀孕确认与早期B超')}</span>
          <span className={`text-xl transition-transform ${open === 'Surrogate Early Ultrasound' ? 'rotate-90' : ''}`}>&gt;</span>
        </button>
         {open === 'Surrogate Early Ultrasound' && (
           <div className="px-6 py-4">
             {Array.isArray(surrogateEarlyUSData) && surrogateEarlyUSData.length > 0 ? (
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
                     {surrogateEarlyUSData.map((r:any, i:number) => (
                       <tr key={i} className="border-b border-gray-100 last:border-b-0">
                         <td className="py-3 px-6">{r.date}</td>
                         <td className="py-3 px-6">{r.category}</td>
                         <td className="py-3 px-6">{r.name}</td>
                         <td className="py-3 px-6">{r.result}</td>
                         <td className="py-3 px-6">{r.fileUrl ? <a className="text-[#C2A87A] underline" href={r.fileUrl} target="_blank" rel="noreferrer">{t('ivfClinic.view','查看')}</a> : '-'}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center py-8 text-center">
                 <div className="text-3xl text-gray-400 mb-3">👶</div>
                 <h3 className="text-base font-medium text-gray-600 mb-2">暂无代母怀孕确认信息</h3>
                 <p className="text-sm text-gray-500">该案例尚未添加代母怀孕确认与早期B超相关信息。</p>
               </div>
             )}
           </div>
         )}
            </div>
            
      {/* 代母产检与生产安排 */}
      <div className="rounded-xl bg-white p-0 text-sage-800 mb-8">
        <button className="w-full flex justify-between items-center px-6 py-4 text-lg font-medium border-b border-sage-200 focus:outline-none cursor-pointer" style={{cursor:'pointer'}} onClick={() => setOpen(open === 'Surrogate Prenatal & Delivery' ? null : 'Surrogate Prenatal & Delivery')}>
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
                       <a className="text-[#C2A87A] underline" href={prenatalDeliveryData.board.pboFileUrl} target="_blank" rel="noreferrer">{t('ivfClinic.view','查看文件')}</a> : 
                       '-'
                     }
                   </div>
                   <div className="text-base text-sage-800">{prenatalDeliveryData?.board?.pboRemark || '-'}</div>
                 </div>
               </div>
             </div>
             {/* 产检与生产记录列表 */}
             {Array.isArray(prenatalDeliveryData?.records) && prenatalDeliveryData.records.length > 0 ? (
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
                     {prenatalDeliveryData.records.map((r:any, i:number) => (
                       <tr key={i} className="border-b border-gray-100 last:border-b-0">
                         <td className="py-3 px-6">{r.status}</td>
                         <td className="py-3 px-6">{r.date}</td>
                         <td className="py-3 px-6">{r.name}</td>
                         <td className="py-3 px-6">{r.fileUrl ? <a className="text-[#C2A87A] underline" href={r.fileUrl} target="_blank" rel="noreferrer">{t('ivfClinic.view','查看')}</a> : '-'}</td>
                         <td className="py-3 px-6">{r.remark}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-lg">
                 <div className="text-3xl text-gray-400 mb-3">📋</div>
                 <h3 className="text-base font-medium text-gray-600 mb-2">暂无产检记录</h3>
                 <p className="text-sm text-gray-500">该案例尚未添加产检与生产记录相关信息。</p>
               </div>
             )}
           </div>
         )}
      </div>
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

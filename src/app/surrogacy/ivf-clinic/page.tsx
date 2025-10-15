"use client"
import React, { useState, Suspense } from 'react'
import { useEffect } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CustomButton } from '../../../components/ui/CustomButton'
// import ManagerLayout from '@/components/manager-layout';
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
  const [actualCaseId, setActualCaseId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let targetCaseId = caseId;
        
        // 优先 caseId 查询
        if (caseId) {
          console.log('使用URL中的caseId:', caseId);
          const res = await fetch(`/api/cases-list?caseId=${caseId}`);
          const data = await res.json();
          const currentCase = Array.isArray(data) ? data[0] : (data.cases?.[0] || data.data?.[0] || null);
          if (currentCase) {
            // 使用现有的 caseId
            targetCaseId = caseId;
            console.log('找到案例，使用caseId:', caseId);
          } else {
            console.log('未找到案例，将尝试使用代母ID');
          }
        }
        
        // 没有 caseId 或 caseId 查不到时，使用 surrogacyId 查询
        if (!targetCaseId) {
          console.log('尝试使用代母ID查询案例');
          const surrogacyId = typeof document !== 'undefined' ? 
            document.cookie.split('; ').find(row => row.startsWith('userId_surrogacy='))?.split('=')[1] : null;
          
          console.log('获取到的代母ID:', surrogacyId);
          
          if (!surrogacyId) {
            setError('缺少案例ID或代母ID参数');
            return;
          }
          
          const res = await fetch(`/api/cases-by-surrogate?surrogateId=${surrogacyId}`);
          const data = await res.json();
          const cases = Array.isArray(data) ? data : (data.cases || data.data || []);
          
          console.log('通过代母ID找到的案例数量:', cases.length);
          
          if (cases.length > 0) {
            // 使用第一个案例的ID
            targetCaseId = cases[0].id;
            console.log('使用第一个案例ID:', targetCaseId);
          } else {
            setError('未找到相关案例');
            return;
          }
        }
        
        // 使用获取到的 caseId 获取 IVF 诊所数据
        console.log('最终使用的caseId:', targetCaseId);
        const ivfRes = await fetch(`/api/ivf-clinic-get?caseId=${targetCaseId}&aboutRole=surrogate_mother`);
        if (!ivfRes.ok) throw new Error('获取代母数据失败');
        
        const ivfData = await ivfRes.json();
        console.log('获取到的IVF诊所数据:', ivfData);
        setClinics(ivfData.ivf_clinics || []);
        setActualCaseId(targetCaseId);
        
      } catch (err) {
        console.error('获取数据失败:', err);
        setError(err instanceof Error ? err.message : '获取数据失败，请稍后重试');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [caseId]);

  // 获取各类型数据
  const clinicOverview = clinics.find(c => c.type === 'ClinicOverview')?.data;
  const embryoJourneyData = clinics.find(c => c.type === 'EmbryoJourney')?.data;
  const surrogateMedicalRecordsData = clinics.find(c => c.type === 'SurrogateMedicalRecords')?.data;
  const surrogateScreeningData = clinics.find(c => c.type === 'SurrogateMedicalScreening')?.data;
  const surrogateEarlyUSData = clinics.find(c => c.type === 'SurrogatePregnancyConfirmation')?.data;
  const prenatalDeliveryData = clinics.find(c => c.type === 'SurrogatePrenatalDelivery')?.data;

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
          <h3 className="text-lg font-medium text-gray-600 mb-2">暂无代母IVF诊所数据</h3>
          <p className="text-sm text-gray-500 max-w-sm">该案例尚未添加任何代母IVF诊所相关信息，请联系管理员添加数据。</p>
        </div>
      )}
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

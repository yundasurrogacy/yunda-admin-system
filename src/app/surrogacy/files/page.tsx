'use client'
import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
// import ManagerLayout from '@/components/manager-layout';
import { Card } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/CustomButton';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation'

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

const getCategories = (t: (key: string) => string) => [
  { key: 'EmbryoDocs', label: t('files.categories.embryoDocs') },
  { key: 'SurrogateInfo', label: t('files.categories.surrogateInfo') },
  { key: 'LegalDocs', label: t('files.categories.legalDocs') },
  { key: 'Other', label: t('files.categories.other') },
];

// 提取的文件项组件（使用 memo 优化）
const FileItem = memo(({ 
  file, 
  t,
  onDownload
}: { 
  file: any; 
  t: any;
  onDownload: (url: string) => void;
}) => {
  const createdDate = useMemo(() => 
    file.created_at ? new Date(file.created_at).toLocaleDateString() : new Date().toLocaleDateString(),
    [file.created_at]
  );

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <span className="text-base font-medium">{file.file_type || t('files.file', '文件')}</span>
        <span className="text-xs text-sage-500">{t('files.uploaded', '上传时间')}</span>
      </div>
      <div className="text-xs mb-1 text-sage-600">{createdDate}</div>
      {file.note && <div className="text-xs text-sage-500 mb-1">{t('files.note', '描述')}: {file.note}</div>}
      <CustomButton
        className="rounded bg-[#D9D9D9] text-sage-800 px-4 py-1 text-xs shadow-none hover:bg-[#E3E8E3] font-normal cursor-pointer"
        onClick={() => onDownload(file.file_url)}
        aria-label={t('files.download', '下载')}
      >
        {t('files.download', '下载')}
      </CustomButton>
      <hr className="my-2" />
    </div>
  );
});

FileItem.displayName = 'FileItem';

// 提取的分类卡片组件（使用 memo 优化）
const CategoryCard = memo(({ 
  category, 
  journeyFiles,
  t,
  onDownload
}: { 
  category: { key: string; label: string };
  journeyFiles: any[];
  t: any;
  onDownload: (url: string) => void;
}) => {
  // 使用 useMemo 缓存该分类下的所有文件
  const filesInCategory = useMemo(() => {
    const files: any[] = [];
    journeyFiles.forEach((journey) => {
      journey.files.filter((f: any) => f.category === category.key).forEach((file: any) => {
        files.push(file);
      });
    });
    return files;
  }, [journeyFiles, category.key]);

  return (
    <Card className="p-6 rounded-xl bg-[#FBF0DA40] text-sage-800">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-sage-800">{category.label}</h2>
      </div>
      {/* 展示该分类下的所有文件 */}
      {filesInCategory.map((file) => (
        <FileItem 
          key={file.id} 
          file={file} 
          t={t} 
          onDownload={onDownload}
        />
      ))}
    </Card>
  );
});

CategoryCard.displayName = 'CategoryCard';

function FilesPageInner() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const searchParams = useSearchParams();
  const caseId = searchParams.get('caseId');
  const stage = searchParams.get('stage');
  const title = searchParams.get('title');
  const journeyId = searchParams.get('journeyId'); // 可选
  const aboutRole = searchParams.get('about_role'); // 角色参数

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [uploading, setUploading] = useState(false);
  // 文件列表结构调整为 journey 及其文件
  const [journeyFiles, setJourneyFiles] = useState<Array<{
    id: number;
    stage: number;
    title: string;
    files: Array<{
      id: number;
      file_url: string;
      category: string;
      file_type: string;
      created_at: string;
      note?: string;
    }>;
  }>>([]);

  // 使用 useMemo 缓存 categories
  const categories = useMemo(() => getCategories(t), [t]);

  // 认证检查和 cookie 读取
  useEffect(() => {
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

  // 页面初始化时获取 journey 及文件
  useEffect(() => {
    if (!caseId || !isAuthenticated) return; // 只在认证后才加载数据
    
    // 构建 API 请求 URL，包含 about_role 参数
    const apiUrl = `/api/journey-get?caseId=${caseId}${aboutRole ? `&about_role=${aboutRole}` : ''}`;
    
    fetch(apiUrl)
      .then(res => res.json())
      .then(data => {
        if (data.journeys) {
          setJourneyFiles(
            data.journeys.map((j: any) => ({
              id: j.id,
              stage: j.stage,
              title: j.title,
              files: (j.cases_files || []).map((f: any) => ({
                id: f.id,
                file_url: f.file_url,
                category: f.category,
                file_type: f.file_type,
                created_at: f.created_at,
                note: f.note,
              }))
            }))
          );
        }
      });
  }, [caseId, aboutRole, isAuthenticated]);

  // 使用 useCallback 缓存事件处理函数
  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleFileDownload = useCallback((fileUrl: string) => {
    window.open(fileUrl, '_blank');
  }, []);

  // 使用 useMemo 缓存是否有文件数据
  const hasFiles = useMemo(() => {
    return journeyFiles.some(journey => journey.files.length > 0);
  }, [journeyFiles]);

  // 使用 useMemo 缓存文件总数
  const totalFiles = useMemo(() => {
    return journeyFiles.reduce((sum, journey) => sum + journey.files.length, 0);
  }, [journeyFiles]);

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查中
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-sage-700">{t('loading')}</div>
      </div>
    );
  }

  // 未认证
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <div className="p-8">
        {/* 返回按钮 */}
        <CustomButton
          className="mb-4 px-5 py-2 rounded-full flex items-center gap-2 text-base font-semibold cursor-pointer"
          onClick={handleBack}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}>
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('back', '返回')}
        </CustomButton>
        <h1 className="text-2xl font-bold text-sage-800 mb-8">{t('files.title', '文件管理')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <CategoryCard 
              key={cat.key} 
              category={cat} 
              journeyFiles={journeyFiles}
              t={t}
              onDownload={handleFileDownload}
            />
          ))}
        </div>
      </div>
    </>
  );
}

export default function FilesPage() {
  return (
    <Suspense fallback={<div className="p-8">{useTranslation('common').t('loadingText', '加载中...')}</div>}>
      <FilesPageInner />
    </Suspense>
  );
}

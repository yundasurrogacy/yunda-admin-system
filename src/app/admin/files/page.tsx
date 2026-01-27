'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import ManagerLayout from '@/components/manager-layout';
import { Card } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/CustomButton';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from "next/navigation"
import { useSidebar } from '@/context/sidebar-context';

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

function FilesPageInner() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sidebarOpen } = useSidebar();
  const caseId = searchParams.get('caseId');
  const stage = searchParams.get('stage');
  const title = searchParams.get('title');
  const journeyId = searchParams.get('journeyId'); // 可选
  const aboutRole = searchParams.get('about_role'); // 角色参数

  // 认证相关状态
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

  const categories = getCategories(t);

  // 认证检查和 cookie 读取
  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      const userRole = getCookie('userRole_admin')
      const userEmail = getCookie('userEmail_admin')
      const userId = getCookie('userId_admin')
      const authed = !!(userRole && userEmail && userId && userRole === 'admin')
      setIsAuthenticated(authed)
      if (!authed) {
        router.replace('/admin/login')
      }
    }
  }, [router]);

  // 只在认证后才加载数据
  useEffect(() => {
    if (!caseId || !isAuthenticated) return;
    
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
  }, [caseId, isAuthenticated, aboutRole]);

  // 上传文件弹窗逻辑
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [uploadNote, setUploadNote] = useState('');

  // ⚠️ 重要：所有 Hooks 必须在条件返回之前调用，以保持 Hooks 调用顺序一致
  // 使用 useCallback 缓存事件处理函数
  const handleUpload = useCallback((categoryKey: string) => {
    setUploadCategory(categoryKey);
    setUploadFile(null);
    setUploadFileName('');
    setUploadNote('');
    setShowUploadModal(true);
  }, []);

  const handleUploadSubmit = useCallback(async () => {
    if (!uploadFile || !caseId || !journeyId) {
      console.error('Upload failed: Missing required parameters');
      return;
    }
    setUploading(true);
    // 1. 使用七牛云直传上传文件
    let fileUrl = '';
    try {
      const { uploadFileToQiniu } = await import('@/utils/qiniuDirectUpload');
      const result = await uploadFileToQiniu(uploadFile);
      fileUrl = result.url;
    } catch (error: any) {
      setUploading(false);
      console.error('File upload failed:', error.message || 'Unknown error');
      return;
    }
    // 2. 直接插入 cases_files
    const fileToInsert = {
      file_url: fileUrl,
      category: uploadCategory,
      file_type: uploadFile.type,
      note: uploadNote,
      case_cases: Number(caseId),
      journey_journeys: Number(journeyId),
      about_role: aboutRole || 'intended_parent', // 添加角色参数
    };
    const res = await fetch('/api/files-add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file: fileToInsert }),
    });
    setUploading(false);
    setShowUploadModal(false);
    if (res.ok) {
      // 上传成功后刷新 journey 文件列表
      const refreshApiUrl = `/api/journey-get?caseId=${caseId}${aboutRole ? `&about_role=${aboutRole}` : ''}`;
      fetch(refreshApiUrl)
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
      console.log('File uploaded successfully');
    } else {
      console.error('Failed to add file to database');
    }
  }, [uploadFile, caseId, journeyId, uploadCategory, uploadNote, aboutRole, t]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleCloseModal = useCallback(() => {
    setShowUploadModal(false);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadFile(e.target.files?.[0] || null);
    setUploadFileName(e.target.files?.[0]?.name || '');
  }, []);

  const handleFileUploadClick = useCallback(() => {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput?.click();
  }, []);

  const handleNoteChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUploadNote(e.target.value);
  }, []);

  const handleFileDownload = useCallback((fileUrl: string) => {
    window.open(fileUrl, '_blank');
  }, []);

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查 loading
  if (isAuthenticated === null) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-sage-700">{t('loading')}</div>
        </div>
      </div>
    )
  }

  // 未认证，等待重定向
  if (!isAuthenticated) {
    return null
  }

  return (
      <div className="p-8">
        {/* 返回按钮 */}
        <CustomButton
          className="mb-4 px-5 py-2 rounded-full flex items-center gap-2 text-base font-semibold cursor-pointer"
          onClick={handleBack}
        >
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}>
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('back')}
        </CustomButton>
        <h1 className="text-2xl font-bold text-sage-800 mb-8">
          {t('files.title')}
          {/* {aboutRole && (
            <span className="text-sm text-sage-600 ml-2">
              ({aboutRole === 'intended_parent' ? t('files.intendedParent') : aboutRole})
            </span>
          )} */}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <Card key={cat.key} className="p-6 rounded-xl bg-[#FBF0DA40] text-sage-800">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-sage-800">{cat.label}</h2>
                <CustomButton
                  className="rounded px-4 py-1 text-xs font-normal bg-[#D9D9D9] text-sage-800 shadow-none hover:bg-[#E3E8E3] cursor-pointer"
                  onClick={() => handleUpload(cat.key)}
                  disabled={uploading}
                  aria-label={t('files.upload')}
                >
                  {t('files.upload')}
                </CustomButton>
              </div>
              {/* 按 journey 分组展示文件 */}
              {journeyFiles.map((journey) => (
                journey.files.filter((f) => f.category === cat.key).map((file, idx) => (
                  <div key={file.id} className="mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium">{file.file_type || t('files.file')}</span>
                      <span className="text-xs text-sage-500">{t('files.uploadTime')}</span>
                    </div>
                    <div className="text-xs mb-1 text-sage-600">{file.created_at ? new Date(file.created_at).toLocaleDateString() : new Date().toLocaleDateString()}</div>
                    {file.note && <div className="text-xs text-sage-500 mb-1">{t('files.note')}: {file.note}</div>}
                    <CustomButton
                      className="rounded px-4 py-1 text-xs font-normal bg-[#D9D9D9] text-sage-800 shadow-none hover:bg-[#E3E8E3] cursor-pointer"
                      onClick={() => handleFileDownload(file.file_url)}
                      aria-label={t('files.download')}
                    >
                      {t('files.download')}
                    </CustomButton>
                    <hr className="my-2" />
                  </div>
                ))
              ))}
            </Card>
          ))}
        </div>

        {/* 上传文件弹窗 */}
        {showUploadModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={sidebarOpen ? { marginLeft: '16rem', width: 'calc(100% - 16rem)' } : {}}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 min-w-[320px] max-w-[90vw] w-full max-w-md relative">
              {/* <CustomButton className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer" onClick={handleCloseModal} aria-label={t('close')}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </CustomButton> */}
              <h2 className="text-xl font-bold mb-4">{t('files.uploadFile')}</h2>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700">{t('files.selectFile')}</label>
                {/* 隐藏的原生文件输入 */}
                <input
                  id="file-input"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept="*"
                  aria-label={t('files.selectFile')}
                />
                {/* 自定义文件选择按钮 */}
                <div 
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-2 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={handleFileUploadClick}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">
                      {uploadFileName ? uploadFileName : t('files.noFileSelected')}
                    </span>
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="text-gray-500">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mb-2">
                  {uploadFileName
                    ? t('files.selectedFile', { fileName: uploadFileName })
                    : t('files.noFileSelected')}
                </div>
                <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="note-input">{t('files.note')}</label>
                <textarea
                  id="note-input"
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                  placeholder={t('files.notePlaceholder')}
                  value={uploadNote}
                  onChange={handleNoteChange}
                  rows={3}
                  aria-label={t('files.note')}
                />
              </div>
              <div className="flex justify-end gap-4">
                <CustomButton className="cursor-pointer" onClick={handleCloseModal}>{t('cancel')}</CustomButton>
                <CustomButton className="cursor-pointer" onClick={handleUploadSubmit} disabled={uploading || !uploadFile}>{uploading ? t('files.uploading') : t('save')}</CustomButton>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}

export default function FilesPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <FilesPageInner />
    </Suspense>
  );
}

'use client'
import React, { useState, useEffect } from 'react';
// import ManagerLayout from '@/components/manager-layout';
import { Card } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/CustomButton';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from "next/navigation"


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
  const caseId = searchParams.get('caseId');
  const stage = searchParams.get('stage');
  const title = searchParams.get('title');
  const journeyId = searchParams.get('journeyId'); // 可选

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

  // 页面初始化时获取 journey 及文件
  useEffect(() => {
    if (!caseId) return;
    fetch(`/api/journey-get?caseId=${caseId}`)
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
  }, [caseId]);

  // 上传文件弹窗逻辑
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadFileName, setUploadFileName] = useState<string>('');
  const [uploadNote, setUploadNote] = useState('');

  const handleUpload = (categoryKey: string) => {
    setUploadCategory(categoryKey);
    setUploadFile(null);
    setUploadFileName('');
    setUploadNote('');
    setShowUploadModal(true);
  };

  const handleUploadSubmit = async () => {
    if (!uploadFile || !caseId || !journeyId) {
      alert(t('files.uploadParamsMissing', 'Missing upload parameters'));
      return;
    }
    setUploading(true);
    // 1. 上传文件到后端，获取真实url
    const formData = new FormData();
    formData.append('file', uploadFile);
    const uploadRes = await fetch('/api/upload/form', {
      method: 'POST',
      body: formData,
    });
    const uploadData = await uploadRes.json();
    let fileUrl = '';
    if (uploadRes.ok && uploadData.success) {
      fileUrl = uploadData.data.url || uploadData.data.path || uploadData.data.fileUrl || uploadData.data;
    } else {
      setUploading(false);
      alert(`${t('files.uploadFailed', 'Upload failed')}: ${uploadData.message || t('files.unknownError', 'Unknown error')}`);
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
      fetch(`/api/journey-get?caseId=${caseId}`)
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
      alert(t('files.uploadSuccess', 'Upload successful'));
    } else {
      alert(t('files.uploadFailed', 'Upload failed'));
    }
  };

  return (
      <div className="p-8">
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
        <h1 className="text-2xl font-bold text-sage-800 mb-8">{t('files.title', '文件管理')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <Card key={cat.key} className="p-6 rounded-xl bg-[#FBF0DA40] text-sage-800">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-sage-800">{cat.label}</h2>
                <CustomButton
                  className="rounded px-4 py-1 text-xs font-normal bg-[#D9D9D9] text-sage-800 shadow-none hover:bg-[#E3E8E3] cursor-pointer"
                  onClick={() => handleUpload(cat.key)}
                  disabled={uploading}
                  aria-label={t('files.upload', '上传')}
                >
                  {`${t('files.upload', '上传')}`}
                </CustomButton>
              </div>
              {/* 按 journey 分组展示文件 */}
              {journeyFiles.map((journey) => (
                journey.files.filter((f) => f.category === cat.key).map((file, idx) => (
                  <div key={file.id} className="mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-medium">{file.file_type || t('files.file', '文件')}</span>
                      <span className="text-xs text-sage-500">{t('files.uploaded', '上传时间')}</span>
                    </div>
                    <div className="text-xs mb-1 text-sage-600">{file.created_at ? new Date(file.created_at).toLocaleDateString() : new Date().toLocaleDateString()}</div>
                    {file.note && <div className="text-xs text-sage-500 mb-1">{t('files.note', '描述')}: {file.note}</div>}
                    <CustomButton
                      className="rounded px-4 py-1 text-xs font-normal bg-[#D9D9D9] text-sage-800 shadow-none hover:bg-[#E3E8E3] cursor-pointer"
                      onClick={() => window.open(file.file_url, '_blank')}
                      aria-label={t('files.download', '下载')}
                    >
                      {t('files.download', '下载')}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-xl p-8 min-w-[320px] max-w-[90vw] w-full max-w-md relative">
              <CustomButton className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer" onClick={() => setShowUploadModal(false)} aria-label={t('close', '关闭')}>
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </CustomButton>
              <h2 className="text-xl font-bold mb-4">{t('files.uploadFile', 'Upload File')}</h2>
              <div className="mb-4">
                <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="file-input">{t('files.selectFile', 'Select File')}</label>
                <input
                  id="file-input"
                  type="file"
                  onChange={e => {
                    setUploadFile(e.target.files?.[0] || null);
                    setUploadFileName(e.target.files?.[0]?.name || '');
                  }}
                  className="block w-full border border-gray-300 rounded px-3 py-2 mb-2"
                  accept="*"
                  aria-label={t('files.selectFile', 'Select File')}
                />
                <div className="text-xs text-gray-500 mb-2">
                  {uploadFileName
                    ? t('files.selectedFile', { fileName: uploadFileName, defaultValue: 'Selected: {{fileName}}' })
                    : t('files.noFileSelected', 'No file selected')}
                </div>
                <label className="block mb-1 text-sm font-medium text-gray-700" htmlFor="note-input">{t('files.note', 'Description')}</label>
                <textarea
                  id="note-input"
                  className="block w-full border border-gray-300 rounded px-3 py-2"
                  placeholder={t('files.notePlaceholder', 'Please enter file description')}
                  value={uploadNote}
                  onChange={e => setUploadNote(e.target.value)}
                  rows={3}
                  aria-label={t('files.note', 'Description')}
                />
              </div>
              <div className="flex justify-end gap-4">
                <CustomButton className="cursor-pointer" onClick={() => setShowUploadModal(false)}>{t('cancel', '取消')}</CustomButton>
                <CustomButton className="cursor-pointer" onClick={handleUploadSubmit} disabled={uploading || !uploadFile}>{uploading ? t('loadingText', '上传中...') : t('save', '保存')}</CustomButton>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}

export default function FilesPage() {
  return (
    <Suspense fallback={<div className="p-8">{useTranslation('common').t('loadingText', '加载中...')}</div>}>
      <FilesPageInner />
    </Suspense>
  );
}

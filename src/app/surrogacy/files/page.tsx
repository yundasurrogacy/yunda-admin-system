'use client'
import React, { useState, useEffect } from 'react';
// import ManagerLayout from '@/components/manager-layout';
import { Card } from '@/components/ui/card';
import { CustomButton } from '@/components/ui/CustomButton';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation'

const getCategories = (t: (key: string) => string) => [
  { key: 'EmbryoDocs', label: t('files.categories.embryoDocs') },
  { key: 'SurrogateInfo', label: t('files.categories.surrogateInfo') },
  { key: 'LegalDocs', label: t('files.categories.legalDocs') },
  { key: 'Other', label: t('files.categories.other') },
];

function FilesPageInner() {
  const router = useRouter();
  const { t } = useTranslation('common');
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


  return (
    <>
      <div className="p-8">
        {/* 返回按钮 */}
        <CustomButton
          className="mb-4 px-5 py-2 rounded-full flex items-center gap-2 text-base font-semibold"
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
                      className="rounded bg-[#D9D9D9] text-sage-800 px-4 py-1 text-xs shadow-none hover:bg-[#E3E8E3] font-normal"
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

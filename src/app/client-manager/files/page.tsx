'use client'
import React, { useState, useEffect } from 'react';
import ManagerLayout from '@/components/manager-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';


const getCategories = (t: (key: string) => string) => [
  { key: 'EmbryoDocs', label: t('files.categories.embryoDocs') },
  { key: 'SurrogateInfo', label: t('files.categories.surrogateInfo') },
  { key: 'LegalDocs', label: t('files.categories.legalDocs') },
  { key: 'Other', label: t('files.categories.other') },
];

function FilesPageInner() {
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
              }))
            }))
          );
        }
      });
  }, [caseId]);

  // 上传文件并新增 journey，上传后自动刷新列表
  const handleUpload = async (categoryKey: string) => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (!target || !target.files || target.files.length === 0) return;
      const file = target.files[0];
      setUploading(true);
      // 1. 上传文件到后端，获取真实url
      const formData = new FormData();
      formData.append('file', file);
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
        alert(`${t('files.uploadFailed')}: ${uploadData.message || t('files.unknownError')}`);
        return;
      }
      // 2. 新增 journey 和 cases_files
      const filesToUpload = [{
        file_url: fileUrl,
        category: categoryKey,
        file_type: file.type,
      }];
      const res = await fetch('/api/journey-create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          journey: {
            case_cases: Number(caseId),
            stage: Number(stage),
            title: title,
          },
          files: filesToUpload,
        }),
      });
      setUploading(false);
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
                  }))
                }))
              );
            }
          });
        alert(t('files.uploadSuccess'));
      } else {
        alert(t('files.addJourneyFailed'));
      }
    };
    fileInput.click();
  };

  return (
    <ManagerLayout>
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-8">{t('files.title')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <Card key={cat.key} className="p-6 rounded-xl bg-[#FBF0DA40] font-serif text-[#271F18]">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-serif">{cat.label}</h2>
                <Button
                  className="rounded bg-[#D9D9D9] text-[#271F18] font-serif px-4 py-1 text-xs shadow-none hover:bg-[#E3E8E3]"
                  onClick={() => handleUpload(cat.key)}
                  disabled={uploading}
                >
                  {`+ ${t('files.upload')}`}
                </Button>
              </div>
              {/* 按 journey 分组展示文件 */}
              {journeyFiles.map((journey) => (
                journey.files.filter((f) => f.category === cat.key).map((file, idx) => (
                  <div key={file.id} className="mb-4">
                    <div className="flex justify-between items-center">
                      <span>{file.file_type || t('files.file')}</span>
                      <span className="text-xs">{t('files.uploaded')}</span>
                    </div>
                    <div className="text-xs mb-1">{file.created_at ? new Date(file.created_at).toLocaleDateString() : new Date().toLocaleDateString()}</div>
                    <Button
                      className="rounded bg-[#D9D9D9] text-[#271F18] font-serif px-4 py-1 text-xs shadow-none hover:bg-[#E3E8E3]"
                      onClick={() => window.open(file.file_url, '_blank')}
                    >
                      {t('files.download')}
                    </Button>
                    <hr className="my-2" />
                  </div>
                ))
              ))}
            </Card>
          ))}
        </div>
      </div>
    </ManagerLayout>
  );
}

export default function FilesPage() {
  return (
    <Suspense fallback={<div className="p-8">加载中...</div>}>
      <FilesPageInner />
    </Suspense>
  );
}

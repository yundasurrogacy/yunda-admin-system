'use client'
import React, { useState, useEffect } from 'react';
// import ManagerLayout from '@/components/manager-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';


const categories = [
  { key: 'EmbryoDocs', label: 'Embryo Docs' },
  { key: 'SurrogateInfo', label: 'Surrogate Info' },
  { key: 'LegalDocs', label: 'Legal Docs' },
  { key: 'Other', label: 'Other' },
];

function FilesPageInner() {
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

  // 只读模式：不允许上传文件，隐藏上传相关逻辑

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-8">My Files</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {categories.map((cat) => (
          <Card key={cat.key} className="p-6 rounded-xl bg-[#FBF0DA40] font-serif text-[#271F18]">
            <div className="flex items-center mb-2">
              <h2 className="text-xl font-serif">{cat.label}</h2>
              {/* 只读模式不显示上传按钮 */}
            </div>
            {/* 按 journey 分组展示文件 */}
            {journeyFiles.map((journey) => (
              journey.files.filter((f) => f.category === cat.key).map((file, idx) => (
                <div key={file.id} className="mb-4">
                  <div className="flex justify-between items-center">
                    <span>{file.file_type || '文件'}</span>
                    <span className="text-xs">Uploaded</span>
                  </div>
                  <div className="text-xs mb-1">{file.created_at ? new Date(file.created_at).toLocaleDateString() : new Date().toLocaleDateString()}</div>
                  <Button
                    className="rounded bg-[#D9D9D9] text-[#271F18] font-serif px-4 py-1 text-xs shadow-none hover:bg-[#E3E8E3]"
                    onClick={() => window.open(file.file_url, '_blank')}
                  >
                    Download
                  </Button>
                  <hr className="my-2" />
                </div>
              ))
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function FilesPage() {
  return (
    <Suspense fallback={<div className="p-8">加载中...</div>}>
      <FilesPageInner />
    </Suspense>
  );
}

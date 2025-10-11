"use client"
// 文件分类选项
const getCategories = (t: (key: string) => string) => [
  { key: 'EmbryoDocs', label: t('files.categories.embryoDocs') },
  { key: 'SurrogateInfo', label: t('files.categories.surrogateInfo') },
  { key: 'LegalDocs', label: t('files.categories.legalDocs') },
  { key: 'Other', label: t('files.categories.other') },
];

import React, { Suspense, useEffect, useState } from 'react'
import Modal from '@/components/ui/modal';
import ManagerLayout from '@/components/manager-layout';
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'

const staticTimelineData = (t: (key: string) => string) => [
  {
    stage: t('journey.stage1.title'),
    items: [
      t('journey.stage1.item1'),
      t('journey.stage1.item2'),
      t('journey.stage1.item3'),
      t('journey.stage1.item4'),
    ],
  },
  {
    stage: t('journey.stage2.title'),
    items: [
      t('journey.stage2.item1'),
      t('journey.stage2.item2'),
      t('journey.stage2.item3'),
      t('journey.stage2.item4'),
      t('journey.stage2.item5'),
    ],
  },
  {
    stage: t('journey.stage3.title'),
    items: [
      t('journey.stage3.item1'),
      t('journey.stage3.item2'),
      t('journey.stage3.item3'),
    ],
  },
  {
    stage: t('journey.stage4.title'),
    items: [
      t('journey.stage4.item1'),
      t('journey.stage4.item2'),
      t('journey.stage4.item3'),
      t('journey.stage4.item4'),
    ],
  },
  {
    stage: t('journey.stage5.title'),
    items: [
      t('journey.stage5.item1'),
      t('journey.stage5.item2'),
      t('journey.stage5.item3'),
      t('journey.stage5.item4'),
    ],
  },
  {
    stage: t('journey.stage6.title'),
    items: [
      t('journey.stage6.item1'),
      t('journey.stage6.item2'),
      t('journey.stage6.item3'),
      t('journey.stage6.item4'),
    ],
  },
  {
    stage: t('journey.stage7.title'),
    items: [
      t('journey.stage7.item1'),
      t('journey.stage7.item2'),
    ],
  },
];

function JourneyInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation('common');
  const categories = getCategories(t);
  const caseId = searchParams.get('caseId');

  const [processStatus, setProcessStatus] = useState<string>('');
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [timeline, setTimeline] = useState<any[]>([]);

  // 将后端返回的状态映射到翻译文件中的键
  const statusKeyMap: { [key: string]: string } = {
    'Matching': 'Matching',
    'LegalStage': 'Legal',
    'CyclePrep': 'Medical',
    'Pregnant': 'Pregnancy',
    'Transferred': 'Post-delivery',
  };

  // 获取案例数据并设置当前case的process_status和updated_at
  useEffect(() => {
    const fetchCases = async () => {
      setIsLoading(true);
      const baseTimeline = staticTimelineData(t).map((stage, idx) => ({
        ...stage,
        items: [] as { id: any; title: string }[],
        stageNumber: idx + 1,
      }));
      try {
        function getCookie(name: string) {
          if (typeof document === 'undefined') return undefined;
          const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
          return match ? match[2] : undefined;
        }
        // 优先 caseId 查询
        if (caseId) {
          // const res = await fetch(`/api/cases-list?caseId=${caseId}`);
          const res = await fetch(`/api/cases-list?caseId=${caseId}`);;
          // const res = await fetch(`/api/cases-by-parent?parentId=${parentId}`);
          const data = await res.json();
        //   console.log('data', data);
          const currentCase = Array.isArray(data) ? data[0] : (data.cases?.[0] || data.data?.[0] || null);
          console.log('currentCase', currentCase);
          if (currentCase) {
            setProcessStatus(currentCase.process_status || '');
            setUpdatedAt(currentCase.updated_at || '');
            if (currentCase.journeys && currentCase.journeys.length > 0) {
              currentCase.journeys.forEach((journey: any) => {
                const stageIndex = journey.stage - 1;
                if (stageIndex >= 0 && stageIndex < 7) {
                  baseTimeline[stageIndex].items.push({
                    id: journey.id,
                    title: journey.title,
                  });
                }
              });
            }
            setTimeline(baseTimeline);
            setIsLoading(false);
            return;
          }
        }
        // 没有 caseId 或 caseId 查不到时，使用 managerId 查询
        const managerId = typeof document !== 'undefined' ? getCookie('userId_manager') : null;
        if (!managerId) {
          setIsLoading(false);
          setTimeline(baseTimeline);
          return;
        }
        const res = await fetch(`/api/cases-by-manager?managerId=${managerId}`);
        const data = await res.json();
        const casesArr = Array.isArray(data) ? data : (data.cases || data.data || []);
        const currentCase = casesArr.find((c: any) => c.id?.toString() === caseId?.toString());
        if (currentCase) {
          setProcessStatus(currentCase.process_status || '');
          setUpdatedAt(currentCase.updated_at || '');
          if (currentCase.journeys && currentCase.journeys.length > 0) {
            currentCase.journeys.forEach((journey: any) => {
              const stageIndex = journey.stage - 1;
              if (stageIndex >= 0 && stageIndex < 7) {
                baseTimeline[stageIndex].items.push({
                  id: journey.id,
                  title: journey.title,
                });
              }
            });
          }
          setTimeline(baseTimeline);
        } else {
          setProcessStatus('');
          setUpdatedAt('');
          setTimeline(baseTimeline);
        }
      } catch (error) {
        console.error("Failed to fetch case data:", error);
        setProcessStatus('');
        setUpdatedAt('');
        setTimeline(baseTimeline);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCases();
  }, [caseId, t]);

  // 跳转到 files 页面并携带参数
  // 跳转到 files 页面并携带 journeyId 参数
  const handleViewClick = (stageNumber: number, itemTitle: string) => {
    // 找到当前阶段下的 journey
    const currentStage = timeline.find((step: any) => step.stageNumber === stageNumber);
    let journeyId = '';
    if (currentStage && currentStage.items && currentStage.items.length > 0) {
      // 精确匹配 title
      const journey = currentStage.items.find((item: any) => item.title === itemTitle);
      if (journey && journey.id) journeyId = journey.id;
    }
    router.push(`/client-manager/files?caseId=${caseId}&stage=${stageNumber}&title=${encodeURIComponent(itemTitle)}${journeyId ? `&journeyId=${journeyId}` : ''}`);
  };

  // 添加 journey 弹窗表单
  const [showAddModal, setShowAddModal] = useState(false);
  const [addStage, setAddStage] = useState<number | null>(null);
  const [addTitle, setAddTitle] = useState('');
  // 只在添加后才有文件行
  const [addFiles, setAddFiles] = useState<Array<{ file?: File; file_url?: string; category?: string; file_type?: string; note?: string }>>([]);
  const [addLoading, setAddLoading] = useState(false);

  const handleAddJourneyClick = (stageNumber: number) => {
    setAddStage(stageNumber);
    setAddTitle('');
    setAddFiles([]); // 弹窗初始为空
    setShowAddModal(true);
  };

  // 支持多文件批量添加
  const handleAddFiles = (files: FileList | null) => {
    if (files && files.length > 0) {
      const newFiles = Array.from(files).map(file => ({
        file,
        file_url: '',
        category: '',
        file_type: file.type || '',
        note: ''
      }));
      setAddFiles(prev => [...prev, ...newFiles]);
    }
  };
  const handleRemoveFileField = (idx: number) => {
    setAddFiles(prev => prev.filter((_, i) => i !== idx));
  };
  const handleFileMetaChange = (idx: number, key: string, value: string) => {
    setAddFiles(prev => prev.map((f, i) => i === idx ? { ...f, [key]: value } : f));
  };

  const handleAddJourneySubmit = async () => {
    if (!caseId || !addStage || !addTitle) return;
    setAddLoading(true);
    try {
      // 1. 上传所有文件
      const uploadedFiles = await Promise.all(addFiles.map(async (f) => {
        if (f.file) {
          const formData = new FormData();
          formData.append('file', f.file);
          const uploadRes = await fetch('/api/upload/form', { method: 'POST', body: formData });
          const uploadData = await uploadRes.json();
          if (uploadRes.ok && uploadData.success) {
            return { ...f, file_url: uploadData.data.url || uploadData.data.path || uploadData.data.fileUrl || uploadData.data };
          } else {
            throw new Error(uploadData.message || t('files.uploadFailed'));
          }
        }
        return f;
      }));
      // 2. 提交 journey + files
      const filesToUpload = uploadedFiles.filter(f => f.file_url).map(f => ({
        file_url: f.file_url,
        category: f.category,
        file_type: f.file_type,
        note: f.note,
      }));
      const res = await fetch('/api/cases-by-manager/add-journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ caseId, stage: addStage, title: addTitle, files: filesToUpload }),
      });
      if (res.ok) {
        setShowAddModal(false);
        window.location.reload();
      } else {
        alert(t('journey.addItemFail'));
      }
    } catch (e: any) {
      alert(e.message || t('journey.networkError'));
    } finally {
      setAddLoading(false);
    }
  };

  return (
    <ManagerLayout>
      <div className="p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
        <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-2">{t('journey.title')}</h1>
        <p className="text-[#271F18] font-serif mb-8">{t('journey.description')}</p>
        <Card className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-serif">{t('journey.currentStatus')}</h2>
            <span className="rounded bg-[#D9D9D9] px-4 py-1 text-xs font-serif text-[#271F18]">
              {isLoading ? t('loadingText') : (processStatus ? t(`statusMapping.${statusKeyMap[processStatus] || processStatus}`, { defaultValue: processStatus }) : t('journey.noStatus'))}
            </span>
          </div>
          <div className="text-sm">
            {updatedAt ? `${t('journey.updated')} ${updatedAt.slice(0, 10)}` : '-'}
          </div>
        </Card>
        <Card className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
          <h2 className="text-xl font-serif mb-4">{t('journey.statusTimeline')}</h2>
          <div className="relative pl-8">
            {/* 竖线 */}
            {timeline.length > 0 && <div className="absolute left-4 top-0 w-0.5 h-full bg-[#D9D9D9]" />}
            {timeline.map((step, idx) => (
              <div key={idx} className="mb-8 relative">
                {/* 圆点 */}
                <div className="absolute -left-4 top-2 w-4 h-4 rounded-full bg-white border-2 border-[#D9D9D9]" />
                <h3 className="font-serif text-lg mb-2">{step.stage}</h3>
                <ul className="mb-2">
                  {step.items.map((item: { id: any; title: string }) => (
                    <li key={item.id} className="flex justify-between items-center py-1">
                      <span>{item.title}</span>
                      <Button
                        className="rounded bg-[#D9D9D9] text-[#271F18] font-serif px-4 py-1 text-xs shadow-none hover:bg-[#E3E8E3]"
                        onClick={() => handleViewClick(step.stageNumber, item.title)}
                      >
                        {t('viewDetails')}
                      </Button>
                    </li>
                  ))}
                </ul>
                <Button
                  className="rounded-full bg-gradient-to-r from-[#BFC9BF] to-[#E3E8E3] text-[#271F18] font-serif px-5 py-2 text-sm mt-2 shadow hover:from-[#A3B18A] hover:to-[#D9D9D9] transition-all flex items-center gap-2"
                  style={{ boxShadow: '0 2px 8px 0 #BFC9BF33' }}
                  onClick={() => handleAddJourneyClick(step.stageNumber)}
                >
                  <svg width="18" height="18" fill="none" stroke="#271F18" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#BFC9BF" strokeWidth="2" fill="#fff"/><path d="M12 8v8M8 12h8" stroke="#271F18" strokeWidth="2" strokeLinecap="round"/></svg>
                  {t('journey.addItem')}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
      {/* 添加 journey 弹窗表单 */}
      {showAddModal && (
        <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
          <div
            className="p-0 w-full max-w-4xl min-w-[700px] rounded-3xl overflow-hidden shadow-2xl border border-[#E3E8E3] bg-gradient-to-br from-[#F8F9FA] to-[#F3F6F3] animate-fadein relative"
            style={{ boxSizing: 'border-box' }}
          >
            {/* 关闭按钮 */}
            <button className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 z-10" onClick={() => setShowAddModal(false)} aria-label={t('close', '关闭')}>
              <svg width="22" height="22" fill="none" stroke="#271F18" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="px-10 pt-10 pb-4 border-b border-[#F0F0F0] flex items-center">
              <h2 className="text-3xl font-extrabold font-serif text-[#271F18] tracking-wide drop-shadow-sm">{t('journey.addItem')}</h2>
            </div>
            <div className="px-10 py-8 flex flex-col gap-10 max-h-[80vh] overflow-y-auto">
              {/* 标题输入 */}
              <div>
                <input
                  className="w-full border border-[#E3E8E3] rounded-2xl px-6 py-3 mb-2 focus:ring-2 focus:ring-[#BFC9BF] focus:outline-none bg-white text-[#271F18] font-serif text-xl shadow-sm transition-all duration-200"
                  value={addTitle}
                  onChange={e => setAddTitle(e.target.value)}
                  placeholder={t('journey.itemTitlePlaceholder', '请输入事项标题')}
                  style={{ boxShadow: '0 2px 8px 0 #E3E8E355' }}
                />
              </div>
              {/* 文件表格和添加按钮 */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-serif font-semibold text-[#271F18] text-lg">{t('files.fileList', '文件列表')}</span>
                  <Button
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-[#BFC9BF] to-[#E3E8E3] text-[#271F18] text-base font-serif font-bold shadow hover:from-[#A3B18A] hover:to-[#D9D9D9] transition-all duration-200"
                    onClick={() => document.getElementById('file-upload-input')?.click()}
                  >
                    {t('files.uploadFiles', '上传文件')}
                  </Button>
                  <input
                    id="file-upload-input"
                    type="file"
                    multiple
                    style={{ display: 'none' }}
                    onChange={e => {
                      handleAddFiles(e.target.files);
                      e.target.value = '';
                    }}
                  />
                </div>
                <div className="rounded-2xl shadow border border-[#E3E8E3] bg-white">
                  <table
                    className="w-full text-sm font-serif table-fixed"
                    style={{ tableLayout: 'fixed', minWidth: 0 }}
                  >
                    <colgroup>
                      <col style={{ width: '40%' }} />
                      <col style={{ width: '20%' }} />
                      <col style={{ width: '28%' }} />
                      <col style={{ width: '12%' }} />
                    </colgroup>
                    <thead>
                      <tr className="bg-[#F8F9FA] text-[#271F18]">
                        <th className="border-b px-4 py-2 font-semibold text-left">{t('files.fileName', '文件名')}</th>
                        <th className="border-b px-4 py-2 font-semibold text-left">{t('files.category', '分类')}</th>
                        <th className="border-b px-4 py-2 font-semibold text-left">{t('files.note', '描述')}</th>
                        <th className="border-b px-4 py-2 font-semibold text-left">{t('operation', '操作')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {addFiles.length === 0 && (
                        <tr><td colSpan={4} className="text-center text-gray-400 py-4">{t('files.noFiles', '暂无文件')}</td></tr>
                      )}
                      {addFiles.map((f, idx) => (
                        <tr key={idx} className="hover:bg-[#F8F9FA] transition-all">
                          <td className="px-4 py-2 truncate" title={f.file?.name}>
                            {f.file ? <span className="font-medium text-[#271F18]">{f.file.name}</span> : <span className="text-gray-400">{t('files.noFile', '未选择')}</span>}
                          </td>
                          <td className="px-4 py-2">
                            <select
                              className="border border-[#E3E8E3] rounded-lg px-2 py-1 w-full font-serif text-sm bg-white focus:ring-2 focus:ring-[#BFC9BF] focus:outline-none transition-all"
                              value={f.category || ''}
                              onChange={e => handleFileMetaChange(idx, 'category', e.target.value)}
                            >
                              <option value="" disabled>{t('files.selectCategory', '请选择分类')}</option>
                              {categories.map(cat => (
                                <option key={cat.key} value={cat.key}>{cat.label}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-4 py-2">
                            <input
                              className="border border-[#E3E8E3] rounded-lg px-2 py-1 w-full font-serif text-sm bg-white focus:ring-2 focus:ring-[#BFC9BF] focus:outline-none transition-all"
                              placeholder={t('files.note', '描述')}
                              value={f.note || ''}
                              onChange={e => handleFileMetaChange(idx, 'note', e.target.value)}
                            />
                          </td>
                          <td className="px-4 py-2">
                            <Button className="px-3 py-1 text-xs rounded-full bg-[#F0F0F0] text-[#271F18] hover:bg-[#E3E8E3] hover:text-red-500 transition-all w-full" onClick={() => handleRemoveFileField(idx)}>{t('delete', '删除')}</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* 底部操作按钮 */}
              <div className="flex justify-end gap-6 mt-4">
                <Button className="px-7 py-2 rounded-full bg-[#E3E8E3] text-[#271F18] font-serif text-lg font-semibold shadow hover:bg-[#D9D9D9] transition-all" onClick={() => setShowAddModal(false)}>{t('cancel', '取消')}</Button>
                <Button className="px-7 py-2 rounded-full bg-gradient-to-r from-[#BFC9BF] to-[#E3E8E3] text-[#271F18] font-serif text-lg font-bold shadow-lg hover:from-[#A3B18A] hover:to-[#D9D9D9] transition-all" onClick={handleAddJourneySubmit} disabled={addLoading}>{addLoading ? t('loadingText', '保存中...') : t('save', '保存')}</Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </ManagerLayout>
  )
}

export default function Journey() {
  return (
    <Suspense fallback={<div className="p-8">加载中...</div>}>
      <JourneyInner />
    </Suspense>
  );
}
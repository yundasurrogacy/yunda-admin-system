"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useParams } from "next/navigation"
import { getSurrogateMotherById } from "@/lib/graphql/applications"
import type { SurrogateMother } from "@/types/surrogate_mother"
import { ChevronRight, User, MessageSquare, FileText, Calendar, Activity, ArrowLeft } from "lucide-react"
import { CustomButton } from "../../../../components/ui/CustomButton"
import { Label } from "../../../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
// import { AdminLayout } from "../../../../components/admin-layout"

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

// 计算年龄的函数
const calculateAge = (dateOfBirth: string | undefined): number => {
  if (!dateOfBirth) return 0;
  
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export default function SurrogateProfileDetailPage() {
  const router = useRouter()
  const { t, i18n } = useTranslation("common")
  const params = useParams<{ id: string }>()
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  
  const [surrogate, setSurrogate] = useState<SurrogateMother | null>(null)
  const [loading, setLoading] = useState(true)
  // 编辑模式
  const [editMode, setEditMode] = useState(false)
  // 编辑表单数据
  const [editData, setEditData] = useState<any>(null)
  const [saving, setSaving] = useState(false)

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
  }, [router])

  useEffect(() => {
    async function fetchData() {
      // 只在认证后才加载数据
      if (params?.id && isAuthenticated) {
        setLoading(true)
        const data = await getSurrogateMotherById(Number(params.id))
        setSurrogate(data)
        setEditData(data) // 初始化编辑数据
        setLoading(false)
      }
    }
    fetchData()
  }, [params?.id, isAuthenticated])

  // 使用 useCallback 缓存事件处理函数
  // 进入编辑模式
  const handleEdit = useCallback(() => {
    setEditData(surrogate ? JSON.parse(JSON.stringify(surrogate)) : null)
    setEditMode(true)
  }, [surrogate])

  // 取消编辑
  const handleCancel = useCallback(() => {
    setEditData(surrogate)
    setEditMode(false)
  }, [surrogate])

  // 字段变更
  const handleFieldChange = useCallback((section: string, field: string, value: any) => {
    setEditData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev?.[section],
        [field]: value,
      },
    }))
  }, [])

  // 保存
  const handleSave = useCallback(async () => {
    if (!params?.id) return;
    setSaving(true);
    try {
      let photos = (editData.upload_photos || []).filter((p: any) => p.url || p.preview);
      // 自动上传有 preview 但无 url 的
      const needUpload = photos.filter((p: any) => !p.url && p.preview);
      for (let i = 0; i < needUpload.length; i++) {
        const file = await fetch(needUpload[i].preview)
          .then(res => res.blob())
          .then(blob => new File([blob], needUpload[i].name || `photo-${i+1}.png`, { type: blob.type }));
        const formData = new FormData();
        formData.append('file', file);
        formData.append('admin_secret', 'admin_secret');
        const res = await fetch('/api/upload/form', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) continue; // 上传失败直接跳过
        const data = await res.json();
        photos = photos.map((p: any) =>
          p === needUpload[i]
            ? { name: p.name, url: data.url }
            : p
        );
      }
      // 只保留 name 和 url 字段，且 url 必须存在
      const cleanPhotos = photos.filter((p: any) => p.url).map((p: any) => ({ name: p.name, url: p.url }));
      const newEditData = { ...editData, upload_photos: cleanPhotos };
      const res = await fetch(`/api/surrogate_mothers-detail?id=${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEditData),
      });
      if (!res.ok) throw new Error('保存失败');
      setEditMode(false);
      // 保存后刷新数据
      const data = await getSurrogateMotherById(Number(params.id));
      setSurrogate(data);
      setEditData(data);
      console.log('Profile saved successfully');
    } catch (e) {
      console.error('保存失败:', e);
    }
    setSaving(false);
  }, [params?.id])

  const handleBack = useCallback(() => {
    router.back()
  }, [router])

  // 使用 useMemo 缓存数据源和计算值
  const data = useMemo(() => editMode ? editData : surrogate, [editMode, editData, surrogate])
  const ci = useMemo(() => data?.contact_information || {}, [data])
  const ph = useMemo(() => data?.pregnancy_and_health || {}, [data])
  const ay = useMemo(() => data?.about_you || {}, [data])
  const interview = useMemo(() => data?.gestational_surrogacy_interview || {}, [data])

  // 通用空值显示（国际化）
  const displayValue = useCallback((val: any, emptyText = t('none', '无')) => {
    if (val === null || val === undefined) return emptyText;
    if (typeof val === "string" && val.trim() === "") return emptyText;
    if (Array.isArray(val) && val.length === 0) return emptyText;
    return val;
  }, [t])

  // 判断是否有图片正在上传
  const isUploadingPhotos = useMemo(() => 
    editMode && Array.isArray(editData?.upload_photos) && editData.upload_photos.some((p: any) => p.uploading || (!p.url && p.preview))
  , [editMode, editData?.upload_photos])

  // 认证检查 loading
  if (isAuthenticated === null) {
    return (
        <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-sage-600">{t('loading')}</div>
          </div>
        </div>
    )
  }

  // 未认证，等待重定向
  if (!isAuthenticated) {
    return null
  }

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 数据加载中
  if (loading || !surrogate) {
    return (
        <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-sage-600">{t('loading')}</div>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12 text-sage-800 font-medium">
            {/* 返回按钮 */}
            <CustomButton
              className="mb-4 px-5 py-2 rounded-full flex items-center gap-2 bg-[#E3E8E3] text-[#271F18] font-serif text-base font-semibold shadow hover:bg-[#f8f8f8] cursor-pointer"
              onClick={handleBack}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}>
                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t('back', '返回')}
            </CustomButton>
        <div className="flex items-center justify-between pt-6 pb-2">
          <h1 className="text-2xl font-semibold text-sage-800 capitalize">{t('surrogateProfile')}</h1>
          <div className="flex items-center gap-4">
            {!editMode && (
              <CustomButton className="bg-sage-600 text-white font-medium cursor-pointer capitalize" onClick={handleEdit}>{t('edit', '编辑')}</CustomButton>
            )}
            {editMode && (
              <>
                <CustomButton className="font-medium cursor-pointer border border-sage-300 bg-white text-sage-800 capitalize" onClick={handleCancel} disabled={saving || isUploadingPhotos}>{t('cancel', '取消')}</CustomButton>
                <CustomButton className="bg-sage-600 text-white font-medium cursor-pointer capitalize" onClick={handleSave} disabled={saving || isUploadingPhotos}>{saving ? t('saving', '保存中...') : t('save', '保存')}</CustomButton>
                {isUploadingPhotos && (
                  <span className="text-xs text-red-500 ml-2 capitalize">{t('photoUploadingTip', '有图片正在上传，请等待上传完成后再保存')}</span>
                )}
              </>
            )}
            {/* <Button
              variant="outline"
              onClick={() => router.push('/admin/surrogate-profiles')}
              className="bg-white cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backToSurrogateProfiles')}
            </Button> */}
          </div>
        </div>
        {/* 顶部照片展示区域 */}
        <div className="w-full flex flex-col items-center mb-6">
          <h3 className="text-lg font-semibold text-sage-800 mb-3 capitalize">{t('uploadPhotos')}</h3>
          {editMode ? (
            <>
              <div className="flex gap-6 justify-center flex-wrap w-full mb-2">
                {Array.isArray(editData?.upload_photos) && editData.upload_photos.length > 0 ? (
                  editData.upload_photos.map((photo: any, idx: number) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="w-48 h-48 rounded-xl overflow-hidden border border-sage-200 bg-sage-50 flex items-center justify-center shadow relative">
                        <img
                          src={photo.url && photo.url.trim() !== '' ? photo.url : photo.preview}
                          alt={photo.name || `photo-${idx+1}`}
                          className="object-cover w-full h-full transition-transform duration-200 hover:scale-105 cursor-pointer"
                          loading="lazy"
                          onClick={e => {
                            const img = e.currentTarget;
                            if (img.requestFullscreen) {
                              img.requestFullscreen();
                            } else if ((img as any).webkitRequestFullscreen) {
                              (img as any).webkitRequestFullscreen();
                            } else if ((img as any).msRequestFullscreen) {
                              (img as any).msRequestFullscreen();
                            }
                          }}
                        />
                        <span className="absolute top-2 left-2 bg-sage-700 text-white text-xs px-2 py-1 rounded shadow font-medium">
                          {`${t('photo')} ${idx+1}`}
                        </span>
                        <button type="button" className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer" onClick={() => {
                          const newPhotos = [...editData.upload_photos];
                          newPhotos.splice(idx, 1);
                          setEditData((prev: any) => ({ ...prev, upload_photos: newPhotos }));
                        }}>×</button>
                      </div>
                      {photo.name && (
                        <span
                          className="mt-2 inline-block bg-sage-100 text-sage-700 px-3 py-1 rounded-full text-xs font-medium border border-sage-200 max-w-[11rem] overflow-hidden text-ellipsis whitespace-nowrap"
                          title={photo.name}
                        >
                          {photo.name}
                        </span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-sage-500 text-sm font-normal">{t('noPhotosUploaded')}</div>
                )}
              </div>
              <div className="flex items-center gap-3 mb-2">
                <input
                  id="custom-file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: 'none' }}
                  onChange={async e => {
                    const files = e.target.files;
                    if (!files) return;
                    const fileArr = Array.from(files);
                    // 先本地预览
                    const previewPhotos = fileArr.map(file => ({
                      name: file.name,
                      preview: URL.createObjectURL(file),
                      url: '',
                      uploading: true,
                    }));
                    setEditData((prev: any) => ({
                      ...prev,
                      upload_photos: [...(prev.upload_photos || []), ...previewPhotos],
                    }));
                    // 上传并替换
                    fileArr.forEach(async (file, i) => {
                      const formData = new FormData();
                      formData.append('file', file);
                      try {
                        const res = await fetch('/api/upload/form', {
                          method: 'POST',
                          body: formData,
                        });
                        if (!res.ok) throw new Error('上传失败');
                        const data = await res.json();
                        const url = data?.data?.url;
                        if (url) {
                          setEditData((prev: any) => {
                            const newArr = [...(prev.upload_photos || [])];
                            // 找到第一个 uploading 且 name 匹配的，替换为只含 name 和 url 的对象
                            const idx = newArr.findIndex(p => p.uploading && p.name === file.name);
                            if (idx !== -1) {
                              newArr[idx] = { name: file.name, url };
                            }
                            return { ...prev, upload_photos: newArr };
                          });
                        }
                      } catch (err) {
                        console.error('图片上传失败:', file.name, err);
                        setEditData((prev: any) => {
                          const newArr = [...(prev.upload_photos || [])];
                          // 失败就移除该预览
                          const idx = newArr.findIndex(p => p.uploading && p.name === file.name);
                          if (idx !== -1) {
                            newArr.splice(idx, 1);
                          }
                          return { ...prev, upload_photos: newArr };
                        });
                      }
                    });
                  }}
                />
                <CustomButton
                  type="button"
                  className="font-medium cursor-pointer border border-sage-300 bg-white text-sage-800"
                  onClick={() => document.getElementById('custom-file-upload')?.click()}
                >
                  {t('chooseFile', '选择文件')}
                </CustomButton>
              </div>
              <div className="text-xs text-sage-500">{t('uploadPhotoTip', '支持多张图片上传，保存后生效')}</div>
            </>
          ) : (
            Array.isArray(surrogate.upload_photos) && surrogate.upload_photos.length > 0 ? (
              <div className="flex gap-6 justify-center flex-wrap w-full">
                {surrogate.upload_photos
                  .filter(photo => photo.url && typeof photo.url === 'string' && photo.url.trim() !== '')
                  .map((photo, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="w-48 h-48 rounded-xl overflow-hidden border border-sage-200 bg-sage-50 flex items-center justify-center shadow relative">
                        <img
                          src={photo.url}
                          alt={photo.name || `photo-${idx+1}`}
                          className="object-cover w-full h-full transition-transform duration-200 hover:scale-105 cursor-pointer"
                          loading="lazy"
                          onClick={e => {
                            const img = e.currentTarget;
                            if (img.requestFullscreen) {
                              img.requestFullscreen();
                            } else if ((img as any).webkitRequestFullscreen) {
                              (img as any).webkitRequestFullscreen();
                            } else if ((img as any).msRequestFullscreen) {
                              (img as any).msRequestFullscreen();
                            }
                          }}
                        />
                        <span className="absolute top-2 left-2 bg-sage-700 text-white text-xs px-2 py-1 rounded shadow font-medium">
                          {`${t('photo')} ${idx+1}`}
                        </span>
                      </div>
                      {photo.name && (
                        <span
                          className="mt-2 inline-block bg-sage-100 text-sage-700 px-3 py-1 rounded-full text-xs font-medium border border-sage-200 max-w-[11rem] overflow-hidden text-ellipsis whitespace-nowrap"
                          title={photo.name}
                        >
                          {photo.name}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-sage-500 text-sm font-normal">{t('noPhotosUploaded')}</div>
            )
          )}
        </div>
        {/* 基本信息（原“About You”部分，已更新并移到第一个卡片） */}
        <Card className="bg-white border-sage-200 animate-slide-in-left overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-sage-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-sage-800 capitalize">
                    {editMode ? (
                      <>
                        <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-32 mr-2 focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ci?.first_name || ''} onChange={e => handleFieldChange('contact_information', 'first_name', e.target.value)} placeholder={t('firstName')} />
                        <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ci?.last_name || ''} onChange={e => handleFieldChange('contact_information', 'last_name', e.target.value)} placeholder={t('lastName')} />
                      </>
                    ) : (
                      ci ? `${ci.first_name || ""} ${ci.last_name || ""}`.trim() : data.id
                    )}
                  </h2>
                  <p className="text-sage-500 font-normal capitalize">ID: #{data.id} • {editMode ? (
                    <input type="date" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-36 focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ci?.date_of_birth || ''} onChange={e => handleFieldChange('contact_information', 'date_of_birth', e.target.value)} />
                  ) : calculateAge(ci?.date_of_birth)}{t('yearsOld')}</p>
                </div>
              </div>
              <Badge variant="outline" className="px-3 py-1 bg-green-100 text-green-800 border-green-200 font-medium capitalize">
                {(ci?.surrogacy_experience_count ?? 0) > 0 ? t('experiencedSurrogate') : t('firstTimeSurrogate')}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sage-800 flex items-center gap-2 capitalize">
                  <FileText className="w-5 h-5" />
                  {t('basicInformation', '基本信息')}
                </h3>
                <div className="space-y-2 text-sm font-normal">
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('occupation')}:</span>
                    <span className="text-sage-800 capitalize">{editMode ? (
                      <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ay?.occupation || ''} onChange={e => handleFieldChange('about_you', 'occupation', e.target.value)} placeholder={t('occupation')} />
                    ) : displayValue(ay?.occupation)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('education')}:</span>
                    <span className="text-sage-800 capitalize">{editMode ? (
                      <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ay?.education_level || ''} onChange={e => handleFieldChange('about_you', 'education_level', e.target.value)} placeholder={t('education')} />
                    ) : displayValue(ay?.education_level)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('maritalStatus')}:</span>
                    <span className="text-sage-800 capitalize">{editMode ? (
                      <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ay?.marital_status || ''} onChange={e => handleFieldChange('about_you', 'marital_status', e.target.value)} placeholder={t('maritalStatus')} />
                    ) : displayValue(ay?.marital_status)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('partnerSupport')}:</span>
                    <span className="text-sage-800 capitalize">{editMode ? (
                      <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ay?.partner_support || ''} onChange={e => handleFieldChange('about_you', 'partner_support', e.target.value)} placeholder={t('partnerSupport')} />
                    ) : displayValue(ay?.partner_support)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('householdIncome')}:</span>
                    <span className="text-sage-800 capitalize">{editMode ? (
                      <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ay?.household_income || ''} onChange={e => handleFieldChange('about_you', 'household_income', e.target.value)} placeholder={t('householdIncome')} />
                    ) : displayValue(ay?.household_income)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('surrogateProfileDetail.isFormerSurrogate', '是否曾为代孕母')}:</span>
                    <span className="text-sage-800 capitalize">{editMode ? (
                      <select className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 cursor-pointer capitalize" value={typeof ay?.is_former_surrogate === 'boolean' ? (ay.is_former_surrogate ? 'yes' : 'no') : ''} onChange={e => handleFieldChange('about_you', 'is_former_surrogate', e.target.value === 'yes')}>
                        <option value="yes" className="capitalize">{t('surrogateProfileDetail.yes', '是')}</option>
                        <option value="no" className="capitalize">{t('surrogateProfileDetail.no', '否')}</option>
                      </select>
                    ) : (typeof ay?.is_former_surrogate === 'boolean' ? (ay.is_former_surrogate ? t('surrogateProfileDetail.yes', '是') : t('surrogateProfileDetail.no', '否')) : t('noData', '暂无数据'))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('surrogateProfileDetail.surrogateExperience', '代孕经历说明')}:</span>
                    <span className="text-sage-800 capitalize">{editMode ? (
                      <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ay?.surrogate_experience || ''} onChange={e => handleFieldChange('about_you', 'surrogate_experience', e.target.value)} placeholder={t('surrogateProfileDetail.surrogateExperience', '代孕经历说明')} />
                    ) : (
                      ay?.surrogate_experience && ay.surrogate_experience.trim() !== ''
                        ? String(t(`surrogateProfileDetail.surrogateExperience.${ay.surrogate_experience}`, ay.surrogate_experience))
                        : t('noData', '暂无数据')
                    )}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('surrogateProfileDetail.hasHighSchoolDiploma', '有高中毕业证')}:</span>
                    <span className="text-sage-800 capitalize">{editMode ? (
                      <select className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 cursor-pointer capitalize" value={typeof ay?.has_high_school_diploma === 'boolean' ? (ay.has_high_school_diploma ? 'yes' : 'no') : ''} onChange={e => handleFieldChange('about_you', 'has_high_school_diploma', e.target.value === 'yes')}>
                        <option value="yes" className="capitalize">{t('surrogateProfileDetail.yes', '是')}</option>
                        <option value="no" className="capitalize">{t('surrogateProfileDetail.no', '否')}</option>
                      </select>
                    ) : (typeof ay?.has_high_school_diploma === 'boolean' ? (ay.has_high_school_diploma ? t('surrogateProfileDetail.yes', '是') : t('surrogateProfileDetail.no', '否')) : t('noData', '暂无数据'))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('surrogateProfileDetail.contactSourceLabel', '联系来源')}:</span>
                    <span className="text-sage-800 capitalize">{editMode ? (
                      <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ay?.contact_source || ''} onChange={e => handleFieldChange('about_you', 'contact_source', e.target.value)} placeholder={t('surrogateProfileDetail.contactSourceLabel', '联系来源')} />
                    ) : (ay?.contact_source ? String(t(`surrogateProfileDetail.contactSource.${ay.contact_source}`, ay.contact_source)) : t('noData', '暂无数据'))}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sage-800 flex items-center gap-2 capitalize">
                  <User className="w-5 h-5" />
                  {t('contactInformation')}
                </h3>
                <div className="space-y-2 text-sm font-normal">
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('dateOfBirth')}:</span>
                    <span className="text-sage-800 capitalize">{editMode ? (
                      <input type="date" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ci?.date_of_birth || ''} onChange={e => handleFieldChange('contact_information', 'date_of_birth', e.target.value)} />
                    ) : displayValue(ci?.date_of_birth)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('phone')}:</span>
                    <span className="text-sage-800 capitalize">{editMode ? (
                      <>
                        <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-16 mr-2 focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ci?.cell_phone_country_code || ''} onChange={e => handleFieldChange('contact_information', 'cell_phone_country_code', e.target.value)} placeholder="区号" />
                        <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ci?.cell_phone || ''} onChange={e => handleFieldChange('contact_information', 'cell_phone', e.target.value)} placeholder={t('phone')} />
                      </>
                    ) : (
                      (ci?.cell_phone_country_code ? `+${ci.cell_phone_country_code} ` : "") + displayValue(ci?.cell_phone)
                    )}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('email')}:</span>
                    <span className="text-sage-800 capitalize">{editMode ? (
                      <input type="email" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ci?.email_address || ''} onChange={e => handleFieldChange('contact_information', 'email_address', e.target.value)} placeholder={t('email')} />
                    ) : displayValue(ci?.email_address)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('city')}:</span>
                    <span className="text-sage-800 capitalize">{editMode ? (
                      <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ci?.city || ''} onChange={e => handleFieldChange('contact_information', 'city', e.target.value)} placeholder={t('city')} />
                    ) : displayValue(ci?.city)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('stateOrProvince')}:</span>
                    <span className="text-sage-800 capitalize">{editMode ? (
                      <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ci?.state_or_province || ''} onChange={e => handleFieldChange('contact_information', 'state_or_province', e.target.value)} placeholder={t('stateOrProvince')} />
                    ) : displayValue(ci?.state_or_province)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('country')}:</span>
                    <span className="text-sage-800 capitalize">{editMode ? (
                      <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ci?.country || ''} onChange={e => handleFieldChange('contact_information', 'country', e.target.value)} placeholder={t('country')} />
                    ) : displayValue(ci?.country)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('zipCode')}:</span>
                    <span className="text-sage-800 capitalize">{editMode ? (
                      <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ci?.zip_code || ''} onChange={e => handleFieldChange('contact_information', 'zip_code', e.target.value)} placeholder={t('zipCode')} />
                    ) : displayValue(ci?.zip_code)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-sage-800 flex items-center gap-2 capitalize">
                  <Activity className="w-5 h-5" />
                  {t('physicalCharacteristics')}
                </h3>
                <div className="space-y-2 text-sm font-normal">
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('height')}:</span>
                    <span className="text-sage-800 capitalize">{editMode ? (
                      <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ci?.height || ''} onChange={e => handleFieldChange('contact_information', 'height', e.target.value)} placeholder={t('height')} />
                    ) : (<>{displayValue(ci?.height)} cm</>)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('weight')}:</span>
                    <span className="text-sage-800 capitalize">{editMode ? (
                      <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ci?.weight || ''} onChange={e => handleFieldChange('contact_information', 'weight', e.target.value)} placeholder={t('weight')} />
                    ) : (<>{displayValue(ci?.weight)} kg</>)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('bmi')}:</span>
                    <span className="text-sage-800 capitalize">{editMode ? (
                      <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ci?.bmi || ''} onChange={e => handleFieldChange('contact_information', 'bmi', e.target.value)} placeholder={t('bmi')} />
                    ) : displayValue(ci?.bmi)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('ethnicity')}:</span>
                    <span className="text-sage-800 capitalize">{editMode ? (
                      <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ci?.ethnicity || ''} onChange={e => handleFieldChange('contact_information', 'ethnicity', e.target.value)} placeholder={t('ethnicity')} />
                    ) : displayValue(ci?.ethnicity)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('surrogacyExperience')}:</span>
                    <span className="text-sage-800 capitalize">{editMode ? (
                      <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-16 focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ci?.surrogacy_experience_count || ''} onChange={e => handleFieldChange('contact_information', 'surrogacy_experience_count', e.target.value)} placeholder={t('surrogacyExperience')} />
                    ) : (<>{displayValue(ci?.surrogacy_experience_count, "0")} {t('times')}</>)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* 健康与怀孕历史 */}
          <Card className="bg-white border-sage-200 animate-slide-in-left">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-sage-800 text-lg font-medium capitalize">
                <Activity className="w-5 h-5" />
                {t('pregnancyHealth')}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div className="space-y-1">
                <Label className="text-sage-600 text-sm capitalize">{t('hasGivenBirth')}</Label>
                {editMode ? (
                  <select className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 cursor-pointer capitalize" value={ph?.has_given_birth ? 'yes' : 'no'} onChange={e => handleFieldChange('pregnancy_and_health', 'has_given_birth', e.target.value === 'yes')}>
                    <option value="yes" className="capitalize">{t('yes')}</option>
                    <option value="no" className="capitalize">{t('no')}</option>
                  </select>
                ) : (
                  <p className="font-medium text-sage-800 capitalize">{ph?.has_given_birth ? t('yes') : t('no')}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-sage-600 text-sm capitalize">{t('isCurrentlyPregnant')}</Label>
                {editMode ? (
                  <select className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 cursor-pointer capitalize" value={ph?.is_currently_pregnant ? 'yes' : 'no'} onChange={e => handleFieldChange('pregnancy_and_health', 'is_currently_pregnant', e.target.value === 'yes')}>
                    <option value="yes" className="capitalize">{t('yes')}</option>
                    <option value="no" className="capitalize">{t('no')}</option>
                  </select>
                ) : (
                  <p className="font-medium text-sage-800 capitalize">{ph?.is_currently_pregnant ? t('yes') : t('no')}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-sage-600 text-sm capitalize">{t('isBreastfeeding')}</Label>
                {editMode ? (
                  <select className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 cursor-pointer capitalize" value={ph?.is_breastfeeding ? 'yes' : 'no'} onChange={e => handleFieldChange('pregnancy_and_health', 'is_breastfeeding', e.target.value === 'yes')}>
                    <option value="yes" className="capitalize">{t('yes')}</option>
                    <option value="no" className="capitalize">{t('no')}</option>
                  </select>
                ) : (
                  <p className="font-medium text-sage-800 capitalize">{ph?.is_breastfeeding ? t('yes') : t('no')}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label className="text-sage-600 text-sm capitalize">{t('hasStillbirth')}</Label>
                {editMode ? (
                  <select className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 cursor-pointer capitalize" value={ph?.has_stillbirth ? 'yes' : 'no'} onChange={e => handleFieldChange('pregnancy_and_health', 'has_stillbirth', e.target.value === 'yes')}>
                    <option value="yes" className="capitalize">{t('yes')}</option>
                    <option value="no" className="capitalize">{t('no')}</option>
                  </select>
                ) : (
                  <p className="font-medium text-sage-800 capitalize">{ph?.has_stillbirth ? t('yes') : t('no')}</p>
                )}
              </div>
              <div className="space-y-1 col-span-2">
                <Label className="text-sage-600 text-sm capitalize">{t('medicalConditions')}</Label>
                {editMode ? (
                  <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ph?.medical_conditions?.join(',') || ''} onChange={e => handleFieldChange('pregnancy_and_health', 'medical_conditions', e.target.value.split(','))} placeholder={t('medicalConditions')} />
                ) : (
                  <p className="font-medium text-sage-800 capitalize">{Array.isArray(ph?.medical_conditions) && ph.medical_conditions.length > 0 ? ph.medical_conditions.join(", ") : t('none', '无')}</p>
                )}
              </div>
              <div className="space-y-1 col-span-2">
                <Label className="text-sage-600 text-sm capitalize">{t('isTakingMedications')}</Label>
                {editMode ? (
                  <select className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 cursor-pointer capitalize" value={ph?.is_taking_medications ? 'yes' : 'no'} onChange={e => handleFieldChange('pregnancy_and_health', 'is_taking_medications', e.target.value === 'yes')}>
                    <option value="yes" className="capitalize">{t('yes')}</option>
                    <option value="no" className="capitalize">{t('no')}</option>
                  </select>
                ) : (
                  <p className="font-medium text-sage-800 capitalize">{ph?.is_taking_medications ? t('yes') : t('no')}</p>
                )}
                {((editMode && ph?.is_taking_medications) || (!editMode && ph?.is_taking_medications)) && (
                  <div className="mt-2">
                    <Label className="text-sage-600 text-sm capitalize">{t('medications')}</Label>
                    {editMode ? (
                      <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ph?.medications_list || ''} onChange={e => handleFieldChange('pregnancy_and_health', 'medications_list', e.target.value)} placeholder={t('medications')} />
                    ) : (
                      <p className="font-medium text-sage-800 capitalize">{displayValue(ph?.medications_list)}</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* 怀孕历史 */}
          <Card className="bg-white border-sage-200 animate-slide-in-left" style={{ animationDelay: "100ms" }}>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-sage-800 text-lg font-medium capitalize">
                <Calendar className="w-5 h-5" />
                {t('pregnancyHistories')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-sage-600 text-sm capitalize">{t('backgroundCheckStatus')}</Label>
                  {editMode ? (
                    <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={ph?.background_check_status || ''} onChange={e => handleFieldChange('pregnancy_and_health', 'background_check_status', e.target.value)} placeholder={t('backgroundCheckStatus')} />
                  ) : (
                    <p className="font-medium text-sage-800 capitalize">{displayValue(ph?.background_check_status)}</p>
                  )}
                </div>
                
                <div className="mt-6">
                  <Label className="text-sage-600 text-sm capitalize">{t('pregnancyHistory')}</Label>
                  {Array.isArray(ph?.pregnancy_histories) && ph.pregnancy_histories.length > 0 ? (
                    <div className="space-y-3 mt-2">
                      {ph.pregnancy_histories.map((history: any, idx: number) => (
                        <div key={idx} className="p-3 bg-sage-50 rounded-lg border border-sage-200">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-sage-500 capitalize">{t('deliveryDate')}:</span>
                              {editMode ? (
                                <input type="date" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={history.delivery_date || ''} onChange={e => {
                                  const newArr = [...ph.pregnancy_histories];
                                  newArr[idx] = { ...history, delivery_date: e.target.value };
                                  handleFieldChange('pregnancy_and_health', 'pregnancy_histories', newArr);
                                }} />
                              ) : (
                                <div className="text-sage-800 capitalize">{displayValue(history.delivery_date)}</div>
                              )}
                            </div>
                            <div>
                              <span className="text-sage-500 capitalize">{t('birthWeight')}:</span>
                              {editMode ? (
                                <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={history.birth_weight || ''} onChange={e => {
                                  const newArr = [...ph.pregnancy_histories];
                                  newArr[idx] = { ...history, birth_weight: e.target.value };
                                  handleFieldChange('pregnancy_and_health', 'pregnancy_histories', newArr);
                                }} placeholder={t('birthWeight')} />
                              ) : (
                                <div className="text-sage-800 capitalize">{displayValue(history.birth_weight)} kg</div>
                              )}
                            </div>
                            <div>
                              <span className="text-sage-500 capitalize">{t('gestationalWeeks')}:</span>
                              {editMode ? (
                                <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={history.gestational_weeks || ''} onChange={e => {
                                  const newArr = [...ph.pregnancy_histories];
                                  newArr[idx] = { ...history, gestational_weeks: e.target.value };
                                  handleFieldChange('pregnancy_and_health', 'pregnancy_histories', newArr);
                                }} placeholder={t('gestationalWeeks')} />
                              ) : (
                                <div className="text-sage-800 capitalize">{displayValue(history.gestational_weeks, t('none', '无'))}</div>
                              )}
                            </div>
                            <div>
                              <span className="text-sage-500 capitalize">{t('numberOfBabies')}:</span>
                              {editMode ? (
                                <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={history.number_of_babies || ''} onChange={e => {
                                  const newArr = [...ph.pregnancy_histories];
                                  newArr[idx] = { ...history, number_of_babies: e.target.value };
                                  handleFieldChange('pregnancy_and_health', 'pregnancy_histories', newArr);
                                }} placeholder={t('numberOfBabies')} />
                              ) : (
                                <div className="text-sage-800 capitalize">{displayValue(history.number_of_babies)}</div>
                              )}
                            </div>
                            <div>
                              <span className="text-sage-500 capitalize">{t('deliveryMethod')}:</span>
                              {editMode ? (
                                <input type="text" className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize" value={history.delivery_method || ''} onChange={e => {
                                  const newArr = [...ph.pregnancy_histories];
                                  newArr[idx] = { ...history, delivery_method: e.target.value };
                                  handleFieldChange('pregnancy_and_health', 'pregnancy_histories', newArr);
                                }} placeholder={t('deliveryMethod')} />
                              ) : (
                                <div className="text-sage-800 capitalize">{displayValue(history.delivery_method)}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sage-500 text-sm italic capitalize">{t('none', '无')}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 面试信息部分 */}
        <div className="bg-white rounded-lg border border-sage-200 p-6 mt-6 animate-slide-in-right">
          <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2 mb-4 capitalize">
            <MessageSquare className="w-5 h-5" />
            {t('interview')}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <span className="text-sage-500 text-sm capitalize">{t('emotionalSupport')}:</span>
                  {editMode ? (
                    <textarea
                      className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm mt-1 w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize"
                      value={interview?.emotional_support || ''}
                      onChange={e => handleFieldChange('gestational_surrogacy_interview', 'emotional_support', e.target.value)}
                    />
                  ) : (
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1 capitalize">{displayValue(interview?.emotional_support, t('none', '无'))}</div>
                  )}
                </div>
                <div>
                  <span className="text-sage-500 text-sm capitalize">{t('languagesSpoken')}:</span>
                  {editMode ? (
                    <input
                      type="text"
                      className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm mt-1 w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize"
                      value={interview?.languages_spoken || ''}
                      onChange={e => handleFieldChange('gestational_surrogacy_interview', 'languages_spoken', e.target.value)}
                    />
                  ) : (
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1 capitalize">{displayValue(interview?.languages_spoken, t('none', '无'))}</div>
                  )}
                </div>
                <div>
                  <span className="text-sage-500 text-sm capitalize">{t('motivation')}:</span>
                  {editMode ? (
                    <textarea
                      className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm mt-1 w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize"
                      value={interview?.motivation || ''}
                      onChange={e => handleFieldChange('gestational_surrogacy_interview', 'motivation', e.target.value)}
                    />
                  ) : (
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1 capitalize">{displayValue(interview?.motivation, t('none', '无'))}</div>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sage-500 text-sm capitalize">{t('selfIntroduction')}:</span>
                  {editMode ? (
                    <textarea
                      className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm mt-1 w-full whitespace-pre-wrap focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize"
                      value={interview?.self_introduction || ''}
                      onChange={e => handleFieldChange('gestational_surrogacy_interview', 'self_introduction', e.target.value)}
                    />
                  ) : (
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1 whitespace-pre-wrap capitalize">{displayValue(interview?.self_introduction, t('none', '无'))}</div>
                  )}
                </div>
                <div>
                  <span className="text-sage-500 text-sm capitalize">{t('contactPreference')}:</span>
                  {editMode ? (
                    <input
                      type="text"
                      className="p-2 bg-white border border-sage-300 rounded text-sage-800 text-sm mt-1 w-full focus:outline-none focus:ring-2 focus:ring-sage-400 capitalize"
                      value={interview?.contact_preference || ''}
                      onChange={e => handleFieldChange('gestational_surrogacy_interview', 'contact_preference', e.target.value)}
                    />
                  ) : (
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1 capitalize">{displayValue(interview?.contact_preference, t('none', '无'))}</div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('hipaaRelease')}:</span>
                    {editMode ? (
                      <select
                        className="border rounded px-2 py-1 w-full font-medium text-sage-800 bg-white border-sage-300 focus:outline-none focus:ring-2 focus:ring-sage-400 cursor-pointer capitalize"
                        value={interview?.hipaa_release_willing ? 'yes' : 'no'}
                        onChange={e => handleFieldChange('gestational_surrogacy_interview', 'hipaa_release_willing', e.target.value === 'yes')}
                      >
                        <option value="yes" className="capitalize">{t('yes')}</option>
                        <option value="no" className="capitalize">{t('no')}</option>
                      </select>
                    ) : (
                      <span className="text-sage-800 capitalize">{interview?.hipaa_release_willing ? t('yes') : t('no')}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('multipleReduction')}:</span>
                    {editMode ? (
                      <select
                        className="border rounded px-2 py-1 w-full font-medium text-sage-800 bg-white border-sage-300 focus:outline-none focus:ring-2 focus:ring-sage-400 cursor-pointer capitalize"
                        value={interview?.multiple_reduction_willing ? 'yes' : 'no'}
                        onChange={e => handleFieldChange('gestational_surrogacy_interview', 'multiple_reduction_willing', e.target.value === 'yes')}
                      >
                        <option value="yes" className="capitalize">{t('yes')}</option>
                        <option value="no" className="capitalize">{t('no')}</option>
                      </select>
                    ) : (
                      <span className="text-sage-800 capitalize">{interview?.multiple_reduction_willing ? t('yes') : t('no')}</span>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500 capitalize">{t('terminationWilling')}:</span>
                    {editMode ? (
                      <select
                        className="border rounded px-2 py-1 w-full font-medium text-sage-800 bg-white border-sage-300 focus:outline-none focus:ring-2 focus:ring-sage-400 cursor-pointer capitalize"
                        value={interview?.termination_willing ? 'yes' : 'no'}
                        onChange={e => handleFieldChange('gestational_surrogacy_interview', 'termination_willing', e.target.value === 'yes')}
                      >
                        <option value="yes" className="capitalize">{t('yes')}</option>
                        <option value="no" className="capitalize">{t('no')}</option>
                      </select>
                    ) : (
                      <span className="text-sage-800 capitalize">{interview?.termination_willing ? t('yes') : t('no')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 时间信息 */}
        <div className="bg-white rounded-lg border border-sage-200 p-6 mt-6 animate-slide-in-right">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="flex justify-between">
              <span className="text-sage-500 capitalize">{t('created')}:</span>
              <span className="text-sage-800 capitalize">{surrogate.created_at ? new Date(surrogate.created_at).toLocaleString(i18n.language === 'zh-CN' ? 'zh-CN' : 'en-US') : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sage-500 capitalize">{t('updated')}:</span>
              <span className="text-sage-800 capitalize">{surrogate.updated_at ? new Date(surrogate.updated_at).toLocaleString(i18n.language === 'zh-CN' ? 'zh-CN' : 'en-US') : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
  )
}

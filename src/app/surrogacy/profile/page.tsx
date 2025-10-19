"use client";
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CustomButton } from "@/components/ui/CustomButton";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { User, MessageSquare, FileText, Calendar, Activity, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import "../../../i18n";

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

export default function SurrogacyProfile() {
  const router = useRouter();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { t, i18n } = useTranslation('common');
  const { toast } = useToast();
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // 只读页面，无需编辑相关状态

  // 计算年龄的函数
  const calculateAge = (dateOfBirth: string | undefined): string => {
    if (!dateOfBirth) return t('noData', '暂无数据');
    
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age.toString();
  }

  // 只读页面，无需编辑、保存、更新逻辑

  // 认证检查和 cookie 读取
  useEffect(() => {
    // 只在客户端执行
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

  // 数据加载 - 只在认证后执行
  useEffect(() => {
    // 只在认证后才加载数据
    if (!isAuthenticated) return;
    
    const surrogacyId = getCookie('userId_surrogacy');
    if (!surrogacyId) {
      setError(t('intendedParents.error.noParentInfo', '未找到代孕母信息'));
      setLoading(false);
      return;
    }
    fetch(`/api/surrogate_mothers-detail?surrogacy=${surrogacyId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(t('intendedParents.error.fetchDataFailed', '获取数据失败'));
        const result = await res.json();
        setData(result);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [t, isAuthenticated]);

  // 使用 useCallback 缓存关闭预览函数
  const handleClosePreview = useCallback(() => {
    setPreviewUrl(null);
  }, []);

  // 使用 useCallback 缓存打开预览函数
  const handleOpenPreview = useCallback((url: string) => {
    setPreviewUrl(url);
  }, []);

  // ⚠️ 重要：所有 useMemo 必须在条件返回之前调用，即使依赖的数据可能为空
  
  // 使用 useMemo 缓存数据对象，避免每次渲染重新创建
  const about = useMemo(() => data?.about_you || {}, [data?.about_you]);
  const contact = useMemo(() => data?.contact_information || {}, [data?.contact_information]);
  const health = useMemo(() => data?.pregnancy_and_health || {}, [data?.pregnancy_and_health]);
  const photos = useMemo(() => Array.isArray(data?.upload_photos) ? data.upload_photos : [], [data?.upload_photos]);
  const interview = useMemo(() => data?.gestational_surrogacy_interview || {}, [data?.gestational_surrogacy_interview]);

  // 只读，直接用原始数据
  const currentContact = contact;
  const currentAbout = about;
  const currentHealth = health;
  const currentInterview = interview;

  // 使用 useMemo 缓存计算的年龄
  const age = useMemo(() => calculateAge(currentContact?.date_of_birth), [currentContact?.date_of_birth]);

  // 使用 useMemo 缓存显示名称
  const displayName = useMemo(() => {
    return currentContact ? `${currentContact.first_name || ""} ${currentContact.last_name || ""}`.trim() : data?.id;
  }, [currentContact, data?.id]);

  // 使用 useMemo 缓存代孕经验标签
  const experienceBadge = useMemo(() => {
    return (currentContact?.surrogacy_experience_count ?? 0) > 0 
      ? t('experiencedSurrogate', '有经验代孕母') 
      : t('firstTimeSurrogate', '初次代孕母');
  }, [currentContact?.surrogacy_experience_count, t]);

  // 使用 useMemo 缓存电话号码显示
  const phoneDisplay = useMemo(() => {
    return currentContact?.cell_phone_country_code 
      ? `+${currentContact.cell_phone_country_code} ${currentContact?.cell_phone ?? t('noData', '暂无数据')}`
      : currentContact?.cell_phone ?? t('noData', '暂无数据');
  }, [currentContact?.cell_phone_country_code, currentContact?.cell_phone, t]);

  // 使用 useMemo 缓存医疗状况显示
  const medicalConditionsDisplay = useMemo(() => {
    return Array.isArray(currentHealth?.medical_conditions) 
      ? currentHealth.medical_conditions.join(", ") 
      : t('noData', '暂无数据');
  }, [currentHealth?.medical_conditions, t]);

  // 使用 useMemo 缓存创建时间和更新时间
  const createdAtDisplay = useMemo(() => {
    return data?.created_at 
      ? new Date(data.created_at).toLocaleString(i18n.language === 'zh-CN' ? 'zh-CN' : 'en-US') 
      : t('noData', '暂无数据');
  }, [data?.created_at, i18n.language, t]);

  const updatedAtDisplay = useMemo(() => {
    return data?.updated_at 
      ? new Date(data.updated_at).toLocaleString(i18n.language === 'zh-CN' ? 'zh-CN' : 'en-US') 
      : t('noData', '暂无数据');
  }, [data?.updated_at, i18n.language, t]);

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查 loading
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-sage-600">{t('loading', '加载中...')}</div>
        </div>
      </div>
    )
  }

  // 未认证，等待重定向
  if (!isAuthenticated) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-sage-600">{t('loading', '加载中...')}</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12">
        <div className="text-center py-8 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12">
      <div className="flex items-center justify-between pt-6 pb-2">
        <div>
          <h1 className="text-2xl font-medium text-sage-800">{t('surrogateProfileDetail.myProfile', '个人资料')}</h1>
          <p className="text-sage-600 text-sm mt-1">{t('surrogateProfileDetail.description', '查看您的个人信息')}</p>
        </div>
      </div>
      
      {/* 顶部照片展示区域 */}
      <div className="w-full flex flex-col items-center mb-6">
        <h3 className="text-lg font-medium text-sage-800 mb-3">{t('uploadPhotos', '上传照片')}</h3>
        {photos.length > 0 ? (
          <div className="flex gap-6 justify-center flex-wrap w-full">
            {photos.map((photo: any, idx: number) => (
              <div
                key={idx}
                className="w-48 h-48 rounded-xl overflow-hidden border border-sage-200 bg-sage-50 flex items-center justify-center shadow relative cursor-pointer group"
                onClick={() => handleOpenPreview(photo.url)}
                title={t('viewLarge', '查看大图')}
                style={{ cursor: 'pointer' }}
              >
                <img
                  src={photo.url}
                  alt={photo.name || `photo-${idx+1}`}
                  className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                  loading="lazy"
                />
                {/* 图片序号标签 */}
                <span className="absolute top-2 left-2 bg-sage-700 text-white text-xs px-2 py-1 rounded shadow">
                  {`${t('photo', '照片')} ${idx+1}`}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sage-500 text-sm">{t('noPhotosUploaded', '暂无上传照片')}</div>
        )}

        {/* 全屏预览弹窗 */}
        {previewUrl && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 animate-fade-in"
            onClick={handleClosePreview}
            style={{ cursor: 'zoom-out' }}
          >
            <img
              src={previewUrl}
              alt="preview"
              className="max-w-full max-h-full rounded-lg shadow-2xl border-4 border-white"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
              onClick={e => e.stopPropagation()}
            />
            <CustomButton
              className="absolute top-8 right-8 text-white text-3xl font-bold bg-black bg-opacity-40 rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-70 transition"
              onClick={handleClosePreview}
              aria-label="Close preview"
              style={{ cursor: 'pointer' }}
            >
              ×
            </CustomButton>
          </div>
        )}
      </div>

      {/* 状态和基本信息 */}
      <Card className="bg-white border-sage-200 animate-slide-in-left overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-sage-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-sage-800">
                  {displayName}
                </h2>
                <p className="text-sage-500">{t('id', 'ID')}: #{data?.id} • {age} {t('yearsOld', '岁')}</p>
              </div>
            </div>
            <Badge variant="outline" className="px-3 py-1 bg-green-100 text-green-800 border-green-200">
              {experienceBadge}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 关于我 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t('surrogateProfileDetail.basicInfo', '关于我')}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('surrogateProfileDetail.occupation', '职业')}:</span>
                  <span className="text-sage-800">{currentAbout?.occupation ?? t('noData', '暂无数据')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('surrogateProfileDetail.contactSource', '信息来源')}:</span>
                  <span className="text-sage-800">{
                    currentAbout?.contact_source
                      ? String(t(`surrogateProfileDetail.contactSource.${currentAbout.contact_source}`, currentAbout.contact_source))
                      : t('noData', '暂无数据')
                  }</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('surrogateProfileDetail.maritalStatus', '婚姻状况')}:</span>
                  <span className="text-sage-800">{currentAbout?.marital_status ?? t('noData', '暂无数据')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('surrogateProfileDetail.education', '教育程度')}:</span>
                  <span className="text-sage-800">{currentAbout?.education_level ?? t('noData', '暂无数据')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('surrogateProfileDetail.partnerSupport', '伴侣支持')}:</span>
                  <span className="text-sage-800">{currentAbout?.partner_support ?? t('noData', '暂无数据')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('surrogateProfileDetail.householdIncome', '家庭收入')}:</span>
                  <span className="text-sage-800">{currentAbout?.household_income ?? t('noData', '暂无数据')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('surrogateProfileDetail.isFormerSurrogate', '是否曾为代孕母')}:</span>
                  <span className="text-sage-800">{typeof currentAbout?.is_former_surrogate === 'boolean' ? (currentAbout.is_former_surrogate ? t('surrogateProfileDetail.yes', '是') : t('surrogateProfileDetail.no', '否')) : t('noData', '暂无数据')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('surrogateProfileDetail.surrogateExperience', '代孕经历说明')}:</span>
                  <span className="text-sage-800">{
                    currentAbout?.surrogate_experience && currentAbout.surrogate_experience.trim() !== ''
                      ? String(t(`surrogateProfileDetail.surrogateExperience.${currentAbout.surrogate_experience}`, currentAbout.surrogate_experience))
                      : t('noData', '暂无数据')
                  }</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('surrogateProfileDetail.hasHighSchoolDiploma', '有高中毕业证')}:</span>
                  <span className="text-sage-800">{typeof currentAbout?.has_high_school_diploma === 'boolean' ? (currentAbout.has_high_school_diploma ? t('surrogateProfileDetail.yes', '是') : t('surrogateProfileDetail.no', '否')) : t('noData', '暂无数据')}</span>
                </div>

              </div>
            </div>
            {/* 联系信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                <User className="w-5 h-5" />
                {t('contactInformation', '联系信息')}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('dateOfBirth', '出生日期')}:</span>
                  <span className="text-sage-800">{currentContact?.date_of_birth ?? t('noData', '暂无数据')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('phone', '电话')}:</span>
                  <span className="text-sage-800">{phoneDisplay}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('email', '邮箱')}:</span>
                  <span className="text-sage-800">{currentContact?.email_address ?? t('noData', '暂无数据')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('city', '城市')}:</span>
                  <span className="text-sage-800">{currentContact?.city ?? t('noData', '暂无数据')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('stateOrProvince', '省份/州')}:</span>
                  <span className="text-sage-800">{currentContact?.state_or_province ?? t('noData', '暂无数据')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('country', '国家')}:</span>
                  <span className="text-sage-800">{currentContact?.country ?? t('noData', '暂无数据')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('zipCode', '邮政编码')}:</span>
                  <span className="text-sage-800">{currentContact?.zip_code ?? t('noData', '暂无数据')}</span>
                </div>
              </div>
            </div>
            {/* 身体特征 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {t('physicalCharacteristics', '身体特征')}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('height', '身高')}:</span>
                  <span className="text-sage-800">{currentContact?.height ?? t('noData', '暂无数据')} {t('cm', '公分')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('weight', '体重')}:</span>
                  <span className="text-sage-800">{currentContact?.weight ?? t('noData', '暂无数据')} {t('kg', '公斤')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('bmi', 'BMI')}:</span>
                  <span className="text-sage-800">{currentContact?.bmi ?? t('noData', '暂无数据')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('ethnicity', '种族')}:</span>
                  <span className="text-sage-800">{currentContact?.ethnicity ?? t('noData', '暂无数据')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('surrogacyExperience', '代孕经验')}:</span>
                  <span className="text-sage-800">{currentContact?.surrogacy_experience_count ?? "0"} {t('times', '次')}</span>
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
            <CardTitle className="flex items-center gap-2 text-sage-800 text-lg font-medium">
              <Activity className="w-5 h-5" />
              {t('pregnancyHealth', '怀孕与健康')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-y-4 gap-x-6">
            <div className="space-y-1">
              <Label className="text-sage-600 text-sm">{t('hasGivenBirth', '是否生过孩子')}</Label>
              <p className="font-medium text-sage-800">{currentHealth?.has_given_birth ? t('yes', '是') : t('no', '否')}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sage-600 text-sm">{t('isCurrentlyPregnant', '目前是否怀孕')}</Label>
              <p className="font-medium text-sage-800">{currentHealth?.is_currently_pregnant ? t('yes', '是') : t('no', '否')}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sage-600 text-sm">{t('isBreastfeeding', '是否正在哺乳')}</Label>
              <p className="font-medium text-sage-800">{currentHealth?.is_breastfeeding ? t('yes', '是') : t('no', '否')}</p>
            </div>
            <div className="space-y-1">
              <Label className="text-sage-600 text-sm">{t('hasStillbirth', '是否有死胎经历')}</Label>
              <p className="font-medium text-sage-800">{currentHealth?.has_stillbirth ? t('yes', '是') : t('no', '否')}</p>
            </div>
            <div className="space-y-1 col-span-2">
              <Label className="text-sage-600 text-sm">{t('medicalConditions', '疾病状况')}</Label>
              <p className="font-medium text-sage-800">{medicalConditionsDisplay}</p>
            </div>
            <div className="space-y-1 col-span-2">
              <Label className="text-sage-600 text-sm">{t('isTakingMedications', '是否正在服药')}</Label>
              <p className="font-medium text-sage-800">{currentHealth?.is_taking_medications ? t('yes', '是') : t('no', '否')}</p>
              {currentHealth?.is_taking_medications && (
                <div className="mt-2">
                  <Label className="text-sage-600 text-sm">{t('medications', '药物清单')}</Label>
                  <p className="font-medium text-sage-800">{currentHealth?.medications_list ?? t('noData', '暂无数据')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 怀孕历史 */}
        <Card className="bg-white border-sage-200 animate-slide-in-left" style={{ animationDelay: "100ms" }}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-sage-800 text-lg font-medium">
              <Calendar className="w-5 h-5" />
              {t('pregnancyHistories', '怀孕历史')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-sage-600 text-sm">{t('backgroundCheckStatus', '背景调查状态')}</Label>
                <p className="font-medium text-sage-800">{health?.background_check_status ?? t('noData', '暂无数据')}</p>
              </div>
              
              <div className="mt-6">
                <Label className="text-sage-600 text-sm">{t('pregnancyHistory', '怀孕历史')}</Label>
                {Array.isArray(health?.pregnancy_histories) && health.pregnancy_histories.length > 0 ? (
                  <div className="space-y-3 mt-2">
                    {health.pregnancy_histories.map((history: any, idx: number) => (
                      <div key={idx} className="p-3 bg-sage-50 rounded-lg border border-sage-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-sage-500">{t('deliveryDate', '分娩日期')}:</span>
                            <div className="text-sage-800">{history.delivery_date || t('noData', '暂无数据')}</div>
                          </div>
                          <div>
                            <span className="text-sage-500">{t('birthWeight', '出生体重')}:</span>
                            <div className="text-sage-800">{history.birth_weight || t('noData', '暂无数据')} {t('kg', '公斤')}</div>
                          </div>
                          <div>
                            <span className="text-sage-500">{t('gestationalWeeks', '孕周')}:</span>
                            <div className="text-sage-800">{history.gestational_weeks || t('noData', '暂无数据')}</div>
                          </div>
                          <div>
                            <span className="text-sage-500">{t('numberOfBabies', '婴儿数量')}:</span>
                            <div className="text-sage-800">{history.number_of_babies || t('noData', '暂无数据')}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sage-500 text-sm italic">{t('noData', '暂无数据')}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 面试信息部分 */}
      <div className="bg-white rounded-lg border border-sage-200 p-6 mt-6 animate-slide-in-right">
        <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5" />
          {t('interview', '面试信息')}
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="text-sage-500 text-sm">{t('emotionalSupport', '情感支持')}:</span>
                <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                  {interview?.emotional_support ?? t('noData', '暂无数据')}
                </div>
              </div>
              <div>
                <span className="text-sage-500 text-sm">{t('languagesSpoken', '会说的语言')}:</span>
                <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                  {interview?.languages_spoken ?? t('noData', '暂无数据')}
                </div>
              </div>
              <div>
                <span className="text-sage-500 text-sm">{t('motivation', '动机')}:</span>
                <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                  {interview?.motivation ?? t('noData', '暂无数据')}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sage-500 text-sm">{t('selfIntroduction', '自我介绍')}:</span>
                <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1 whitespace-pre-wrap">
                  {interview?.self_introduction ?? t('noData', '暂无数据')}
                </div>
              </div>
              <div>
                <span className="text-sage-500 text-sm">{t('contactPreference', '联系偏好')}:</span>
                <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                  {interview?.contact_preference ?? t('noData', '暂无数据')}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('hipaaRelease', 'HIPAA放行')}:</span>
                  <span className="text-sage-800">{interview?.hipaa_release_willing ? t('yes', '是') : t('no', '否')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('multipleReduction', '多胎减胎')}:</span>
                  <span className="text-sage-800">{interview?.multiple_reduction_willing ? t('yes', '是') : t('no', '否')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('terminationWilling', '终止怀孕意愿')}:</span>
                  <span className="text-sage-800">{interview?.termination_willing ? t('yes', '是') : t('no', '否')}</span>
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
            <span className="text-sage-500">{t('created', '创建时间')}:</span>
            <span className="text-sage-800">{createdAtDisplay}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sage-500">{t('updated', '更新时间')}:</span>
            <span className="text-sage-800">{updatedAtDisplay}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

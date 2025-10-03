"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useParams } from "next/navigation"
import "../../../i18n"
import { getSurrogateMotherById } from "@/lib/graphql/applications"
import type { SurrogateMother } from "@/types/surrogate_mother"
import { ChevronRight, User, MessageSquare, FileText, Calendar, Activity, ArrowLeft } from "lucide-react"
import { Button } from "../../../components/ui/button"
import { Label } from "../../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"


export default function SurrogateProfileDetailPage() {
  const router = useRouter()
  const { t, i18n } = useTranslation("common")
  const params = useParams<{ id: string }>()
  const [surrogate, setSurrogate] = useState<SurrogateMother | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 计算年龄的函数，使用国际化
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

  useEffect(() => {
    async function fetchData() {
      try {
        // 从localStorage获取准父母ID
        const parentId = typeof window !== "undefined" ? localStorage.getItem("parentId") : null;
        if (!parentId) {
          setError(t('myCases.error.noUserId', "未找到用户ID，请重新登录。"));
          setLoading(false);
          return;
        }

        // 获取准父母的案例数据
        const response = await fetch(`/api/cases-by-parent?parentId=${parentId}`);
        if (!response.ok) {
          throw new Error(t('myCases.error.fetchFailed', "获取案例失败"));
        }
        
        const cases = await response.json();
        console.log('准父母案例数据:', cases);

        // 查找匹配的案例（如果URL有案例ID参数）
        let targetCase = null;
        if (params?.id) {
          // 如果URL参数是案例ID，查找对应案例
          targetCase = cases.find((caseItem: any) => caseItem.id === Number(params.id));
        } else {
          // 如果没有指定案例ID，使用第一个有代孕母的案例
          targetCase = cases.find((caseItem: any) => caseItem.surrogate_mother);
        }

        if (!targetCase) {
          setError(t('notFoundCase', "未找到匹配的案例"));
          setLoading(false);
          return;
        }

        if (!targetCase.surrogate_mother) {
          setError(t('notFoundSurrogate', "该案例还未匹配代孕母"));
          setLoading(false);
          return;
        }

        // 获取代孕母详细信息
        const surrogateId = targetCase.surrogate_mother.id;
        const surrogateData = await getSurrogateMotherById(surrogateId);
        setSurrogate(surrogateData);
        
      } catch (error: any) {
        console.error('获取代孕母信息失败:', error);
        setError(error.message || t('fetchError', '获取数据失败'));
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, [params?.id, t])



  if (loading) {
    return (
      <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-sage-600">{t('loading', '加载中...')}</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12">
        <div className="text-center py-8 text-red-600">{error}</div>
      </div>
    )
  }

  if (!surrogate) {
    return (
      <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12">
        <div className="text-center py-8 text-red-600">{t('notFoundSurrogate', '未找到代孕母信息')}</div>
      </div>
    )
  }

  const ci = surrogate.contact_information
  const ph = surrogate.pregnancy_and_health
  const ay = surrogate.about_you
  const interview = surrogate.gestational_surrogacy_interview

  return (

      <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12">
        <div className="flex items-center justify-between pt-6 pb-2">
          <div>
            <h1 className="text-2xl font-medium text-sage-800">{t('matchedSurrogate', '匹配的代孕母')}</h1>
            <p className="text-sage-600 text-sm mt-1">{t('matchedSurrogateDesc', '以下是为您匹配的代孕母详细信息')}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/client/my-cases')}
              className="bg-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backToCases', '返回我的案例')}
            </Button>
          </div>
        </div>
        
        {/* 匹配说明卡片 */}
        {/* <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900 mb-1">{t('surrogateMatchInfo', '代孕母匹配信息')}</h3>
                <p className="text-blue-700 text-sm">
                  {t('surrogateMatchDesc', '系统已为您的案例匹配了合适的代孕母。以下是她的详细资料，包括个人信息、健康状况、怀孕历史等重要信息。如有任何疑问，请联系我们的专业团队。')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card> */}
        
        {/* 顶部照片展示区域 */}
        <div className="w-full flex flex-col items-center mb-6">
          <h3 className="text-lg font-medium text-sage-800 mb-3">{t('uploadPhotos', '上传照片')}</h3>
          {Array.isArray(surrogate.upload_photos) && surrogate.upload_photos.length > 0 ? (
            <div className="flex gap-6 justify-center flex-wrap w-full">
              {surrogate.upload_photos.map((photo, idx) => (
                <div key={idx} className="w-48 h-48 rounded-xl overflow-hidden border border-sage-200 bg-sage-50 flex items-center justify-center shadow relative">
                  <img
                    src={photo.url}
                    alt={photo.name || `photo-${idx+1}`}
                    className="object-cover w-full h-full transition-transform duration-200 hover:scale-105"
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
                    {ci ? `${ci.first_name || ""} ${ci.last_name || ""}`.trim() : surrogate.id}
                  </h2>
                  <p className="text-sage-500">{t('id', 'ID')}: #{surrogate.id} • {calculateAge(ci?.date_of_birth)} {t('yearsOld', '岁')}</p>
                </div>
              </div>
              <Badge variant="outline" className="px-3 py-1 bg-green-100 text-green-800 border-green-200">
                {(ci?.surrogacy_experience_count ?? 0) > 0 ? t('experiencedSurrogate', '有经验代孕母') : t('firstTimeSurrogate', '初次代孕母')}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t('contactInformation', '联系信息')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('dateOfBirth', '出生日期')}:</span>
                    <span className="text-sage-800">{ci?.date_of_birth ?? t('noData', '暂无数据')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('phone', '电话')}:</span>
                    <span className="text-sage-800">{ci?.cell_phone_country_code ? `+${ci.cell_phone_country_code} ` : ""}{ci?.cell_phone ?? t('noData', '暂无数据')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('email', '邮箱')}:</span>
                    <span className="text-sage-800">{ci?.email_address ?? t('noData', '暂无数据')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('city', '城市')}:</span>
                    <span className="text-sage-800">{ci?.city ?? t('noData', '暂无数据')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('stateOrProvince', '省份/州')}:</span>
                    <span className="text-sage-800">{ci?.state_or_province ?? t('noData', '暂无数据')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('country', '国家')}:</span>
                    <span className="text-sage-800">{ci?.country ?? t('noData', '暂无数据')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('zipCode', '邮政编码')}:</span>
                    <span className="text-sage-800">{ci?.zip_code ?? t('noData', '暂无数据')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  {t('physicalCharacteristics', '身体特征')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('height', '身高')}:</span>
                    <span className="text-sage-800">{ci?.height ?? t('noData', '暂无数据')} {t('cm', '公分')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('weight', '体重')}:</span>
                    <span className="text-sage-800">{ci?.weight ?? t('noData', '暂无数据')} {t('kg', '公斤')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('bmi', 'BMI')}:</span>
                    <span className="text-sage-800">{ci?.bmi ?? t('noData', '暂无数据')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('ethnicity', '种族')}:</span>
                    <span className="text-sage-800">{ci?.ethnicity ?? t('noData', '暂无数据')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('surrogacyExperience', '代孕经验')}:</span>
                    <span className="text-sage-800">{ci?.surrogacy_experience_count ?? "0"} {t('times', '次')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t('aboutYou', '关于您')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('occupation', '职业')}:</span>
                    <span className="text-sage-800">{ay?.occupation ?? t('noData', '暂无数据')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('education', '教育程度')}:</span>
                    <span className="text-sage-800">{ay?.education_level ?? t('noData', '暂无数据')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('maritalStatus', '婚姻状况')}:</span>
                    <span className="text-sage-800">{ay?.marital_status ?? t('noData', '暂无数据')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('partnerSupport', '伴侣支持')}:</span>
                    <span className="text-sage-800">{ay?.partner_support ?? t('noData', '暂无数据')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('householdIncome', '家庭收入')}:</span>
                    <span className="text-sage-800">{ay?.household_income ?? t('noData', '暂无数据')}</span>
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
                <p className="font-medium text-sage-800">{ph?.has_given_birth ? t('yes', '是') : t('no', '否')}</p>
              </div>
              
              <div className="space-y-1">
                <Label className="text-sage-600 text-sm">{t('isCurrentlyPregnant', '目前是否怀孕')}</Label>
                <p className="font-medium text-sage-800">{ph?.is_currently_pregnant ? t('yes', '是') : t('no', '否')}</p>
              </div>
              
              <div className="space-y-1">
                <Label className="text-sage-600 text-sm">{t('isBreastfeeding', '是否正在哺乳')}</Label>
                <p className="font-medium text-sage-800">{ph?.is_breastfeeding ? t('yes', '是') : t('no', '否')}</p>
              </div>
              
              <div className="space-y-1">
                <Label className="text-sage-600 text-sm">{t('hasStillbirth', '是否有死胎经历')}</Label>
                <p className="font-medium text-sage-800">{ph?.has_stillbirth ? t('yes', '是') : t('no', '否')}</p>
              </div>
              
              <div className="space-y-1 col-span-2">
                <Label className="text-sage-600 text-sm">{t('medicalConditions', '疾病状况')}</Label>
                <p className="font-medium text-sage-800">{ph?.medical_conditions?.join(", ") ?? t('noData', '暂无数据')}</p>
              </div>
              
              <div className="space-y-1 col-span-2">
                <Label className="text-sage-600 text-sm">{t('isTakingMedications', '是否正在服药')}</Label>
                <p className="font-medium text-sage-800">{ph?.is_taking_medications ? t('yes', '是') : t('no', '否')}</p>
                {ph?.is_taking_medications && (
                  <div className="mt-2">
                    <Label className="text-sage-600 text-sm">{t('medications', '药物清单')}</Label>
                    <p className="font-medium text-sage-800">{ph?.medications_list ?? t('noData', '暂无数据')}</p>
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
                  <p className="font-medium text-sage-800">{ph?.background_check_status ?? t('noData', '暂无数据')}</p>
                </div>
                
                <div className="mt-6">
                  <Label className="text-sage-600 text-sm">{t('pregnancyHistory', '怀孕历史')}</Label>
                  {ph?.pregnancy_histories?.length ? (
                    <div className="space-y-3 mt-2">
                      {ph.pregnancy_histories.map((history, idx) => (
                        <div key={idx} className="p-3 bg-sage-50 rounded-lg border border-sage-200">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-sage-500">{t('deliveryDate', '分娩日期')}:</span>
                              <div className="text-sage-800">{history.delivery_date}</div>
                            </div>
                            <div>
                              <span className="text-sage-500">{t('birthWeight', '出生体重')}:</span>
                              <div className="text-sage-800">{history.birth_weight} {t('kg', '公斤')}</div>
                            </div>
                            <div>
                              <span className="text-sage-500">{t('gestationalWeeks', '孕周')}:</span>
                              <div className="text-sage-800">{history.gestational_weeks || t('noData', '暂无数据')}</div>
                            </div>
                            <div>
                              <span className="text-sage-500">{t('numberOfBabies', '婴儿数量')}:</span>
                              <div className="text-sage-800">{history.number_of_babies}</div>
                            </div>
                            <div>
                              <span className="text-sage-500">{t('deliveryMethod', '分娩方式')}:</span>
                              <div className="text-sage-800">{history.delivery_method}</div>
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
              <span className="text-sage-800">{surrogate.created_at ? new Date(surrogate.created_at).toLocaleString(i18n.language === 'zh-CN' ? 'zh-CN' : 'en-US') : t('noData', '暂无数据')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sage-500">{t('updated', '更新时间')}:</span>
              <span className="text-sage-800">{surrogate.updated_at ? new Date(surrogate.updated_at).toLocaleString(i18n.language === 'zh-CN' ? 'zh-CN' : 'en-US') : t('noData', '暂无数据')}</span>
            </div>
          </div>
        </div>
      </div>
  )
}

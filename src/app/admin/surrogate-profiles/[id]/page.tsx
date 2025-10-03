"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useParams } from "next/navigation"
import { getSurrogateMotherById } from "@/lib/graphql/applications"
import type { SurrogateMother } from "@/types/surrogate_mother"
import { ChevronRight, User, MessageSquare, FileText, Calendar, Activity, ArrowLeft } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Label } from "../../../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { AdminLayout } from "../../../../components/admin-layout"

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
  const [surrogate, setSurrogate] = useState<SurrogateMother | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (params?.id) {
        const data = await getSurrogateMotherById(Number(params.id))
        setSurrogate(data)
      }
      setLoading(false)
    }
    fetchData()
  }, [params?.id])

  const calculateAge = (dateOfBirth: string | undefined) => {
    if (!dateOfBirth) return 'N/A'
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-sage-600">{t('loading')}</div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!surrogate) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12">
          <div className="text-center py-8 text-red-600">{t('notFoundSurrogate')}</div>
        </div>
      </AdminLayout>
    )
  }

  const ci = surrogate.contact_information
  const ph = surrogate.pregnancy_and_health
  const ay = surrogate.about_you
  const interview = surrogate.gestational_surrogacy_interview

  return (
    <AdminLayout>
      <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12">
        <div className="flex items-center justify-between pt-6 pb-2">
          <h1 className="text-2xl font-medium text-sage-800">{t('surrogateProfile')}</h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/admin/surrogate-profiles')}
              className="bg-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backToSurrogateProfiles')}
            </Button>
          </div>
        </div>
        
        {/* 顶部照片展示区域 */}
        <div className="w-full flex flex-col items-center mb-6">
          <h3 className="text-lg font-medium text-sage-800 mb-3">{t('uploadPhotos')}</h3>
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
                    {`${t('photo')} ${idx+1}`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sage-500 text-sm">{t('noPhotosUploaded')}</div>
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
                  <p className="text-sage-500">ID: #{surrogate.id} • {calculateAge(ci?.date_of_birth)}{t('yearsOld')}</p>
                </div>
              </div>
              <Badge variant="outline" className="px-3 py-1 bg-green-100 text-green-800 border-green-200">
                {(ci?.surrogacy_experience_count ?? 0) > 0 ? t('experiencedSurrogate') : t('firstTimeSurrogate')}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t('contactInformation')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('dateOfBirth')}:</span>
                    <span className="text-sage-800">{ci?.date_of_birth ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('phone')}:</span>
                    <span className="text-sage-800">{ci?.cell_phone_country_code ? `+${ci.cell_phone_country_code} ` : ""}{ci?.cell_phone ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('email')}:</span>
                    <span className="text-sage-800">{ci?.email_address ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('city')}:</span>
                    <span className="text-sage-800">{ci?.city ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('stateOrProvince')}:</span>
                    <span className="text-sage-800">{ci?.state_or_province ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('country')}:</span>
                    <span className="text-sage-800">{ci?.country ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('zipCode')}:</span>
                    <span className="text-sage-800">{ci?.zip_code ?? "-"}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  {t('physicalCharacteristics')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('height')}:</span>
                    <span className="text-sage-800">{ci?.height ?? "-"} cm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('weight')}:</span>
                    <span className="text-sage-800">{ci?.weight ?? "-"} kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('bmi')}:</span>
                    <span className="text-sage-800">{ci?.bmi ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('ethnicity')}:</span>
                    <span className="text-sage-800">{ci?.ethnicity ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('surrogacyExperience')}:</span>
                    <span className="text-sage-800">{ci?.surrogacy_experience_count ?? "0"} {t('times')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t('aboutYou')}
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('occupation')}:</span>
                    <span className="text-sage-800">{ay?.occupation ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('education')}:</span>
                    <span className="text-sage-800">{ay?.education_level ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('maritalStatus')}:</span>
                    <span className="text-sage-800">{ay?.marital_status ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('partnerSupport')}:</span>
                    <span className="text-sage-800">{ay?.partner_support ?? "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('householdIncome')}:</span>
                    <span className="text-sage-800">{ay?.household_income ?? "-"}</span>
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
                {t('pregnancyHealth')}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div className="space-y-1">
                <Label className="text-sage-600 text-sm">{t('hasGivenBirth')}</Label>
                <p className="font-medium text-sage-800">{ph?.has_given_birth ? t('yes') : t('no')}</p>
              </div>
              
              <div className="space-y-1">
                <Label className="text-sage-600 text-sm">{t('isCurrentlyPregnant')}</Label>
                <p className="font-medium text-sage-800">{ph?.is_currently_pregnant ? t('yes') : t('no')}</p>
              </div>
              
              <div className="space-y-1">
                <Label className="text-sage-600 text-sm">{t('isBreastfeeding')}</Label>
                <p className="font-medium text-sage-800">{ph?.is_breastfeeding ? t('yes') : t('no')}</p>
              </div>
              
              <div className="space-y-1">
                <Label className="text-sage-600 text-sm">{t('hasStillbirth')}</Label>
                <p className="font-medium text-sage-800">{ph?.has_stillbirth ? t('yes') : t('no')}</p>
              </div>
              
              <div className="space-y-1 col-span-2">
                <Label className="text-sage-600 text-sm">{t('medicalConditions')}</Label>
                <p className="font-medium text-sage-800">{ph?.medical_conditions?.join(", ") ?? "-"}</p>
              </div>
              
              <div className="space-y-1 col-span-2">
                <Label className="text-sage-600 text-sm">{t('isTakingMedications')}</Label>
                <p className="font-medium text-sage-800">{ph?.is_taking_medications ? t('yes') : t('no')}</p>
                {ph?.is_taking_medications && (
                  <div className="mt-2">
                    <Label className="text-sage-600 text-sm">{t('medications')}</Label>
                    <p className="font-medium text-sage-800">{ph?.medications_list ?? "-"}</p>
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
                {t('pregnancyHistories')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-sage-600 text-sm">{t('backgroundCheckStatus')}</Label>
                  <p className="font-medium text-sage-800">{ph?.background_check_status ?? "-"}</p>
                </div>
                
                <div className="mt-6">
                  <Label className="text-sage-600 text-sm">{t('pregnancyHistory')}</Label>
                  {ph?.pregnancy_histories?.length ? (
                    <div className="space-y-3 mt-2">
                      {ph.pregnancy_histories.map((history, idx) => (
                        <div key={idx} className="p-3 bg-sage-50 rounded-lg border border-sage-200">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-sage-500">{t('deliveryDate')}:</span>
                              <div className="text-sage-800">{history.delivery_date}</div>
                            </div>
                            <div>
                              <span className="text-sage-500">{t('birthWeight')}:</span>
                              <div className="text-sage-800">{history.birth_weight} kg</div>
                            </div>
                            <div>
                              <span className="text-sage-500">{t('gestationalWeeks')}:</span>
                              <div className="text-sage-800">{history.gestational_weeks || 'N/A'}</div>
                            </div>
                            <div>
                              <span className="text-sage-500">{t('numberOfBabies')}:</span>
                              <div className="text-sage-800">{history.number_of_babies}</div>
                            </div>
                            <div>
                              <span className="text-sage-500">{t('deliveryMethod')}:</span>
                              <div className="text-sage-800">{history.delivery_method}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sage-500 text-sm italic">{t('N/A')}</p>
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
            {t('interview')}
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <span className="text-sage-500 text-sm">{t('emotionalSupport')}:</span>
                  <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                    {interview?.emotional_support ?? 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="text-sage-500 text-sm">{t('languagesSpoken')}:</span>
                  <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                    {interview?.languages_spoken ?? 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="text-sage-500 text-sm">{t('motivation')}:</span>
                  <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                    {interview?.motivation ?? 'N/A'}
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <span className="text-sage-500 text-sm">{t('selfIntroduction')}:</span>
                  <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1 whitespace-pre-wrap">
                    {interview?.self_introduction ?? 'N/A'}
                  </div>
                </div>
                <div>
                  <span className="text-sage-500 text-sm">{t('contactPreference')}:</span>
                  <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                    {interview?.contact_preference ?? 'N/A'}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('hipaaRelease')}:</span>
                    <span className="text-sage-800">{interview?.hipaa_release_willing ? t('yes') : t('no')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('multipleReduction')}:</span>
                    <span className="text-sage-800">{interview?.multiple_reduction_willing ? t('yes') : t('no')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sage-500">{t('terminationWilling')}:</span>
                    <span className="text-sage-800">{interview?.termination_willing ? t('yes') : t('no')}</span>
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
              <span className="text-sage-500">{t('created')}:</span>
              <span className="text-sage-800">{surrogate.created_at ? new Date(surrogate.created_at).toLocaleString(i18n.language === 'zh-CN' ? 'zh-CN' : 'en-US') : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sage-500">{t('updated')}:</span>
              <span className="text-sage-800">{surrogate.updated_at ? new Date(surrogate.updated_at).toLocaleString(i18n.language === 'zh-CN' ? 'zh-CN' : 'en-US') : 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

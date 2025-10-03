"use client"

import { useTranslation } from 'react-i18next';
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import ManagerLayout from '@/components/manager-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { User, MessageSquare, Calendar } from "lucide-react"
import type { SurrogateMother } from '@/types/surrogate_mother'

export default function SurrogateProfileDetailPage() {
  const { t } = useTranslation('common');
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const [surrogate, setSurrogate] = useState<SurrogateMother | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      if (params?.id) {
        try {
          const res = await fetch(`/api/surrogate_mothers-detail?surrogacy=${params.id}`)
          if (!res.ok) throw new Error(t('surrogateProfileDetail.fetchFailed'))
          const data = await res.json()
          setSurrogate(data)
        } catch {
          setSurrogate(null)
        }
      }
      setLoading(false)
    }
    fetchData()
  }, [params?.id, t])

  if (loading) {
    return <div className="p-8 text-[#271F18]">{t('loading')}</div>
  }

  if (!surrogate) {
    return <div className="p-8 text-red-600">{t('surrogateProfileDetail.notFound')}</div>
  }

  const ci = surrogate.contact_information
  const ph = surrogate.pregnancy_and_health
  const ay = surrogate.about_you
  const interview = surrogate.gestational_surrogacy_interview

  return (
    <ManagerLayout>
      <div className="space-y-6 animate-fade-in p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
        <div className="mb-4">
          <Button variant="outline" onClick={() => router.push('/client-manager/surrogate-profiles')}>{t('surrogateProfileDetail.backToList')}</Button>
        </div>
        <h1 className="text-3xl font-light text-[#271F18] tracking-wide mb-6">{t('surrogateProfileDetail.title')}</h1>
        {/* 基本信息 */}
        <Card className="bg-white border-[#E2E8F0] animate-slide-in-up">
          <CardHeader className="pb-4">
            <CardTitle className="text-[#271F18] text-lg font-medium">{t('surrogateProfileDetail.basicInfo')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#F5E6C8] rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-[#271F18]" />
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
                  <div>
                    <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.name')}:</Label>
                    <p className="font-medium text-[#271F18]">{ci ? `${ci.first_name || ""} ${ci.last_name || ""}`.trim() : surrogate.id}</p>
                  </div>
                  <div>
                    <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.dob')}:</Label>
                    <p className="font-medium text-[#271F18]">{ci?.date_of_birth ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.phone')}:</Label>
                    <p className="font-medium text-[#271F18]">{ci?.cell_phone_country_code ? `+${ci.cell_phone_country_code} ` : ""}{ci?.cell_phone ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.email')}:</Label>
                    <p className="font-medium text-[#271F18]">{ci?.email_address ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.city')}:</Label>
                    <p className="font-medium text-[#271F18]">{ci?.city ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.stateProvince')}:</Label>
                    <p className="font-medium text-[#271F18]">{ci?.state_or_province ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.country')}:</Label>
                    <p className="font-medium text-[#271F18]">{ci?.country ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.zipCode')}:</Label>
                    <p className="font-medium text-[#271F18]">{ci?.zip_code ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.height')}:</Label>
                    <p className="font-medium text-[#271F18]">{ci?.height ?? "-"} cm</p>
                  </div>
                  <div>
                    <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.weight')}:</Label>
                    <p className="font-medium text-[#271F18]">{ci?.weight ?? "-"} kg</p>
                  </div>
                  <div>
                    <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.bmi')}:</Label>
                    <p className="font-medium text-[#271F18]">{ci?.bmi ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.ethnicity')}:</Label>
                    <p className="font-medium text-[#271F18]">{ci?.ethnicity_selected_key ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.surrogacyExperience')}:</Label>
                    <p className="font-medium text-[#271F18]">{ci?.surrogacy_experience_count ?? "-"} {t('surrogateProfileDetail.timesUnit')}</p>
                  </div>
                  <div>
                    <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.education')}:</Label>
                    <p className="font-medium text-[#271F18]">{ay?.education_level_selected_key ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.maritalStatus')}:</Label>
                    <p className="font-medium text-[#271F18]">{ay?.marital_status_selected_key ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.partnerSupport')}:</Label>
                    <p className="font-medium text-[#271F18]">{ay?.partner_support_selected_key ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.householdIncome')}:</Label>
                    <p className="font-medium text-[#271F18]">{ay?.household_income_selected_key ?? "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 孕产与健康 */}
          <Card className="bg-white border-[#E2E8F0] animate-slide-in-left">
            <CardHeader className="pb-4">
              <CardTitle className="text-[#271F18] text-lg font-medium">{t('surrogateProfileDetail.pregnancyHealth')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.hasGivenBirth')}:</Label>
                  <p className="font-medium text-[#271F18]">{ph?.has_given_birth ? t('yes') : t('no')}</p>
                </div>
                <div>
                  <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.isCurrentlyPregnant')}:</Label>
                  <p className="font-medium text-[#271F18]">{ph?.is_currently_pregnant ? t('yes') : t('no')}</p>
                </div>
                <div>
                  <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.isBreastfeeding')}:</Label>
                  <p className="font-medium text-[#271F18]">{ph?.is_breastfeeding ? t('yes') : t('no')}</p>
                </div>
                <div>
                  <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.hasStillbirth')}:</Label>
                  <p className="font-medium text-[#271F18]">{ph?.has_stillbirth ? t('yes') : t('no')}</p>
                </div>
                <div>
                  <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.healthConditions')}:</Label>
                  <p className="font-medium text-[#271F18]">{ph?.medical_conditions_selected_keys?.join(", ") ?? "-"}</p>
                </div>
                <div>
                  <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.isTakingMedications')}:</Label>
                  <p className="font-medium text-[#271F18]">{ph?.is_taking_medications ? t('yes') : t('no')}</p>
                </div>
                <div>
                  <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.medicationsList')}:</Label>
                  <p className="font-medium text-[#271F18]">{ph?.medications_list ?? "-"}</p>
                </div>
                <div>
                  <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.backgroundCheck')}:</Label>
                  <p className="font-medium text-[#271F18]">{ph?.background_check_status_selected_key ?? "-"}</p>
                </div>
              </div>
              <div className="mt-4">
                <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.pregnancyHistory')}:</Label>
                <ul className="list-disc ml-6">
                  {ph?.pregnancy_histories?.length ? ph.pregnancy_histories.map((h, idx) => (
                    <li key={idx} className="text-[#271F18] text-sm">
                      {h.delivery_date} | {h.delivery_method} | {h.number_of_babies} {t('surrogateProfileDetail.babiesUnit')} | {h.birth_weight}kg
                    </li>
                  )) : <li className="text-[#271F18] text-sm">-</li>}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 面试与其他信息 */}
          <div className="space-y-6">
            <Card className="bg-white border-[#E2E8F0] animate-slide-in-right">
              <CardHeader className="pb-4">
                <CardTitle className="text-[#271F18] text-lg font-medium flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {t('surrogateProfileDetail.interviewInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.languages')}:</Label>
                    <p className="font-medium text-[#271F18]">{interview?.languages_spoken ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.motivation')}:</Label>
                    <p className="font-medium text-[#271F18]">{interview?.motivation ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.selfIntroduction')}:</Label>
                    <p className="font-medium text-[#271F18]">{interview?.self_introduction ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-[#271F18] text-sm">{t('surrogateProfileDetail.contactPreference')}:</Label>
                    <p className="font-medium text-[#271F18]">{interview?.contact_preference ?? "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-[#E2E8F0] animate-slide-in-right" style={{ animationDelay: "200ms" }}>
              <CardHeader className="pb-4">
                <CardTitle className="text-[#271F18] text-lg font-medium flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t('surrogateProfileDetail.uploadedPhotos')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {surrogate.upload_photos?.length ? surrogate.upload_photos.map((photo, idx) => (
                    <div key={idx} className="w-24 h-24 rounded-lg overflow-hidden border border-[#E2E8F0] flex items-center justify-center bg-[#F5E6C8]">
                      <img src={photo.url} alt={photo.name} className="object-cover w-full h-full" />
                    </div>
                  )) : <span className="text-[#271F18]">{t('surrogateProfileDetail.noPhotos')}</span>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Medical Record 可扩展区块，可补充更多健康相关内容 */}
      </div>
    </ManagerLayout>
  )
}

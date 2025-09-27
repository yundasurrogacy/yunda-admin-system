"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useParams } from "next/navigation"
import { getSurrogateMotherById } from "@/lib/graphql/applications"
import type { SurrogateMother } from "@/types/surrogate_mother"
import { ChevronRight, User, MessageSquare, FileText, Calendar } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Label } from "../../../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
import { AdminLayout } from "../../../../components/admin-layout"

export default function SurrogateProfileDetailPage() {
  const router = useRouter()
  const { t, i18n } = useTranslation("common")
  const params = useParams<{ id: string }>()
  // 国际化由 i18n 控制，无需本地 language 状态
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

  if (loading) {
    return <div className="p-8 text-sage-600">{t('loading')}</div>
  }

  if (!surrogate) {
    return <div className="p-8 text-red-600">{t('notFoundSurrogate')}</div>
  }

  const ci = surrogate.contact_information
  const ph = surrogate.pregnancy_and_health
  const ay = surrogate.about_you
  const interview = surrogate.gestational_surrogacy_interview

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="mb-4">
          <Button variant="outline" onClick={() => router.push('/admin/surrogate-profiles')}>
            {t('backToSurrogateProfiles')}
          </Button>
        </div>
        <h1 className="text-3xl font-light text-sage-800 tracking-wide">{t('surrogateProfile')}</h1>
        {/* Basic Information */}
        <Card className="bg-white border-sage-200 animate-slide-in-up">
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium">{t('basicInformation')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-sage-600" />
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
                  <div>
                    <Label className="text-sage-600 text-sm">{t('name')}:</Label>
                    <p className="font-medium text-sage-800">{ci ? `${ci.first_name || ""} ${ci.last_name || ""}`.trim() : surrogate.id}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{t('dateOfBirth')}:</Label>
                    <p className="font-medium text-sage-800">{ci?.date_of_birth ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{t('phone')}:</Label>
                    <p className="font-medium text-sage-800">{ci?.cell_phone_country_code ? `+${ci.cell_phone_country_code} ` : ""}{ci?.cell_phone ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{t('email')}:</Label>
                    <p className="font-medium text-sage-800">{ci?.email_address ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{t('city')}:</Label>
                    <p className="font-medium text-sage-800">{ci?.city ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{t('stateOrProvince')}:</Label>
                    <p className="font-medium text-sage-800">{ci?.state_or_province ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{t('country')}:</Label>
                    <p className="font-medium text-sage-800">{ci?.country ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{t('zipCode')}:</Label>
                    <p className="font-medium text-sage-800">{ci?.zip_code ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{t('height')}:</Label>
                    <p className="font-medium text-sage-800">{ci?.height ?? "-"} cm</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{t('weight')}:</Label>
                    <p className="font-medium text-sage-800">{ci?.weight ?? "-"} kg</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{t('bmi')}:</Label>
                    <p className="font-medium text-sage-800">{ci?.bmi ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{t('ethnicity')}:</Label>
                    <p className="font-medium text-sage-800">{ci?.ethnicity_selected_key ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{t('surrogacyExperience')}:</Label>
                    <p className="font-medium text-sage-800">{ci?.surrogacy_experience_count ?? "-"} {t('times')}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{t('education')}:</Label>
                    <p className="font-medium text-sage-800">{ay?.education_level_selected_key ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{t('maritalStatus')}:</Label>
                    <p className="font-medium text-sage-800">{ay?.marital_status_selected_key ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{t('partnerSupport')}:</Label>
                    <p className="font-medium text-sage-800">{ay?.partner_support_selected_key ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{t('householdIncome')}:</Label>
                    <p className="font-medium text-sage-800">{ay?.household_income_selected_key ?? "-"}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pregnancy & Health */}
          <Card className="bg-white border-sage-200 animate-slide-in-left">
            <CardHeader className="pb-4">
              <CardTitle className="text-sage-800 text-lg font-medium">{t('pregnancyHealth')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sage-600 text-sm">{t('hasGivenBirth')}:</Label>
                  <p className="font-medium text-sage-800">{ph?.has_given_birth ? t('yes') : t('no')}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">{t('isCurrentlyPregnant')}:</Label>
                  <p className="font-medium text-sage-800">{ph?.is_currently_pregnant ? t('yes') : t('no')}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">{t('isBreastfeeding')}:</Label>
                  <p className="font-medium text-sage-800">{ph?.is_breastfeeding ? t('yes') : t('no')}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">{t('hasStillbirth')}:</Label>
                  <p className="font-medium text-sage-800">{ph?.has_stillbirth ? t('yes') : t('no')}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">{t('medicalConditions')}:</Label>
                  <p className="font-medium text-sage-800">{ph?.medical_conditions_selected_keys?.join(", ") ?? "-"}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">{t('isTakingMedications')}:</Label>
                  <p className="font-medium text-sage-800">{ph?.is_taking_medications ? t('yes') : t('no')}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">{t('medicationsList')}:</Label>
                  <p className="font-medium text-sage-800">{ph?.medications_list ?? "-"}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">{t('backgroundCheckStatus')}:</Label>
                  <p className="font-medium text-sage-800">{ph?.background_check_status_selected_key ?? "-"}</p>
                </div>
              </div>
              <div className="mt-4">
                <Label className="text-sage-600 text-sm">{t('pregnancyHistories')}:</Label>
                <ul className="list-disc ml-6">
                  {ph?.pregnancy_histories?.length ? ph.pregnancy_histories.map((h, idx) => (
                    <li key={idx} className="text-sage-600 text-sm">
                      {h.delivery_date} | {h.delivery_method} | {h.number_of_babies} {t('babies')} | {h.birth_weight}kg
                    </li>
                  )) : <li className="text-sage-600 text-sm">-</li>}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Interview & Other Info */}
          <div className="space-y-6">
            <Card className="bg-white border-sage-200 animate-slide-in-right">
              <CardHeader className="pb-4">
                <CardTitle className="text-sage-800 text-lg font-medium flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {t('interview')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sage-600 text-sm">{t('languagesSpoken')}:</Label>
                    <p className="font-medium text-sage-800">{interview?.languages_spoken ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{t('motivation')}:</Label>
                    <p className="font-medium text-sage-800">{interview?.motivation ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{t('selfIntroduction')}:</Label>
                    <p className="font-medium text-sage-800">{interview?.self_introduction ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">{t('contactPreference')}:</Label>
                    <p className="font-medium text-sage-800">{interview?.contact_preference ?? "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-sage-200 animate-slide-in-right" style={{ animationDelay: "200ms" }}>
              <CardHeader className="pb-4">
                <CardTitle className="text-sage-800 text-lg font-medium flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t('uploadPhotos')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {surrogate.upload_photos?.length ? surrogate.upload_photos.map((photo, idx) => (
                    <div key={idx} className="w-24 h-24 rounded-lg overflow-hidden border border-sage-200 flex items-center justify-center bg-sage-50">
                      <img src={photo.url} alt={photo.name} className="object-cover w-full h-full" />
                    </div>
                  )) : <span className="text-sage-600">{t('noPhotosUploaded')}</span>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Medical Record 可扩展区块，可补充更多健康相关内容 */}
      </div>
    </AdminLayout>
  )
}

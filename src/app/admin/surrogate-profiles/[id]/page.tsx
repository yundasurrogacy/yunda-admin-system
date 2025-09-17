"use client"

import { useState, useEffect } from "react"
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
  const params = useParams<{ id: string }>()
  const [language, setLanguage] = useState<"EN" | "CN">("EN")
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
    return <div className="p-8 text-sage-600">加载中...</div>
  }

  if (!surrogate) {
    return <div className="p-8 text-red-600">未找到该代孕母信息</div>
  }

  const ci = surrogate.contact_information
  const ph = surrogate.pregnancy_and_health
  const ay = surrogate.about_you
  const interview = surrogate.gestational_surrogacy_interview

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-light text-sage-800 tracking-wide">Surrogate Profile</h1>
        {/* Basic Information */}
        <Card className="bg-white border-sage-200 animate-slide-in-up">
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium">Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-sage-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-sage-600" />
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
                  <div>
                    <Label className="text-sage-600 text-sm">Name:</Label>
                    <p className="font-medium text-sage-800">{ci ? `${ci.first_name || ""} ${ci.last_name || ""}`.trim() : surrogate.id}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">Date of Birth:</Label>
                    <p className="font-medium text-sage-800">{ci?.date_of_birth ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">Phone:</Label>
                    <p className="font-medium text-sage-800">{ci?.cell_phone_country_code ? `+${ci.cell_phone_country_code} ` : ""}{ci?.cell_phone ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">Email:</Label>
                    <p className="font-medium text-sage-800">{ci?.email_address ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">City:</Label>
                    <p className="font-medium text-sage-800">{ci?.city ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">State/Province:</Label>
                    <p className="font-medium text-sage-800">{ci?.state_or_province ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">Country:</Label>
                    <p className="font-medium text-sage-800">{ci?.country ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">Zip Code:</Label>
                    <p className="font-medium text-sage-800">{ci?.zip_code ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">Height:</Label>
                    <p className="font-medium text-sage-800">{ci?.height ?? "-"} cm</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">Weight:</Label>
                    <p className="font-medium text-sage-800">{ci?.weight ?? "-"} kg</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">BMI:</Label>
                    <p className="font-medium text-sage-800">{ci?.bmi ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">Ethnicity:</Label>
                    <p className="font-medium text-sage-800">{ci?.ethnicity_selected_key ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">Surrogacy Experience:</Label>
                    <p className="font-medium text-sage-800">{ci?.surrogacy_experience_count ?? "-"} times</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">Education:</Label>
                    <p className="font-medium text-sage-800">{ay?.education_level_selected_key ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">Marital Status:</Label>
                    <p className="font-medium text-sage-800">{ay?.marital_status_selected_key ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">Partner Support:</Label>
                    <p className="font-medium text-sage-800">{ay?.partner_support_selected_key ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">Household Income:</Label>
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
              <CardTitle className="text-sage-800 text-lg font-medium">Pregnancy & Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sage-600 text-sm">Has Given Birth:</Label>
                  <p className="font-medium text-sage-800">{ph?.has_given_birth ? "Yes" : "No"}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">Is Currently Pregnant:</Label>
                  <p className="font-medium text-sage-800">{ph?.is_currently_pregnant ? "Yes" : "No"}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">Is Breastfeeding:</Label>
                  <p className="font-medium text-sage-800">{ph?.is_breastfeeding ? "Yes" : "No"}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">Has Stillbirth:</Label>
                  <p className="font-medium text-sage-800">{ph?.has_stillbirth ? "Yes" : "No"}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">Medical Conditions:</Label>
                  <p className="font-medium text-sage-800">{ph?.medical_conditions_selected_keys?.join(", ") ?? "-"}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">Is Taking Medications:</Label>
                  <p className="font-medium text-sage-800">{ph?.is_taking_medications ? "Yes" : "No"}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">Medications List:</Label>
                  <p className="font-medium text-sage-800">{ph?.medications_list ?? "-"}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">Background Check Status:</Label>
                  <p className="font-medium text-sage-800">{ph?.background_check_status_selected_key ?? "-"}</p>
                </div>
              </div>
              <div className="mt-4">
                <Label className="text-sage-600 text-sm">Pregnancy Histories:</Label>
                <ul className="list-disc ml-6">
                  {ph?.pregnancy_histories?.length ? ph.pregnancy_histories.map((h, idx) => (
                    <li key={idx} className="text-sage-600 text-sm">
                      {h.delivery_date} | {h.delivery_method} | {h.number_of_babies} babies | {h.birth_weight}kg
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
                  Interview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sage-600 text-sm">Languages Spoken:</Label>
                    <p className="font-medium text-sage-800">{interview?.languages_spoken ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">Motivation:</Label>
                    <p className="font-medium text-sage-800">{interview?.motivation ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">Self Introduction:</Label>
                    <p className="font-medium text-sage-800">{interview?.self_introduction ?? "-"}</p>
                  </div>
                  <div>
                    <Label className="text-sage-600 text-sm">Contact Preference:</Label>
                    <p className="font-medium text-sage-800">{interview?.contact_preference ?? "-"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-sage-200 animate-slide-in-right" style={{ animationDelay: "200ms" }}>
              <CardHeader className="pb-4">
                <CardTitle className="text-sage-800 text-lg font-medium flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upload Photos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {surrogate.upload_photos?.length ? surrogate.upload_photos.map((photo, idx) => (
                    <div key={idx} className="w-24 h-24 rounded-lg overflow-hidden border border-sage-200 flex items-center justify-center bg-sage-50">
                      <img src={photo.url} alt={photo.name} className="object-cover w-full h-full" />
                    </div>
                  )) : <span className="text-sage-600">No photos uploaded</span>}
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

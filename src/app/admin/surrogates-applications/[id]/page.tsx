"use client"

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Heart, FileText, CheckCircle, XCircle, Clock, Activity, Baby, Shield, MessageSquare } from 'lucide-react'
// import { AdminLayout } from '../../../../components/admin-layout'
import { PageHeader, PageContent } from '@/components/ui/page-layout'
import { CustomButton } from '@/components/ui/CustomButton'
import { Badge } from '@/components/ui/badge'
import { getApplicationById, updateApplicationStatus } from '@/lib/graphql/applications'
import { exportDetailToExcel, exportDetailToPdf, type DetailExportRow } from '@/lib/exports/applications'
import type { Application, ApplicationStatus } from '@/types/applications'
import { useTranslation } from 'react-i18next'
import { formatBooleanLabel } from '@/lib/utils'

// 简单全屏图片预览组件
function ImagePreviewModal({ open, images, current, onClose, t }: { open: boolean, images: {url: string, name?: string}[], current: number, onClose: () => void, t: any }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80" onClick={onClose}>
      <img
        src={images[current]?.url}
        alt={images[current]?.name || `photo-${current + 1}`}
        className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-2xl border-4 border-white"
        onClick={e => e.stopPropagation()}
      />
      <button
        className="absolute top-6 right-8 text-white text-3xl font-bold cursor-pointer bg-black bg-opacity-40 rounded-full px-3 py-1 hover:bg-opacity-70"
        onClick={onClose}
        aria-label={t('close', 'Close')}
      >×</button>
    </div>
  );
}

interface FieldRow {
  label: string
  value: string
}

interface FieldConfig {
  key: string
  label: string
  type?: 'boolean' | 'text'
  hideWhenEmpty?: boolean
}

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

// 提取辅助函数到组件外部，避免每次渲染重新创建
function getStatusColor(status: ApplicationStatus): string {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'approved':
      return 'bg-green-100 text-green-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-sage-100 text-sage-800'
  }
}

function calculateAge(dateOfBirth: string): string | number {
  if (!dateOfBirth) return 0
  const today = new Date()
  const birthDate = new Date(dateOfBirth)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// 为避免 Hooks 顺序问题，在组件外实现导出行构建，供顶层 useMemo 无条件调用
function buildSurrogateDetailExportRows(
  _application: Application,
  parsedData: { appData: any; gc: any; isGcIntake: boolean; contactInfo: any; aboutYou: any; pregnancyHealth: any; interview: any; pregnancyHistories: any },
  t: (key: string, opts?: { defaultValue?: string }) => string,
): DetailExportRow[] {
  const rows: DetailExportRow[] = []
  const pushRows = (section: string, data: FieldRow[]) => {
    if (!data.length) {
      rows.push({ section, label: t('notAvailable', { defaultValue: 'N/A' }), value: t('notAvailable', { defaultValue: 'N/A' }) })
      return
    }
    data.forEach(item => {
      rows.push({ section, label: item.label, value: item.value || t('notAvailable', { defaultValue: 'N/A' }) })
    })
  }
  const gc = parsedData.gc
  const g = gc?.general_info ?? {}
  const pb = gc?.pregnancy_birth_history ?? {}
  const gcLabel = (key: string, fallback: string) => t(key, { defaultValue: fallback })
  const fallbackValue = t('notAvailable', { defaultValue: 'N/A' })
  const yesNo = (value?: boolean | null) => formatBooleanLabel(value ?? null, t as any)
  const pushRow = (arr: FieldRow[], label: string, value?: string | number | null, options?: { useFallback?: boolean }) => {
    const shouldFallback = options?.useFallback ?? false
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
      if (!shouldFallback) return
      arr.push({ label, value: fallbackValue })
      return
    }
    arr.push({ label, value: typeof value === 'string' ? value.trim() : String(value) })
  }
  const buildRowsFromConfig = (config: FieldConfig[], source: Record<string, any>) => {
    const out: FieldRow[] = []
    config.forEach(({ key, label, type, hideWhenEmpty }) => {
      const raw = source?.[key]
      if (type === 'boolean') {
        const formatted = yesNo(typeof raw === 'boolean' ? raw : null)
        pushRow(out, label, formatted, { useFallback: !hideWhenEmpty })
      } else {
        pushRow(out, label, raw, { useFallback: !hideWhenEmpty })
      }
    })
    return out
  }

  const occupationMap: Record<string, string> = {
    employed: gcLabel('surrogate.application.gcIntake.occupationEmployed', 'Employed (please specify)'),
    stay_at_home: gcLabel('surrogate.application.gcIntake.occupationStayAtHome', 'Stay-at-home parent'),
    unemployed: gcLabel('surrogate.application.gcIntake.occupationUnemployed', 'Unemployed (please specify financial situation)'),
  }
  const maritalMap: Record<string, string> = {
    married: gcLabel('surrogate.application.gcIntake.maritalMarried', 'Married'),
    single: gcLabel('surrogate.application.gcIntake.maritalSingle', 'Single'),
    cohabitating: gcLabel('surrogate.application.gcIntake.maritalCohabitating', 'Cohabitating'),
    divorced: gcLabel('surrogate.application.gcIntake.maritalDivorced', 'Divorced'),
  }
  const gcPhone = [g.country_code, g.phone].filter(Boolean).join(' ').trim()
  const gcHeight = g.height_feet ? `${g.height_feet}'${g.height_inches || 0}"` : ''
  const gcWeight = g.weight ? `${g.weight} lbs` : ''

  const generalInfoRows: FieldRow[] = []
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.fullName', 'Full Name'), g.full_name, { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.email', 'Email Address'), g.email, { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.phone', 'Phone Number'), gcPhone, { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.dob', 'Date of Birth'), g.dob, { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.stateOfResidence', 'Current State of Residence'), g.state_of_residence, { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.placeOfBirth', 'Place of Birth'), g.place_of_birth, { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.homeAddress', 'Home Address'), g.home_address, { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.heightWeight', 'Height / Weight'), gcHeight, { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.form.weight', 'Weight'), gcWeight, { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.bmi', 'BMI'), g.bmi, { useFallback: true })
  const occupationTypeLabel = g.occupation_type ? (occupationMap[g.occupation_type] || g.occupation_type) : ''
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.occupationSource', 'Occupation or Source of Income'), occupationTypeLabel, { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.occupationSource', 'Occupation Detail'), g.occupation_specify)
  const maritalStatusLabel = g.marital_status ? (maritalMap[g.marital_status] || g.marital_status) : ''
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.maritalStatus', 'Marital Status'), maritalStatusLabel, { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.singlePartnerInfo', 'Single Partner Info'), g.single_partner_info)
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.usCitizenOrResident', 'U.S. Citizen or Resident?'), yesNo(typeof g.us_citizen_or_resident === 'boolean' ? g.us_citizen_or_resident : null), { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.ethnicity.label', 'Ethnicity'), g.ethnicity, { useFallback: true })

  const pregnancyBirthRows: FieldRow[] = []
  pushRow(pregnancyBirthRows, gcLabel('surrogate.application.gcIntake.totalChildren', 'Total number of children'), pb.total_children, { useFallback: true })
  pushRow(pregnancyBirthRows, gcLabel('surrogate.application.gcIntake.totalVaginal', 'Total vaginal deliveries'), pb.total_vaginal, { useFallback: true })
  pushRow(pregnancyBirthRows, gcLabel('surrogate.application.gcIntake.totalCSections', 'Total C-sections'), pb.total_c_sections, { useFallback: true })
  pushRow(pregnancyBirthRows, gcLabel('surrogate.application.gcIntake.miscarriages', 'History of miscarriage(s)?'), yesNo(typeof pb.miscarriages === 'boolean' ? pb.miscarriages : null), { useFallback: true })
  pushRow(pregnancyBirthRows, gcLabel('surrogate.application.gcIntake.miscarriagesDetail', 'When and reason(s)'), pb.miscarriages_detail)
  pushRow(pregnancyBirthRows, gcLabel('surrogate.application.gcIntake.abortions', 'History of abortion(s)?'), yesNo(typeof pb.abortions === 'boolean' ? pb.abortions : null), { useFallback: true })
  pushRow(pregnancyBirthRows, gcLabel('surrogate.application.gcIntake.abortionsDetail', 'When and reason(s)'), pb.abortions_detail)
  pushRow(pregnancyBirthRows, gcLabel('surrogate.application.gcIntake.beenSurrogateBefore', 'Been surrogate before?'), yesNo(typeof pb.been_surrogate_before === 'boolean' ? pb.been_surrogate_before : null), { useFallback: true })
  pushRow(pregnancyBirthRows, gcLabel('surrogate.application.gcIntake.beenSurrogateWhen', 'When (if yes)'), pb.been_surrogate_when)

  const pregnancyMedicalConfig: FieldConfig[] = [
    { key: 'anemia', label: gcLabel('surrogate.application.gcIntake.anemia', 'Anemia?'), type: 'boolean' },
    { key: 'severe_vomiting_3mo', label: gcLabel('surrogate.application.gcIntake.severeVomiting3mo', 'Severe vomiting lasting more than 3 months?'), type: 'boolean' },
    { key: 'bp_during_pregnancy', label: gcLabel('surrogate.application.gcIntake.bpDuringPregnancy', 'Usual blood pressure during pregnancy') },
    { key: 'preeclampsia', label: gcLabel('surrogate.application.gcIntake.preeclampsia', 'Pre-eclampsia?'), type: 'boolean' },
    { key: 'gestational_diabetes', label: gcLabel('surrogate.application.gcIntake.gestationalDiabetes', 'Gestational diabetes?'), type: 'boolean' },
    { key: 'hypertension_pregnancy', label: gcLabel('surrogate.application.gcIntake.hypertensionPregnancy', 'Hypertension during pregnancy?'), type: 'boolean' },
    { key: 'blood_transfusion', label: gcLabel('surrogate.application.gcIntake.bloodTransfusion', 'Blood transfusion during pregnancy?'), type: 'boolean' },
    { key: 'seizures', label: gcLabel('surrogate.application.gcIntake.seizures', 'Seizures?'), type: 'boolean' },
  ]
  const medicalHealthConfig: FieldConfig[] = [
    { key: 'regular_menstrual_cycles', label: gcLabel('surrogate.application.gcIntake.regularMenstrualCycles', 'Regular menstrual cycles?'), type: 'boolean' },
    { key: 'birth_control', label: gcLabel('surrogate.application.gcIntake.birthControl', 'Currently using birth control?'), type: 'boolean' },
    { key: 'birth_control_type', label: gcLabel('surrogate.application.gcIntake.birthControlType', 'Birth control type'), hideWhenEmpty: true },
    { key: 'taking_medications', label: gcLabel('surrogate.application.gcIntake.takingMedications', 'Taking medications?'), type: 'boolean' },
    { key: 'medications_list', label: gcLabel('surrogate.application.gcIntake.medicationsList', 'Medications list'), hideWhenEmpty: true },
    { key: 'last_pap_smear', label: gcLabel('surrogate.application.gcIntake.lastPapSmear', 'Date of last Pap smear') },
    { key: 'covid_vaccinated', label: gcLabel('surrogate.application.gcIntake.covidVaccinated', 'COVID-19 vaccinated?'), type: 'boolean' },
    { key: 'hep_b_vaccinated', label: gcLabel('surrogate.application.gcIntake.hepBVaccinated', 'Hepatitis B vaccinated?'), type: 'boolean' },
    { key: 'varicella_vaccinated', label: gcLabel('surrogate.application.gcIntake.varicellaVaccinated', 'Varicella vaccinated?'), type: 'boolean' },
    { key: 'ongoing_medical_treatment', label: gcLabel('surrogate.application.gcIntake.ongoingMedicalTreatment', 'Receiving ongoing medical treatment?'), type: 'boolean' },
    { key: 'surgeries_past_2y', label: gcLabel('surrogate.application.gcIntake.surgeriesPast2y', 'Surgeries in past 2 years?'), type: 'boolean' },
    { key: 'surgeries_specify', label: gcLabel('surrogate.application.gcIntake.surgeriesSpecify', 'Surgeries (specify)'), hideWhenEmpty: true },
  ]
  const mentalHealthConfig: FieldConfig[] = [
    { key: 'anxiety_depression', label: gcLabel('surrogate.application.gcIntake.anxietyDepression', 'Anxiety or depression?'), type: 'boolean' },
    { key: 'bipolar_schizo_personality', label: gcLabel('surrogate.application.gcIntake.bipolarSchizoPersonality', 'Bipolar / schizophrenia / personality disorder?'), type: 'boolean' },
    { key: 'adhd', label: gcLabel('surrogate.application.gcIntake.adhd', 'ADHD?'), type: 'boolean' },
    { key: 'meds_anxiety_depression', label: gcLabel('surrogate.application.gcIntake.medsAnxietyDepression', 'Taking medication for anxiety/depression?'), type: 'boolean' },
    { key: 'meds_specify', label: gcLabel('surrogate.application.gcIntake.medsSpecify', 'Medication details'), hideWhenEmpty: true },
  ]
  const substanceUseConfig: FieldConfig[] = [
    { key: 'drug_use_pregnancy', label: gcLabel('surrogate.application.gcIntake.drugUsePregnancy', 'Drug use during pregnancy?'), type: 'boolean' },
    { key: 'marijuana_current', label: gcLabel('surrogate.application.gcIntake.marijuanaCurrent', 'Currently smoke marijuana?'), type: 'boolean' },
    { key: 'marijuana_last_use', label: gcLabel('surrogate.application.gcIntake.marijuanaLastUse', 'Date of last marijuana use'), hideWhenEmpty: true },
    { key: 'smoked_vaped_pregnancy', label: gcLabel('surrogate.application.gcIntake.smokedVapedPregnancy', 'Smoked or vaped during pregnancy?'), type: 'boolean' },
    { key: 'alcohol', label: gcLabel('surrogate.application.gcIntake.alcohol', 'Drink alcohol?'), type: 'boolean' },
    { key: 'alcohol_frequency', label: gcLabel('surrogate.application.gcIntake.alcoholFrequency', 'Alcohol frequency'), hideWhenEmpty: true },
  ]
  const infectiousConfig: FieldConfig[] = [
    { key: 'syphilis', label: gcLabel('surrogate.application.gcIntake.syphilis', 'Syphilis'), type: 'boolean' },
    { key: 'hepatitis_b_c', label: gcLabel('surrogate.application.gcIntake.hepatitisBC', 'Hepatitis B or C'), type: 'boolean' },
    { key: 'genital_herpes', label: gcLabel('surrogate.application.gcIntake.genitalHerpes', 'Genital herpes'), type: 'boolean' },
    { key: 'hiv', label: gcLabel('surrogate.application.gcIntake.hiv', 'HIV / AIDS'), type: 'boolean' },
  ]
  const otherMedicalConfig: FieldConfig[] = [
    { key: 'asthma', label: gcLabel('surrogate.application.gcIntake.asthma', 'Asthma?'), type: 'boolean' },
    { key: 'asthma_inhaler_per_week', label: gcLabel('surrogate.application.gcIntake.asthmaInhaler', 'Inhaler use per week'), hideWhenEmpty: true },
    { key: 'heart_conditions', label: gcLabel('surrogate.application.gcIntake.heartConditions', 'Heart conditions?'), type: 'boolean' },
    { key: 'cancer_history', label: gcLabel('surrogate.application.gcIntake.cancerHistory', 'History of cancer?'), type: 'boolean' },
    { key: 'scoliosis', label: gcLabel('surrogate.application.gcIntake.scoliosis', 'Scoliosis?'), type: 'boolean' },
    { key: 'endometrial_ablation', label: gcLabel('surrogate.application.gcIntake.endometrialAblation', 'Endometrial ablation history?'), type: 'boolean' },
  ]
  const preferencesConfig: FieldConfig[] = [
    { key: 'availability', label: gcLabel('surrogate.application.gcIntake.availability', 'Availability to proceed') },
    { key: 'health_insurance', label: gcLabel('surrogate.application.gcIntake.healthInsurance', 'Health insurance coverage') },
    { key: 'open_twins', label: gcLabel('surrogate.application.gcIntake.openTwins', 'Open to carrying twins?'), type: 'boolean' },
    { key: 'open_fetal_reduction', label: gcLabel('surrogate.application.gcIntake.openFetalReduction', 'Open to fetal reduction?'), type: 'boolean' },
    { key: 'open_termination', label: gcLabel('surrogate.application.gcIntake.openTermination', 'Open to termination if medically indicated?'), type: 'boolean' },
    { key: 'open_amniocentesis_cvs', label: gcLabel('surrogate.application.gcIntake.openAmniocentesisCVS', 'Open to amniocentesis / CVS testing?'), type: 'boolean' },
    { key: 'open_same_sex_single_ip', label: gcLabel('surrogate.application.gcIntake.openSameSexSingleIP', 'Open to same-sex or single intended parents?'), type: 'boolean' },
    { key: 'willing_pump_breast_milk', label: gcLabel('surrogate.application.gcIntake.willingPumpBreastMilk', 'Willing to pump breast milk?'), type: 'boolean' },
    { key: 'open_ip_hiv', label: gcLabel('surrogate.application.gcIntake.openIPHIV', 'Open to intended parents with HIV?'), type: 'boolean' },
    { key: 'open_ip_hepatitis_b', label: gcLabel('surrogate.application.gcIntake.openIPHepatitisB', 'Open to intended parents with Hepatitis B?'), type: 'boolean' },
  ]
  const legalConfig: FieldConfig[] = [
    { key: 'pending_legal', label: gcLabel('surrogate.application.gcIntake.pendingLegal', 'Pending legal claims or lawsuits?'), type: 'boolean' },
    { key: 'criminal_record', label: gcLabel('surrogate.application.gcIntake.criminalRecord', 'Criminal record?'), type: 'boolean' },
    { key: 'emergency_contact', label: gcLabel('surrogate.application.gcIntake.emergencyContact', 'Emergency contact'), hideWhenEmpty: false },
    { key: 'government_assistance', label: gcLabel('surrogate.application.gcIntake.governmentAssistance', 'Receiving government assistance?'), type: 'boolean' },
  ]

  const pregnancyMedicalRows = buildRowsFromConfig(pregnancyMedicalConfig, gc?.pregnancy_medical ?? {})
  const medicalHealthRows = buildRowsFromConfig(medicalHealthConfig, gc?.medical_health ?? {})
  const mentalHealthRows = buildRowsFromConfig(mentalHealthConfig, gc?.mental_health ?? {})
  const substanceUseRows = buildRowsFromConfig(substanceUseConfig, gc?.substance_use ?? {})
  const infectiousRows = buildRowsFromConfig(infectiousConfig, gc?.infectious_disease ?? {})
  const otherMedicalRows = buildRowsFromConfig(otherMedicalConfig, gc?.other_medical ?? {})
  const preferencesRows = buildRowsFromConfig(preferencesConfig, gc?.preferences ?? {})
  const legalRows = buildRowsFromConfig(legalConfig, gc?.legal_admin ?? {})

  const medicalRecordsSourceMap: Record<string, string> = {
    patient_portal: gcLabel('surrogate.application.gcIntake.medicalRecordsPatientPortal', 'Patient Portal'),
    clinic: gcLabel('surrogate.application.gcIntake.medicalRecordsClinic', 'Clinic'),
    other: gcLabel('surrogate.application.gcIntake.medicalRecordsOther', 'Other'),
  }
  const notesRows: FieldRow[] = []
  pushRow(notesRows, gcLabel('surrogate.application.gcIntake.referredBy', 'Referred by'), gc?.notes?.referred_by, { useFallback: true })
  const medicalSourceKey = gc?.notes?.medical_records_source
  const medicalSourceLabel = medicalSourceKey ? (medicalRecordsSourceMap[medicalSourceKey] || medicalSourceKey) : ''
  pushRow(notesRows, gcLabel('surrogate.application.gcIntake.medicalRecordsSource', 'Medical records source'), medicalSourceLabel, { useFallback: true })

  const substanceSources = gc?.substance_use || {}
  if (substanceSources.drug_use_pregnancy) {
    const drugSelections: string[] = []
    if (substanceSources.drug_marijuana) drugSelections.push(gcLabel('surrogate.application.gcIntake.drugMarijuana', 'Marijuana'))
    if (substanceSources.drug_fentanyl) drugSelections.push(gcLabel('surrogate.application.gcIntake.drugFentanyl', 'Fentanyl'))
    if (substanceSources.drug_methamphetamine) drugSelections.push(gcLabel('surrogate.application.gcIntake.drugMethamphetamine', 'Methamphetamine'))
    if (substanceSources.drug_mdma) drugSelections.push(gcLabel('surrogate.application.gcIntake.drugMDMA', 'MDMA (Molly)'))
    if (substanceSources.drug_other) drugSelections.push(substanceSources.drug_other)
    if (drugSelections.length) pushRow(substanceUseRows, gcLabel('surrogate.application.gcIntake.drugTypes', 'Drug types'), drugSelections.join(', '))
  }

  const deliveryHistory = Array.isArray(gc?.delivery_history) ? gc.delivery_history : []

  pushRows(gcLabel('surrogate.application.gcIntake.sections.generalInfo', 'I. General Information'), generalInfoRows)
  pushRows(gcLabel('surrogate.application.gcIntake.sections.pregnancyBirthHistory', 'II. Pregnancy & Birth History'), pregnancyBirthRows)
  if (deliveryHistory.length) {
    deliveryHistory.forEach((delivery: any, idx: number) => {
      rows.push({
        section: gcLabel('surrogate.application.gcIntake.sections.deliveryHistory', 'III. Delivery History'),
        label: gcLabel('surrogate.application.gcIntake.babyNum', 'Baby #{n}').replace('{n}', String(idx + 1)),
        value: [delivery.delivery_date, delivery.gender, delivery.birth_weight, delivery.number_of_weeks, delivery.delivery_type, delivery.hospital].filter(Boolean).join(' • ') || t('notAvailable', { defaultValue: 'N/A' }),
      })
    })
  } else {
    rows.push({
      section: gcLabel('surrogate.application.gcIntake.sections.deliveryHistory', 'III. Delivery History'),
      label: t('notAvailable', { defaultValue: 'N/A' }),
      value: t('notAvailable', { defaultValue: 'N/A' }),
    })
  }
  pushRows(gcLabel('surrogate.application.gcIntake.sections.pregnancyMedical', 'IV. Pregnancy-Related Medical History'), pregnancyMedicalRows)
  pushRows(gcLabel('surrogate.application.gcIntake.sections.medicalHealth', 'V. Medical & Health History'), medicalHealthRows)
  pushRows(gcLabel('surrogate.application.gcIntake.sections.mentalHealth', 'VI. Mental Health History'), mentalHealthRows)
  pushRows(gcLabel('surrogate.application.gcIntake.sections.substanceUse', 'VII. Substance Use History'), substanceUseRows)
  pushRows(gcLabel('surrogate.application.gcIntake.sections.infectiousDisease', 'VIII. Infectious Disease History'), infectiousRows)
  pushRows(gcLabel('surrogate.application.gcIntake.sections.otherMedical', 'IX. Other Medical Conditions'), otherMedicalRows)
  pushRows(gcLabel('surrogate.application.gcIntake.sections.preferences', 'X. Preferences & Matching Considerations'), preferencesRows)
  pushRows(gcLabel('surrogate.application.gcIntake.sections.legalAdmin', 'XI. Legal & Administrative'), legalRows)
  pushRows(gcLabel('surrogate.application.gcIntake.sections.notes', 'XII. Notes / Internal Use'), notesRows)

  return rows
}

export default function SurrogateApplicationDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [language, setLanguage] = useState<"en" | "cn">("cn")
  const [application, setApplication] = useState<Application | null>(null)
  const [loading, setLoading] = useState(true)
  const { t, i18n } = useTranslation('common')
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  // 图片预览相关 state
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewIndex, setPreviewIndex] = useState(0)

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
    const handleLangChange = (lng: string) => {
      setLanguage(lng === 'zh-CN' ? 'cn' : 'en')
    }
    i18n.on('languageChanged', handleLangChange)
    setLanguage(i18n.language === 'zh-CN' ? 'cn' : 'en')
    return () => {
      i18n.off('languageChanged', handleLangChange)
    }
  }, [i18n])

  // 使用 useCallback 缓存数据加载函数
  const loadApplication = useCallback(async (id: number) => {
    try {
      setLoading(true)
      const data = await getApplicationById(id)
      console.log('Loaded application:', data)
      setApplication(data)
    } catch (error) {
      console.error('Failed to load application:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // 只在认证后才加载数据
    if (params.id && isAuthenticated) {
      loadApplication(Number(params.id))
    }
  }, [params.id, isAuthenticated, loadApplication])

  // 使用 useCallback 缓存状态更新函数
  const handleStatusUpdate = useCallback(async (newStatus: ApplicationStatus) => {
    if (!application) return
    
    try {
      await updateApplicationStatus(application.id, newStatus)
      await loadApplication(application.id) // 重新加载数据
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }, [application, loadApplication])

  // 使用 useCallback 缓存事件处理函数
  const handleBack = useCallback(() => {
    router.back()
  }, [router])

  const handleApprove = useCallback(() => {
    handleStatusUpdate('approved')
  }, [handleStatusUpdate])

  const handleReject = useCallback(() => {
    handleStatusUpdate('rejected')
  }, [handleStatusUpdate])

  const handleDelete = useCallback(async () => {
    if (!application)
      return
    const confirmed = window.confirm(t('confirmDeleteApplication', { defaultValue: 'Delete this application?' }))
    if (!confirmed)
      return
    try {
      const response = await fetch(`/api/applications?id=${application.id}`, { method: 'DELETE' })
      if (!response.ok)
        throw new Error(await response.text())
      window.alert(t('deleteSuccess', { defaultValue: 'Application deleted successfully.' }))
      router.push('/admin/surrogates-applications')
    }
    catch (error) {
      console.error('Failed to delete application:', error)
      window.alert(t('deleteFailed', { defaultValue: 'Failed to delete application, please try again.' }))
    }
  }, [application, router, t])

  // 图片预览处理函数
  const handlePreviewOpen = useCallback((index: number) => {
    setPreviewIndex(index);
    setPreviewOpen(true);
  }, []);

  const handlePreviewClose = useCallback(() => {
    setPreviewOpen(false);
  }, []);

  const parsedData = useMemo(() => {
    if (!application) return null
    const appData = application.application_data as any
    const gc = appData?.gc_intake
    const contactInfo = appData?.contact_information || {}
    const aboutYou = appData?.about_you || {}
    const pregnancyHealth = appData?.pregnancy_and_health || {}
    const interview = appData?.gestational_surrogacy_interview || {}
    const pregnancyHistories = pregnancyHealth?.pregnancy_histories || []
    return {
      appData,
      gc,
      isGcIntake: !!gc,
      contactInfo,
      aboutYou,
      pregnancyHealth,
      interview,
      pregnancyHistories,
    }
  }, [application])

  const formattedData = useMemo(() => {
    if (!application || !parsedData) return { createdAt: '', updatedAt: '', age: 0 }
    const dob = parsedData.isGcIntake
      ? parsedData.gc?.general_info?.dob
      : parsedData.contactInfo?.date_of_birth
    return {
      createdAt: new Date(application.created_at).toLocaleString('zh-CN'),
      updatedAt: new Date(application.updated_at).toLocaleString('zh-CN'),
      age: calculateAge(dob),
    }
  }, [application, parsedData])

  const heightDisplay = useMemo(() => {
    if (parsedData?.isGcIntake) {
      const g = parsedData.gc?.general_info
      if (g?.height_feet != null || g?.height_inches != null)
        return `${g.height_feet || ''}'${g.height_inches || ''}"`
      return t('notAvailable')
    }
    const h = parsedData?.contactInfo?.height
    if (!h) return t('notAvailable')
    if (typeof h === 'string' && h.includes("'")) return h
    return `${h} ${t('ft', '英尺')}`
  }, [parsedData?.isGcIntake, parsedData?.contactInfo?.height, parsedData?.gc?.general_info, t])

  // 导出行：必须在所有条件 return 之前调用，保证 Hooks 顺序一致
  const detailExportRows = useMemo((): DetailExportRow[] => {
    if (!application || !parsedData) return []
    return buildSurrogateDetailExportRows(application, parsedData, t)
  }, [application, parsedData, t])

  const buildExportRows = useCallback((): DetailExportRow[] => detailExportRows, [detailExportRows])

  const handleExportDetail = useCallback((format: 'excel' | 'pdf') => {
    const rows = detailExportRows
    if (!rows.length) {
      window.alert(t('noRecords', { defaultValue: 'No records' }))
      return
    }
    const dateStamp = new Date().toISOString().split('T')[0]
    const baseName = `surrogate-application-${application?.id || 'detail'}-${dateStamp}`
    const title = `${t('surrogatesApplications')} #${application?.id || ''}`
    if (format === 'excel')
      exportDetailToExcel(rows, `${baseName}.xlsx`)
    else
      exportDetailToPdf(title, rows, `${baseName}.pdf`)
  }, [application?.id, detailExportRows, t])

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查 loading
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
          <div className="text-lg text-sage-700">{t('loading', { defaultValue: '加载中...' })}</div>
        </div>
      </div>
    )
  }

  // 未认证，等待重定向
  if (!isAuthenticated) {
    return null
  }

  // 数据加载中
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600"></div>
          <div className="text-lg text-sage-700">{t('loading', { defaultValue: '加载中...' })}</div>
        </div>
      </div>
    )
  }

  if (!application || !parsedData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-sage-400 mb-4">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-xl text-sage-600 font-medium mb-2">{t('applicationNotFound', { defaultValue: '未找到申请' })}</p>
          <p className="text-sm text-sage-400 mb-6">{t('applicationNotFoundDesc', { defaultValue: '该申请可能已被删除或不存在' })}</p>
          <CustomButton
            onClick={() => router.push('/admin/surrogates-applications')}
            className="bg-sage-200 text-sage-800 hover:bg-sage-300 cursor-pointer"
          >
            {t('backToApplications', { defaultValue: '返回申请列表' })}
          </CustomButton>
        </div>
      </div>
    )
  }

  const { appData, contactInfo, aboutYou, pregnancyHealth, interview, pregnancyHistories, gc, isGcIntake } = parsedData
  const { createdAt, updatedAt, age } = formattedData
  const displayName = isGcIntake ? (gc?.general_info?.full_name || '') : `${contactInfo?.first_name || ''} ${contactInfo?.last_name || ''}`.trim() || '—'
  const fallbackValue = t('notAvailable', { defaultValue: 'N/A' })
  const yesNo = (value?: boolean | null) => formatBooleanLabel(value ?? null, t)
  const pushRow = (rows: FieldRow[], label: string, value?: string | number | null, options?: { useFallback?: boolean }) => {
    const shouldFallback = options?.useFallback ?? false
    if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
      if (!shouldFallback)
        return
      rows.push({ label, value: fallbackValue })
      return
    }
    const formatted = typeof value === 'string' ? value.trim() : String(value)
    rows.push({ label, value: formatted })
  }
  const buildRowsFromConfig = (config: FieldConfig[], source: Record<string, any>) => {
    const rows: FieldRow[] = []
    config.forEach(({ key, label, type, hideWhenEmpty }) => {
      const raw = source?.[key]
      if (type === 'boolean') {
        const formatted = yesNo(typeof raw === 'boolean' ? raw : null)
        pushRow(rows, label, formatted, { useFallback: !hideWhenEmpty })
      }
      else {
        pushRow(rows, label, raw, { useFallback: !hideWhenEmpty })
      }
    })
    return rows
  }
  const renderFieldRows = (rows: FieldRow[]) => {
    if (!rows.length)
      return <p className="text-sm text-sage-500">{fallbackValue}</p>
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rows.map(row => (
          <div key={`${row.label}-${row.value}`} className="rounded-lg border border-sage-100 bg-sage-50/60 p-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-sage-500">{row.label}</div>
            <div className="text-sage-800 font-medium mt-1 whitespace-pre-wrap break-words">{row.value}</div>
          </div>
        ))}
      </div>
    )
  }
  const gcLabel = (key: string, fallback: string) => t(key, { defaultValue: fallback })

  const g = gc?.general_info ?? {}
  const pb = gc?.pregnancy_birth_history ?? {}
  const medicalRecordsSourceMap: Record<string, string> = {
    patient_portal: gcLabel('surrogate.application.gcIntake.medicalRecordsPatientPortal', 'Patient Portal'),
    clinic: gcLabel('surrogate.application.gcIntake.medicalRecordsClinic', 'Clinic'),
    other: gcLabel('surrogate.application.gcIntake.medicalRecordsOther', 'Other'),
  }
  const occupationMap: Record<string, string> = {
    employed: gcLabel('surrogate.application.gcIntake.occupationEmployed', 'Employed (please specify)'),
    stay_at_home: gcLabel('surrogate.application.gcIntake.occupationStayAtHome', 'Stay-at-home parent'),
    unemployed: gcLabel('surrogate.application.gcIntake.occupationUnemployed', 'Unemployed (please specify financial situation)'),
  }
  const maritalMap: Record<string, string> = {
    married: gcLabel('surrogate.application.gcIntake.maritalMarried', 'Married'),
    single: gcLabel('surrogate.application.gcIntake.maritalSingle', 'Single'),
    cohabitating: gcLabel('surrogate.application.gcIntake.maritalCohabitating', 'Cohabitating'),
    divorced: gcLabel('surrogate.application.gcIntake.maritalDivorced', 'Divorced'),
  }
  const gcPhone = [g.country_code, g.phone].filter(Boolean).join(' ').trim()
  const gcHeight = g.height_feet ? `${g.height_feet}'${g.height_inches || 0}"` : ''
  const gcWeight = g.weight ? `${g.weight} lbs` : ''
  const generalInfoRows: FieldRow[] = []
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.fullName', 'Full Name'), g.full_name, { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.email', 'Email Address'), g.email, { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.phone', 'Phone Number'), gcPhone, { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.dob', 'Date of Birth'), g.dob, { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.stateOfResidence', 'Current State of Residence'), g.state_of_residence, { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.placeOfBirth', 'Place of Birth'), g.place_of_birth, { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.homeAddress', 'Home Address'), g.home_address, { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.heightWeight', 'Height / Weight'), gcHeight, { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.form.weight', 'Weight'), gcWeight, { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.bmi', 'BMI'), g.bmi, { useFallback: true })
  const occupationTypeLabel = g.occupation_type ? (occupationMap[g.occupation_type] || g.occupation_type) : ''
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.occupationSource', 'Occupation or Source of Income'), occupationTypeLabel, { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.occupationSource', 'Occupation Detail'), g.occupation_specify)
  const maritalStatusLabel = g.marital_status ? (maritalMap[g.marital_status] || g.marital_status) : ''
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.maritalStatus', 'Marital Status'), maritalStatusLabel, { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.singlePartnerInfo', 'Single Partner Info'), g.single_partner_info)
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.usCitizenOrResident', 'U.S. Citizen or Resident?'), yesNo(typeof g.us_citizen_or_resident === 'boolean' ? g.us_citizen_or_resident : null), { useFallback: true })
  pushRow(generalInfoRows, gcLabel('surrogate.application.gcIntake.ethnicity.label', 'Ethnicity'), g.ethnicity, { useFallback: true })

  const pregnancyBirthRows: FieldRow[] = []
  pushRow(pregnancyBirthRows, gcLabel('surrogate.application.gcIntake.totalChildren', 'Total number of children'), pb.total_children, { useFallback: true })
  pushRow(pregnancyBirthRows, gcLabel('surrogate.application.gcIntake.totalVaginal', 'Total vaginal deliveries'), pb.total_vaginal, { useFallback: true })
  pushRow(pregnancyBirthRows, gcLabel('surrogate.application.gcIntake.totalCSections', 'Total C-sections'), pb.total_c_sections, { useFallback: true })
  pushRow(pregnancyBirthRows, gcLabel('surrogate.application.gcIntake.miscarriages', 'History of miscarriage(s)?'), yesNo(typeof pb.miscarriages === 'boolean' ? pb.miscarriages : null), { useFallback: true })
  pushRow(pregnancyBirthRows, gcLabel('surrogate.application.gcIntake.miscarriagesDetail', 'When and reason(s)'), pb.miscarriages_detail)
  pushRow(pregnancyBirthRows, gcLabel('surrogate.application.gcIntake.abortions', 'History of abortion(s)?'), yesNo(typeof pb.abortions === 'boolean' ? pb.abortions : null), { useFallback: true })
  pushRow(pregnancyBirthRows, gcLabel('surrogate.application.gcIntake.abortionsDetail', 'When and reason(s)'), pb.abortions_detail)
  pushRow(pregnancyBirthRows, gcLabel('surrogate.application.gcIntake.beenSurrogateBefore', 'Been surrogate before?'), yesNo(typeof pb.been_surrogate_before === 'boolean' ? pb.been_surrogate_before : null), { useFallback: true })
  pushRow(pregnancyBirthRows, gcLabel('surrogate.application.gcIntake.beenSurrogateWhen', 'When (if yes)'), pb.been_surrogate_when)

  const pregnancyMedicalConfig: FieldConfig[] = [
    { key: 'anemia', label: gcLabel('surrogate.application.gcIntake.anemia', 'Anemia?'), type: 'boolean' },
    { key: 'severe_vomiting_3mo', label: gcLabel('surrogate.application.gcIntake.severeVomiting3mo', 'Severe vomiting lasting more than 3 months?'), type: 'boolean' },
    { key: 'bp_during_pregnancy', label: gcLabel('surrogate.application.gcIntake.bpDuringPregnancy', 'Usual blood pressure during pregnancy') },
    { key: 'preeclampsia', label: gcLabel('surrogate.application.gcIntake.preeclampsia', 'Pre-eclampsia?'), type: 'boolean' },
    { key: 'gestational_diabetes', label: gcLabel('surrogate.application.gcIntake.gestationalDiabetes', 'Gestational diabetes?'), type: 'boolean' },
    { key: 'hypertension_pregnancy', label: gcLabel('surrogate.application.gcIntake.hypertensionPregnancy', 'Hypertension during pregnancy?'), type: 'boolean' },
    { key: 'blood_transfusion', label: gcLabel('surrogate.application.gcIntake.bloodTransfusion', 'Blood transfusion during pregnancy?'), type: 'boolean' },
    { key: 'seizures', label: gcLabel('surrogate.application.gcIntake.seizures', 'Seizures?'), type: 'boolean' },
  ]
  const medicalHealthConfig: FieldConfig[] = [
    { key: 'regular_menstrual_cycles', label: gcLabel('surrogate.application.gcIntake.regularMenstrualCycles', 'Regular menstrual cycles?'), type: 'boolean' },
    { key: 'birth_control', label: gcLabel('surrogate.application.gcIntake.birthControl', 'Currently using birth control?'), type: 'boolean' },
    { key: 'birth_control_type', label: gcLabel('surrogate.application.gcIntake.birthControlType', 'Birth control type'), hideWhenEmpty: true },
    { key: 'taking_medications', label: gcLabel('surrogate.application.gcIntake.takingMedications', 'Taking medications?'), type: 'boolean' },
    { key: 'medications_list', label: gcLabel('surrogate.application.gcIntake.medicationsList', 'Medications list'), hideWhenEmpty: true },
    { key: 'last_pap_smear', label: gcLabel('surrogate.application.gcIntake.lastPapSmear', 'Date of last Pap smear') },
    { key: 'covid_vaccinated', label: gcLabel('surrogate.application.gcIntake.covidVaccinated', 'COVID-19 vaccinated?'), type: 'boolean' },
    { key: 'hep_b_vaccinated', label: gcLabel('surrogate.application.gcIntake.hepBVaccinated', 'Hepatitis B vaccinated?'), type: 'boolean' },
    { key: 'varicella_vaccinated', label: gcLabel('surrogate.application.gcIntake.varicellaVaccinated', 'Varicella vaccinated?'), type: 'boolean' },
    { key: 'ongoing_medical_treatment', label: gcLabel('surrogate.application.gcIntake.ongoingMedicalTreatment', 'Receiving ongoing medical treatment?'), type: 'boolean' },
    { key: 'surgeries_past_2y', label: gcLabel('surrogate.application.gcIntake.surgeriesPast2y', 'Surgeries in past 2 years?'), type: 'boolean' },
    { key: 'surgeries_specify', label: gcLabel('surrogate.application.gcIntake.surgeriesSpecify', 'Surgeries (specify)'), hideWhenEmpty: true },
  ]
  const mentalHealthConfig: FieldConfig[] = [
    { key: 'anxiety_depression', label: gcLabel('surrogate.application.gcIntake.anxietyDepression', 'Anxiety or depression?'), type: 'boolean' },
    { key: 'bipolar_schizo_personality', label: gcLabel('surrogate.application.gcIntake.bipolarSchizoPersonality', 'Bipolar / schizophrenia / personality disorder?'), type: 'boolean' },
    { key: 'adhd', label: gcLabel('surrogate.application.gcIntake.adhd', 'ADHD?'), type: 'boolean' },
    { key: 'meds_anxiety_depression', label: gcLabel('surrogate.application.gcIntake.medsAnxietyDepression', 'Taking medication for anxiety/depression?'), type: 'boolean' },
    { key: 'meds_specify', label: gcLabel('surrogate.application.gcIntake.medsSpecify', 'Medication details'), hideWhenEmpty: true },
  ]
  const substanceUseConfig: FieldConfig[] = [
    { key: 'drug_use_pregnancy', label: gcLabel('surrogate.application.gcIntake.drugUsePregnancy', 'Drug use during pregnancy?'), type: 'boolean' },
    { key: 'marijuana_current', label: gcLabel('surrogate.application.gcIntake.marijuanaCurrent', 'Currently smoke marijuana?'), type: 'boolean' },
    { key: 'marijuana_last_use', label: gcLabel('surrogate.application.gcIntake.marijuanaLastUse', 'Date of last marijuana use'), hideWhenEmpty: true },
    { key: 'smoked_vaped_pregnancy', label: gcLabel('surrogate.application.gcIntake.smokedVapedPregnancy', 'Smoked or vaped during pregnancy?'), type: 'boolean' },
    { key: 'alcohol', label: gcLabel('surrogate.application.gcIntake.alcohol', 'Drink alcohol?'), type: 'boolean' },
    { key: 'alcohol_frequency', label: gcLabel('surrogate.application.gcIntake.alcoholFrequency', 'Alcohol frequency'), hideWhenEmpty: true },
  ]
  const infectiousConfig: FieldConfig[] = [
    { key: 'syphilis', label: gcLabel('surrogate.application.gcIntake.syphilis', 'Syphilis'), type: 'boolean' },
    { key: 'hepatitis_b_c', label: gcLabel('surrogate.application.gcIntake.hepatitisBC', 'Hepatitis B or C'), type: 'boolean' },
    { key: 'genital_herpes', label: gcLabel('surrogate.application.gcIntake.genitalHerpes', 'Genital herpes'), type: 'boolean' },
    { key: 'hiv', label: gcLabel('surrogate.application.gcIntake.hiv', 'HIV / AIDS'), type: 'boolean' },
  ]
  const otherMedicalConfig: FieldConfig[] = [
    { key: 'asthma', label: gcLabel('surrogate.application.gcIntake.asthma', 'Asthma?'), type: 'boolean' },
    { key: 'asthma_inhaler_per_week', label: gcLabel('surrogate.application.gcIntake.asthmaInhaler', 'Inhaler use per week'), hideWhenEmpty: true },
    { key: 'heart_conditions', label: gcLabel('surrogate.application.gcIntake.heartConditions', 'Heart conditions?'), type: 'boolean' },
    { key: 'cancer_history', label: gcLabel('surrogate.application.gcIntake.cancerHistory', 'History of cancer?'), type: 'boolean' },
    { key: 'scoliosis', label: gcLabel('surrogate.application.gcIntake.scoliosis', 'Scoliosis?'), type: 'boolean' },
    { key: 'endometrial_ablation', label: gcLabel('surrogate.application.gcIntake.endometrialAblation', 'Endometrial ablation history?'), type: 'boolean' },
  ]
  const preferencesConfig: FieldConfig[] = [
    { key: 'availability', label: gcLabel('surrogate.application.gcIntake.availability', 'Availability to proceed') },
    { key: 'health_insurance', label: gcLabel('surrogate.application.gcIntake.healthInsurance', 'Health insurance coverage') },
    { key: 'open_twins', label: gcLabel('surrogate.application.gcIntake.openTwins', 'Open to carrying twins?'), type: 'boolean' },
    { key: 'open_fetal_reduction', label: gcLabel('surrogate.application.gcIntake.openFetalReduction', 'Open to fetal reduction?'), type: 'boolean' },
    { key: 'open_termination', label: gcLabel('surrogate.application.gcIntake.openTermination', 'Open to termination if medically indicated?'), type: 'boolean' },
    { key: 'open_amniocentesis_cvs', label: gcLabel('surrogate.application.gcIntake.openAmniocentesisCVS', 'Open to amniocentesis / CVS testing?'), type: 'boolean' },
    { key: 'open_same_sex_single_ip', label: gcLabel('surrogate.application.gcIntake.openSameSexSingleIP', 'Open to same-sex or single intended parents?'), type: 'boolean' },
    { key: 'willing_pump_breast_milk', label: gcLabel('surrogate.application.gcIntake.willingPumpBreastMilk', 'Willing to pump breast milk?'), type: 'boolean' },
    { key: 'open_ip_hiv', label: gcLabel('surrogate.application.gcIntake.openIPHIV', 'Open to intended parents with HIV?'), type: 'boolean' },
    { key: 'open_ip_hepatitis_b', label: gcLabel('surrogate.application.gcIntake.openIPHepatitisB', 'Open to intended parents with Hepatitis B?'), type: 'boolean' },
  ]
  const legalConfig: FieldConfig[] = [
    { key: 'pending_legal', label: gcLabel('surrogate.application.gcIntake.pendingLegal', 'Pending legal claims or lawsuits?'), type: 'boolean' },
    { key: 'criminal_record', label: gcLabel('surrogate.application.gcIntake.criminalRecord', 'Criminal record?'), type: 'boolean' },
    { key: 'emergency_contact', label: gcLabel('surrogate.application.gcIntake.emergencyContact', 'Emergency contact'), hideWhenEmpty: false },
    { key: 'government_assistance', label: gcLabel('surrogate.application.gcIntake.governmentAssistance', 'Receiving government assistance?'), type: 'boolean' },
  ]

  const pregnancyMedicalRows = buildRowsFromConfig(pregnancyMedicalConfig, gc?.pregnancy_medical ?? {})
  const medicalHealthRows = buildRowsFromConfig(medicalHealthConfig, gc?.medical_health ?? {})
  const mentalHealthRows = buildRowsFromConfig(mentalHealthConfig, gc?.mental_health ?? {})
  const substanceUseRows = buildRowsFromConfig(substanceUseConfig, gc?.substance_use ?? {})
  const infectiousRows = buildRowsFromConfig(infectiousConfig, gc?.infectious_disease ?? {})
  const otherMedicalRows = buildRowsFromConfig(otherMedicalConfig, gc?.other_medical ?? {})
  const preferencesRows = buildRowsFromConfig(preferencesConfig, gc?.preferences ?? {})
  const legalRows = buildRowsFromConfig(legalConfig, gc?.legal_admin ?? {})
  const notesRows: FieldRow[] = []
  pushRow(notesRows, gcLabel('surrogate.application.gcIntake.referredBy', 'Referred by'), gc?.notes?.referred_by, { useFallback: true })
  const medicalSourceKey = gc?.notes?.medical_records_source
  const medicalSourceLabel = medicalSourceKey ? (medicalRecordsSourceMap[medicalSourceKey] || medicalSourceKey) : ''
  pushRow(notesRows, gcLabel('surrogate.application.gcIntake.medicalRecordsSource', 'Medical records source'), medicalSourceLabel, { useFallback: true })

  const substanceSources = gc?.substance_use || {}
  if (substanceSources.drug_use_pregnancy) {
    const drugSelections: string[] = []
    if (substanceSources.drug_marijuana)
      drugSelections.push(gcLabel('surrogate.application.gcIntake.drugMarijuana', 'Marijuana'))
    if (substanceSources.drug_fentanyl)
      drugSelections.push(gcLabel('surrogate.application.gcIntake.drugFentanyl', 'Fentanyl'))
    if (substanceSources.drug_methamphetamine)
      drugSelections.push(gcLabel('surrogate.application.gcIntake.drugMethamphetamine', 'Methamphetamine'))
    if (substanceSources.drug_mdma)
      drugSelections.push(gcLabel('surrogate.application.gcIntake.drugMDMA', 'MDMA (Molly)'))
    if (substanceSources.drug_other)
      drugSelections.push(substanceSources.drug_other)
    if (drugSelections.length)
      pushRow(substanceUseRows, gcLabel('surrogate.application.gcIntake.drugTypes', 'Drug types'), drugSelections.join(', '))
  }

  const deliveryHistory = Array.isArray(gc?.delivery_history) ? gc.delivery_history : []

  return (
      <PageContent>
        <PageHeader
          title={t('SurrogateApplicationDetails')}
          rightContent={
            <div className="flex items-center gap-4">
              <CustomButton
                className="bg-white font-medium cursor-pointer border border-sage-300 text-sage-800"
                onClick={handleBack}
              >
                {t('Back To Applications')}
              </CustomButton>
              <CustomButton
                className="bg-white font-medium cursor-pointer border border-sage-300 text-sage-800"
                onClick={() => handleExportDetail('excel')}
              >
                {t('exportExcel')}
              </CustomButton>
              <CustomButton
                className="bg-white font-medium cursor-pointer border border-sage-300 text-sage-800"
                onClick={() => handleExportDetail('pdf')}
              >
                {t('exportPdf')}
              </CustomButton>
              <CustomButton
                className="text-red-600 border border-red-200 bg-white font-medium cursor-pointer"
                onClick={handleDelete}
              >
                {t('delete', { defaultValue: 'Delete' })}
              </CustomButton>
              {application.status === 'pending' && (
                <>
                  <CustomButton
                    className="bg-green-100 text-green-800 hover:bg-green-200 font-medium cursor-pointer px-3 py-1 text-sm rounded"
                    onClick={handleApprove}
                  >
                    {t('approve')}
                  </CustomButton>
                  <CustomButton
                    className="text-red-600 hover:bg-red-50 font-medium cursor-pointer border border-red-200 bg-white px-3 py-1 text-sm rounded"
                    onClick={handleReject}
                  >
                    {t('reject')}
                  </CustomButton>
                </>
              )}
            </div>
          }
        />
        <div className="w-full flex flex-col items-center mb-8">
          <h3 className="text-lg font-medium text-sage-800 mb-3">{t('applicationPhotos')}</h3>
          {Array.isArray(appData.upload_photos) && appData.upload_photos.length > 0 ? (
            <>
              <div className="flex gap-6 justify-center flex-wrap w-full">
                {appData.upload_photos.map((photo: any, idx: number) => (
                  <div
                    key={idx}
                    className="w-48 h-48 rounded-xl overflow-hidden border border-sage-200 bg-sage-50 flex items-center justify-center shadow relative cursor-pointer"
                    onClick={() => handlePreviewOpen(idx)}
                  >
                    <img
                      src={photo.url}
                      alt={photo.name || `photo-${idx + 1}`}
                      className="object-cover w-full h-full transition-transform duration-200 hover:scale-105"
                      loading="lazy"
                    />
                    <span className="absolute top-2 left-2 bg-sage-700 text-white text-xs px-2 py-1 rounded shadow font-medium">
                      {t('photoNumber', { number: idx + 1 })}
                    </span>
                  </div>
                ))}
              </div>
              <ImagePreviewModal
                open={previewOpen}
                images={appData.upload_photos}
                current={previewIndex}
                onClose={handlePreviewClose}
                t={t}
              />
            </>
          ) : (
            <div className="text-sage-800 text-sm font-medium">{t('noPhotosUploaded')}</div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-sage-800" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-sage-800">{displayName || '—'}</h2>
                  <p className="text-sage-800 font-medium">{t('applicationNumber')}: #{application.id} • {age}{t('yearsOld')}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                {t(application.status)}
              </span>
            </div>

            {!isGcIntake && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {t('basicInformation')}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('occupation')}:</span>
                    <span className="text-sage-800 font-semibold">{aboutYou.occupation || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('education')}:</span>
                    <span className="text-sage-800 font-semibold">{aboutYou.education_level || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('maritalStatus')}:</span>
                    <span className="text-sage-800 font-semibold">{aboutYou.marital_status || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('partnerSupport')}:</span>
                    <span className="text-sage-800 font-semibold">{aboutYou.partner_support || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('householdIncome')}:</span>
                    <span className="text-sage-800 font-semibold">{aboutYou.household_income || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('surrogacyExperience')}:</span>
                    <span className="text-sage-800 font-semibold">{aboutYou.is_former_surrogate ? t('experienced') : t('firstTime')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('surrogateProfileDetail.surrogateExperience', '代孕经历说明')}:</span>
                    <span className="text-sage-800 font-semibold">{aboutYou.surrogate_experience || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('surrogateProfileDetail.hasHighSchoolDiploma', '有高中毕业证')}:</span>
                    <span className="text-sage-800 font-semibold">{aboutYou.has_high_school_diploma ? t('yes') : t('no')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('surrogateProfileDetail.contactSourceLabel', '联系来源')}:</span>
                    <span className="text-sage-800 font-semibold">{aboutYou.contact_source ? String(t(`surrogateProfileDetail.contactSource.${aboutYou.contact_source}`, aboutYou.contact_source)) : t('notAvailable')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {t('contactInformation')}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('dateOfBirth')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.date_of_birth || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('phone')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.cell_phone_country_code} {contactInfo.cell_phone || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('email')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.email_address || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('city')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.city || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('stateOrProvince')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.state_or_province || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('country')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.country || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('zipCode')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.zip_code || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('surrogacyProfile.contactInfo.usCitizenOrVisaStatus')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.us_citizen_or_visa_status || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('surrogacyProfile.contactInfo.agreeToReceiveMessages')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.is_agree_cell_phone_receive_messages ? t('yes') : t('no')}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  {t('physicalCharacteristics')}
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('height')}:</span>
                    <span className="text-sage-800 font-semibold">{heightDisplay}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('weight')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.weight ? `${contactInfo.weight} ${t('lbs', '磅')}` : t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('bmi')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.bmi || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('ethnicity')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.ethnicity || t('notAvailable')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sage-500 font-medium">{t('surrogacyExperienceCount')}:</span>
                    <span className="text-sage-800 font-semibold">{contactInfo.surrogacy_experience_count || 0} {t('timesCount')}</span>
                  </div>
                </div>
              </div>
            </div>
            )}
            {isGcIntake && gc && (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-sage-800">{gcLabel('surrogate.application.gcIntake.sections.generalInfo', 'I. General Information')}</h3>
                {renderFieldRows(generalInfoRows)}
              </div>
              <div>
                <h3 className="text-lg font-medium text-sage-800">{gcLabel('surrogate.application.gcIntake.sections.pregnancyBirthHistory', 'II. Pregnancy & Birth History')}</h3>
                {renderFieldRows(pregnancyBirthRows)}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-sage-700">{gcLabel('surrogate.application.gcIntake.sections.deliveryHistory', 'Delivery History')}</h4>
                  {deliveryHistory.length > 0 ? (
                    <div className="space-y-3 mt-2">
                      {deliveryHistory.map((delivery: any, idx: number) => (
                        <div key={`delivery-${idx}`} className="rounded-lg border border-sage-100 bg-sage-50/60 p-3 text-sm text-sage-800">
                          <div className="font-semibold text-sage-700 mb-1">{gcLabel('surrogate.application.gcIntake.babyNum', 'Baby #{n}').replace('{n}', String(idx + 1))}</div>
                          <p className="whitespace-pre-wrap break-words">{[delivery.delivery_date, delivery.gender, delivery.birth_weight, delivery.number_of_weeks, delivery.delivery_type, delivery.hospital].filter(Boolean).join(' • ')}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-sage-500 mt-2">{fallbackValue}</p>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-sage-800">{gcLabel('surrogate.application.gcIntake.sections.pregnancyMedical', 'IV. Pregnancy-Related Medical History')}</h3>
                {renderFieldRows(pregnancyMedicalRows)}
              </div>
              <div>
                <h3 className="text-lg font-medium text-sage-800">{gcLabel('surrogate.application.gcIntake.sections.medicalHealth', 'V. Medical & Health History')}</h3>
                {renderFieldRows(medicalHealthRows)}
              </div>
              <div>
                <h3 className="text-lg font-medium text-sage-800">{gcLabel('surrogate.application.gcIntake.sections.mentalHealth', 'VI. Mental Health History')}</h3>
                {renderFieldRows(mentalHealthRows)}
              </div>
              <div>
                <h3 className="text-lg font-medium text-sage-800">{gcLabel('surrogate.application.gcIntake.sections.substanceUse', 'VII. Substance Use History')}</h3>
                {renderFieldRows(substanceUseRows)}
              </div>
              <div>
                <h3 className="text-lg font-medium text-sage-800">{gcLabel('surrogate.application.gcIntake.sections.infectiousDisease', 'VIII. Infectious Disease History')}</h3>
                {renderFieldRows(infectiousRows)}
              </div>
              <div>
                <h3 className="text-lg font-medium text-sage-800">{gcLabel('surrogate.application.gcIntake.sections.otherMedical', 'IX. Other Medical Conditions')}</h3>
                {renderFieldRows(otherMedicalRows)}
              </div>
              <div>
                <h3 className="text-lg font-medium text-sage-800">{gcLabel('surrogate.application.gcIntake.sections.preferences', 'X. Preferences & Matching Considerations')}</h3>
                {renderFieldRows(preferencesRows)}
              </div>
              <div>
                <h3 className="text-lg font-medium text-sage-800">{gcLabel('surrogate.application.gcIntake.sections.legalAdmin', 'XI. Legal & Administrative')}</h3>
                {renderFieldRows(legalRows)}
              </div>
              <div>
                <h3 className="text-lg font-medium text-sage-800">{gcLabel('surrogate.application.gcIntake.sections.notes', 'XII. Notes')}</h3>
                {renderFieldRows(notesRows)}
              </div>
            </div>
            )}
          </div>

          {!isGcIntake && (
          <>
          {/* 怀孕与健康 */}
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5" />
              {t('pregnancyHealth')}
            </h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('hasGivenBirth')}</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.has_given_birth ? t('yes') : t('no')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('isCurrentlyPregnant')}</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.is_currently_pregnant ? t('yes') : t('no')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('isBreastfeeding')}</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.is_breastfeeding ? t('yes') : t('no')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('hasStillbirth')}</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.has_stillbirth ? t('yes') : t('no')}</p>
              </div>
              {pregnancyHealth.birth_details && (
                <div className="space-y-1 col-span-2">
                  <span className="text-sage-600 text-sm">{t('surrogacyProfile.health.birthDetails')}:</span>
                  <p className="font-medium text-sage-800">{pregnancyHealth.birth_details}</p>
                </div>
              )}
              {pregnancyHealth.closest_hospital && (
                <div className="space-y-1 col-span-2">
                  <span className="text-sage-600 text-sm">{t('surrogacyProfile.health.closestHospital')}:</span>
                  <p className="font-medium text-sage-800">{pregnancyHealth.closest_hospital}</p>
                </div>
              )}
              {pregnancyHealth.closest_nicu_iii && (
                <div className="space-y-1 col-span-2">
                  <span className="text-sage-600 text-sm">{t('surrogacyProfile.health.closestNICUIII')}:</span>
                  <p className="font-medium text-sage-800">{pregnancyHealth.closest_nicu_iii}</p>
                </div>
              )}
              {pregnancyHealth.current_birth_control && (
                <div className="space-y-1 col-span-2">
                  <span className="text-sage-600 text-sm">{t('surrogacyProfile.health.currentBirthControl')}:</span>
                  <p className="font-medium text-sage-800">{pregnancyHealth.current_birth_control}</p>
                </div>
              )}
              <div className="space-y-1 col-span-2">
                <span className="text-sage-600 text-sm">{t('medicalConditions')}</span>
                <p className="font-medium text-sage-800">{Array.isArray(pregnancyHealth.medical_conditions) && pregnancyHealth.medical_conditions.length > 0 ? pregnancyHealth.medical_conditions.join(", ") : t('noneValue')}</p>
              </div>
              <div className="space-y-1 col-span-2">
                <span className="text-sage-600 text-sm">{t('isTakingMedications')}</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.is_taking_medications ? t('yes') : t('no')}</p>
                {pregnancyHealth.is_taking_medications && pregnancyHealth.medications_list && (
                  <div className="mt-2">
                    <span className="text-sage-600 text-sm">{t('medications')}</span>
                    <p className="font-medium text-sage-800">{pregnancyHealth.medications_list}</p>
                  </div>
                )}
              </div>
              {/* 背景调查相关字段 */}
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('surrogacyProfile.health.arrests')}:</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.arrests ? t('yes') : t('no')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('surrogacyProfile.health.felonyCharges')}:</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.felony_charges ? t('yes') : t('no')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('surrogacyProfile.health.substanceAbuse')}:</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.substance_abuse ? t('yes') : t('no')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('surrogacyProfile.health.domesticViolence')}:</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.domestic_violence ? t('yes') : t('no')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('surrogacyProfile.health.childAbuseNeglect')}:</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.child_abuse_neglect ? t('yes') : t('no')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('surrogateProfileDetail.health.formalProbation', 'Formal Probation')}:</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.formal_probation ? t('yes') : t('no')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('surrogateProfileDetail.health.outstandingWarrant', 'Outstanding Warrant')}:</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.outstanding_warrant ? t('yes') : t('no')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('surrogateProfileDetail.health.childProtectionInvestigation', 'Child Protection Investigation')}:</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.child_protection_investigation ? t('yes') : t('no')}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('surrogateProfileDetail.health.seriousPregnancyComplications', 'Serious Pregnancy Complications')}:</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.serious_pregnancy_complications ? t('yes') : t('no')}</p>
              </div>
            </div>

          </div>

          {/* 怀孕历史 - 与代孕母详情页面一致 */}
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5" />
              {t('pregnancyHistories')}
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-sage-600 text-sm">{t('backgroundCheckStatus')}</span>
                <p className="font-medium text-sage-800">{pregnancyHealth.background_check_status || t('notAvailable')}</p>
              </div>
              
              <div className="mt-6">
                <span className="text-sage-600 text-sm">{t('pregnancyHistory')}</span>
                {Array.isArray(pregnancyHistories) && pregnancyHistories.length > 0 ? (
                  <div className="space-y-3 mt-2">
                    {pregnancyHistories.map((history: any, idx: number) => (
                      <div key={idx} className="p-3 bg-sage-50 rounded-lg border border-sage-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-sage-500">{t('deliveryDate')}:</span>
                            <div className="text-sage-800">{history.delivery_date || t('notAvailable')}</div>
                          </div>
                          <div>
                            <span className="text-sage-500">{t('birthWeight')}:</span>
                            <div className="text-sage-800">{history.birth_weight ? `${history.birth_weight} ${t('lbs', '磅')}` : t('notAvailable')}</div>
                          </div>
                          <div>
                            <span className="text-sage-500">{t('gestationalWeeks')}:</span>
                            <div className="text-sage-800">{history.gestational_weeks || t('notAvailable')}</div>
                          </div>
                          <div>
                            <span className="text-sage-500">{t('numberOfBabies')}:</span>
                            <div className="text-sage-800">{history.number_of_babies || t('notAvailable')}</div>
                          </div>
                          <div>
                            <span className="text-sage-500">{t('deliveryMethod')}:</span>
                            <div className="text-sage-800">{history.delivery_method || t('notAvailable')}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sage-500 text-sm italic mt-2">{t('noneValue')}</p>
                )}
              </div>
            </div>
          </div>

          {/* 代孕面试 */}
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2 mb-4">
              <MessageSquare className="w-5 h-5" />
              {t('interview')}
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sage-500 text-sm">{t('emotionalSupport')}:</span>
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">{interview.emotional_support || t('notAvailable')}</div>
                  </div>
                  <div>
                    <span className="text-sage-500 text-sm">{t('languagesSpoken')}:</span>
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">{interview.languages_spoken || t('notAvailable')}</div>
                  </div>
                  <div>
                    <span className="text-sage-500 text-sm">{t('motivation')}:</span>
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1 whitespace-pre-wrap">{interview.motivation || t('notAvailable')}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sage-500 text-sm">{t('selfIntroduction')}:</span>
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1 whitespace-pre-wrap">{interview.self_introduction || t('notAvailable')}</div>
                  </div>
                  <div>
                    <span className="text-sage-500 text-sm">{t('contactPreference')}:</span>
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">{interview.contact_preference || t('notAvailable')}</div>
                  </div>
                  <div>
                    <span className="text-sage-500 text-sm">{t('twinsFeeling')}:</span>
                    <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">{interview.twins_feeling || t('notAvailable')}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-sage-500">{t('hipaaRelease')}:</span>
                      <span className="text-sage-800">{interview.hipaa_release_willing ? t('yes') : t('no')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sage-500">{t('multipleReduction')}:</span>
                      <span className="text-sage-800">{interview.multiple_reduction_willing ? t('yes') : t('no')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sage-500">{t('terminationWilling')}:</span>
                      <span className="text-sage-800">{interview.termination_willing ? t('yes') : t('no')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </>
          )}

          {/* 时间信息 */}
          <div className="bg-white rounded-lg border border-sage-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="flex justify-between">
                <span className="text-sage-500">{t('created')}:</span>
                <span className="text-sage-800">{createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sage-500">{t('updated')}:</span>
                <span className="text-sage-800">{updatedAt}</span>
              </div>
            </div>
          </div>
        </div>
      </PageContent>
  )
}

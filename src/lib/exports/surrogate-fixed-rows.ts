import type { Application } from '@/types/applications'
import { formatBooleanLabel } from '@/lib/utils'

export type SurrogateParsedData = {
  appData: any
  gc: any
  isGcIntake: boolean
  contactInfo: any
  aboutYou: any
  pregnancyHealth: any
  interview: any
  pregnancyHistories: any[]
}

export function parseSurrogateApplicationData(application: Application): SurrogateParsedData {
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
}

const DELIVERY_COLUMN_COUNT = 10

function formatDeliveryRecord(delivery: any, isGc: boolean): string {
  if (!delivery) return ''
  if (isGc) {
    return [delivery.delivery_date, delivery.gender, delivery.birth_weight, delivery.number_of_weeks, delivery.delivery_type, delivery.hospital].filter(Boolean).join(' • ')
  }
  return [delivery.delivery_date, delivery.birth_weight, delivery.gestational_weeks, delivery.number_of_babies, delivery.delivery_method].filter(Boolean).join(' • ')
}

/** 固定列导出：一行一个孕妈，分娩记录预设 10 列，附加信息列预留空。供详情页与列表批量导出共用 */
export function buildSurrogateDetailFixedRow(
  application: Application,
  parsedData: SurrogateParsedData,
  t: (key: string, opts?: { defaultValue?: string }) => string,
): { headers: string[]; row: Record<string, string> } {
  const gcLabel = (key: string, fallback: string) => t(key, { defaultValue: fallback })
  const yesNo = (value?: boolean | null) => formatBooleanLabel(value ?? null, t as any)
  const gc = parsedData.gc
  const g = gc?.general_info ?? {}
  const pb = gc?.pregnancy_birth_history ?? {}
  const pm = gc?.pregnancy_medical ?? {}
  const mh = gc?.medical_health ?? {}
  const mental = gc?.mental_health ?? {}
  const substance = gc?.substance_use ?? {}
  const infectious = gc?.infectious_disease ?? {}
  const otherMed = gc?.other_medical ?? {}
  const prefs = gc?.preferences ?? {}
  const legal = gc?.legal_admin ?? {}
  const notes = gc?.notes ?? {}
  const contactInfo = parsedData.contactInfo || {}
  const pregnancyHistories = parsedData.pregnancyHistories || []
  const isGc = parsedData.isGcIntake
  const deliveryHistory = Array.isArray(gc?.delivery_history) ? gc.delivery_history : []
  const deliverySource = isGc ? deliveryHistory : pregnancyHistories

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
  const medicalRecordsSourceMap: Record<string, string> = {
    patient_portal: gcLabel('surrogate.application.gcIntake.medicalRecordsPatientPortal', 'Patient Portal'),
    clinic: gcLabel('surrogate.application.gcIntake.medicalRecordsClinic', 'Clinic'),
    other: gcLabel('surrogate.application.gcIntake.medicalRecordsOther', 'Other'),
  }
  const gcPhone = [g.country_code, g.phone].filter(Boolean).join(' ').trim()
  const gcHeight = g.height_feet != null ? `${g.height_feet}'${g.height_inches ?? 0}"` : ''
  const gcWeight = g.weight != null ? `${g.weight} lbs` : ''
  const fullName = isGc ? (g.full_name ?? '') : `${contactInfo.first_name ?? ''} ${contactInfo.last_name ?? ''}`.trim()
  const email = isGc ? (g.email ?? '') : (contactInfo.email_address ?? '')
  const phone = isGc ? gcPhone : [contactInfo.cell_phone_country_code, contactInfo.cell_phone].filter(Boolean).join(' ').trim()
  const dob = isGc ? (g.dob ?? '') : (contactInfo.date_of_birth ?? '')

  const v = (x: any) => (x === undefined || x === null || x === '') ? '' : String(x).trim()
  const deliveryCols: string[] = []
  for (let i = 0; i < DELIVERY_COLUMN_COUNT; i++) {
    deliveryCols.push(formatDeliveryRecord(deliverySource[i], isGc))
  }

  const drugTypes: string[] = []
  if (substance.drug_use_pregnancy) {
    if (substance.drug_marijuana) drugTypes.push(gcLabel('surrogate.application.gcIntake.drugMarijuana', 'Marijuana'))
    if (substance.drug_fentanyl) drugTypes.push(gcLabel('surrogate.application.gcIntake.drugFentanyl', 'Fentanyl'))
    if (substance.drug_methamphetamine) drugTypes.push(gcLabel('surrogate.application.gcIntake.drugMethamphetamine', 'Methamphetamine'))
    if (substance.drug_mdma) drugTypes.push(gcLabel('surrogate.application.gcIntake.drugMDMA', 'MDMA (Molly)'))
    if (substance.drug_other) drugTypes.push(substance.drug_other)
  }

  const headers: string[] = []
  const row: Record<string, string> = {}

  const columnDefs: [string, () => string][] = [
    [gcLabel('export.applicationId', 'Application ID'), () => String(application?.id ?? '')],
    [gcLabel('export.fullName', 'Full Name'), () => fullName],
    [gcLabel('export.email', 'Email'), () => email],
    [gcLabel('export.phone', 'Phone'), () => phone],
    [gcLabel('export.dob', 'Date of Birth'), () => dob],
    [gcLabel('export.stateOfResidence', 'State of Residence'), () => isGc ? v(g.state_of_residence) : ''],
    [gcLabel('export.placeOfBirth', 'Place of Birth'), () => isGc ? v(g.place_of_birth) : ''],
    [gcLabel('export.homeAddress', 'Home Address'), () => isGc ? v(g.home_address) : ''],
    [gcLabel('export.height', 'Height'), () => isGc ? gcHeight : v(contactInfo.height)],
    [gcLabel('export.weight', 'Weight'), () => isGc ? gcWeight : ''],
    [gcLabel('export.bmi', 'BMI'), () => isGc ? v(g.bmi) : ''],
    [gcLabel('export.occupationType', 'Occupation Type'), () => isGc ? (occupationMap[g.occupation_type] || g.occupation_type || '') : ''],
    [gcLabel('export.occupationSpecify', 'Occupation Detail'), () => isGc ? v(g.occupation_specify) : ''],
    [gcLabel('export.maritalStatus', 'Marital Status'), () => isGc ? (maritalMap[g.marital_status] || g.marital_status || '') : ''],
    [gcLabel('export.singlePartnerInfo', 'Single Partner Info'), () => isGc ? v(g.single_partner_info) : ''],
    [gcLabel('export.usCitizenOrResident', 'U.S. Citizen or Resident'), () => isGc ? yesNo(g.us_citizen_or_resident) : ''],
    [gcLabel('export.ethnicity', 'Ethnicity'), () => isGc ? v(g.ethnicity) : ''],
    [gcLabel('export.totalChildren', 'Total Children'), () => isGc ? v(pb.total_children) : ''],
    [gcLabel('export.totalVaginal', 'Total Vaginal Deliveries'), () => isGc ? v(pb.total_vaginal) : ''],
    [gcLabel('export.totalCSections', 'Total C-sections'), () => isGc ? v(pb.total_c_sections) : ''],
    [gcLabel('export.miscarriages', 'History of Miscarriages'), () => isGc ? yesNo(pb.miscarriages) : ''],
    [gcLabel('export.miscarriagesDetail', 'Miscarriages Detail'), () => isGc ? v(pb.miscarriages_detail) : ''],
    [gcLabel('export.abortions', 'History of Abortions'), () => isGc ? yesNo(pb.abortions) : ''],
    [gcLabel('export.abortionsDetail', 'Abortions Detail'), () => isGc ? v(pb.abortions_detail) : ''],
    [gcLabel('export.beenSurrogateBefore', 'Been Surrogate Before'), () => isGc ? yesNo(pb.been_surrogate_before) : ''],
    [gcLabel('export.beenSurrogateWhen', 'Been Surrogate When'), () => isGc ? v(pb.been_surrogate_when) : ''],
    ...deliveryCols.map((val, i) => [t(`export.deliveryRecord${i + 1}`, { defaultValue: `Delivery Record ${i + 1}` }), () => val] as [string, () => string]),
    [gcLabel('surrogate.application.gcIntake.anemia', 'Anemia?'), () => isGc ? yesNo(pm.anemia) : ''],
    [gcLabel('surrogate.application.gcIntake.severeVomiting3mo', 'Severe vomiting 3+ months?'), () => isGc ? yesNo(pm.severe_vomiting_3mo) : ''],
    [gcLabel('surrogate.application.gcIntake.bpDuringPregnancy', 'BP during pregnancy'), () => isGc ? v(pm.bp_during_pregnancy) : ''],
    [gcLabel('surrogate.application.gcIntake.preeclampsia', 'Pre-eclampsia?'), () => isGc ? yesNo(pm.preeclampsia) : ''],
    [gcLabel('surrogate.application.gcIntake.gestationalDiabetes', 'Gestational diabetes?'), () => isGc ? yesNo(pm.gestational_diabetes) : ''],
    [gcLabel('surrogate.application.gcIntake.hypertensionPregnancy', 'Hypertension during pregnancy?'), () => isGc ? yesNo(pm.hypertension_pregnancy) : ''],
    [gcLabel('surrogate.application.gcIntake.bloodTransfusion', 'Blood transfusion during pregnancy?'), () => isGc ? yesNo(pm.blood_transfusion) : ''],
    [gcLabel('surrogate.application.gcIntake.seizures', 'Seizures?'), () => isGc ? yesNo(pm.seizures) : ''],
    [gcLabel('surrogate.application.gcIntake.regularMenstrualCycles', 'Regular menstrual cycles?'), () => isGc ? yesNo(mh.regular_menstrual_cycles) : ''],
    [gcLabel('surrogate.application.gcIntake.birthControl', 'Birth control?'), () => isGc ? yesNo(mh.birth_control) : ''],
    [gcLabel('surrogate.application.gcIntake.birthControlType', 'Birth control type'), () => isGc ? v(mh.birth_control_type) : ''],
    [gcLabel('surrogate.application.gcIntake.takingMedications', 'Taking medications?'), () => isGc ? yesNo(mh.taking_medications) : ''],
    [gcLabel('surrogate.application.gcIntake.medicationsList', 'Medications list'), () => isGc ? v(mh.medications_list) : ''],
    [gcLabel('surrogate.application.gcIntake.lastPapSmear', 'Last Pap smear'), () => isGc ? v(mh.last_pap_smear) : ''],
    [gcLabel('surrogate.application.gcIntake.covidVaccinated', 'COVID-19 vaccinated?'), () => isGc ? yesNo(mh.covid_vaccinated) : ''],
    [gcLabel('surrogate.application.gcIntake.hepBVaccinated', 'Hepatitis B vaccinated?'), () => isGc ? yesNo(mh.hep_b_vaccinated) : ''],
    [gcLabel('surrogate.application.gcIntake.varicellaVaccinated', 'Varicella vaccinated?'), () => isGc ? yesNo(mh.varicella_vaccinated) : ''],
    [gcLabel('surrogate.application.gcIntake.ongoingMedicalTreatment', 'Ongoing medical treatment?'), () => isGc ? yesNo(mh.ongoing_medical_treatment) : ''],
    [gcLabel('surrogate.application.gcIntake.surgeriesPast2y', 'Surgeries in past 2 years?'), () => isGc ? yesNo(mh.surgeries_past_2y) : ''],
    [gcLabel('surrogate.application.gcIntake.surgeriesSpecify', 'Surgeries specify'), () => isGc ? v(mh.surgeries_specify) : ''],
    [gcLabel('surrogate.application.gcIntake.anxietyDepression', 'Anxiety or depression?'), () => isGc ? yesNo(mental.anxiety_depression) : ''],
    [gcLabel('surrogate.application.gcIntake.bipolarSchizoPersonality', 'Bipolar/schizophrenia/personality disorder?'), () => isGc ? yesNo(mental.bipolar_schizo_personality) : ''],
    [gcLabel('surrogate.application.gcIntake.adhd', 'ADHD?'), () => isGc ? yesNo(mental.adhd) : ''],
    [gcLabel('surrogate.application.gcIntake.medsAnxietyDepression', 'Meds for anxiety/depression?'), () => isGc ? yesNo(mental.meds_anxiety_depression) : ''],
    [gcLabel('surrogate.application.gcIntake.medsSpecify', 'Meds specify'), () => isGc ? v(mental.meds_specify) : ''],
    [gcLabel('surrogate.application.gcIntake.drugUsePregnancy', 'Drug use during pregnancy?'), () => isGc ? yesNo(substance.drug_use_pregnancy) : ''],
    [gcLabel('surrogate.application.gcIntake.drugTypes', 'Drug types'), () => drugTypes.join(', ')],
    [gcLabel('surrogate.application.gcIntake.marijuanaCurrent', 'Currently smoke marijuana?'), () => isGc ? yesNo(substance.marijuana_current) : ''],
    [gcLabel('surrogate.application.gcIntake.marijuanaLastUse', 'Last marijuana use'), () => isGc ? v(substance.marijuana_last_use) : ''],
    [gcLabel('surrogate.application.gcIntake.smokedVapedPregnancy', 'Smoked/vaped during pregnancy?'), () => isGc ? yesNo(substance.smoked_vaped_pregnancy) : ''],
    [gcLabel('surrogate.application.gcIntake.alcohol', 'Drink alcohol?'), () => isGc ? yesNo(substance.alcohol) : ''],
    [gcLabel('surrogate.application.gcIntake.alcoholFrequency', 'Alcohol frequency'), () => isGc ? v(substance.alcohol_frequency) : ''],
    [gcLabel('surrogate.application.gcIntake.syphilis', 'Syphilis'), () => isGc ? yesNo(infectious.syphilis) : ''],
    [gcLabel('surrogate.application.gcIntake.hepatitisBC', 'Hepatitis B or C'), () => isGc ? yesNo(infectious.hepatitis_b_c) : ''],
    [gcLabel('surrogate.application.gcIntake.genitalHerpes', 'Genital herpes'), () => isGc ? yesNo(infectious.genital_herpes) : ''],
    [gcLabel('surrogate.application.gcIntake.hiv', 'HIV/AIDS'), () => isGc ? yesNo(infectious.hiv) : ''],
    [gcLabel('surrogate.application.gcIntake.asthma', 'Asthma?'), () => isGc ? yesNo(otherMed.asthma) : ''],
    [gcLabel('surrogate.application.gcIntake.asthmaInhaler', 'Inhaler use per week'), () => isGc ? v(otherMed.asthma_inhaler_per_week) : ''],
    [gcLabel('surrogate.application.gcIntake.heartConditions', 'Heart conditions?'), () => isGc ? yesNo(otherMed.heart_conditions) : ''],
    [gcLabel('surrogate.application.gcIntake.cancerHistory', 'History of cancer?'), () => isGc ? yesNo(otherMed.cancer_history) : ''],
    [gcLabel('surrogate.application.gcIntake.scoliosis', 'Scoliosis?'), () => isGc ? yesNo(otherMed.scoliosis) : ''],
    [gcLabel('surrogate.application.gcIntake.endometrialAblation', 'Endometrial ablation?'), () => isGc ? yesNo(otherMed.endometrial_ablation) : ''],
    [gcLabel('surrogate.application.gcIntake.availability', 'Availability to proceed'), () => isGc ? v(prefs.availability) : ''],
    [gcLabel('surrogate.application.gcIntake.healthInsurance', 'Health insurance'), () => isGc ? v(prefs.health_insurance) : ''],
    [gcLabel('surrogate.application.gcIntake.openTwins', 'Open to twins?'), () => isGc ? yesNo(prefs.open_twins) : ''],
    [gcLabel('surrogate.application.gcIntake.openFetalReduction', 'Open to fetal reduction?'), () => isGc ? yesNo(prefs.open_fetal_reduction) : ''],
    [gcLabel('surrogate.application.gcIntake.openTermination', 'Open to termination if indicated?'), () => isGc ? yesNo(prefs.open_termination) : ''],
    [gcLabel('surrogate.application.gcIntake.openAmniocentesisCVS', 'Open to amniocentesis/CVS?'), () => isGc ? yesNo(prefs.open_amniocentesis_cvs) : ''],
    [gcLabel('surrogate.application.gcIntake.openSameSexSingleIP', 'Open to same-sex/single IP?'), () => isGc ? yesNo(prefs.open_same_sex_single_ip) : ''],
    [gcLabel('surrogate.application.gcIntake.willingPumpBreastMilk', 'Willing to pump breast milk?'), () => isGc ? yesNo(prefs.willing_pump_breast_milk) : ''],
    [gcLabel('surrogate.application.gcIntake.openIPHIV', 'Open to IP with HIV?'), () => isGc ? yesNo(prefs.open_ip_hiv) : ''],
    [gcLabel('surrogate.application.gcIntake.openIPHepatitisB', 'Open to IP with Hepatitis B?'), () => isGc ? yesNo(prefs.open_ip_hepatitis_b) : ''],
    [gcLabel('surrogate.application.gcIntake.pendingLegal', 'Pending legal?'), () => isGc ? yesNo(legal.pending_legal) : ''],
    [gcLabel('surrogate.application.gcIntake.criminalRecord', 'Criminal record?'), () => isGc ? yesNo(legal.criminal_record) : ''],
    [gcLabel('surrogate.application.gcIntake.emergencyContact', 'Emergency contact'), () => isGc ? v(legal.emergency_contact) : ''],
    [gcLabel('surrogate.application.gcIntake.governmentAssistance', 'Government assistance?'), () => isGc ? yesNo(legal.government_assistance) : ''],
    [gcLabel('surrogate.application.gcIntake.referredBy', 'Referred by'), () => isGc ? v(notes.referred_by) : ''],
    [gcLabel('surrogate.application.gcIntake.medicalRecordsSource', 'Medical records source'), () => isGc ? (medicalRecordsSourceMap[notes.medical_records_source] || notes.medical_records_source || '') : ''],
  ]

  columnDefs.forEach(([header, getVal]) => {
    headers.push(header)
    row[header] = getVal()
  })

  return { headers, row }
}

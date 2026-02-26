import type { Application } from '@/types/applications'

export type ParentsParsedData = {
  basicInfo: any
  contactInfo: any
  familyProfile: any
  programInterests: any
  referral: any
  embryoMedicalStatus: any
  languages: string
  ethnicity: string
  preferredContactMethod: string
}

function getServiceName(service: string, t: (key: string, options?: Record<string, unknown>) => string): string {
  const serviceMap: { [key: string]: string } = {
    surrogacyOnly: t('surrogacyService', { defaultValue: 'Surrogacy Service' }),
    surrogacyEggDonor: t('surrogacyEggDonorService', { defaultValue: 'Surrogacy + Egg Donor Service' }),
    eggDonorOnly: t('eggDonorService', { defaultValue: 'Egg Donor Service' }),
    thirdPartySurrogate: t('thirdPartySurrogate', { defaultValue: 'Third Party Surrogate' }),
    bringYourOwnSurrogate: t('bringYourOwnSurrogate', { defaultValue: 'Bring Your Own Surrogate' }),
    bringYourOwnSurrogateEgg: t('bringYourOwnSurrogateEgg', { defaultValue: 'Bring Your Own Surrogate + Egg Donor' }),
    notSure: t('notSure', { defaultValue: 'Not Sure' }),
  }
  return serviceMap[service] || service
}

function getTimingName(timing: string, t: (key: string, options?: Record<string, unknown>) => string): string {
  const timingMap: { [key: string]: string } = {
    immediately: t('timing.immediately', { defaultValue: 'Immediately' }),
    'within-3-months': t('timing.within3Months', { defaultValue: 'Within 3 months' }),
    'within-6-months': t('timing.within6Months', { defaultValue: 'Within 6 months' }),
    'within-1-year': t('timing.within1Year', { defaultValue: 'Within 1 year' }),
    flexible: t('timing.flexible', { defaultValue: 'Flexible' }),
  }
  return timingMap[timing] || timing
}

function getChildrenCountName(count: string, t: (key: string, options?: Record<string, unknown>) => string): string {
  const countMap: { [key: string]: string } = {
    one: t('childrenCount.one', { defaultValue: '1' }),
    two: t('childrenCount.two', { defaultValue: '2' }),
    three: t('childrenCount.three', { defaultValue: '3' }),
    four: t('childrenCount.four', { defaultValue: '4' }),
    open: t('childrenCount.open', { defaultValue: 'Open' }),
  }
  return countMap[count] || count
}

function formatYesNoValue(value: unknown, t: (key: string, options?: Record<string, unknown>) => string): string {
  if (value === true || value === 'Yes' || value === 'yes') return t('yes', { defaultValue: 'Yes' })
  if (value === false || value === 'No' || value === 'no') return t('no', { defaultValue: 'No' })
  if (value === null || value === undefined || value === '') return t('notAvailable', { defaultValue: 'N/A' })
  return String(value)
}

export function parseParentsApplicationData(application: Application): ParentsParsedData {
  const appData = application.application_data as any
  const basicInfo = appData?.basic_information || {}
  const contactInfo = appData?.contact_information || {}
  const familyProfile = appData?.family_profile || {}
  const programInterests = appData?.program_interests || {}
  const referral = appData?.referral || {}
  const embryoMedicalStatus = appData?.embryo_medical_status || {}

  const languages = Array.isArray(contactInfo.primary_languages)
    ? contactInfo.primary_languages.join(', ')
    : (contactInfo.primary_languages || '')
  const ethnicity = Array.isArray(basicInfo.ethnicity)
    ? basicInfo.ethnicity.join(', ')
    : (basicInfo.ethnicity || '')
  const preferredContactMethod = contactInfo.preferred_contact_method
    ? contactInfo.preferred_contact_method.split(',').join(', ')
    : ''

  return {
    basicInfo,
    contactInfo,
    familyProfile,
    programInterests,
    referral,
    embryoMedicalStatus,
    languages,
    ethnicity,
    preferredContactMethod,
  }
}

/** 固定列导出：一行一个准父母，列与详情页导出结构一致，供详情页与列表批量导出共用 */
export function buildParentsDetailFixedRow(
  application: Application,
  parsedData: ParentsParsedData,
  t: (key: string, opts?: { defaultValue?: string }) => string,
  formattedDates: { createdAt: string; updatedAt: string },
): { headers: string[]; row: Record<string, string> } {
  const { basicInfo, contactInfo, familyProfile, programInterests, referral, embryoMedicalStatus, languages, ethnicity, preferredContactMethod } = parsedData
  const v = (x: any) => (x === undefined || x === null || x === '') ? '' : String(x).trim()
  const yesNo = (val: unknown) => formatYesNoValue(val, t as any)

  const headers: string[] = []
  const row: Record<string, string> = {}

  const columnDefs: [string, string][] = [
    [t('export.applicationId', { defaultValue: 'Application ID' }), String(application?.id ?? '')],
    [t('firstName', { defaultValue: 'First Name' }), v(basicInfo.firstName)],
    [t('lastName', { defaultValue: 'Last Name' }), v(basicInfo.lastName)],
    [t('pronouns', { defaultValue: 'Pronouns' }), v(basicInfo.pronouns)],
    [t('genderIdentity', { defaultValue: 'Gender Identity' }), v(basicInfo.gender_identity)],
    [t('dateOfBirth', { defaultValue: 'Date of Birth' }), v(basicInfo.date_of_birth)],
    [t('ethnicity', { defaultValue: 'Ethnicity' }), ethnicity || ''],
    [t('email', { defaultValue: 'Email' }), v(contactInfo.email_address)],
    [t('phone', { defaultValue: 'Phone' }), `${contactInfo.cell_phone_country_code || ''} ${contactInfo.cell_phone || ''}`.trim()],
    [t('languages', { defaultValue: 'Languages' }), languages || ''],
    [t('preferredContactMethod', { defaultValue: 'Preferred contact method' }), preferredContactMethod || ''],
    [t('sexualOrientation', { defaultValue: 'Sexual Orientation' }), v(familyProfile.sexual_orientation)],
    [t('relationshipStatus', { defaultValue: 'Relationship Status' }), v(familyProfile.relationship_status)],
    [t('city', { defaultValue: 'City' }), v(familyProfile.city)],
    [t('country', { defaultValue: 'Country' }), v(familyProfile.country)],
    [t('state', { defaultValue: 'State' }), v(familyProfile.state_or_province)],
    [t('interestedServices', { defaultValue: 'Interested Services' }), getServiceName(programInterests.interested_services || '', t as any)],
    [t('journeyStartTiming', { defaultValue: 'Journey Start Timing' }), getTimingName(programInterests.journey_start_timing || '', t as any)],
    [t('desiredChildrenCount', { defaultValue: 'Desired Children Count' }), getChildrenCountName(programInterests.desired_children_count || '', t as any)],
    [t('hasEmbryos', { defaultValue: 'Has Embryos' }), yesNo(embryoMedicalStatus.has_embryos)],
    [t('embryoClinicName', { defaultValue: 'Embryo Clinic Name' }), v(embryoMedicalStatus.embryo_clinic_name)],
    [t('embryoCount', { defaultValue: 'Embryo Count' }), v(embryoMedicalStatus.embryo_count)],
    [t('pgtStatus', { defaultValue: 'PGT Status' }), yesNo(embryoMedicalStatus.pgt_status)],
    [t('hasFertilityClinic', { defaultValue: 'Has Fertility Clinic' }), yesNo(embryoMedicalStatus.has_fertility_clinic)],
    [t('fertilityClinicName', { defaultValue: 'Fertility Clinic Name' }), v(embryoMedicalStatus.fertility_clinic_name)],
    [t('referralSource', { defaultValue: 'Referral Source' }), v(referral.referral_source)],
    [t('initialQuestions', { defaultValue: 'Initial Questions' }), v(referral.initial_questions)],
    [t('applicationDate', { defaultValue: 'Application Date' }), formattedDates.createdAt],
    [t('lastUpdate', { defaultValue: 'Last Update' }), formattedDates.updatedAt],
  ]

  columnDefs.forEach(([header, value]) => {
    headers.push(header)
    row[header] = value || t('notAvailable', { defaultValue: 'N/A' })
  })

  return { headers, row }
}

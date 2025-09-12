// 代孕母相关类型定义
// 基于 GraphQL schema 中的 surrogate_mothers 表结构和前端申请页面

// ========== 枚举类型定义 ==========

// 联系来源
export enum ContactSource {
  FRIEND_REFERRAL = 'FRIEND_REFERRAL',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA', 
  GOOGLE_SEARCH = 'GOOGLE_SEARCH',
  OTHER = 'OTHER'
}

// 婚姻状态
export enum MaritalStatusEnum {
  MARRIED = 'MARRIED',
  ENGAGED = 'ENGAGED',
  CO_HABITATING = 'CO_HABITATING',
  LIVING_SEPARATELY = 'LIVING_SEPARATELY',
  SINGLE = 'SINGLE',
  DIVORCED_FINALIZED = 'DIVORCED_FINALIZED',
  DIVORCED_IN_PROGRESS = 'DIVORCED_IN_PROGRESS',
  LEGALLY_SEPARATED = 'LEGALLY_SEPARATED',
  SEPARATED_INFORMALLY = 'SEPARATED_INFORMALLY'
}

// 伴侣支持状态
export enum PartnerSupportStatus {
  YES = 'YES',
  NO = 'NO',
  NOT_APPLICABLE = 'NOT_APPLICABLE'
}

// 收入范围
export enum IncomeRange {
  UNDER_30K = 'UNDER_30K',
  BETWEEN_30K_50K = 'BETWEEN_30K_50K',
  BETWEEN_50K_75K = 'BETWEEN_50K_75K',
  BETWEEN_75K_100K = 'BETWEEN_75K_100K',
  OVER_100K = 'OVER_100K',
  DECLINE_TO_STATE = 'DECLINE_TO_STATE'
}

// 政府援助类型
export enum GovernmentAssistanceType {
  FOOD_STAMPS = 'FOOD_STAMPS',
  MEDICAID = 'MEDICAID',
  CASH_ASSISTANCE = 'CASH_ASSISTANCE',
  FINANCIAL_AID = 'FINANCIAL_AID',
  WIC = 'WIC',
  SSI = 'SSI',
  PUBLIC_HOUSING = 'PUBLIC_HOUSING',
  SUBSIDIZED_CHILDCARE = 'SUBSIDIZED_CHILDCARE',
  STUDENT_LOANS = 'STUDENT_LOANS',
  OTHER_ASSISTANCE = 'OTHER_ASSISTANCE'
}

// 医疗状况
export enum MedicalCondition {
  DIABETES = 'DIABETES',
  HYPERTENSION = 'HYPERTENSION',
  BIPOLAR_DISORDER = 'BIPOLAR_DISORDER',
  MULTIPLE_MISCARRIAGES = 'MULTIPLE_MISCARRIAGES',
  SEIZURE_DISORDER = 'SEIZURE_DISORDER',
  NONE = 'NONE'
}

// 公民身份状态
export enum CitizenshipStatus {
  US_CITIZEN = 'US_CITIZEN',
  PERMANENT_RESIDENT = 'PERMANENT_RESIDENT',
  VISA_HOLDER = 'VISA_HOLDER',
  OTHER = 'OTHER'
}

// ========== 关于你自己相关类型 ==========

// 基本信息
export interface BasicInfo {
  firstName: string
  lastName: string
  fullLegalName: string
  dateOfBirth: string
  age: number
  gender: 'female' | 'other'
}

// 身份信息
export interface IdentityInfo {
  citizenshipStatus: CitizenshipStatus | string
  occupation: string
  education: string
  hasHighSchoolDiploma: boolean
}

// 婚姻状况
export interface MaritalStatus {
  status: MaritalStatusEnum | string
  partnerSupport?: PartnerSupportStatus | string
  partnerName?: string
}

// 代孕经验
export interface SurrogateExperience {
  isFormerSurrogate: boolean
  experienceDescription?: string
  previousSurrogacyCount?: number
}

// 家庭信息
export interface FamilyInfo {
  householdIncome: IncomeRange | string
  numberOfChildren: number
  childrenAges: number[]
}

// 个人描述
export interface PersonalDescription {
  description?: string
  motivation?: string
  interests?: string[]
  hobbies?: string[]
}

// 关于你自己组合
export interface AboutYou {
  basicInfo: BasicInfo
  identityInfo: IdentityInfo
  maritalStatus: MaritalStatus
  surrogateExperience: SurrogateExperience
  familyInfo: FamilyInfo
  personalDescription?: PersonalDescription
}
  
// ========== 联系方式相关类型 ==========

// 联系方式
export interface ContactDetails {
  email: string
  phoneNumber: string
  countryCode: string
  mobileWithCountryCode: string
  preferredContactMethod?: 'email' | 'phone' | 'sms'
  timeZone?: string
}

// 地址信息
export interface AddressInfo {
  street?: string
  city: string
  state: string
  zipCode: string
  country: string
}

// 紧急联系人
export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
}

// 联系方式组合
export interface ContactInformation {
  contactDetails: ContactDetails
  address: AddressInfo
  emergencyContact?: EmergencyContact
}
  
// ========== 准生育与健康经历相关类型 ==========

// 怀孕历史
export interface PregnancyHistory {
  hasGivenBirth: boolean
  hasStillbirth: boolean
  birthDetails?: string
  isPregnant: boolean
  isBreastfeeding: boolean
  height: number // 英寸
  weightPounds: number
  lastPregnancyDate?: string
}

// 健康历史
export interface HealthHistory {
  isTakingMeds: boolean
  medicationsList?: string
  medicalConditions: MedicalCondition[] | string[]
  allergies?: string[]
  bloodType?: string
  lastPhysicalExam?: string
}

// 财务和法律信息
export interface FinancialLegal {
  hasCriminalRecord: boolean
  criminalDescription?: string
  hasLegalProceedings: boolean
  proceedingDetails?: string
  hasCPSHistory: boolean
  governmentAssistance: GovernmentAssistanceType[] | string[]
  otherAssistanceDetail?: string
}

// 生活方式
export interface Lifestyle {
  smoking: boolean
  alcohol: 'none' | 'occasional' | 'regular'
  exercise: 'none' | 'light' | 'moderate' | 'intense'
  diet: 'standard' | 'vegetarian' | 'vegan' | 'other'
  sleepSchedule: string
}

// 心理健康
export interface MentalHealth {
  depression: boolean
  anxiety: boolean
  otherConditions: string[]
  therapyHistory: boolean
  currentTherapy: boolean
}

// 准生育与健康经历组合
export interface PregnancyAndHealth {
  pregnancyHistory: PregnancyHistory
  healthHistory: HealthHistory
  financialLegal: FinancialLegal
  lifestyle: Lifestyle
  mentalHealth: MentalHealth
}
  
// ========== 上传图片相关类型 ==========

// 上传的图片
export interface UploadPhoto {
  id: string
  name: string
  url: string
  type: 'profile' | 'family' | 'medical' | 'lifestyle' | 'other'
  description?: string
  uploadedAt: string
  size: number
  width?: number
  height?: number
}
  
// ========== 申请表 application_data 类型 ==========

// 代孕母申请数据（用于 applications 表的 application_data 字段）
// 完全匹配前端表单结构
export interface SurrogateMotherApplicationData {
  // 基本信息
  firstName: string
  lastName: string
  email: string
  mobileWithCountryCode: string
  birthDate: string
  citizenshipStatus: string
  occupation: string
  city: string
  state: string
  zipCode: string
  country: string
  
  // 联系来源
  contactSource: ContactSource | string
  contactSourceOther?: string
  
  // 教育背景
  hasHighSchoolDiploma: boolean
  
  // 婚姻状况
  maritalStatus: MaritalStatusEnum | string
  partnerSupport?: PartnerSupportStatus | string
  
  // 代孕经验
  isFormerSurrogate: boolean
  surrogateExperience?: string
  
  // 财务和法律信息
  householdIncome: IncomeRange | string
  financialLegal: {
    criminalDescription?: string
    governmentAssistance: GovernmentAssistanceType[] | string[]
    hasCPSHistory: boolean
    hasCriminalRecord: boolean
    hasLegalProceedings: boolean
    otherAssistanceDetail?: string
    proceedingDetails?: string
  }
  
  // 健康历史
  healthHistory: {
    isTakingMeds: boolean
    medicalConditions: MedicalCondition[] | string[]
    medicationsList?: string
  }
  
  // 怀孕历史
  pregnancyHistory: {
    birthDetails?: string
    hasGivenBirth: boolean
    hasStillbirth: boolean
    height?: number
    isBreastfeeding: boolean
    isPregnant: boolean
    weightPounds?: number
  }
  
  // 同意条款
  smsConsent: boolean
}
  
// ========== 完整表结构类型 ==========

// 代孕母完整记录（对应 surrogate_mothers 表）
export interface SurrogateMother {
  id: number
  created_at: string
  updated_at: string
  about_you?: AboutYou
  contact_information?: ContactInformation
  pregnancy_and_health?: PregnancyAndHealth
  upload_photos?: UploadPhoto[]
}
  
// ========== 筛选和操作相关类型 ==========

// 代孕母筛选条件
export interface SurrogateMotherFilters {
  search?: string
  status?: string
  ageRange?: {
    min?: number
    max?: number
  }
  state?: string
  country?: string
  maritalStatus?: MaritalStatusEnum | string
  hasExperience?: boolean
  isPregnant?: boolean
  isBreastfeeding?: boolean
  hasGivenBirth?: boolean
  healthStatus?: string
  createdAfter?: string
  createdBefore?: string
}

// 代孕母状态枚举
export type SurrogateMotherStatus = 
  | 'pending'           // 待处理
  | 'under_review'      // 审核中
  | 'approved'          // 已通过
  | 'rejected'          // 已拒绝
  | 'on_hold'           // 暂停
  | 'active'            // 活跃
  | 'inactive'          // 非活跃
  | 'matched'           // 已匹配
  | 'pregnant'          // 怀孕中
  | 'completed'         // 已完成

// 代孕母创建输入
export interface CreateSurrogateMotherInput {
  about_you: AboutYou
  contact_information: ContactInformation
  pregnancy_and_health: PregnancyAndHealth
  upload_photos?: UploadPhoto[]
}

// 代孕母更新输入
export interface UpdateSurrogateMotherInput {
  id: number
  about_you?: Partial<AboutYou>
  contact_information?: Partial<ContactInformation>
  pregnancy_and_health?: Partial<PregnancyAndHealth>
  upload_photos?: UploadPhoto[]
}

// 代孕母列表响应
export interface SurrogateMotherListResponse {
  data: SurrogateMother[]
  total: number
  page: number
  limit: number
}

// 代孕母详情响应
export interface SurrogateMotherDetailResponse {
  data: SurrogateMother
  medicalRecords?: any[] // 医疗记录
  matchingHistory?: any[] // 匹配历史
  communicationHistory?: any[] // 沟通历史
}

// 代孕母匹配偏好
export interface SurrogateMatchingPreferences {
  intendedParentAgeRange: {
    min: number
    max: number
  }
  preferredLocation: string[]
  compensationRange: {
    min: number
    max: number
  }
  specialRequirements: string[]
  communicationStyle: 'frequent' | 'moderate' | 'minimal'
  relationshipType: 'professional' | 'friendly' | 'family-like'
}

// 代孕母评估
export interface SurrogateAssessment {
  id: number
  surrogateId: number
  assessorId: number
  assessmentDate: string
  overallScore: number
  categories: {
    health: number
    lifestyle: number
    communication: number
    reliability: number
    motivation: number
  }
  notes: string
  recommendations: string[]
  status: 'pending' | 'approved' | 'rejected' | 'needs_followup'
}
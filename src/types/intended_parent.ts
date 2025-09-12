// 准父母相关类型定义
// 基于 GraphQL schema 中的 intended_parents 表结构

// ========== 基本信息相关类型 ==========

// 个人身份信息
export interface PersonalIdentity {
    firstName: string
    lastName: string
    fullLegalName: string
    dateOfBirth: string
    genderIdentity: string
    genderSelfDescribe?: string
    pronouns: string
    pronounsSelfDescribe?: string
    sexualOrientation: string
    sexualOrientationSelfDescribe?: string
  }
  
  // 种族和语言信息
  export interface EthnicityAndLanguage {
    ethnicities: string[]
    ethnicitySelfDescribe?: string
    languages: string[]
    otherLanguage?: string
  }
  
  // 地址信息
  export interface AddressInfo {
    city: string
    country: string
    stateProvince: string
  }
  
  // 基本信息组合
  export interface BasicInformation {
    personalIdentity: PersonalIdentity
    ethnicityAndLanguage: EthnicityAndLanguage
    addressInfo: AddressInfo
  }
  
  // ========== 联系信息相关类型 ==========
  
  // 联系方式
  export interface ContactDetails {
    email: string
    phoneNumber: string
    countryCode: string
    preferredContactMethod?: 'email' | 'phone' | 'sms'
    timeZone?: string
  }
  
  // 详细地址
  export interface DetailedAddress {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  
  // 联系信息组合
  export interface ContactInformation {
    contactDetails: ContactDetails
    address: DetailedAddress
  }
  
  // ========== 家庭资料相关类型 ==========
  
  // 婚姻状况
  export interface MaritalStatus {
    status: 'single' | 'married' | 'divorced' | 'widowed' | 'partnered'
    partnerName?: string
    partnerSupport?: 'supportive' | 'neutral' | 'unsupportive'
  }
  
  // 现有子女信息
  export interface ExistingChildren {
    count: number
    ages: number[]
    biological: boolean
  }
  
  // 家庭背景
  export interface FamilyBackground {
    parentsSupport: 'supportive' | 'neutral' | 'unsupportive'
    siblingsSupport: 'supportive' | 'neutral' | 'unsupportive'
    extendedFamilyAwareness: boolean
  }
  
  // 生活方式
  export interface Lifestyle {
    workSchedule: string
    hobbies: string[]
    travelFrequency: 'frequent' | 'occasional' | 'rare'
  }
  
  // 家庭资料组合
  export interface FamilyProfile {
    maritalStatus: MaritalStatus
    existingChildren?: ExistingChildren
    familyBackground?: FamilyBackground
    lifestyle?: Lifestyle
  }
  
  // ========== 项目意向相关类型 ==========
  
  // 基本意向
  export interface BasicIntentions {
    desiredChildrenCount: '1' | '2' | '3' | '4+' | 'open'
    journeyStartTiming: 'immediately' | 'within-3-months' | 'within-6-months' | 'within-1-year' | 'flexible'
    programInterests: string[]
    initialQuestions?: string
  }
  
  // 预算信息
  export interface BudgetInfo {
    min: number
    max: number
    currency: string
  }
  
  // 代孕母偏好
  export interface SurrogatePreferences {
    ageRange: {
      min: number
      max: number
    }
    location: string[]
    healthRequirements: string[]
    experienceLevel: 'first-time' | 'experienced' | 'any'
    personalityTraits: string[]
  }
  
  // 项目意向组合
  export interface ProgramInterests {
    basicIntentions: BasicIntentions
    budgetRange?: BudgetInfo
    specialRequirements?: string[]
    surrogatePreferences?: SurrogatePreferences
  }
  
  // ========== 渠道及初步沟通相关类型 ==========
  
  // 推荐来源
  export interface ReferralSource {
    source: 'website' | 'social-media' | 'referral' | 'advertisement' | 'other'
    otherDescription?: string
  }
  
  // 沟通记录
  export interface CommunicationRecord {
    date: string
    method: 'phone' | 'email' | 'video-call' | 'in-person'
    notes: string
    followUpRequired: boolean
    nextContactDate?: string
  }
  
  // 营销信息
  export interface MarketingInfo {
    heardAboutUs: string
    interestedIn: string[]
    concerns: string[]
  }
  
  // 渠道及初步沟通组合
  export interface Referral {
    referralSource: ReferralSource
    initialCommunication?: CommunicationRecord[]
    marketingInfo?: MarketingInfo
  }
  
  // ========== 申请表 application_data 类型 ==========
  
  // 准父母申请数据（用于 applications 表的 application_data 字段）
  export interface IntendedParentApplicationData {
    // 基本信息
    accountId: number
    firstName: string
    lastName: string
    fullLegalName: string
    email: string
    phoneNumber: string
    countryCode: string
    dateOfBirth: string
    city: string
    country: string
    stateProvince: string
    
    // 身份信息
    genderIdentity: string
    genderSelfDescribe?: string
    pronouns: string
    pronounsSelfDescribe?: string
    sexualOrientation: string
    sexualOrientationSelfDescribe?: string
    
    // 种族和语言
    ethnicities: string[]
    ethnicitySelfDescribe?: string
    languages: string[]
    otherLanguage?: string
    
    // 项目意向
    desiredChildrenCount: string
    journeyStartTiming: string
    programInterests: string[]
    initialQuestions?: string
    
    // 联系来源
    referralSource?: string
    
    // 同意条款
    consentAgreement: boolean
    consentSMS: boolean
  }
  
  // ========== 完整表结构类型 ==========
  
  // 准父母完整记录（对应 intended_parents 表）
  export interface IntendedParent {
    id: number
    created_at: string
    updated_at: string
    basic_information?: BasicInformation
    contact_information?: ContactInformation
    family_profile?: FamilyProfile
    program_interests?: ProgramInterests
    referral?: Referral
  }
  
  // ========== 筛选和操作相关类型 ==========
  
  // 准父母筛选条件
  export interface IntendedParentFilters {
    search?: string
    status?: string
    country?: string
    stateProvince?: string
    genderIdentity?: string
    maritalStatus?: string
    desiredChildrenCount?: string
    journeyStartTiming?: string
    referralSource?: string
    createdAfter?: string
    createdBefore?: string
  }
  
  // 准父母状态枚举
  export type IntendedParentStatus = 
    | 'pending'           // 待处理
    | 'under_review'      // 审核中
    | 'approved'          // 已通过
    | 'rejected'          // 已拒绝
    | 'on_hold'           // 暂停
    | 'active'            // 活跃
    | 'inactive'          // 非活跃
    | 'completed'         // 已完成
  
  // 准父母创建输入
  export interface CreateIntendedParentInput {
    basic_information: BasicInformation
    contact_information: ContactInformation
    family_profile?: FamilyProfile
    program_interests: ProgramInterests
    referral?: Referral
  }
  
  // 准父母更新输入
  export interface UpdateIntendedParentInput {
    id: number
    basic_information?: Partial<BasicInformation>
    contact_information?: Partial<ContactInformation>
    family_profile?: Partial<FamilyProfile>
    program_interests?: Partial<ProgramInterests>
    referral?: Partial<Referral>
  }
  
  // 准父母列表响应
  export interface IntendedParentListResponse {
    data: IntendedParent[]
    total: number
    page: number
    limit: number
  }
  
  // 准父母详情响应
  export interface IntendedParentDetailResponse {
    data: IntendedParent
    relatedCases?: any[] // 相关案例
    communicationHistory?: any[] // 沟通历史
  }
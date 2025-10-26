// 代孕母相关类型定义

// ========== 枚举定义 ==========

// 种族枚举
export enum Ethnicity {
  ASIAN = 'ASIAN',
  WHITE = 'WHITE', 
  BLACK = 'BLACK',
  HISPANIC = 'HISPANIC',
  MIDDLE_EASTERN = 'MIDDLE_EASTERN',
  NATIVE_AMERICAN = 'NATIVE_AMERICAN',
  PACIFIC_ISLANDER = 'PACIFIC_ISLANDER',
  MIXED_RACE = 'MIXED_RACE',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY',
  OTHER = 'OTHER'
}

// 教育水平枚举
export enum EducationLevel {
  HIGH_SCHOOL = 'HIGH_SCHOOL',
  SOME_COLLEGE = 'SOME_COLLEGE',
  ASSOCIATE_DEGREE = 'ASSOCIATE_DEGREE',
  BACHELOR_DEGREE = 'BACHELOR_DEGREE',
  MASTER_DEGREE = 'MASTER_DEGREE',
  DOCTORATE = 'DOCTORATE',
  OTHER = 'OTHER'
}

// 美国公民或签证身份枚举
export enum USCitizenOrVisaStatus {
  US_CITIZEN = 'US_CITIZEN',
  PERMANENT_RESIDENT = 'PERMANENT_RESIDENT',
  WORK_VISA = 'WORK_VISA',
  STUDENT_VISA = 'STUDENT_VISA',
  TOURIST_VISA = 'TOURIST_VISA',
  OTHER_VISA = 'OTHER_VISA',
  NO_STATUS = 'NO_STATUS'
}

// 背景调查状态枚举
export enum BackgroundCheckStatus {
  APPROVED = 'APPROVED',
  NOT_APPROVED = 'NOT_APPROVED',
  PENDING = 'PENDING',
  NOT_REQUIRED = 'NOT_REQUIRED'
}

// 联系来源枚举
export enum ContactSource {
  WEBSITE = 'WEBSITE',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  REFERRAL = 'REFERRAL',
  ADVERTISEMENT = 'ADVERTISEMENT',
  OTHER = 'OTHER'
}

// 婚姻状态枚举
export enum MaritalStatus {
  MARRIED = 'MARRIED',
  ENGAGED = 'ENGAGED',
  COHABITATING = 'COHABITATING',
  LIVING_SEPARATELY = 'LIVING_SEPARATELY',
  SINGLE = 'SINGLE',
  DIVORCED_FINALIZED = 'DIVORCED_FINALIZED',
  DIVORCED_IN_PROCESS = 'DIVORCED_IN_PROCESS',
  LEGALLY_SEPARATED = 'LEGALLY_SEPARATED',
  SEPARATED_INFORMALLY = 'SEPARATED_INFORMALLY'
}

// 伴侣支持状态枚举
export enum PartnerSupport {
  YES = 'YES',
  NO = 'NO',
  NOT_APPLICABLE = 'NOT_APPLICABLE'
}

// 家庭收入范围枚举
export enum HouseholdIncome {
  UNDER_30K = 'UNDER_30K',
  BETWEEN_30K_50K = 'BETWEEN_30K_50K',
  BETWEEN_50K_75K = 'BETWEEN_50K_75K',
  BETWEEN_75K_100K = 'BETWEEN_75K_100K',
  OVER_100K = 'OVER_100K',
  PREFER_NOT_TO_SAY = 'PREFER_NOT_TO_SAY'
}

// 医疗状况枚举
export enum MedicalCondition {
  DIABETES = 'DIABETES',
  HYPERTENSION = 'HYPERTENSION',
  BIPOLAR_DISORDER = 'BIPOLAR_DISORDER',
  MULTIPLE_MISCARRIAGES = 'MULTIPLE_MISCARRIAGES',
  SEIZURE_DISORDER = 'SEIZURE_DISORDER',
  NONE = 'NONE'
}

// ========== 基本信息组合 ==========

// 联系方式
export interface ContactInformation {
  first_name: string; // 名字
  last_name: string; // 姓氏
  date_of_birth: string; // 出生日期
  cell_phone_country_code: string; // 国际区号
  cell_phone: string; // 手机号
  is_agree_cell_phone_receive_messages: boolean; // 是否同意接收手机短信
  email_address: string; // 邮箱地址
  city: string; // 城市
  country: string; // 国家
  country_selected_key: string; // 国家选择键,一般是多语言的key,用于回显
  state_or_province: string; // 州/省
  state_or_province_selected_key: string; // 州/省选择键,一般是多语言的key,用于回显
  zip_code: string; // 邮编
  // 新增字段
  height: string; // 身高
  weight: string; // 体重
  bmi: number; // BMI
  ethnicity: string; // 种族
  ethnicity_selected_key: Ethnicity; // 种族选择键
  surrogacy_experience_count: number; // 代孕经验次数
  us_citizen_or_visa_status: string; // 美国公民或签证身份
  us_citizen_or_visa_status_selected_key: USCitizenOrVisaStatus; // 美国公民或签证身份选择键
}

// 关于你自己
export interface AboutYou {
  // 联系来源
  contact_source: string; // 联系来源(website, social_media, referral, advertisement, other)
  contact_source_selected_key: ContactSource; // 联系来源选择键,一般是多语言的key,用于回显

  // 职业和教育
  occupation: string; // 职业
  education_level: string; // 最高学历
  education_level_selected_key: EducationLevel; // 最高学历选择键

  // 代孕经验
  is_former_surrogate: boolean; // 是否曾经是代孕母
  surrogate_experience: string; // 代孕经验描述

  // 个人状况
  marital_status: string; // 婚姻状态(married, engaged, cohabitating, living_separately, single, divorced_finalized, divorced_in_process, legally_separated, separated_informally)
  marital_status_selected_key: MaritalStatus; // 婚姻状态选择键,一般是多语言的key,用于回显
  partner_support: string; // 伴侣支持状态(yes, no, not_applicable)
  partner_support_selected_key: PartnerSupport; // 伴侣支持状态选择键,一般是多语言的key,用于回显
  has_high_school_diploma: boolean; // 是否有高中文凭

  // 财务信息
  household_income: string; // 家庭收入范围(under_30k, between_30k_50k, between_50k_75k, between_75k_100k, over_100k, prefer_not_to_say)
  household_income_selected_key: HouseholdIncome; // 家庭收入范围选择键,一般是多语言的key,用于回显
}

// 怀孕历史详情
export interface PregnancyHistory {
  delivery_date: string; // 分娩日期
  birth_weight: string; // 出生体重
  gestational_weeks: string; // 孕周
  number_of_babies: string; // 胎儿数
  delivery_method: string; // 分娩方式
}

// 准生育与健康经历
export interface PregnancyAndHealth {
  // 怀孕历史
  has_given_birth: boolean; // 是否曾经分娩
  birth_details: string; // 分娩详情
  is_currently_pregnant: boolean; // 是否怀孕
  is_breastfeeding: boolean; // 是否正在哺乳
  has_stillbirth: boolean; // 是否有死胎经历

  // 健康历史
  medical_conditions: string[]; // 医疗状况(diabetes, hypertension, bipolar_disorder, multiple_miscarriages, seizure_disorder, none)
  medical_conditions_selected_keys: MedicalCondition[]; // 医疗状况选择键,一般是多语言的key,用于回显
  is_taking_medications: boolean; // 是否正在服药
  medications_list: string; // 药物清单

  // 新增法律和背景调查字段
  domestic_violence: boolean; // 家庭暴力
  substance_abuse: boolean; // 药物滥用
  felony_charges: boolean; // 重罪指控
  outstanding_warrant: boolean; // 未执行逮捕令
  formal_probation: boolean; // 正式缓刑
  arrests: boolean; // 逮捕记录
  child_abuse_neglect: boolean; // 虐待/忽视儿童
  child_protection_investigation: boolean; // 儿童保护调查
  background_check_status: string; // 背景调查状态(approved, not_approved)
  background_check_status_selected_key: BackgroundCheckStatus; // 背景调查状态选择键,一般是多语言的key,用于回显

  // 怀孕历史详情
  pregnancy_histories: PregnancyHistory[]; // 怀孕历史详情列表

  serious_pregnancy_complications: boolean; // 严重孕期并发症
  current_birth_control: string; // 当前避孕方式
  closest_hospital: string; // 最近的医院
  closest_nicu_iii: string; // 最近的三级新生儿重症监护室
}

// 代孕面试问题
export interface GestationalSurrogacyInterview {
  emotional_support: string; // 情感支持者
  languages_spoken: string; // 会说的语言
  motivation: string; // 代孕动机
  self_introduction: string; // 自我介绍
  contact_preference: string; // 与准父母联系偏好
  hipaa_release_willing: boolean; // 是否愿意签署HIPAA授权表
  twins_feeling: string; // 对怀双胞胎的态度
  multiple_reduction_willing: boolean; // 是否愿意根据医疗建议减少多胎
  termination_willing: boolean; // 是否愿意根据医疗建议终止妊娠
}

// 上传的图片
export interface UploadPhoto {
  name: string; // 图片名称
  url: string; // 图片URL
}

// ========== 申请表 application_data 类型 ==========

// 代孕母申请数据（用于 applications 表的 application_data 字段）
export interface SurrogateMotherApplicationData {
  // 联系方式
  contact_information?: ContactInformation;
  // 关于你自己
  about_you?: AboutYou;
  // 准生育与健康经历
  pregnancy_and_health?: PregnancyAndHealth;
  // 代孕面试问题
  gestational_surrogacy_interview?: GestationalSurrogacyInterview;
  // 上传的图片
  upload_photos?: UploadPhoto[];
}

// ========== 完整表结构类型 ==========

// 代孕母完整记录（对应 surrogate_mothers 表）
export interface SurrogateMother {
  id: number;
  email: string;
  password?: string;
  created_at: string;
  updated_at: string;
  contact_information?: ContactInformation;
  about_you?: AboutYou;
  pregnancy_and_health?: PregnancyAndHealth;
  gestational_surrogacy_interview?: GestationalSurrogacyInterview;
  upload_photos?: UploadPhoto[];
}

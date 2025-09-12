// 代孕母相关类型定义

// ========== 基本信息组合 ==========

// 联系方式
export interface ContactInformation {
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
}

// 关于你自己
export interface AboutYou {
  first_name: string; // 名字
  last_name: string; // 姓氏
  date_of_birth: string; // 出生日期
  citizenship_status: string; // 公民身份状态(us_citizen, permanent_resident, valid_visa, other)
  citizenship_status_selected_key: string; // 公民身份状态选择键,一般是多语言的key,用于回显
  occupation: string; // 职业
  has_high_school_diploma: boolean; // 是否有高中文凭
  marital_status: string; // 婚姻状态(married, engaged, cohabitating, living_separately, single, divorced_finalized, divorced_in_process, legally_separated, separated_informally)
  marital_status_selected_key: string; // 婚姻状态选择键,一般是多语言的key,用于回显
  partner_support: string; // 伴侣支持状态(yes, no, not_applicable)
  partner_support_selected_key: string; // 伴侣支持状态选择键,一般是多语言的key,用于回显
  is_former_surrogate: boolean; // 是否曾经是代孕母
  surrogate_experience: string; // 代孕经验描述
  contact_source: string; // 联系来源(website, social_media, referral, advertisement, other)
  contact_source_selected_key: string; // 联系来源选择键,一般是多语言的key,用于回显
  contact_source_other: string; // 其他联系来源说明
  household_income: string; // 家庭收入范围(under_30k, between_30k_50k, between_50k_75k, between_75k_100k, over_100k, prefer_not_to_say)
  household_income_selected_key: string; // 家庭收入范围选择键,一般是多语言的key,用于回显
}

// 准生育与健康经历
export interface PregnancyAndHealth {
  // 怀孕历史
  has_given_birth: boolean; // 是否曾经分娩
  birth_details: string; // 分娩详情
  is_currently_pregnant: boolean; // 是否怀孕
  is_breastfeeding: boolean; // 是否正在哺乳
  has_stillbirth: boolean; // 是否有死胎经历
  height_inches: number; // 身高 (英寸)
  weight_pounds: number; // 体重 (磅)
  
  // 健康历史
  medical_conditions: string[]; // 医疗状况(diabetes, hypertension, bipolar_disorder, multiple_miscarriages, seizure_disorder, none)
  medical_conditions_selected_keys: string[]; // 医疗状况选择键,一般是多语言的key,用于回显
  is_taking_medications: boolean; // 是否正在服药
  medications_list: string; // 药物清单
  
  // 财务和法律信息
  has_criminal_record: boolean; // 是否有犯罪记录
  criminal_description: string; // 犯罪记录描述
  has_legal_proceedings: boolean; // 是否有法律诉讼
  proceeding_details: string; // 诉讼详情
  has_cps_history: boolean; // 是否有儿童保护服务历史
  government_assistance: string[]; // 政府援助类型(food_stamps, medicaid, cash_assistance, financial_aid, wic, ssi, public_housing, subsidized_childcare, student_loans, other)
  government_assistance_selected_keys: string[]; // 政府援助类型选择键,一般是多语言的key,用于回显
  other_assistance_detail: string; // 其他援助详情
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
  // 上传的图片
  upload_photos?: UploadPhoto[];
}

// ========== 完整表结构类型 ==========

// 代孕母完整记录（对应 surrogate_mothers 表）
export interface SurrogateMother {
  id: number;
  created_at: string;
  updated_at: string;
  contact_information?: ContactInformation;
  about_you?: AboutYou;
  pregnancy_and_health?: PregnancyAndHealth;
  upload_photos?: UploadPhoto[];
}

// ========== 枚举值定义 ==========

// 公民身份状态
export enum CitizenshipStatus {
  US_CITIZEN = 'us_citizen',
  PERMANENT_RESIDENT = 'permanent_resident',
  VALID_VISA = 'valid_visa',
  OTHER = 'other'
}

// 婚姻状态
export enum MaritalStatus {
  MARRIED = 'married',
  ENGAGED = 'engaged',
  COHABITATING = 'cohabitating',
  LIVING_SEPARATELY = 'living_separately',
  SINGLE = 'single',
  DIVORCED_FINALIZED = 'divorced_finalized',
  DIVORCED_IN_PROCESS = 'divorced_in_process',
  LEGALLY_SEPARATED = 'legally_separated',
  SEPARATED_INFORMALLY = 'separated_informally'
}

// 伴侣支持状态
export enum PartnerSupportStatus {
  YES = 'yes',
  NO = 'no',
  NOT_APPLICABLE = 'not_applicable'
}

// 联系来源
export enum ContactSource {
  WEBSITE = 'website',
  SOCIAL_MEDIA = 'social_media',
  REFERRAL = 'referral',
  ADVERTISEMENT = 'advertisement',
  OTHER = 'other'
}

// 收入范围
export enum IncomeRange {
  UNDER_30K = 'under_30k',
  BETWEEN_30K_50K = 'between_30k_50k',
  BETWEEN_50K_75K = 'between_50k_75k',
  BETWEEN_75K_100K = 'between_75k_100k',
  OVER_100K = 'over_100k',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say'
}

// 医疗状况
export enum MedicalCondition {
  DIABETES = 'diabetes',
  HYPERTENSION = 'hypertension',
  BIPOLAR_DISORDER = 'bipolar_disorder',
  MULTIPLE_MISCARRIAGES = 'multiple_miscarriages',
  SEIZURE_DISORDER = 'seizure_disorder',
  NONE = 'none'
}

// 政府援助类型
export enum GovernmentAssistance {
  FOOD_STAMPS = 'food_stamps',
  MEDICAID = 'medicaid',
  CASH_ASSISTANCE = 'cash_assistance',
  FINANCIAL_AID = 'financial_aid',
  WIC = 'wic',
  SSI = 'ssi',
  PUBLIC_HOUSING = 'public_housing',
  SUBSIDIZED_CHILDCARE = 'subsidized_childcare',
  STUDENT_LOANS = 'student_loans',
  OTHER = 'other'
}

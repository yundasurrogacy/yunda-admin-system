// 准父母相关类型定义

// 基本信息
export interface BasicInformation {
  firstName: string; //名字
  lastName: string; //姓氏
  pronouns: string; //代词(he/him, she/her, they/them(ta), other)
  pronouns_selected_key: string; //代词选择键,一般是多语言的key,用于回显
  gender_identity: string; //性别认同(male, female, transgender/trans man, transgender/trans woman, non-binary/genderqueer, prefer to self-describe)
  gender_identity_selected_key: string; //性别认同选择键,一般是多语言的key,用于回显
  date_of_birth: string; //出生日期
  ethnicity: string; //族裔(asian, white, black, hispanic, middle eastern, native american, pacific islander, mixed race, prefer not to say, other)
  ethnicity_selected_key: string; //族裔选择键,一般是多语言的key,用于回显
}

// 联系信息组合
export interface ContactInformation {
  cell_phone_country_code: string; //国际区号
  cell_phone: string; //手机号
  is_agree_cell_phone_receive_messages: boolean; //是否同意接收手机短信
  email_address: string; //邮箱地址
  primary_languages: string[]; //主要语言(english, mandarin, cantonese, spanish, french, korean, japanese, hindi, vietnamese, russian, arabic, portuguese, tagalog, german, italian, other)
  primary_languages_selected_keys: string[]; //主要语言选择键,一般是多语言的key,用于回显
}

// 家庭资料组合
export interface FamilyProfile {
  sexual_orientation: string; //性取向(heterosexual, homosexual, bisexual, pansexual, asexual, other)
  sexual_orientation_selected_key: string; //性取向选择键,一般是多语言的key,用于回显

  city: string; //城市
  country: string; //国家
  country_selected_key: string; //国家选择键,一般是多语言的key,用于回显
  state_or_province: string; //州/省
  state_or_province_selected_key: string; //州/省选择键,一般是多语言的key,用于回显
}

// 项目意向组合
export interface ProgramInterests {
  // 您可能需要哪些服务？
  interested_services: string; //感兴趣的服务(surrogacyEggDonor, surrogacyOnly, eggDonorOnly, thirdPartySurrogate, bringYourOwnSurrogate, bringYourOwnSurrogateEgg, notSure)
  interested_services_selected_keys: string; //感兴趣的服务选择键,一般是多语言的key,用于回显
  // 您希望何时开始您的旅程？
  journey_start_timing: string; //旅程开始时间(immediately, within-3-months, within-6-months, within-1-year, flexible)
  journey_start_timing_selected_key: string; //旅程开始时间选择键,一般是多语言的key,用于回显
  // 您希望通过本计划迎来几个孩子？
  desired_children_count: string; //期望孩子数量(one, two, three, four, open)
  desired_children_count_selected_key: string; //期望孩子数量选择键,一般是多语言的key,用于回显
}

// 渠道及初步沟通组合
export interface Referral {
  // 您是通过什么渠道了解到我们公司的？
  referral_source: string; //推荐来源(website, social-media, referral, advertisement, other)
  referral_source_selected_key: string; //推荐来源选择键,一般是多语言的key,用于回显
  // 您有任何想进一步了解的问题或话题吗？
  initial_questions: string; //初步问题
  initial_questions_selected_key: string; //初步问题选择键,一般是多语言的key,用于回显
}

// ========== 申请表 application_data 类型 ==========

// 准父母申请数据（用于 applications 表的 application_data 字段）
export interface IntendedParentApplicationData {
  // 基本信息
  basic_information?: BasicInformation;
  // 联系信息
  contact_information?: ContactInformation;
  // 家庭资料
  family_profile?: FamilyProfile;
  // 项目意向
  program_interests?: ProgramInterests;
  // 渠道及初步沟通
  referral?: Referral;
}

// ========== 完整表结构类型 ==========

// 准父母完整记录（对应 intended_parents 表）
export interface IntendedParent {
  id: number;
  created_at: string;
  updated_at: string;
  basic_information?: BasicInformation;
  contact_information?: ContactInformation;
  family_profile?: FamilyProfile;
  program_interests?: ProgramInterests;
  referral?: Referral;
}

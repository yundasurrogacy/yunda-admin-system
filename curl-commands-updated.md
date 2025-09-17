# 更新后的Applications API测试命令

## 前提条件
确保您的Next.js应用正在运行：
```bash
cd yunda-admin-system
npm run dev
```

## 快速运行所有测试
```bash
./test-applications-updated.sh
```

## 单独测试命令

### 1. 代孕母申请 - Sarah Williams (完整数据)

```bash
curl -X POST "http://localhost:3000/api/applications" \
  -H "Content-Type: application/json" \
  -d '{
    "application_type": "surrogate_mother",
    "application_data": {
      "contact_information": {
        "first_name": "Sarah",
        "last_name": "Williams",
        "date_of_birth": "1995-03-15",
        "cell_phone_country_code": "+1",
        "cell_phone": "555-0101",
        "is_agree_cell_phone_receive_messages": true,
        "email_address": "sarah.williams@email.com",
        "city": "Los Angeles",
        "country": "United States",
        "country_selected_key": "us",
        "state_or_province": "California",
        "state_or_province_selected_key": "ca",
        "zip_code": "90210",
        "height": "5'\''5\"",
        "weight": "140 lbs",
        "bmi": 23.3,
        "ethnicity": "white",
        "ethnicity_selected_key": "white",
        "surrogacy_experience_count": 0,
        "us_citizen_or_visa_status": "us_citizen",
        "us_citizen_or_visa_status_selected_key": "us_citizen"
      },
      "about_you": {
        "contact_source": "website",
        "contact_source_selected_key": "website",
        "occupation": "Teacher",
        "education_level": "bachelor",
        "education_level_selected_key": "bachelor",
        "is_former_surrogate": false,
        "surrogate_experience": "First time surrogate",
        "marital_status": "married",
        "marital_status_selected_key": "married",
        "partner_support": "yes",
        "partner_support_selected_key": "yes",
        "has_high_school_diploma": true,
        "household_income": "between_50k_75k",
        "household_income_selected_key": "between_50k_75k"
      },
      "pregnancy_and_health": {
        "has_given_birth": true,
        "birth_details": "2 healthy children, ages 3 and 5",
        "is_currently_pregnant": false,
        "is_breastfeeding": false,
        "has_stillbirth": false,
        "medical_conditions": ["none"],
        "medical_conditions_selected_keys": ["none"],
        "is_taking_medications": false,
        "medications_list": "",
        "domestic_violence": false,
        "substance_abuse": false,
        "felony_charges": false,
        "outstanding_warrant": false,
        "formal_probation": false,
        "arrests": false,
        "child_abuse_neglect": false,
        "child_protection_investigation": false,
        "background_check_status": "approved",
        "background_check_status_selected_key": "approved",
        "pregnancy_histories": [
          {
            "delivery_date": "2020-06-15",
            "birth_weight": "7.2 lbs",
            "gestational_weeks": "39",
            "number_of_babies": "1",
            "delivery_method": "vaginal"
          },
          {
            "delivery_date": "2022-08-20",
            "birth_weight": "8.1 lbs",
            "gestational_weeks": "40",
            "number_of_babies": "1",
            "delivery_method": "vaginal"
          }
        ],
        "serious_pregnancy_complications": false,
        "current_birth_control": "IUD",
        "closest_hospital": "Cedars-Sinai Medical Center",
        "closest_nicu_iii": "UCLA Medical Center"
      },
      "gestational_surrogacy_interview": {
        "emotional_support": "My husband and close family members will support me throughout this journey",
        "languages_spoken": "English, Spanish",
        "motivation": "I want to help couples who cannot have children naturally experience the joy of parenthood",
        "self_introduction": "I am a 28-year-old teacher, married with two children. I love helping others and believe in the power of giving.",
        "contact_preference": "Regular updates and photos throughout the pregnancy",
        "hipaa_release_willing": true,
        "twins_feeling": "I would be comfortable carrying twins if medically safe",
        "multiple_reduction_willing": true,
        "termination_willing": true
      },
      "upload_photos": [
        {
          "name": "profile_photo_1.jpg",
          "url": "https://example.com/photos/sarah_profile_1.jpg"
        },
        {
          "name": "family_photo_1.jpg",
          "url": "https://example.com/photos/sarah_family_1.jpg"
        }
      ]
    }
  }'
```

### 2. 准父母申请 - John Smith (简化数据)

```bash
curl -X POST "http://localhost:3000/api/applications" \
  -H "Content-Type: application/json" \
  -d '{
    "application_type": "intended_parent",
    "application_data": {
      "basic_information": {
        "firstName": "John",
        "lastName": "Smith",
        "pronouns": "he/him",
        "pronouns_selected_key": "he_him",
        "gender_identity": "male",
        "gender_identity_selected_key": "male",
        "date_of_birth": "1988-05-10",
        "ethnicity": "white",
        "ethnicity_selected_key": "white"
      },
      "contact_information": {
        "cell_phone_country_code": "+1",
        "cell_phone": "555-0201",
        "is_agree_cell_phone_receive_messages": true,
        "email_address": "john.smith@email.com",
        "primary_languages": ["english"],
        "primary_languages_selected_keys": ["english"]
      },
      "family_profile": {
        "sexual_orientation": "heterosexual",
        "sexual_orientation_selected_key": "heterosexual",
        "city": "New York",
        "country": "United States",
        "country_selected_key": "us",
        "state_or_province": "New York",
        "state_or_province_selected_key": "ny"
      },
      "program_interests": {
        "interested_services": "surrogacyOnly",
        "interested_services_selected_keys": "surrogacyOnly",
        "journey_start_timing": "within-6-months",
        "journey_start_timing_selected_key": "within-6-months",
        "desired_children_count": "two",
        "desired_children_count_selected_key": "two"
      },
      "referral": {
        "referral_source": "website",
        "referral_source_selected_key": "website",
        "initial_questions": "We are interested in learning more about the surrogacy process and costs involved.",
        "initial_questions_selected_key": "general_inquiry"
      }
    }
  }'
```

## 新功能特性

### 代孕母申请新增字段：
- **身高体重BMI**: 物理特征信息
- **种族**: 族裔背景
- **教育水平**: 最高学历
- **代孕经验次数**: 量化经验
- **美国公民身份**: 法律身份
- **怀孕历史详情**: 每次怀孕的详细记录
- **背景调查**: 犯罪记录和法律状况
- **代孕面试**: 9个核心面试问题
- **照片上传**: 个人和家庭照片

### 准父母申请保持原有结构：
- 基本信息
- 联系信息  
- 家庭资料
- 项目意向
- 推荐来源

## 查看结果

提交成功后，您可以在admin界面查看：

- **Parents Applications**: http://localhost:3000/admin/parents-applications
- **Surrogates Applications**: http://localhost:3000/admin/surrogates-applications

## 预期响应

成功的响应应该包含完整的申请数据，包括所有新增字段：

```json
{
  "success": true,
  "message": "申请表提交成功",
  "data": {
    "id": 5,
    "application_type": "surrogate_mother",
    "status": "pending",
    "application_data": {
      "contact_information": { ... },
      "about_you": { ... },
      "pregnancy_and_health": { ... },
      "gestational_surrogacy_interview": { ... },
      "upload_photos": [ ... ]
    },
    "created_at": "2025-09-12T22:07:14.558979+00:00",
    "updated_at": "2025-09-12T22:07:14.558979+00:00"
  }
}
```

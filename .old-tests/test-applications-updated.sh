#!/bin/bash

# 基于最新类型定义的Applications API测试脚本
# 提交2条代孕母申请和2条准父母申请

BASE_URL="http://localhost:3000"
API_ENDPOINT="$BASE_URL/api/applications"

echo "🚀 开始测试更新后的Applications API接口..."
echo "=========================================="

# 1. 代孕母申请 - Sarah Williams
echo "📝 提交代孕母申请 #1 - Sarah Williams"
curl -X POST "$API_ENDPOINT" \
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

echo -e "\n\n"

# 2. 代孕母申请 - Emily Davis
echo "📝 提交代孕母申请 #2 - Emily Davis"
curl -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "application_type": "surrogate_mother",
    "application_data": {
      "contact_information": {
        "first_name": "Emily",
        "last_name": "Davis",
        "date_of_birth": "1992-07-22",
        "cell_phone_country_code": "+1",
        "cell_phone": "555-0102",
        "is_agree_cell_phone_receive_messages": true,
        "email_address": "emily.davis@email.com",
        "city": "Austin",
        "country": "United States",
        "country_selected_key": "us",
        "state_or_province": "Texas",
        "state_or_province_selected_key": "tx",
        "zip_code": "73301",
        "height": "5'\''7\"",
        "weight": "155 lbs",
        "bmi": 24.3,
        "ethnicity": "hispanic",
        "ethnicity_selected_key": "hispanic",
        "surrogacy_experience_count": 1,
        "us_citizen_or_visa_status": "us_citizen",
        "us_citizen_or_visa_status_selected_key": "us_citizen"
      },
      "about_you": {
        "contact_source": "referral",
        "contact_source_selected_key": "referral",
        "occupation": "Nurse",
        "education_level": "bachelor",
        "education_level_selected_key": "bachelor",
        "is_former_surrogate": true,
        "surrogate_experience": "Successfully completed 1 surrogacy journey in 2022, delivered healthy twins",
        "marital_status": "married",
        "marital_status_selected_key": "married",
        "partner_support": "yes",
        "partner_support_selected_key": "yes",
        "has_high_school_diploma": true,
        "household_income": "between_75k_100k",
        "household_income_selected_key": "between_75k_100k"
      },
      "pregnancy_and_health": {
        "has_given_birth": true,
        "birth_details": "3 healthy children, ages 2, 4, and 6",
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
            "delivery_date": "2018-03-10",
            "birth_weight": "6.8 lbs",
            "gestational_weeks": "38",
            "number_of_babies": "1",
            "delivery_method": "vaginal"
          },
          {
            "delivery_date": "2020-09-15",
            "birth_weight": "7.5 lbs",
            "gestational_weeks": "39",
            "number_of_babies": "1",
            "delivery_method": "vaginal"
          },
          {
            "delivery_date": "2022-11-20",
            "birth_weight": "6.2 lbs",
            "gestational_weeks": "37",
            "number_of_babies": "1",
            "delivery_method": "vaginal"
          }
        ],
        "serious_pregnancy_complications": false,
        "current_birth_control": "None",
        "closest_hospital": "Dell Seton Medical Center",
        "closest_nicu_iii": "Dell Children'\''s Medical Center"
      },
      "gestational_surrogacy_interview": {
        "emotional_support": "My husband, mother, and sister will provide emotional support",
        "languages_spoken": "English, Spanish",
        "motivation": "Having experienced the joy of helping another family, I want to continue making a difference",
        "self_introduction": "I am a 31-year-old registered nurse with experience in labor and delivery. I have three children and one successful surrogacy journey.",
        "contact_preference": "Frequent communication and regular visits if possible",
        "hipaa_release_willing": true,
        "twins_feeling": "I have experience with twins and would be comfortable carrying them again",
        "multiple_reduction_willing": true,
        "termination_willing": true
      },
      "upload_photos": [
        {
          "name": "profile_photo_2.jpg",
          "url": "https://example.com/photos/emily_profile_2.jpg"
        },
        {
          "name": "family_photo_2.jpg",
          "url": "https://example.com/photos/emily_family_2.jpg"
        }
      ]
    }
  }'

echo -e "\n\n"

# 3. 准父母申请 - John Smith
echo "📝 提交准父母申请 #1 - John Smith"
curl -X POST "$API_ENDPOINT" \
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
        "initial_questions": "We are interested in learning more about the surrogacy process and costs involved. We would like to schedule a consultation to discuss our options.",
        "initial_questions_selected_key": "general_inquiry"
      }
    }
  }'

echo -e "\n\n"

# 4. 准父母申请 - Michael Chen
echo "📝 提交准父母申请 #2 - Michael Chen"
curl -X POST "$API_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{
    "application_type": "intended_parent",
    "application_data": {
      "basic_information": {
        "firstName": "Michael",
        "lastName": "Chen",
        "pronouns": "he/him",
        "pronouns_selected_key": "he_him",
        "gender_identity": "male",
        "gender_identity_selected_key": "male",
        "date_of_birth": "1985-12-03",
        "ethnicity": "asian",
        "ethnicity_selected_key": "asian"
      },
      "contact_information": {
        "cell_phone_country_code": "+1",
        "cell_phone": "555-0202",
        "is_agree_cell_phone_receive_messages": true,
        "email_address": "michael.chen@email.com",
        "primary_languages": ["english", "mandarin"],
        "primary_languages_selected_keys": ["english", "mandarin"]
      },
      "family_profile": {
        "sexual_orientation": "heterosexual",
        "sexual_orientation_selected_key": "heterosexual",
        "city": "San Francisco",
        "country": "United States",
        "country_selected_key": "us",
        "state_or_province": "California",
        "state_or_province_selected_key": "ca"
      },
      "program_interests": {
        "interested_services": "surrogacyEggDonor",
        "interested_services_selected_keys": "surrogacyEggDonor",
        "journey_start_timing": "within-3-months",
        "journey_start_timing_selected_key": "within-3-months",
        "desired_children_count": "one",
        "desired_children_count_selected_key": "one"
      },
      "referral": {
        "referral_source": "referral",
        "referral_source_selected_key": "referral",
        "initial_questions": "We were referred by a friend who had a successful surrogacy journey with your agency. We would like to schedule a consultation to discuss our specific needs and timeline.",
        "initial_questions_selected_key": "consultation_request"
      }
    }
  }'

echo -e "\n\n"
echo "✅ 所有测试数据提交完成！"
echo "=========================================="
echo "📊 提交总结："
echo "   - 代孕母申请: 2条"
echo "   - 准父母申请: 2条"
echo "   - 总计: 4条申请"
echo ""
echo "🔍 您可以在admin界面查看这些申请："
echo "   - Parents Applications: http://localhost:3000/admin/parents-applications"
echo "   - Surrogates Applications: http://localhost:3000/admin/surrogates-applications"
echo ""
echo "📋 新功能包括："
echo "   - 完整的代孕面试问题"
echo "   - 怀孕历史详情记录"
echo "   - 背景调查状态"
echo "   - 身高体重BMI信息"
echo "   - 种族和教育水平"
echo "   - 照片上传功能"

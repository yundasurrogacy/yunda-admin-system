"use client";
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function MyAccount() {
  const { t } = useTranslation('common');
  const [parent, setParent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const parentId = localStorage.getItem('parentId');
    if (!parentId) {
      setError(t('clientProfileDetail.notFound', '未登录或缺少用户ID'));
      setLoading(false);
      return;
    }
    fetch(`/api/intended-parent-detail?parentId=${parentId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setParent(data);
        }
      })
      .catch(e => setError(t('clientProfileDetail.fetchFailed', '获取信息失败')))
      .finally(() => setLoading(false));
  }, [t]);

  if (loading) return <div className="p-8">{t('loadingText', '加载中...')}</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  // 解析基本信息
  const basic = parent?.basic_information || {};
  const contact = parent?.contact_information || {};
  const family = parent?.family_profile || {};
  const program = parent?.program_interests || {};
  const referral = parent?.referral || {};

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#FBF0DA] to-[#F7F7F7]">
      <h1 className="text-3xl font-bold font-serif text-[#271F18] mb-4 flex items-center gap-2">
        <span>👤</span> {t('intendedParents.title', 'My Account')}
      </h1>
      <p className="text-[#271F18] font-serif mb-8 text-base">{t('intendedParents.description', 'Manage your account details here. Update your personal information, email address, or password to keep your profile up-to-date.')}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 信托账户余额 */}
        <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
          <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>💰</span> {t('intendedParents.trustAccount.title', 'Trust Account Balance')}</h2>
          <div className="text-2xl font-bold mb-2">{parent.trust_account_balance ?? 0}</div>
          <div className="text-xs text-gray-500 mt-1">{t('intendedParents.trustAccount.email', 'Email')}: {parent.email}</div>
          <div className="text-xs text-gray-500">{t('intendedParents.trustAccount.created', 'Created')}: {parent.created_at}</div>
          <div className="text-xs text-gray-500">{t('intendedParents.trustAccount.updated', 'Updated')}: {parent.updated_at}</div>
        </Card>
        {/* 基本信息 */}
        <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
          <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>📝</span> {t('intendedParents.basicInfo.title', 'Basic Information')}</h2>
          <div className="flex gap-6 items-center mb-2">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-[#E2E8F0] font-serif text-[#271F18] text-2xl">{basic.firstName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div><span className="font-semibold">{t('intendedParents.basicInfo.firstName', 'First Name')}:</span> {basic.firstName}</div>
              <div><span className="font-semibold">{t('intendedParents.basicInfo.lastName', 'Last Name')}:</span> {basic.lastName}</div>
              <div><span className="font-semibold">{t('intendedParents.basicInfo.dob', 'Date of Birth')}:</span> {basic.date_of_birth}</div>
              <div><span className="font-semibold">{t('intendedParents.basicInfo.genderIdentity', 'Gender Identity')}:</span> {basic.gender_identity}</div>
              <div><span className="font-semibold">{t('intendedParents.basicInfo.pronouns', 'Pronouns')}:</span> {basic.pronouns}</div>
              <div><span className="font-semibold">{t('intendedParents.basicInfo.ethnicity', 'Ethnicity')}:</span> {basic.ethnicity}</div>
              <div><span className="font-semibold">{t('intendedParents.basicInfo.genderIdentityKey', 'Gender Identity Key')}:</span> {basic.gender_identity_selected_key}</div>
              <div><span className="font-semibold">{t('intendedParents.basicInfo.pronounsKey', 'Pronouns Key')}:</span> {basic.pronouns_selected_key}</div>
              <div><span className="font-semibold">{t('intendedParents.basicInfo.ethnicityKey', 'Ethnicity Key')}:</span> {basic.ethnicity_selected_key}</div>
            </div>
          </div>
        </Card>
        {/* 联系信息 */}
        <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
          <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>📞</span> {t('intendedParents.contactInfo.title', 'Contact Information')}</h2>
          <div className="space-y-1">
            <div><span className="font-semibold">{t('intendedParents.contactInfo.cellPhone', 'Cell Phone')}:</span> {contact.cell_phone_country_code} {contact.cell_phone}</div>
            <div><span className="font-semibold">{t('intendedParents.contactInfo.email', 'Email')}:</span> {contact.email_address}</div>
            <div><span className="font-semibold">{t('intendedParents.contactInfo.primaryLanguages', 'Primary Languages')}:</span> {Array.isArray(contact.primary_languages) ? contact.primary_languages.join(', ') : ''}</div>
            <div><span className="font-semibold">{t('intendedParents.contactInfo.primaryLanguagesKey', 'Primary Languages Key')}:</span> {Array.isArray(contact.primary_languages_selected_keys) ? contact.primary_languages_selected_keys.join(', ') : ''}</div>
            <div><span className="font-semibold">{t('intendedParents.contactInfo.agreeToReceiveMessages', 'Agree to Receive Messages')}:</span> {contact.is_agree_cell_phone_receive_messages ? t('yes', 'Yes') : t('no', 'No')}</div>
          </div>
        </Card>
        {/* 家庭资料 */}
        <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
          <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>🏠</span> {t('intendedParents.familyProfile.title', 'Family Profile')}</h2>
          <div className="space-y-1">
            <div><span className="font-semibold">{t('intendedParents.familyProfile.city', 'City')}:</span> {family.city}</div>
            <div><span className="font-semibold">{t('intendedParents.familyProfile.stateProvince', 'State/Province')}:</span> {family.state_or_province}</div>
            <div><span className="font-semibold">{t('intendedParents.familyProfile.stateProvinceKey', 'State/Province Key')}:</span> {family.state_or_province_selected_key}</div>
            <div><span className="font-semibold">{t('intendedParents.familyProfile.country', 'Country')}:</span> {family.country}</div>
            <div><span className="font-semibold">{t('intendedParents.familyProfile.countryKey', 'Country Key')}:</span> {family.country_selected_key}</div>
            <div><span className="font-semibold">{t('intendedParents.familyProfile.sexualOrientation', 'Sexual Orientation')}:</span> {family.sexual_orientation}</div>
            <div><span className="font-semibold">{t('intendedParents.familyProfile.sexualOrientationKey', 'Sexual Orientation Key')}:</span> {family.sexual_orientation_selected_key}</div>
          </div>
        </Card>
        {/* 项目意向 */}
        <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
          <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>🎯</span> {t('intendedParents.programInterests.title', 'Program Interests')}</h2>
          <div className="space-y-1">
            <div><span className="font-semibold">{t('intendedParents.programInterests.interestedServices', 'Interested Services')}:</span> {program.interested_services}</div>
            <div><span className="font-semibold">{t('intendedParents.programInterests.interestedServicesKey', 'Interested Services Key')}:</span> {program.interested_services_selected_keys}</div>
            <div><span className="font-semibold">{t('intendedParents.programInterests.journeyStartTiming', 'Journey Start Timing')}:</span> {program.journey_start_timing}</div>
            <div><span className="font-semibold">{t('intendedParents.programInterests.journeyStartTimingKey', 'Journey Start Timing Key')}:</span> {program.journey_start_timing_selected_key}</div>
            <div><span className="font-semibold">{t('intendedParents.programInterests.desiredChildrenCount', 'Desired Children Count')}:</span> {program.desired_children_count}</div>
            <div><span className="font-semibold">{t('intendedParents.programInterests.desiredChildrenCountKey', 'Desired Children Count Key')}:</span> {program.desired_children_count_selected_key}</div>
          </div>
        </Card>
        {/* 渠道及初步沟通 */}
        <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
          <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>🔗</span> {t('intendedParents.referral.title', 'Referral & Initial Communication')}</h2>
          <div className="space-y-1">
            <div><span className="font-semibold">{t('intendedParents.referral.referralSource', 'Referral Source')}:</span> {referral.referral_source}</div>
            <div><span className="font-semibold">{t('intendedParents.referral.referralSourceKey', 'Referral Source Key')}:</span> {referral.referral_source_selected_key}</div>
            <div><span className="font-semibold">{t('intendedParents.referral.initialQuestions', 'Initial Questions')}:</span> {referral.initial_questions}</div>
            <div><span className="font-semibold">{t('intendedParents.referral.initialQuestionsKey', 'Initial Questions Key')}:</span> {referral.initial_questions_selected_key}</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

"use client"

import ManagerLayout from '@/components/manager-layout'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'

export default function ClientProfileDetail() {
  const params = useParams();
  const { t } = useTranslation('common');
  const parentId = params?.id || '';
  const [parent, setParent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!parentId) {
      setError(t('clientProfileDetail.notFound'));
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
      .catch(e => setError(t('clientProfileDetail.fetchFailed')))
      .finally(() => setLoading(false));
  }, [parentId, t]);

  if (loading) return <ManagerLayout><div className="p-8">{t('loadingText')}</div></ManagerLayout>;
  if (error) return <ManagerLayout><div className="p-8 text-red-500">{error}</div></ManagerLayout>;

  // 解析分组信息
  const basic = parent?.basic_information || {};
  const contact = parent?.contact_information || {};
  const family = parent?.family_profile || {};
  const program = parent?.program_interests || {};
  const referral = parent?.referral || {};

  return (
    <ManagerLayout>
      <div className="p-8 min-h-screen bg-gradient-to-br from-[#FBF0DA] to-[#F7F7F7]">
        <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-8">{t('clientProfileDetail.title')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 信托账户余额 */}
          <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
            <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>💰</span> {t('clientProfileDetail.trustAccountBalance')}</h2>
            <div className="text-2xl font-bold mb-2">{parent.trust_account_balance ?? 0}</div>
            <div className="text-xs text-gray-500 mt-1">{t('clientProfileDetail.email')}: {parent.email}</div>
            <div className="text-xs text-gray-500">{t('clientProfileDetail.created')}: {parent.created_at}</div>
            <div className="text-xs text-gray-500">{t('clientProfileDetail.updated')}: {parent.updated_at}</div>
          </Card>
          {/* 基本信息 */}
          <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
            <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>📝</span> {t('clientProfileDetail.basicInfo')}</h2>
            <div className="flex gap-6 items-center mb-2">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-[#E2E8F0] font-serif text-[#271F18] text-2xl">{basic.firstName?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div><span className="font-semibold">{t('clientProfileDetail.firstName')}:</span> {basic.firstName}</div>
                <div><span className="font-semibold">{t('clientProfileDetail.lastName')}:</span> {basic.lastName}</div>
                <div><span className="font-semibold">{t('clientProfileDetail.dob')}:</span> {basic.date_of_birth}</div>
                <div><span className="font-semibold">{t('clientProfileDetail.genderIdentity')}:</span> {basic.gender_identity}</div>
                <div><span className="font-semibold">{t('clientProfileDetail.pronouns')}:</span> {basic.pronouns}</div>
                <div><span className="font-semibold">{t('clientProfileDetail.ethnicity')}:</span> {basic.ethnicity}</div>
                <div><span className="font-semibold">{t('clientProfileDetail.genderIdentityKey')}:</span> {basic.gender_identity_selected_key}</div>
                <div><span className="font-semibold">{t('clientProfileDetail.pronounsKey')}:</span> {basic.pronouns_selected_key}</div>
                <div><span className="font-semibold">{t('clientProfileDetail.ethnicityKey')}:</span> {basic.ethnicity_selected_key}</div>
              </div>
            </div>
          </Card>
          {/* 联系信息 */}
          <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
            <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>📞</span> {t('clientProfileDetail.contactInfo')}</h2>
            <div className="space-y-1">
              <div><span className="font-semibold">{t('clientProfileDetail.cellPhone')}:</span> {contact.cell_phone_country_code} {contact.cell_phone}</div>
              <div><span className="font-semibold">{t('clientProfileDetail.email')}:</span> {contact.email_address}</div>
              <div><span className="font-semibold">{t('clientProfileDetail.primaryLanguages')}:</span> {Array.isArray(contact.primary_languages) ? contact.primary_languages.join(', ') : ''}</div>
              <div><span className="font-semibold">{t('clientProfileDetail.primaryLanguagesKey')}:</span> {Array.isArray(contact.primary_languages_selected_keys) ? contact.primary_languages_selected_keys.join(', ') : ''}</div>
              <div><span className="font-semibold">{t('clientProfileDetail.agreeToReceiveMessages')}:</span> {contact.is_agree_cell_phone_receive_messages ? t('yes') : t('no')}</div>
            </div>
          </Card>
          {/* 家庭资料 */}
          <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
            <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>🏠</span> {t('clientProfileDetail.familyProfile')}</h2>
            <div className="space-y-1">
              <div><span className="font-semibold">{t('clientProfileDetail.city')}:</span> {family.city}</div>
              <div><span className="font-semibold">{t('clientProfileDetail.stateProvince')}:</span> {family.state_or_province}</div>
              <div><span className="font-semibold">{t('clientProfileDetail.stateProvinceKey')}:</span> {family.state_or_province_selected_key}</div>
              <div><span className="font-semibold">{t('clientProfileDetail.country')}:</span> {family.country}</div>
              <div><span className="font-semibold">{t('clientProfileDetail.countryKey')}:</span> {family.country_selected_key}</div>
              <div><span className="font-semibold">{t('clientProfileDetail.sexualOrientation')}:</span> {family.sexual_orientation}</div>
              <div><span className="font-semibold">{t('clientProfileDetail.sexualOrientationKey')}:</span> {family.sexual_orientation_selected_key}</div>
            </div>
          </Card>
          {/* 项目意向 */}
          <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
            <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>🎯</span> {t('clientProfileDetail.programInterests')}</h2>
            <div className="space-y-1">
              <div><span className="font-semibold">{t('clientProfileDetail.interestedServices')}:</span> {program.interested_services}</div>
              <div><span className="font-semibold">{t('clientProfileDetail.interestedServicesKey')}:</span> {program.interested_services_selected_keys}</div>
              <div><span className="font-semibold">{t('clientProfileDetail.journeyStartTiming')}:</span> {program.journey_start_timing}</div>
              <div><span className="font-semibold">{t('clientProfileDetail.journeyStartTimingKey')}:</span> {program.journey_start_timing_selected_key}</div>
              <div><span className="font-semibold">{t('clientProfileDetail.desiredChildrenCount')}:</span> {program.desired_children_count}</div>
              <div><span className="font-semibold">{t('clientProfileDetail.desiredChildrenCountKey')}:</span> {program.desired_children_count_selected_key}</div>
            </div>
          </Card>
          {/* 渠道及初步沟通 */}
          <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
            <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>🔗</span> {t('clientProfileDetail.referralAndInitialCommunication')}</h2>
            <div className="space-y-1">
              <div><span className="font-semibold">{t('clientProfileDetail.referralSource')}:</span> {referral.referral_source}</div>
              <div><span className="font-semibold">{t('clientProfileDetail.referralSourceKey')}:</span> {referral.referral_source_selected_key}</div>
              <div><span className="font-semibold">{t('clientProfileDetail.initialQuestions')}:</span> {referral.initial_questions}</div>
              <div><span className="font-semibold">{t('clientProfileDetail.initialQuestionsKey')}:</span> {referral.initial_questions_selected_key}</div>
            </div>
          </Card>
        </div>
      </div>
    </ManagerLayout>
  )
}

'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function IntendedParents() {
  const { t } = useTranslation('common')
  const [parentInfo, setParentInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError('')
      try {
        const surrogateId = localStorage.getItem('surrogateId') || ''
        // 2. 通过代孕母id获取case，兼容多种返回结构
        const caseRes = await fetch(`/api/cases-by-surrogate?surrogateId=${surrogateId}`)
        if (!caseRes.ok) throw new Error(t('intendedParents.error.fetchCaseFailed'))
        const data = await caseRes.json()
        const casesRaw = data.cases || data.data || data || []
        // 格式化 case 数据
        const cases = Array.isArray(casesRaw)
          ? casesRaw.map((item: any) => ({
              id: item.id,
              process_status: item.process_status,
              trust_account_balance: item.trust_account_balance,
              surrogate_mother: item.surrogate_mother
                ? {
                    id: item.surrogate_mother.id,
                    email: item.surrogate_mother.email,
                    name:
                      item.surrogate_mother.contact_information?.name ||
                      item.surrogate_mother.contact_information || '',
                  }
                : undefined,
              intended_parent: item.intended_parent
                ? {
                    id: item.intended_parent.id,
                    email: item.intended_parent.email,
                    name:
                      item.intended_parent.basic_information?.name ||
                      item.intended_parent.basic_information || '',
                  }
                : undefined,
            }))
          : []

        // 只取第一个 case 的 intended_parent 信息
        const intendedParent = cases.length > 0 ? cases[0].intended_parent : undefined
        const parentId = intendedParent?.id
        if (!parentId) {
          setError(t('intendedParents.error.noParentInfo'))
          setLoading(false)
          return
        }
        // 4. 通过准父母id获取准父母详细信息
        const parentRes = await fetch(`/api/intended-parent-detail?parentId=${parentId}`)
        const parentDetail = await parentRes.json()
        setParentInfo(parentDetail)
      } catch (e: any) {
        setError(t('intendedParents.error.fetchDataFailed'))
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="p-8 min-h-screen">{t('loadingText')}</div>
  }
  if (error) {
    return <div className="p-8 min-h-screen text-red-500">{error}</div>
  }

  // 解析分组信息
  const basic = parentInfo?.basic_information || {}
  const contact = parentInfo?.contact_information || {}
  const family = parentInfo?.family_profile || {}
  const program = parentInfo?.program_interests || {}
  const referral = parentInfo?.referral || {}

  return (
    <div className="p-8 min-h-screen bg-gradient-to-br from-[#FBF0DA] to-[#F7F7F7]">
      <h1 className="text-3xl font-bold font-serif text-[#271F18] mb-4 flex items-center gap-2">
        <span>👤</span> {t('intendedParents.title')}
      </h1>
      <p className="text-[#271F18] font-serif mb-8 text-base">{t('intendedParents.description')}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 信托账户余额 */}
        <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
          <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>💰</span> {t('intendedParents.trustAccount.title')}</h2>
          <div className="text-2xl font-bold mb-2">{parentInfo?.trust_account_balance ?? 0}</div>
          <div className="text-xs text-gray-500 mt-1">{t('intendedParents.trustAccount.email')}: {parentInfo?.email}</div>
          <div className="text-xs text-gray-500">{t('intendedParents.trustAccount.created')}: {parentInfo?.created_at}</div>
          <div className="text-xs text-gray-500">{t('intendedParents.trustAccount.updated')}: {parentInfo?.updated_at}</div>
        </Card>
        {/* 基本信息 */}
        <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
          <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>📝</span> {t('intendedParents.basicInfo.title')}</h2>
          <div className="flex gap-6 items-center mb-2">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-[#E2E8F0] font-serif text-[#271F18] text-2xl">{basic.firstName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div><span className="font-semibold">{t('intendedParents.basicInfo.firstName')}:</span> {basic.firstName}</div>
              <div><span className="font-semibold">{t('intendedParents.basicInfo.lastName')}:</span> {basic.lastName}</div>
              <div><span className="font-semibold">{t('intendedParents.basicInfo.dob')}:</span> {basic.date_of_birth}</div>
              <div><span className="font-semibold">{t('intendedParents.basicInfo.genderIdentity')}:</span> {basic.gender_identity}</div>
              <div><span className="font-semibold">{t('intendedParents.basicInfo.pronouns')}:</span> {basic.pronouns}</div>
              <div><span className="font-semibold">{t('intendedParents.basicInfo.ethnicity')}:</span> {basic.ethnicity}</div>
              <div><span className="font-semibold">{t('intendedParents.basicInfo.genderIdentityKey')}:</span> {basic.gender_identity_selected_key}</div>
              <div><span className="font-semibold">{t('intendedParents.basicInfo.pronounsKey')}:</span> {basic.pronouns_selected_key}</div>
              <div><span className="font-semibold">{t('intendedParents.basicInfo.ethnicityKey')}:</span> {basic.ethnicity_selected_key}</div>
            </div>
          </div>
        </Card>
        {/* 联系信息 */}
        <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
          <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>📞</span> {t('intendedParents.contactInfo.title')}</h2>
          <div className="space-y-1">
            <div><span className="font-semibold">{t('intendedParents.contactInfo.cellPhone')}:</span> {contact.cell_phone_country_code} {contact.cell_phone}</div>
            <div><span className="font-semibold">{t('intendedParents.contactInfo.email')}:</span> {contact.email_address}</div>
            <div><span className="font-semibold">{t('intendedParents.contactInfo.primaryLanguages')}:</span> {Array.isArray(contact.primary_languages) ? contact.primary_languages.join(', ') : ''}</div>
            <div><span className="font-semibold">{t('intendedParents.contactInfo.primaryLanguagesKey')}:</span> {Array.isArray(contact.primary_languages_selected_keys) ? contact.primary_languages_selected_keys.join(', ') : ''}</div>
            <div><span className="font-semibold">{t('intendedParents.contactInfo.agreeToReceiveMessages')}:</span> {contact.is_agree_cell_phone_receive_messages ? t('yes') : t('no')}</div>
          </div>
        </Card>
        {/* 家庭资料 */}
        <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
          <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>🏠</span> {t('intendedParents.familyProfile.title')}</h2>
          <div className="space-y-1">
            <div><span className="font-semibold">{t('intendedParents.familyProfile.city')}:</span> {family.city}</div>
            <div><span className="font-semibold">{t('intendedParents.familyProfile.stateProvince')}:</span> {family.state_or_province}</div>
            <div><span className="font-semibold">{t('intendedParents.familyProfile.stateProvinceKey')}:</span> {family.state_or_province_selected_key}</div>
            <div><span className="font-semibold">{t('intendedParents.familyProfile.country')}:</span> {family.country}</div>
            <div><span className="font-semibold">{t('intendedParents.familyProfile.countryKey')}:</span> {family.country_selected_key}</div>
            <div><span className="font-semibold">{t('intendedParents.familyProfile.sexualOrientation')}:</span> {family.sexual_orientation}</div>
            <div><span className="font-semibold">{t('intendedParents.familyProfile.sexualOrientationKey')}:</span> {family.sexual_orientation_selected_key}</div>
          </div>
        </Card>
        {/* 项目意向 */}
        <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
          <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>🎯</span> {t('intendedParents.programInterests.title')}</h2>
          <div className="space-y-1">
            <div><span className="font-semibold">{t('intendedParents.programInterests.interestedServices')}:</span> {program.interested_services}</div>
            <div><span className="font-semibold">{t('intendedParents.programInterests.interestedServicesKey')}:</span> {program.interested_services_selected_keys}</div>
            <div><span className="font-semibold">{t('intendedParents.programInterests.journeyStartTiming')}:</span> {program.journey_start_timing}</div>
            <div><span className="font-semibold">{t('intendedParents.programInterests.journeyStartTimingKey')}:</span> {program.journey_start_timing_selected_key}</div>
            <div><span className="font-semibold">{t('intendedParents.programInterests.desiredChildrenCount')}:</span> {program.desired_children_count}</div>
            <div><span className="font-semibold">{t('intendedParents.programInterests.desiredChildrenCountKey')}:</span> {program.desired_children_count_selected_key}</div>
          </div>
        </Card>
        {/* 渠道及初步沟通 */}
        <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
          <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>🔗</span> {t('intendedParents.referral.title')}</h2>
          <div className="space-y-1">
            <div><span className="font-semibold">{t('intendedParents.referral.referralSource')}:</span> {referral.referral_source}</div>
            <div><span className="font-semibold">{t('intendedParents.referral.referralSourceKey')}:</span> {referral.referral_source_selected_key}</div>
            <div><span className="font-semibold">{t('intendedParents.referral.initialQuestions')}:</span> {referral.initial_questions}</div>
            <div><span className="font-semibold">{t('intendedParents.referral.initialQuestionsKey')}:</span> {referral.initial_questions_selected_key}</div>
          </div>
        </Card>
      </div>
    </div>
  )
}

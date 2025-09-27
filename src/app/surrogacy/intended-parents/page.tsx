'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function IntendedParents() {
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
        if (!caseRes.ok) throw new Error('获取案子失败')
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
          setError('未找到准父母信息')
          setLoading(false)
          return
        }
        // 4. 通过准父母id获取准父母详细信息
        const parentRes = await fetch(`/api/intended-parent-detail?parentId=${parentId}`)
        const parentDetail = await parentRes.json()
        setParentInfo(parentDetail)
      } catch (e: any) {
        setError('数据获取失败')
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return <div className="p-8 min-h-screen">加载中...</div>
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
        <span>👤</span> My Intended Parents
      </h1>
      <p className="text-[#271F18] font-serif mb-8 text-base">Here are some details about the intended parents you are matched with.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 信托账户余额 */}
        <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
          <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>💰</span> Trust Account Balance</h2>
          <div className="text-2xl font-bold mb-2">{parentInfo?.trust_account_balance ?? 0}</div>
          <div className="text-xs text-gray-500 mt-1">Email: {parentInfo?.email}</div>
          <div className="text-xs text-gray-500">Created: {parentInfo?.created_at}</div>
          <div className="text-xs text-gray-500">Updated: {parentInfo?.updated_at}</div>
        </Card>
        {/* 基本信息 */}
        <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
          <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>📝</span> Basic Information</h2>
          <div className="flex gap-6 items-center mb-2">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-[#E2E8F0] font-serif text-[#271F18] text-2xl">{basic.firstName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div><span className="font-semibold">First Name:</span> {basic.firstName}</div>
              <div><span className="font-semibold">Last Name:</span> {basic.lastName}</div>
              <div><span className="font-semibold">Date of Birth:</span> {basic.date_of_birth}</div>
              <div><span className="font-semibold">Gender Identity:</span> {basic.gender_identity}</div>
              <div><span className="font-semibold">Pronouns:</span> {basic.pronouns}</div>
              <div><span className="font-semibold">Ethnicity:</span> {basic.ethnicity}</div>
              <div><span className="font-semibold">Gender Identity Key:</span> {basic.gender_identity_selected_key}</div>
              <div><span className="font-semibold">Pronouns Key:</span> {basic.pronouns_selected_key}</div>
              <div><span className="font-semibold">Ethnicity Key:</span> {basic.ethnicity_selected_key}</div>
            </div>
          </div>
        </Card>
        {/* 联系信息 */}
        <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
          <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>📞</span> Contact Information</h2>
          <div className="space-y-1">
            <div><span className="font-semibold">Cell Phone:</span> {contact.cell_phone_country_code} {contact.cell_phone}</div>
            <div><span className="font-semibold">Email:</span> {contact.email_address}</div>
            <div><span className="font-semibold">Primary Languages:</span> {Array.isArray(contact.primary_languages) ? contact.primary_languages.join(', ') : ''}</div>
            <div><span className="font-semibold">Primary Languages Key:</span> {Array.isArray(contact.primary_languages_selected_keys) ? contact.primary_languages_selected_keys.join(', ') : ''}</div>
            <div><span className="font-semibold">Agree to Receive Messages:</span> {contact.is_agree_cell_phone_receive_messages ? 'Yes' : 'No'}</div>
          </div>
        </Card>
        {/* 家庭资料 */}
        <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
          <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>🏠</span> Family Profile</h2>
          <div className="space-y-1">
            <div><span className="font-semibold">City:</span> {family.city}</div>
            <div><span className="font-semibold">State/Province:</span> {family.state_or_province}</div>
            <div><span className="font-semibold">State/Province Key:</span> {family.state_or_province_selected_key}</div>
            <div><span className="font-semibold">Country:</span> {family.country}</div>
            <div><span className="font-semibold">Country Key:</span> {family.country_selected_key}</div>
            <div><span className="font-semibold">Sexual Orientation:</span> {family.sexual_orientation}</div>
            <div><span className="font-semibold">Sexual Orientation Key:</span> {family.sexual_orientation_selected_key}</div>
          </div>
        </Card>
        {/* 项目意向 */}
        <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
          <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>🎯</span> Program Interests</h2>
          <div className="space-y-1">
            <div><span className="font-semibold">Interested Services:</span> {program.interested_services}</div>
            <div><span className="font-semibold">Interested Services Key:</span> {program.interested_services_selected_keys}</div>
            <div><span className="font-semibold">Journey Start Timing:</span> {program.journey_start_timing}</div>
            <div><span className="font-semibold">Journey Start Timing Key:</span> {program.journey_start_timing_selected_key}</div>
            <div><span className="font-semibold">Desired Children Count:</span> {program.desired_children_count}</div>
            <div><span className="font-semibold">Desired Children Count Key:</span> {program.desired_children_count_selected_key}</div>
          </div>
        </Card>
        {/* 渠道及初步沟通 */}
        <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
          <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>🔗</span> Referral & Initial Communication</h2>
          <div className="space-y-1">
            <div><span className="font-semibold">Referral Source:</span> {referral.referral_source}</div>
            <div><span className="font-semibold">Referral Source Key:</span> {referral.referral_source_selected_key}</div>
            <div><span className="font-semibold">Initial Questions:</span> {referral.initial_questions}</div>
            <div><span className="font-semibold">Initial Questions Key:</span> {referral.initial_questions_selected_key}</div>
          </div>
        </Card>
      </div>
    </div>
  )
}

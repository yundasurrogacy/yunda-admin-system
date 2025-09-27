"use client"

import ManagerLayout from '@/components/manager-layout'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function ClientProfileDetail() {
  const params = useParams();
  const parentId = params?.id || '';
  const [parent, setParent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!parentId) {
      setError('未找到准父母ID');
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
      .catch(e => setError('获取信息失败'))
      .finally(() => setLoading(false));
  }, [parentId]);

  if (loading) return <ManagerLayout><div className="p-8">加载中...</div></ManagerLayout>;
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
        <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-8">Client Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* 信托账户余额 */}
          <Card className="rounded-2xl shadow-lg bg-white p-6 font-serif text-[#271F18] flex flex-col border border-[#F3E6C2]">
            <h2 className="text-xl font-bold font-serif mb-4 flex items-center gap-2"><span>💰</span> Trust Account Balance</h2>
            <div className="text-2xl font-bold mb-2">{parent.trust_account_balance ?? 0}</div>
            <div className="text-xs text-gray-500 mt-1">Email: {parent.email}</div>
            <div className="text-xs text-gray-500">Created: {parent.created_at}</div>
            <div className="text-xs text-gray-500">Updated: {parent.updated_at}</div>
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
    </ManagerLayout>
  )
}

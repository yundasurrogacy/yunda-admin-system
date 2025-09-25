"use client";
import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function MyAccount() {
  const [parent, setParent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const parentId = localStorage.getItem('parentId');
    if (!parentId) {
      setError('未登录或缺少用户ID');
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
  }, []);

  if (loading) return <div className="p-8">加载中...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  // 解析基本信息
  const basic = parent?.basic_information || {};
  const contact = parent?.contact_information || {};
  const family = parent?.family_profile || {};
  const program = parent?.program_interests || {};
  const referral = parent?.referral || {};

  return (
    <div className="p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
      <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-2">My Account</h1>
      <p className="text-[#271F18] font-serif mb-8">Manage your account details here. Update your personal information, email address, or password to keep your profile up-to-date.</p>
      {/* 信托账户余额 */}
      <Card className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6 flex flex-col">
        <h2 className="text-xl font-serif mb-4">Trust Account Balance</h2>
        <div className="text-lg font-bold">{parent.trust_account_balance ?? 0}</div>
      </Card>
      {/* 基本信息 */}
      <Card className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6 flex flex-col relative">
        <h2 className="text-xl font-serif mb-4">Basic Information</h2>
        <Button className="absolute top-6 right-6 rounded bg-[#D9D9D9] text-[#271F18] font-serif px-4 py-1 text-xs shadow-none hover:bg-[#E3E8E3]">Edit</Button>
        <div className="flex gap-6 items-center">
          <Avatar className="w-14 h-14">
            <AvatarFallback className="bg-[#E2E8F0] font-serif text-[#271F18]">{basic.firstName?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <div><span className="font-medium">First Name:</span> {basic.firstName}</div>
            <div><span className="font-medium">Last Name:</span> {basic.lastName}</div>
            <div><span className="font-medium">Date of Birth:</span> {basic.date_of_birth}</div>
            <div><span className="font-medium">Gender Identity:</span> {basic.gender_identity}</div>
            <div><span className="font-medium">Pronouns:</span> {basic.pronouns}</div>
            <div><span className="font-medium">Ethnicity:</span> {basic.ethnicity}</div>
          </div>
        </div>
      </Card>
      {/* 联系信息 */}
      <Card className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6 flex flex-col">
        <h2 className="text-xl font-serif mb-4">Contact Information</h2>
        <div className="space-y-1">
          <div><span className="font-medium">Cell Phone:</span> {contact.cell_phone_country_code} {contact.cell_phone}</div>
          <div><span className="font-medium">Email:</span> {contact.email_address}</div>
          <div><span className="font-medium">Primary Languages:</span> {Array.isArray(contact.primary_languages) ? contact.primary_languages.join(', ') : ''}</div>
          <div><span className="font-medium">Agree to Receive Messages:</span> {contact.is_agree_cell_phone_receive_messages ? 'Yes' : 'No'}</div>
        </div>
      </Card>
      {/* 家庭资料 */}
      <Card className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6 flex flex-col">
        <h2 className="text-xl font-serif mb-4">Family Profile</h2>
        <div className="space-y-1">
          <div><span className="font-medium">City:</span> {family.city}</div>
          <div><span className="font-medium">State/Province:</span> {family.state_or_province}</div>
          <div><span className="font-medium">Country:</span> {family.country}</div>
          <div><span className="font-medium">Sexual Orientation:</span> {family.sexual_orientation}</div>
        </div>
      </Card>
      {/* 项目意向 */}
      <Card className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6 flex flex-col">
        <h2 className="text-xl font-serif mb-4">Program Interests</h2>
        <div className="space-y-1">
          <div><span className="font-medium">Interested Services:</span> {program.interested_services}</div>
          <div><span className="font-medium">Journey Start Timing:</span> {program.journey_start_timing}</div>
          <div><span className="font-medium">Desired Children Count:</span> {program.desired_children_count}</div>
        </div>
      </Card>
      {/* 渠道及初步沟通 */}
      <Card className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6 flex flex-col">
        <h2 className="text-xl font-serif mb-4">Referral & Initial Communication</h2>
        <div className="space-y-1">
          <div><span className="font-medium">Referral Source:</span> {referral.referral_source}</div>
          <div><span className="font-medium">Initial Questions:</span> {referral.initial_questions}</div>
        </div>
      </Card>
      {/* 登录设置 */}
      <Card className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6 flex flex-col">
        <h2 className="text-xl font-serif mb-4">Login Settings</h2>
        <div className="flex gap-4">
          <Button className="rounded bg-[#D9D9D9] text-[#271F18] font-serif px-4 py-1 text-xs shadow-none hover:bg-[#E3E8E3]">Change Password</Button>
          <Button className="rounded bg-[#D9D9D9] text-[#271F18] font-serif px-4 py-1 text-xs shadow-none hover:bg-[#E3E8E3]">Manage Devices</Button>
        </div>
      </Card>
    </div>
  );
}

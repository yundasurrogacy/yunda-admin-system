"use client";
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';


export default function MyAccount() {
  const { t } = useTranslation('common');
  const [parent, setParent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 只读：获取个人信息
  useEffect(() => {
    setLoading(true);
    function getCookie(name: string) {
      if (typeof document === 'undefined') return undefined;
      const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
      return match ? match[2] : undefined;
    }
    const parentId = typeof document !== 'undefined' ? getCookie('userId_client') : null;
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

  // 格式化多选和枚举展示
  const formatArray = (arr: string[] | undefined): string =>
    Array.isArray(arr) && arr.length ? arr.join(", ") : "-";
  const formatValue = (val: string | undefined): string =>
    val ? val : "-";

  if (loading) return <div className="p-8 text-sage-600">{t('loadingText', '加载中...')}</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  // 解析基本信息
  const basic = parent?.basic_information || {};
  const contact = parent?.contact_information || {};
  const family = parent?.family_profile || {};
  const program = parent?.program_interests || {};
  const referral = parent?.referral || {};

  return (
    <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12 py-6">
      <div className="flex items-center justify-between pt-6 pb-2">
        <h1 className="text-2xl font-medium text-sage-800">{t('intendedParents.personalInfo', '个人信息')}</h1>
      </div>
      <p className="text-sage-700 mb-6">{t('intendedParents.personalInfoDescription', '查看您的个人资料信息')}</p>

      {/* 基本信息 */}
      <Card className="bg-white border-sage-200 animate-slide-in-left overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-sage-800 text-lg font-medium">{t('intendedParents.basicInfo.title', 'Basic Information')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6 mb-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-sage-100 text-sage-800 text-3xl">
                {basic.firstName?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-medium text-sage-800">
                {`${basic.firstName || ''} ${basic.lastName || ''}`}
              </h3>
              <p className="text-sage-600">
                {basic.gender_identity}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.basicInfo.firstName', 'First Name')}:</Label>
              <p className="font-medium text-sage-800 break-words">{formatValue(basic.firstName)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.basicInfo.lastName', 'Last Name')}:</Label>
              <p className="font-medium text-sage-800 break-words">{formatValue(basic.lastName)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.basicInfo.dob', 'Date of Birth')}:</Label>
              <p className="font-medium text-sage-800 break-words">{formatValue(basic.date_of_birth)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.basicInfo.genderIdentity', 'Gender Identity')}:</Label>
              <p className="font-medium text-sage-800 break-words">{formatValue(basic.gender_identity)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.basicInfo.pronouns', 'Pronouns')}:</Label>
              <p className="font-medium text-sage-800 break-words">{formatValue(basic.pronouns)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.basicInfo.ethnicity', 'Ethnicity')}:</Label>
              <p className="font-medium text-sage-800 break-words">{formatValue(basic.ethnicity)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.trustAccount.email', 'Email')}:</Label>
              <p className="font-medium text-sage-800 break-words">{formatValue(parent?.email)}</p>
            </div>
            {/* <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.trustAccount.title', 'Trust Account Balance')}:</Label>
              <p className="font-medium text-sage-800 break-words">{parent?.trust_account_balance ?? 0}</p>
            </div> */}
          </div>
        </CardContent>
      </Card>
      
      {/* 联系信息 */}
      <Card className="bg-white border-sage-200 animate-slide-in-left overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-sage-800 text-lg font-medium">{t('intendedParents.contactInfo.title', 'Contact Information')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.contactInfo.cellPhone', 'Cell Phone')}:</Label>
              <p className="font-medium text-sage-800 break-words">
                {contact?.cell_phone_country_code ? `+${contact.cell_phone_country_code} ` : ""}{formatValue(contact?.cell_phone)}
              </p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.contactInfo.email', 'Email')}:</Label>
              <p className="font-medium text-sage-800 break-words">{formatValue(contact?.email_address)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.contactInfo.primaryLanguages', 'Primary Languages')}:</Label>
              <p className="font-medium text-sage-800 break-words">{formatArray(contact?.primary_languages_selected_keys)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.contactInfo.agreeToReceiveMessages', 'Agree to Receive Messages')}:</Label>
              <p className="font-medium text-sage-800 break-words">
                {contact?.is_agree_cell_phone_receive_messages ? t('yes', 'Yes') : t('no', 'No')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 家庭资料 */}
      <Card className="bg-white border-sage-200 animate-slide-in-left overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-sage-800 text-lg font-medium">{t('intendedParents.familyProfile.title', 'Family Profile')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.familyProfile.sexualOrientation', 'Sexual Orientation')}:</Label>
              <p className="font-medium text-sage-800 break-words">{formatValue(family?.sexual_orientation)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.familyProfile.city', 'City')}:</Label>
              <p className="font-medium text-sage-800 break-words">{formatValue(family?.city)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.familyProfile.country', 'Country')}:</Label>
              <p className="font-medium text-sage-800 break-words">{formatValue(family?.country)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.familyProfile.stateProvince', 'State/Province')}:</Label>
              <p className="font-medium text-sage-800 break-words">{formatValue(family?.state_or_province)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 项目意向 */}
      <Card className="bg-white border-sage-200 animate-slide-in-left overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-sage-800 text-lg font-medium">{t('intendedParents.programInterests.title', 'Program Interests')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.programInterests.interestedServices', 'Interested Services')}:</Label>
              <p className="font-medium text-sage-800 break-words">{formatValue(program?.interested_services)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.programInterests.journeyStartTiming', 'Journey Start Timing')}:</Label>
              <p className="font-medium text-sage-800 break-words">{formatValue(program?.journey_start_timing)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.programInterests.desiredChildrenCount', 'Desired Children Count')}:</Label>
              <p className="font-medium text-sage-800 break-words">{formatValue(program?.desired_children_count)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 渠道及初步沟通 */}
      <Card className="bg-white border-sage-200 animate-slide-in-left overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-sage-800 text-lg font-medium">{t('intendedParents.referral.title', 'Referral & Initial Communication')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.referral.referralSource', 'Referral Source')}:</Label>
              <p className="font-medium text-sage-800 break-words">{formatValue(referral?.referral_source)}</p>
            </div>
            <div className="col-span-2">
              <Label className="text-sage-600 text-sm">{t('intendedParents.referral.initialQuestions', 'Initial Questions')}:</Label>
              <p className="font-medium text-sage-800 break-words">{formatValue(referral?.initial_questions)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 底部空白区域，提供页面底部间距 */}
      <div className="pb-8"></div>
    </div>
  );
}

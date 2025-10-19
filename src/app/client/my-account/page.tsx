"use client";
import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

// 提取的字段显示组件（使用 memo 优化）
const InfoField = memo(({ label, value }: { label: string; value: string }) => (
  <div>
    <Label className="text-sage-600 text-sm">{label}:</Label>
    <p className="font-medium text-sage-800 break-words">{value}</p>
  </div>
));

InfoField.displayName = 'InfoField';

// 提取的信息卡片组件（使用 memo 优化）
const InfoCard = memo(({ 
  title, 
  children 
}: { 
  title: string; 
  children: React.ReactNode;
}) => (
  <Card className="bg-white border-sage-200 animate-slide-in-left overflow-hidden">
    <CardHeader className="pb-4">
      <CardTitle className="text-sage-800 text-lg font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {children}
    </CardContent>
  </Card>
));

InfoCard.displayName = 'InfoCard';

export default function MyAccount() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [parent, setParent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 认证检查和 cookie 读取
  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      const userRole = getCookie('userRole_client')
      const userEmail = getCookie('userEmail_client')
      const userId = getCookie('userId_client')
      const authed = !!(userRole && userEmail && userId)
      setIsAuthenticated(authed)
      if (!authed) {
        router.replace('/client/login')
      }
    }
  }, [router]);

  // 只读：获取个人信息
  useEffect(() => {
    if (!isAuthenticated) return; // 只在认证后才加载数据
    
    setLoading(true);
    const parentId = getCookie('userId_client');
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
  }, [t, isAuthenticated]);

  // 使用 useCallback 缓存格式化函数
  const formatArray = useCallback((arr: string[] | undefined): string =>
    Array.isArray(arr) && arr.length ? arr.join(", ") : "-", []);
  const formatValue = useCallback((val: string | undefined): string =>
    val ? val : "-", []);

  // 使用 useMemo 缓存解析后的信息
  const basic = useMemo(() => parent?.basic_information || {}, [parent]);
  const contact = useMemo(() => parent?.contact_information || {}, [parent]);
  const family = useMemo(() => parent?.family_profile || {}, [parent]);
  const program = useMemo(() => parent?.program_interests || {}, [parent]);
  const referral = useMemo(() => parent?.referral || {}, [parent]);

  // 使用 useMemo 缓存计算值
  const fullName = useMemo(() => 
    `${basic.firstName || ''} ${basic.lastName || ''}`.trim() || 'Unknown', 
    [basic.firstName, basic.lastName]
  );

  const avatarInitial = useMemo(() => 
    basic.firstName?.[0] || 'U', 
    [basic.firstName]
  );

  const phoneDisplay = useMemo(() => {
    const countryCode = contact?.cell_phone_country_code ? `+${contact.cell_phone_country_code} ` : "";
    const phoneNumber = formatValue(contact?.cell_phone);
    return `${countryCode}${phoneNumber}`;
  }, [contact?.cell_phone_country_code, contact?.cell_phone, formatValue]);

  const agreeToMessages = useMemo(() => 
    contact?.is_agree_cell_phone_receive_messages ? t('yes', 'Yes') : t('no', 'No'),
    [contact?.is_agree_cell_phone_receive_messages, t]
  );

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查中
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-sage-700">{t('loading')}</div>
      </div>
    );
  }

  // 未认证
  if (!isAuthenticated) {
    return null;
  }

  // 数据加载中
  if (loading) return <div className="p-8 text-sage-600">{t('loadingText', '加载中...')}</div>;
  
  // 加载错误
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12 py-6">
      <div className="flex items-center justify-between pt-6 pb-2">
        <h1 className="text-2xl font-medium text-sage-800">{t('intendedParents.personalInfo', '个人信息')}</h1>
      </div>
      <p className="text-sage-700 mb-6">{t('intendedParents.personalInfoDescription', '查看您的个人资料信息')}</p>

      {/* 基本信息 */}
      <InfoCard title={t('intendedParents.basicInfo.title', 'Basic Information')}>
        <div className="flex items-center gap-6 mb-4">
          <Avatar className="w-20 h-20">
            <AvatarFallback className="bg-sage-100 text-sage-800 text-3xl">
              {avatarInitial}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-medium text-sage-800">
              {fullName}
            </h3>
            <p className="text-sage-600">
              {basic.gender_identity}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <InfoField 
            label={t('intendedParents.basicInfo.firstName', 'First Name')} 
            value={formatValue(basic.firstName)} 
          />
          <InfoField 
            label={t('intendedParents.basicInfo.lastName', 'Last Name')} 
            value={formatValue(basic.lastName)} 
          />
          <InfoField 
            label={t('intendedParents.basicInfo.dob', 'Date of Birth')} 
            value={formatValue(basic.date_of_birth)} 
          />
          <InfoField 
            label={t('intendedParents.basicInfo.genderIdentity', 'Gender Identity')} 
            value={formatValue(basic.gender_identity)} 
          />
          <InfoField 
            label={t('intendedParents.basicInfo.pronouns', 'Pronouns')} 
            value={formatValue(basic.pronouns)} 
          />
          <InfoField 
            label={t('intendedParents.basicInfo.ethnicity', 'Ethnicity')} 
            value={formatValue(basic.ethnicity)} 
          />
          <InfoField 
            label={t('intendedParents.trustAccount.email', 'Email')} 
            value={formatValue(parent?.email)} 
          />
        </div>
      </InfoCard>
      
      {/* 联系信息 */}
      <InfoCard title={t('intendedParents.contactInfo.title', 'Contact Information')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <InfoField 
            label={t('intendedParents.contactInfo.cellPhone', 'Cell Phone')} 
            value={phoneDisplay} 
          />
          <InfoField 
            label={t('intendedParents.contactInfo.email', 'Email')} 
            value={formatValue(contact?.email_address)} 
          />
          <InfoField 
            label={t('intendedParents.contactInfo.primaryLanguages', 'Primary Languages')} 
            value={formatArray(contact?.primary_languages_selected_keys)} 
          />
          <InfoField 
            label={t('intendedParents.contactInfo.agreeToReceiveMessages', 'Agree to Receive Messages')} 
            value={agreeToMessages} 
          />
        </div>
      </InfoCard>
      
      {/* 家庭资料 */}
      <InfoCard title={t('intendedParents.familyProfile.title', 'Family Profile')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <InfoField 
            label={t('intendedParents.familyProfile.sexualOrientation', 'Sexual Orientation')} 
            value={formatValue(family?.sexual_orientation)} 
          />
          <InfoField 
            label={t('intendedParents.familyProfile.city', 'City')} 
            value={formatValue(family?.city)} 
          />
          <InfoField 
            label={t('intendedParents.familyProfile.country', 'Country')} 
            value={formatValue(family?.country)} 
          />
          <InfoField 
            label={t('intendedParents.familyProfile.stateProvince', 'State/Province')} 
            value={formatValue(family?.state_or_province)} 
          />
        </div>
      </InfoCard>

      {/* 项目意向 */}
      <InfoCard title={t('intendedParents.programInterests.title', 'Program Interests')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <InfoField 
            label={t('intendedParents.programInterests.interestedServices', 'Interested Services')} 
            value={formatValue(program?.interested_services)} 
          />
          <InfoField 
            label={t('intendedParents.programInterests.journeyStartTiming', 'Journey Start Timing')} 
            value={formatValue(program?.journey_start_timing)} 
          />
          <InfoField 
            label={t('intendedParents.programInterests.desiredChildrenCount', 'Desired Children Count')} 
            value={formatValue(program?.desired_children_count)} 
          />
        </div>
      </InfoCard>

      {/* 渠道及初步沟通 */}
      <InfoCard title={t('intendedParents.referral.title', 'Referral & Initial Communication')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <InfoField 
            label={t('intendedParents.referral.referralSource', 'Referral Source')} 
            value={formatValue(referral?.referral_source)} 
          />
          <div className="col-span-2">
            <InfoField 
              label={t('intendedParents.referral.initialQuestions', 'Initial Questions')} 
              value={formatValue(referral?.initial_questions)} 
            />
          </div>
        </div>
      </InfoCard>
      
      {/* 底部空白区域，提供页面底部间距 */}
      <div className="pb-8"></div>
    </div>
  );
}

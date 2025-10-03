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
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const [parent, setParent] = useState<any>(null);
  const [editedParent, setEditedParent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 获取个人信息的函数
  const fetchParentData = () => {
    setLoading(true);
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
          // 如果不在编辑状态，重置编辑数据
          if (!isEditing) {
            setEditedParent(JSON.parse(JSON.stringify(data)));
          }
        }
      })
      .catch(e => setError(t('clientProfileDetail.fetchFailed', '获取信息失败')))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchParentData();
  }, [t]);
  
  // 表单提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    
    try {
      const parentId = localStorage.getItem('parentId');
      if (!parentId) {
        setSaveError(t('clientProfileDetail.notFound', '未登录或缺少用户ID'));
        return;
      }
      
      const response = await fetch('/api/update-intended-parent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          parentId,
          data: editedParent
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || t('updateFailed', '更新失败'));
      }
      
      // 更新本地状态为服务器返回的数据
      if (result.data) {
        setParent(result.data);
        setEditedParent(JSON.parse(JSON.stringify(result.data)));
      } else {
        setParent(editedParent);
      }
      
      setSaveSuccess(true);
      setIsEditing(false);
      
      // 3秒后清除成功提示
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
    } catch (error: any) {
      console.error('Save error:', error);
      setSaveError(error.message || t('updateFailed', '更新失败'));
    } finally {
      setIsSaving(false);
    }
  };
  
  // 处理表单字段变化
  const handleInputChange = (section: string, field: string, value: any) => {
    setEditedParent((prev: any) => {
      const updated = { ...prev };
      if (section === 'root') {
        updated[field] = value;
      } else {
        updated[section] = {
          ...updated[section],
          [field]: value
        };
      }
      return updated;
    });
  };

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
        <div className="flex items-center gap-4">
          {!isEditing ? (
            <Button 
              variant="outline" 
              className="bg-white border-sage-300 hover:bg-sage-100 text-sage-800"
              onClick={() => setIsEditing(true)}
            >
              {t('edit', '编辑个人资料')}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                className="bg-white border-sage-300 hover:bg-sage-100 text-sage-800"
                onClick={() => {
                  setIsEditing(false);
                  setEditedParent(JSON.parse(JSON.stringify(parent)));
                }}
                disabled={isSaving}
              >
                {t('cancel', '取消')}
              </Button>
              <Button 
                variant="default" 
                className="bg-sage-600 hover:bg-sage-700 text-white"
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isSaving ? t('saving', '保存中...') : t('save', '保存')}
              </Button>
            </div>
          )}
        </div>
      </div>
      <p className="text-sage-700 mb-6">{t('intendedParents.personalInfoDescription', '查看并管理您的个人资料信息')}</p>
      
      {saveSuccess && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <div className="flex">
            <p className="text-green-700">{t('updateSuccess', '更新成功！')}</p>
          </div>
        </div>
      )}
      
      {saveError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <p className="text-red-700">{saveError}</p>
          </div>
        </div>
      )}

      {/* 基本信息 */}
      <Card className="bg-white border-sage-200 animate-slide-in-left overflow-hidden">
        <CardHeader className="pb-4">
          <CardTitle className="text-sage-800 text-lg font-medium">{t('intendedParents.basicInfo.title', 'Basic Information')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6 mb-4">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-sage-100 text-sage-800 text-3xl">
                {isEditing 
                  ? editedParent?.basic_information?.firstName?.[0] || 'U'
                  : basic.firstName?.[0] || 'U'
                }
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-medium text-sage-800">
                {isEditing 
                  ? `${editedParent?.basic_information?.firstName || ''} ${editedParent?.basic_information?.lastName || ''}`
                  : `${basic.firstName || ''} ${basic.lastName || ''}`
                }
              </h3>
              <p className="text-sage-600">
                {isEditing ? editedParent?.basic_information?.gender_identity : basic.gender_identity}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <div>
              <Label className="text-sage-600 text-sm" htmlFor="firstName">{t('intendedParents.basicInfo.firstName', 'First Name')}:</Label>
              {isEditing ? (
                <input
                  id="firstName"
                  type="text"
                  className="w-full p-2 border border-sage-200 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  value={editedParent?.basic_information?.firstName || ''}
                  onChange={(e) => handleInputChange('basic_information', 'firstName', e.target.value)}
                />
              ) : (
                <p className="font-medium text-sage-800 break-words">{formatValue(basic.firstName)}</p>
              )}
            </div>
            <div>
              <Label className="text-sage-600 text-sm" htmlFor="lastName">{t('intendedParents.basicInfo.lastName', 'Last Name')}:</Label>
              {isEditing ? (
                <input
                  id="lastName"
                  type="text"
                  className="w-full p-2 border border-sage-200 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  value={editedParent?.basic_information?.lastName || ''}
                  onChange={(e) => handleInputChange('basic_information', 'lastName', e.target.value)}
                />
              ) : (
                <p className="font-medium text-sage-800 break-words">{formatValue(basic.lastName)}</p>
              )}
            </div>
            <div>
              <Label className="text-sage-600 text-sm" htmlFor="dob">{t('intendedParents.basicInfo.dob', 'Date of Birth')}:</Label>
              {isEditing ? (
                <input
                  id="dob"
                  type="date"
                  className="w-full p-2 border border-sage-200 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  value={editedParent?.basic_information?.date_of_birth || ''}
                  onChange={(e) => handleInputChange('basic_information', 'date_of_birth', e.target.value)}
                />
              ) : (
                <p className="font-medium text-sage-800 break-words">{formatValue(basic.date_of_birth)}</p>
              )}
            </div>
            <div>
              <Label className="text-sage-600 text-sm" htmlFor="gender">{t('intendedParents.basicInfo.genderIdentity', 'Gender Identity')}:</Label>
              {isEditing ? (
                <select
                  id="gender"
                  className="w-full p-2 border border-sage-200 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  value={editedParent?.basic_information?.gender_identity || ''}
                  onChange={(e) => handleInputChange('basic_information', 'gender_identity', e.target.value)}
                >
                  <option value="">{t('pleaseSelect', '请选择')}</option>
                  <option value="Male">{t('genderOptions.male', '男')}</option>
                  <option value="Female">{t('genderOptions.female', '女')}</option>
                  <option value="Non-Binary">{t('genderOptions.nonBinary', '非二元性别')}</option>
                  <option value="Other">{t('genderOptions.other', '其他')}</option>
                </select>
              ) : (
                <p className="font-medium text-sage-800 break-words">{formatValue(basic.gender_identity)}</p>
              )}
            </div>
            <div>
              <Label className="text-sage-600 text-sm" htmlFor="pronouns">{t('intendedParents.basicInfo.pronouns', 'Pronouns')}:</Label>
              {isEditing ? (
                <input
                  id="pronouns"
                  type="text"
                  className="w-full p-2 border border-sage-200 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  value={editedParent?.basic_information?.pronouns || ''}
                  onChange={(e) => handleInputChange('basic_information', 'pronouns', e.target.value)}
                />
              ) : (
                <p className="font-medium text-sage-800 break-words">{formatValue(basic.pronouns)}</p>
              )}
            </div>
            <div>
              <Label className="text-sage-600 text-sm" htmlFor="ethnicity">{t('intendedParents.basicInfo.ethnicity', 'Ethnicity')}:</Label>
              {isEditing ? (
                <select
                  id="ethnicity"
                  className="w-full p-2 border border-sage-200 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  value={editedParent?.basic_information?.ethnicity || ''}
                  onChange={(e) => handleInputChange('basic_information', 'ethnicity', e.target.value)}
                >
                  <option value="">{t('pleaseSelect', '请选择')}</option>
                  <option value="Asian">{t('ethnicityOptions.asian', '亚洲人')}</option>
                  <option value="Black">{t('ethnicityOptions.black', '黑人')}</option>
                  <option value="Hispanic">{t('ethnicityOptions.hispanic', '西班牙裔')}</option>
                  <option value="Middle Eastern">{t('ethnicityOptions.middleEastern', '中东人')}</option>
                  <option value="White">{t('ethnicityOptions.white', '白人')}</option>
                  <option value="Mixed">{t('ethnicityOptions.mixed', '混血')}</option>
                  <option value="Other">{t('ethnicityOptions.other', '其他')}</option>
                </select>
              ) : (
                <p className="font-medium text-sage-800 break-words">{formatValue(basic.ethnicity)}</p>
              )}
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.trustAccount.email', 'Email')}:</Label>
              <p className="font-medium text-sage-800 break-words">{formatValue(parent?.email)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.trustAccount.title', 'Trust Account Balance')}:</Label>
              <p className="font-medium text-sage-800 break-words">{parent?.trust_account_balance ?? 0}</p>
            </div>
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
              <Label className="text-sage-600 text-sm" htmlFor="cellPhoneCode">{t('intendedParents.contactInfo.cellPhone', 'Cell Phone')}:</Label>
              {isEditing ? (
                <div className="flex gap-2 mt-1">
                  <input
                    id="cellPhoneCode"
                    type="text"
                    className="w-16 p-2 border border-sage-200 rounded focus:outline-none focus:ring-2 focus:ring-sage-500"
                    placeholder="+1"
                    value={editedParent?.contact_information?.cell_phone_country_code || ''}
                    onChange={(e) => handleInputChange('contact_information', 'cell_phone_country_code', e.target.value.replace(/\D/g, ''))}
                  />
                  <input
                    id="cellPhone"
                    type="tel"
                    className="flex-1 p-2 border border-sage-200 rounded focus:outline-none focus:ring-2 focus:ring-sage-500"
                    placeholder="12345678"
                    value={editedParent?.contact_information?.cell_phone || ''}
                    onChange={(e) => handleInputChange('contact_information', 'cell_phone', e.target.value)}
                  />
                </div>
              ) : (
                <p className="font-medium text-sage-800 break-words">
                  {contact?.cell_phone_country_code ? `+${contact.cell_phone_country_code} ` : ""}{formatValue(contact?.cell_phone)}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sage-600 text-sm" htmlFor="email">{t('intendedParents.contactInfo.email', 'Email')}:</Label>
              {isEditing ? (
                <input
                  id="email"
                  type="email"
                  className="w-full p-2 border border-sage-200 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  value={editedParent?.contact_information?.email_address || ''}
                  onChange={(e) => handleInputChange('contact_information', 'email_address', e.target.value)}
                />
              ) : (
                <p className="font-medium text-sage-800 break-words">{formatValue(contact?.email_address)}</p>
              )}
            </div>
            <div>
              <Label className="text-sage-600 text-sm" htmlFor="languages">{t('intendedParents.contactInfo.primaryLanguages', 'Primary Languages')}:</Label>
              {isEditing ? (
                <select
                  id="languages"
                  className="w-full p-2 border border-sage-200 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  multiple
                  value={editedParent?.contact_information?.primary_languages_selected_keys || []}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    handleInputChange('contact_information', 'primary_languages_selected_keys', selectedOptions);
                  }}
                >
                  <option value="English">{t('languageOptions.english', '英语')}</option>
                  <option value="Chinese">{t('languageOptions.chinese', '中文')}</option>
                  <option value="Spanish">{t('languageOptions.spanish', '西班牙语')}</option>
                  <option value="French">{t('languageOptions.french', '法语')}</option>
                  <option value="German">{t('languageOptions.german', '德语')}</option>
                  <option value="Japanese">{t('languageOptions.japanese', '日语')}</option>
                  <option value="Korean">{t('languageOptions.korean', '韩语')}</option>
                  <option value="Russian">{t('languageOptions.russian', '俄语')}</option>
                  <option value="Portuguese">{t('languageOptions.portuguese', '葡萄牙语')}</option>
                  <option value="Arabic">{t('languageOptions.arabic', '阿拉伯语')}</option>
                  <option value="Other">{t('languageOptions.other', '其他')}</option>
                </select>
              ) : (
                <p className="font-medium text-sage-800 break-words">{formatArray(contact?.primary_languages_selected_keys)}</p>
              )}
              {isEditing && (
                <p className="text-xs text-sage-500 mt-1">{t('multipleSelectHint', '按住 Ctrl 键可多选')}</p>
              )}
            </div>
            <div>
              <Label className="text-sage-600 text-sm" htmlFor="agreeMsg">{t('intendedParents.contactInfo.agreeToReceiveMessages', 'Agree to Receive Messages')}:</Label>
              {isEditing ? (
                <div className="flex items-center mt-2">
                  <input
                    id="agreeMsg"
                    type="checkbox"
                    className="h-4 w-4 rounded border-sage-300 text-sage-600 focus:ring-sage-500"
                    checked={editedParent?.contact_information?.is_agree_cell_phone_receive_messages || false}
                    onChange={(e) => handleInputChange('contact_information', 'is_agree_cell_phone_receive_messages', e.target.checked)}
                  />
                  <Label htmlFor="agreeMsg" className="ml-2 text-sm text-sage-700">
                    {t('agreeToReceiveMessages', '同意接收消息')}
                  </Label>
                </div>
              ) : (
                <p className="font-medium text-sage-800 break-words">
                  {contact?.is_agree_cell_phone_receive_messages ? t('yes', 'Yes') : t('no', 'No')}
                </p>
              )}
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
              <Label className="text-sage-600 text-sm" htmlFor="sexualOrientation">{t('intendedParents.familyProfile.sexualOrientation', 'Sexual Orientation')}:</Label>
              {isEditing ? (
                <select
                  id="sexualOrientation"
                  className="w-full p-2 border border-sage-200 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  value={editedParent?.family_profile?.sexual_orientation || ''}
                  onChange={(e) => handleInputChange('family_profile', 'sexual_orientation', e.target.value)}
                >
                  <option value="">{t('pleaseSelect', '请选择')}</option>
                  <option value="Heterosexual">{t('sexualOrientationOptions.heterosexual', '异性恋')}</option>
                  <option value="Homosexual">{t('sexualOrientationOptions.homosexual', '同性恋')}</option>
                  <option value="Bisexual">{t('sexualOrientationOptions.bisexual', '双性恋')}</option>
                  <option value="Pansexual">{t('sexualOrientationOptions.pansexual', '泛性恋')}</option>
                  <option value="Asexual">{t('sexualOrientationOptions.asexual', '无性恋')}</option>
                  <option value="Other">{t('sexualOrientationOptions.other', '其他')}</option>
                </select>
              ) : (
                <p className="font-medium text-sage-800 break-words">{formatValue(family?.sexual_orientation)}</p>
              )}
            </div>
            <div>
              <Label className="text-sage-600 text-sm" htmlFor="city">{t('intendedParents.familyProfile.city', 'City')}:</Label>
              {isEditing ? (
                <input
                  id="city"
                  type="text"
                  className="w-full p-2 border border-sage-200 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  value={editedParent?.family_profile?.city || ''}
                  onChange={(e) => handleInputChange('family_profile', 'city', e.target.value)}
                />
              ) : (
                <p className="font-medium text-sage-800 break-words">{formatValue(family?.city)}</p>
              )}
            </div>
            <div>
              <Label className="text-sage-600 text-sm" htmlFor="country">{t('intendedParents.familyProfile.country', 'Country')}:</Label>
              {isEditing ? (
                <input
                  id="country"
                  type="text"
                  className="w-full p-2 border border-sage-200 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  value={editedParent?.family_profile?.country || ''}
                  onChange={(e) => handleInputChange('family_profile', 'country', e.target.value)}
                />
              ) : (
                <p className="font-medium text-sage-800 break-words">{formatValue(family?.country)}</p>
              )}
            </div>
            <div>
              <Label className="text-sage-600 text-sm" htmlFor="stateProvince">{t('intendedParents.familyProfile.stateProvince', 'State/Province')}:</Label>
              {isEditing ? (
                <input
                  id="stateProvince"
                  type="text"
                  className="w-full p-2 border border-sage-200 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  value={editedParent?.family_profile?.state_or_province || ''}
                  onChange={(e) => handleInputChange('family_profile', 'state_or_province', e.target.value)}
                />
              ) : (
                <p className="font-medium text-sage-800 break-words">{formatValue(family?.state_or_province)}</p>
              )}
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
              <Label className="text-sage-600 text-sm" htmlFor="interestedServices">{t('intendedParents.programInterests.interestedServices', 'Interested Services')}:</Label>
              {isEditing ? (
                <select
                  id="interestedServices"
                  className="w-full p-2 border border-sage-200 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  value={editedParent?.program_interests?.interested_services || ''}
                  onChange={(e) => handleInputChange('program_interests', 'interested_services', e.target.value)}
                >
                  <option value="">{t('pleaseSelect', '请选择')}</option>
                  <option value="Surrogacy Service">{t('serviceOptions.surrogacyService', '代孕服务')}</option>
                  <option value="Surrogacy + Egg Donor Service">{t('serviceOptions.surrogacyEggDonorService', '代孕+捐卵服务')}</option>
                  <option value="Egg Donor Service">{t('serviceOptions.eggDonorService', '捐卵服务')}</option>
                  <option value="Third Party Surrogate">{t('serviceOptions.thirdPartySurrogate', '第三方代孕')}</option>
                  <option value="Bring Your Own Surrogate">{t('serviceOptions.bringYourOwnSurrogate', '自带代孕者')}</option>
                  <option value="Bring Your Own Surrogate + Egg Donor">{t('serviceOptions.bringYourOwnSurrogateEgg', '自带代孕者+捐卵')}</option>
                  <option value="Not Sure">{t('serviceOptions.notSure', '不确定')}</option>
                </select>
              ) : (
                <p className="font-medium text-sage-800 break-words">{formatValue(program?.interested_services)}</p>
              )}
            </div>
            <div>
              <Label className="text-sage-600 text-sm" htmlFor="journeyTiming">{t('intendedParents.programInterests.journeyStartTiming', 'Journey Start Timing')}:</Label>
              {isEditing ? (
                <select
                  id="journeyTiming"
                  className="w-full p-2 border border-sage-200 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  value={editedParent?.program_interests?.journey_start_timing || ''}
                  onChange={(e) => handleInputChange('program_interests', 'journey_start_timing', e.target.value)}
                >
                  <option value="">{t('pleaseSelect', '请选择')}</option>
                  <option value="Immediately">{t('timingOptions.immediately', '立即开始')}</option>
                  <option value="Within 3 months">{t('timingOptions.within3Months', '3个月内')}</option>
                  <option value="Within 6 months">{t('timingOptions.within6Months', '6个月内')}</option>
                  <option value="Within 1 year">{t('timingOptions.within1Year', '1年内')}</option>
                  <option value="More than 1 year">{t('timingOptions.moreThan1Year', '1年以上')}</option>
                  <option value="Not sure">{t('timingOptions.notSure', '不确定')}</option>
                </select>
              ) : (
                <p className="font-medium text-sage-800 break-words">{formatValue(program?.journey_start_timing)}</p>
              )}
            </div>
            <div>
              <Label className="text-sage-600 text-sm" htmlFor="childrenCount">{t('intendedParents.programInterests.desiredChildrenCount', 'Desired Children Count')}:</Label>
              {isEditing ? (
                <select
                  id="childrenCount"
                  className="w-full p-2 border border-sage-200 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  value={editedParent?.program_interests?.desired_children_count || ''}
                  onChange={(e) => handleInputChange('program_interests', 'desired_children_count', e.target.value)}
                >
                  <option value="">{t('pleaseSelect', '请选择')}</option>
                  <option value="1">{t('childrenCountOptions.one', '1个')}</option>
                  <option value="2">{t('childrenCountOptions.two', '2个')}</option>
                  <option value="3">{t('childrenCountOptions.three', '3个')}</option>
                  <option value="4+">{t('childrenCountOptions.fourPlus', '4个或更多')}</option>
                  <option value="Not sure">{t('childrenCountOptions.notSure', '不确定')}</option>
                </select>
              ) : (
                <p className="font-medium text-sage-800 break-words">{formatValue(program?.desired_children_count)}</p>
              )}
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
              <Label className="text-sage-600 text-sm" htmlFor="referralSource">{t('intendedParents.referral.referralSource', 'Referral Source')}:</Label>
              {isEditing ? (
                <select
                  id="referralSource"
                  className="w-full p-2 border border-sage-200 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  value={editedParent?.referral?.referral_source || ''}
                  onChange={(e) => handleInputChange('referral', 'referral_source', e.target.value)}
                >
                  <option value="">{t('pleaseSelect', '请选择')}</option>
                  <option value="Search Engine">{t('referralSourceOptions.searchEngine', '搜索引擎')}</option>
                  <option value="Social Media">{t('referralSourceOptions.socialMedia', '社交媒体')}</option>
                  <option value="Friend Referral">{t('referralSourceOptions.friendReferral', '朋友推荐')}</option>
                  <option value="Doctor Referral">{t('referralSourceOptions.doctorReferral', '医生推荐')}</option>
                  <option value="Advertisement">{t('referralSourceOptions.advertisement', '广告')}</option>
                  <option value="Event/Conference">{t('referralSourceOptions.eventConference', '活动/会议')}</option>
                  <option value="Other">{t('referralSourceOptions.other', '其他')}</option>
                </select>
              ) : (
                <p className="font-medium text-sage-800 break-words">{formatValue(referral?.referral_source)}</p>
              )}
            </div>
            <div className="col-span-2">
              <Label className="text-sage-600 text-sm" htmlFor="initialQuestions">{t('intendedParents.referral.initialQuestions', 'Initial Questions')}:</Label>
              {isEditing ? (
                <textarea
                  id="initialQuestions"
                  rows={3}
                  className="w-full p-2 border border-sage-200 rounded mt-1 focus:outline-none focus:ring-2 focus:ring-sage-500"
                  value={editedParent?.referral?.initial_questions || ''}
                  onChange={(e) => handleInputChange('referral', 'initial_questions', e.target.value)}
                  placeholder={t('enterInitialQuestions', '请输入您的初步问题...')}
                />
              ) : (
                <p className="font-medium text-sage-800 break-words">{formatValue(referral?.initial_questions)}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 底部空白区域，提供页面底部间距 */}
      <div className="pb-8"></div>
    </div>
  );
}

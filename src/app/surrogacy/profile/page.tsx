"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "react-i18next";
import { User, MessageSquare, FileText, Calendar, Activity, Edit, Save, X } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import "../../../i18n";

export default function SurrogacyProfile() {
  const { t, i18n } = useTranslation('common');
  const { toast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  // 计算年龄的函数
  const calculateAge = (dateOfBirth: string | undefined): string => {
    if (!dateOfBirth) return t('noData', '暂无数据');
    
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age.toString();
  }

  // 开始编辑
  const handleStartEdit = () => {
    setEditData({
      contact_information: { ...data?.contact_information },
      about_you: { ...data?.about_you },
      pregnancy_and_health: { ...data?.pregnancy_and_health },
      gestational_surrogacy_interview: { ...data?.gestational_surrogacy_interview }
    });
    setIsEditing(true);
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditData(null);
    setIsEditing(false);
  };

  // 保存修改
  const handleSave = async () => {
    setSaving(true);
    try {
      const surrogateId = typeof window !== "undefined" ? localStorage.getItem("surrogateId") : null;
      if (!surrogateId) {
        throw new Error(t('error.noUserId', '未找到用户ID'));
      }

      const response = await fetch(`/api/surrogate-profile-update?id=${surrogateId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t('updateFailed', '更新失败'));
      }

      const result = await response.json();
      // 更新本地状态，保持照片数据不变
      setData((prevData: any) => ({
        ...prevData,
        ...result.data,
        // 确保照片数据不会被覆盖
        upload_photos: prevData?.upload_photos || result.data.upload_photos
      }));
      
      setIsEditing(false);
      setEditData(null);
      
      toast({
        title: t('updateSuccess', '更新成功!'),
        description: t('profileUpdated', '您的个人资料已成功更新'),
        variant: "default",
      });

    } catch (error) {
      console.error('保存失败:', error);
      toast({
        title: t('updateFailed', '更新失败'),
        description: error instanceof Error ? error.message : t('unknownError', '未知错误'),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  // 更新编辑数据
  const updateEditData = (section: string, field: string, value: any) => {
    setEditData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  useEffect(() => {
    const surrogacyId = typeof window !== "undefined" ? localStorage.getItem("surrogateId") : null;
    if (!surrogacyId) {
      setError(t('intendedParents.error.noParentInfo', '未找到代孕母信息'));
      setLoading(false);
      return;
    }
    fetch(`/api/surrogate_mothers-detail?surrogacy=${surrogacyId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(t('intendedParents.error.fetchDataFailed', '获取数据失败'));
        const result = await res.json();
        setData(result);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [t]);

  if (loading) {
    return (
      <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-sage-600">{t('loading', '加载中...')}</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12">
        <div className="text-center py-8 text-red-600">{error}</div>
      </div>
    );
  }

  const about = data?.about_you || {};
  const contact = data?.contact_information || {};
  const health = data?.pregnancy_and_health || {};
  const photos = Array.isArray(data?.upload_photos) ? data.upload_photos : [];
  const interview = data?.gestational_surrogacy_interview || {};

  // 当前显示的数据 (编辑时显示editData，否则显示原始data)
  const currentContact = isEditing ? editData?.contact_information || {} : contact;
  const currentAbout = isEditing ? editData?.about_you || {} : about;
  const currentHealth = isEditing ? editData?.pregnancy_and_health || {} : health;
  const currentInterview = isEditing ? editData?.gestational_surrogacy_interview || {} : interview;

  return (
    <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12">
      <div className="flex items-center justify-between pt-6 pb-2">
        <div>
          <h1 className="text-2xl font-medium text-sage-800">{t('surrogacyProfile.title', '我的个人资料')}</h1>
          <p className="text-sage-600 text-sm mt-1">{t('surrogacyProfile.description', '查看和管理您的个人资料信息')}</p>
        </div>
        <div className="flex items-center gap-4">
          {!isEditing ? (
            <Button
              variant="outline"
              className="bg-white"
              onClick={handleStartEdit}
            >
              <Edit className="w-4 h-4 mr-2" />
              {t('edit', '编辑资料')}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                <X className="w-4 h-4 mr-2" />
                {t('cancel', '取消')}
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-sage-600 hover:bg-sage-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? t('saving', '保存中...') : t('save', '保存')}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* 顶部照片展示区域 */}
      <div className="w-full flex flex-col items-center mb-6">
        <h3 className="text-lg font-medium text-sage-800 mb-3">{t('uploadPhotos', '上传照片')}</h3>
        {photos.length > 0 ? (
          <div className="flex gap-6 justify-center flex-wrap w-full">
            {photos.map((photo: any, idx: number) => (
              <div key={idx} className="w-48 h-48 rounded-xl overflow-hidden border border-sage-200 bg-sage-50 flex items-center justify-center shadow relative">
                <img
                  src={photo.url}
                  alt={photo.name || `photo-${idx+1}`}
                  className="object-cover w-full h-full transition-transform duration-200 hover:scale-105"
                  loading="lazy"
                />
                {/* 图片序号标签 */}
                <span className="absolute top-2 left-2 bg-sage-700 text-white text-xs px-2 py-1 rounded shadow">
                  {`${t('photo', '照片')} ${idx+1}`}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sage-500 text-sm">{t('noPhotosUploaded', '暂无上传照片')}</div>
        )}
      </div>

      {/* 状态和基本信息 */}
      <Card className="bg-white border-sage-200 animate-slide-in-left overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-sage-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-sage-800">
                  {currentContact ? `${currentContact.first_name || ""} ${currentContact.last_name || ""}`.trim() : data?.id}
                </h2>
                <p className="text-sage-500">{t('id', 'ID')}: #{data?.id} • {calculateAge(currentContact?.date_of_birth)} {t('yearsOld', '岁')}</p>
              </div>
            </div>
            <Badge variant="outline" className="px-3 py-1 bg-green-100 text-green-800 border-green-200">
              {(currentContact?.surrogacy_experience_count ?? 0) > 0 ? t('experiencedSurrogate', '有经验代孕母') : t('firstTimeSurrogate', '初次代孕母')}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                <User className="w-5 h-5" />
                {t('contactInformation', '联系信息')}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('dateOfBirth', '出生日期')}:</span>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={currentContact?.date_of_birth || ''}
                      onChange={(e) => updateEditData('contact_information', 'date_of_birth', e.target.value)}
                      className="h-7 text-xs"
                    />
                  ) : (
                    <span className="text-sage-800">{currentContact?.date_of_birth ?? t('noData', '暂无数据')}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('phone', '电话')}:</span>
                  {isEditing ? (
                    <Input
                      value={currentContact?.cell_phone || ''}
                      onChange={(e) => updateEditData('contact_information', 'cell_phone', e.target.value)}
                      className="h-7 text-xs"
                      placeholder="手机号码"
                    />
                  ) : (
                    <span className="text-sage-800">{currentContact?.cell_phone_country_code ? `+${currentContact.cell_phone_country_code} ` : ""}{currentContact?.cell_phone ?? t('noData', '暂无数据')}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('email', '邮箱')}:</span>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={currentContact?.email_address || ''}
                      onChange={(e) => updateEditData('contact_information', 'email_address', e.target.value)}
                      className="h-7 text-xs"
                      placeholder="邮箱地址"
                    />
                  ) : (
                    <span className="text-sage-800">{currentContact?.email_address ?? t('noData', '暂无数据')}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('city', '城市')}:</span>
                  {isEditing ? (
                    <Input
                      value={currentContact?.city || ''}
                      onChange={(e) => updateEditData('contact_information', 'city', e.target.value)}
                      className="h-7 text-xs"
                      placeholder="城市"
                    />
                  ) : (
                    <span className="text-sage-800">{currentContact?.city ?? t('noData', '暂无数据')}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('stateOrProvince', '省份/州')}:</span>
                  {isEditing ? (
                    <Input
                      value={currentContact?.state_or_province || ''}
                      onChange={(e) => updateEditData('contact_information', 'state_or_province', e.target.value)}
                      className="h-7 text-xs"
                      placeholder="省份/州"
                    />
                  ) : (
                    <span className="text-sage-800">{currentContact?.state_or_province ?? t('noData', '暂无数据')}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('country', '国家')}:</span>
                  {isEditing ? (
                    <Input
                      value={currentContact?.country || ''}
                      onChange={(e) => updateEditData('contact_information', 'country', e.target.value)}
                      className="h-7 text-xs"
                      placeholder="国家"
                    />
                  ) : (
                    <span className="text-sage-800">{currentContact?.country ?? t('noData', '暂无数据')}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('zipCode', '邮政编码')}:</span>
                  {isEditing ? (
                    <Input
                      value={currentContact?.zip_code || ''}
                      onChange={(e) => updateEditData('contact_information', 'zip_code', e.target.value)}
                      className="h-7 text-xs"
                      placeholder="邮政编码"
                    />
                  ) : (
                    <span className="text-sage-800">{currentContact?.zip_code ?? t('noData', '暂无数据')}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {t('physicalCharacteristics', '身体特征')}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('height', '身高')}:</span>
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={currentContact?.height || ''}
                        onChange={(e) => updateEditData('contact_information', 'height', e.target.value)}
                        className="h-7 text-xs w-16"
                        placeholder="身高"
                      />
                      <span className="text-xs">{t('cm', '公分')}</span>
                    </div>
                  ) : (
                    <span className="text-sage-800">{currentContact?.height ?? t('noData', '暂无数据')} {t('cm', '公分')}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('weight', '体重')}:</span>
                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <Input
                        type="number"
                        value={currentContact?.weight || ''}
                        onChange={(e) => updateEditData('contact_information', 'weight', e.target.value)}
                        className="h-7 text-xs w-16"
                        placeholder="体重"
                      />
                      <span className="text-xs">{t('kg', '公斤')}</span>
                    </div>
                  ) : (
                    <span className="text-sage-800">{currentContact?.weight ?? t('noData', '暂无数据')} {t('kg', '公斤')}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('bmi', 'BMI')}:</span>
                  <span className="text-sage-800">{currentContact?.bmi ?? t('noData', '暂无数据')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('ethnicity', '种族')}:</span>
                  {isEditing ? (
                    <Input
                      value={currentContact?.ethnicity || ''}
                      onChange={(e) => updateEditData('contact_information', 'ethnicity', e.target.value)}
                      className="h-7 text-xs"
                      placeholder="种族"
                    />
                  ) : (
                    <span className="text-sage-800">{currentContact?.ethnicity ?? t('noData', '暂无数据')}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('surrogacyExperience', '代孕经验')}:</span>
                  <span className="text-sage-800">{currentContact?.surrogacy_experience_count ?? "0"} {t('times', '次')}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                {t('aboutYou', '关于您')}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('occupation', '职业')}:</span>
                  {isEditing ? (
                    <Input
                      value={currentAbout?.occupation || ''}
                      onChange={(e) => updateEditData('about_you', 'occupation', e.target.value)}
                      className="h-7 text-xs"
                      placeholder="职业"
                    />
                  ) : (
                    <span className="text-sage-800">{currentAbout?.occupation ?? t('noData', '暂无数据')}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('education', '教育程度')}:</span>
                  {isEditing ? (
                    <Input
                      value={currentAbout?.education_level || ''}
                      onChange={(e) => updateEditData('about_you', 'education_level', e.target.value)}
                      className="h-7 text-xs"
                      placeholder="教育程度"
                    />
                  ) : (
                    <span className="text-sage-800">{currentAbout?.education_level ?? t('noData', '暂无数据')}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('maritalStatus', '婚姻状况')}:</span>
                  {isEditing ? (
                    <Select
                      value={currentAbout?.marital_status || ''}
                      onValueChange={(value) => updateEditData('about_you', 'marital_status', value)}
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="选择婚姻状况" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">单身</SelectItem>
                        <SelectItem value="married">已婚</SelectItem>
                        <SelectItem value="divorced">离异</SelectItem>
                        <SelectItem value="widowed">丧偶</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className="text-sage-800">{currentAbout?.marital_status ?? t('noData', '暂无数据')}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('partnerSupport', '伴侣支持')}:</span>
                  {isEditing ? (
                    <Input
                      value={currentAbout?.partner_support || ''}
                      onChange={(e) => updateEditData('about_you', 'partner_support', e.target.value)}
                      className="h-7 text-xs"
                      placeholder="伴侣支持"
                    />
                  ) : (
                    <span className="text-sage-800">{currentAbout?.partner_support ?? t('noData', '暂无数据')}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('householdIncome', '家庭收入')}:</span>
                  {isEditing ? (
                    <Input
                      value={currentAbout?.household_income || ''}
                      onChange={(e) => updateEditData('about_you', 'household_income', e.target.value)}
                      className="h-7 text-xs"
                      placeholder="家庭收入"
                    />
                  ) : (
                    <span className="text-sage-800">{currentAbout?.household_income ?? t('noData', '暂无数据')}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* 健康与怀孕历史 */}
        <Card className="bg-white border-sage-200 animate-slide-in-left">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-sage-800 text-lg font-medium">
              <Activity className="w-5 h-5" />
              {t('pregnancyHealth', '怀孕与健康')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-y-4 gap-x-6">
            <div className="space-y-1">
              <Label className="text-sage-600 text-sm">{t('hasGivenBirth', '是否生过孩子')}</Label>
              {isEditing ? (
                <Select
                  value={currentHealth?.has_given_birth ? 'true' : 'false'}
                  onValueChange={(value) => updateEditData('health_information', 'has_given_birth', value === 'true')}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">是</SelectItem>
                    <SelectItem value="false">否</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="font-medium text-sage-800">{currentHealth?.has_given_birth ? t('yes', '是') : t('no', '否')}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <Label className="text-sage-600 text-sm">{t('isCurrentlyPregnant', '目前是否怀孕')}</Label>
              {isEditing ? (
                <Select
                  value={currentHealth?.is_currently_pregnant ? 'true' : 'false'}
                  onValueChange={(value) => updateEditData('health_information', 'is_currently_pregnant', value === 'true')}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">是</SelectItem>
                    <SelectItem value="false">否</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="font-medium text-sage-800">{currentHealth?.is_currently_pregnant ? t('yes', '是') : t('no', '否')}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <Label className="text-sage-600 text-sm">{t('isBreastfeeding', '是否正在哺乳')}</Label>
              {isEditing ? (
                <Select
                  value={currentHealth?.is_breastfeeding ? 'true' : 'false'}
                  onValueChange={(value) => updateEditData('health_information', 'is_breastfeeding', value === 'true')}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">是</SelectItem>
                    <SelectItem value="false">否</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="font-medium text-sage-800">{currentHealth?.is_breastfeeding ? t('yes', '是') : t('no', '否')}</p>
              )}
            </div>
            
            <div className="space-y-1">
              <Label className="text-sage-600 text-sm">{t('hasStillbirth', '是否有死胎经历')}</Label>
              {isEditing ? (
                <Select
                  value={currentHealth?.has_stillbirth ? 'true' : 'false'}
                  onValueChange={(value) => updateEditData('health_information', 'has_stillbirth', value === 'true')}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">是</SelectItem>
                    <SelectItem value="false">否</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="font-medium text-sage-800">{currentHealth?.has_stillbirth ? t('yes', '是') : t('no', '否')}</p>
              )}
            </div>
            
            <div className="space-y-1 col-span-2">
              <Label className="text-sage-600 text-sm">{t('medicalConditions', '疾病状况')}</Label>
              {isEditing ? (
                <Input
                  value={Array.isArray(currentHealth?.medical_conditions) ? currentHealth.medical_conditions.join(", ") : ''}
                  onChange={(e) => updateEditData('health_information', 'medical_conditions', e.target.value.split(", "))}
                  className="h-8 text-sm"
                  placeholder="请用逗号分隔多个疾病"
                />
              ) : (
                <p className="font-medium text-sage-800">{Array.isArray(currentHealth?.medical_conditions) ? currentHealth.medical_conditions.join(", ") : t('noData', '暂无数据')}</p>
              )}
            </div>
            
            <div className="space-y-1 col-span-2">
              <Label className="text-sage-600 text-sm">{t('isTakingMedications', '是否正在服药')}</Label>
              {isEditing ? (
                <Select
                  value={currentHealth?.is_taking_medications ? 'true' : 'false'}
                  onValueChange={(value) => updateEditData('health_information', 'is_taking_medications', value === 'true')}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">是</SelectItem>
                    <SelectItem value="false">否</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="font-medium text-sage-800">{currentHealth?.is_taking_medications ? t('yes', '是') : t('no', '否')}</p>
              )}
              {currentHealth?.is_taking_medications && (
                <div className="mt-2">
                  <Label className="text-sage-600 text-sm">{t('medications', '药物清单')}</Label>
                  {isEditing ? (
                    <Input
                      value={currentHealth?.medications_list || ''}
                      onChange={(e) => updateEditData('health_information', 'medications_list', e.target.value)}
                      className="h-8 text-sm"
                      placeholder="药物清单"
                    />
                  ) : (
                    <p className="font-medium text-sage-800">{currentHealth?.medications_list ?? t('noData', '暂无数据')}</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 怀孕历史 */}
        <Card className="bg-white border-sage-200 animate-slide-in-left" style={{ animationDelay: "100ms" }}>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-sage-800 text-lg font-medium">
              <Calendar className="w-5 h-5" />
              {t('pregnancyHistories', '怀孕历史')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-sage-600 text-sm">{t('backgroundCheckStatus', '背景调查状态')}</Label>
                <p className="font-medium text-sage-800">{health?.background_check_status ?? t('noData', '暂无数据')}</p>
              </div>
              
              <div className="mt-6">
                <Label className="text-sage-600 text-sm">{t('pregnancyHistory', '怀孕历史')}</Label>
                {Array.isArray(health?.pregnancy_histories) && health.pregnancy_histories.length > 0 ? (
                  <div className="space-y-3 mt-2">
                    {health.pregnancy_histories.map((history: any, idx: number) => (
                      <div key={idx} className="p-3 bg-sage-50 rounded-lg border border-sage-200">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-sage-500">{t('deliveryDate', '分娩日期')}:</span>
                            <div className="text-sage-800">{history.delivery_date || t('noData', '暂无数据')}</div>
                          </div>
                          <div>
                            <span className="text-sage-500">{t('birthWeight', '出生体重')}:</span>
                            <div className="text-sage-800">{history.birth_weight || t('noData', '暂无数据')} {t('kg', '公斤')}</div>
                          </div>
                          <div>
                            <span className="text-sage-500">{t('gestationalWeeks', '孕周')}:</span>
                            <div className="text-sage-800">{history.gestational_weeks || t('noData', '暂无数据')}</div>
                          </div>
                          <div>
                            <span className="text-sage-500">{t('numberOfBabies', '婴儿数量')}:</span>
                            <div className="text-sage-800">{history.number_of_babies || t('noData', '暂无数据')}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sage-500 text-sm italic">{t('noData', '暂无数据')}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 面试信息部分 */}
      <div className="bg-white rounded-lg border border-sage-200 p-6 mt-6 animate-slide-in-right">
        <h3 className="text-lg font-medium text-sage-800 flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5" />
          {t('interview', '面试信息')}
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="text-sage-500 text-sm">{t('emotionalSupport', '情感支持')}:</span>
                <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                  {interview?.emotional_support ?? t('noData', '暂无数据')}
                </div>
              </div>
              <div>
                <span className="text-sage-500 text-sm">{t('languagesSpoken', '会说的语言')}:</span>
                <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                  {interview?.languages_spoken ?? t('noData', '暂无数据')}
                </div>
              </div>
              <div>
                <span className="text-sage-500 text-sm">{t('motivation', '动机')}:</span>
                <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                  {interview?.motivation ?? t('noData', '暂无数据')}
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <span className="text-sage-500 text-sm">{t('selfIntroduction', '自我介绍')}:</span>
                <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1 whitespace-pre-wrap">
                  {interview?.self_introduction ?? t('noData', '暂无数据')}
                </div>
              </div>
              <div>
                <span className="text-sage-500 text-sm">{t('contactPreference', '联系偏好')}:</span>
                <div className="p-2 bg-sage-50 rounded text-sage-800 text-sm mt-1">
                  {interview?.contact_preference ?? t('noData', '暂无数据')}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('hipaaRelease', 'HIPAA放行')}:</span>
                  <span className="text-sage-800">{interview?.hipaa_release_willing ? t('yes', '是') : t('no', '否')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('multipleReduction', '多胎减胎')}:</span>
                  <span className="text-sage-800">{interview?.multiple_reduction_willing ? t('yes', '是') : t('no', '否')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sage-500">{t('terminationWilling', '终止怀孕意愿')}:</span>
                  <span className="text-sage-800">{interview?.termination_willing ? t('yes', '是') : t('no', '否')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 时间信息 */}
      <div className="bg-white rounded-lg border border-sage-200 p-6 mt-6 animate-slide-in-right">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="flex justify-between">
            <span className="text-sage-500">{t('created', '创建时间')}:</span>
            <span className="text-sage-800">{data?.created_at ? new Date(data.created_at).toLocaleString(i18n.language === 'zh-CN' ? 'zh-CN' : 'en-US') : t('noData', '暂无数据')}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sage-500">{t('updated', '更新时间')}:</span>
            <span className="text-sage-800">{data?.updated_at ? new Date(data.updated_at).toLocaleString(i18n.language === 'zh-CN' ? 'zh-CN' : 'en-US') : t('noData', '暂无数据')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

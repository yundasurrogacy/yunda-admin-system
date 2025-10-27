"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useRouter } from "next/navigation"
import { useParams } from "next/navigation"
import { getIntendedParentById } from "@/lib/graphql/applications"
import type { IntendedParent } from "@/types/intended_parent"
import { ChevronRight, ChevronDown, User, FileText, Search, ArrowLeft } from "lucide-react"
import { CustomButton } from "../../../../components/ui/CustomButton"
import { CommonHeader } from "../../../../components/common-header"
import { useTranslation } from "react-i18next"
import '../../../../i18n'
import { Label } from "../../../../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card"
import { Badge } from "../../../../components/ui/badge"
// import { AdminLayout } from "../../../../components/admin-layout"

// 获取 cookie 的辅助函数
function getCookie(name: string) {
  if (typeof document === 'undefined') return undefined;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : undefined;
}

// 提取辅助函数到组件外部，避免每次渲染重新创建
const capitalize = (str: string | undefined): string => {
  if (!str) return "-";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const formatArray = (arr: string[] | undefined): string => 
  Array.isArray(arr) && arr.length ? arr.map(capitalize).join(", ") : "-";

const formatValue = (val: string | undefined): string => 
  val ? capitalize(val) : "-";

export default function ClientProfileDetailPage() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const params = useParams<{ id: string }>();
  
  // 认证相关状态
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  const [language, setLanguage] = useState<"EN" | "CN">("EN");
  const [client, setClient] = useState<IntendedParent | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    medicalRecords: false,
    medicationTracker: false,
  });
  // 编辑模式
  const [editMode, setEditMode] = useState(false);
  // 编辑表单数据
  const [editData, setEditData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  
  // Toast 通知状态
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'warning'>('success');

  // 显示Toast提示
  const showToastMessage = useCallback((message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    
    // 3秒后自动隐藏
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  }, []);

  // 认证检查和 cookie 读取
  useEffect(() => {
    // 只在客户端执行
    if (typeof window !== 'undefined') {
      const userRole = getCookie('userRole_admin')
      const userEmail = getCookie('userEmail_admin')
      const userId = getCookie('userId_admin')
      const authed = !!(userRole && userEmail && userId && userRole === 'admin')
      setIsAuthenticated(authed)
      if (!authed) {
        router.replace('/admin/login')
      }
    }
  }, [router])

  useEffect(() => {
    async function fetchData() {
      // 只在认证后才加载数据
      if (params?.id && isAuthenticated) {
        setLoading(true);
        const data = await getIntendedParentById(Number(params.id));
        setClient(data);
        setEditData(data); // 初始化编辑数据
        setLoading(false);
      }
    }
    fetchData();
  }, [params?.id, isAuthenticated]);

  // 使用 useCallback 缓存事件处理函数
  const toggleSection = useCallback((section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }, []);

  // 进入编辑模式
  const handleEdit = useCallback(() => {
    // 深拷贝，避免引用丢失导致内容为空
    setEditData(client ? JSON.parse(JSON.stringify(client)) : null);
    setEditMode(true);
  }, [client]);

  // 取消编辑
  const handleCancel = useCallback(() => {
    setEditData(client);
    setEditMode(false);
  }, [client]);

  // 表单字段变更
  const handleFieldChange = useCallback((section: string, field: string, value: any) => {
    setEditData((prev: any) => ({
      ...prev,
      [section]: {
        ...prev?.[section],
        [field]: value,
      },
    }));
  }, []);

  // 保存
  const handleSave = useCallback(async () => {
    if (!params?.id) return;
    setSaving(true);
    try {
      console.log('🔧 开始保存数据:', editData);
      const res = await fetch(`/api/intended-parent-detail?id=${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });
      
      console.log('🔧 API响应状态:', res.status);
      
      if (!res.ok) {
        const errorData = await res.json();
        console.error('🔧 API错误详情:', errorData);
        throw new Error(`保存失败: ${errorData.error || res.statusText}`);
      }
      
      const result = await res.json();
      console.log('🔧 保存成功:', result);
      
      setEditMode(false);
      // 保存后刷新数据
      const data = await getIntendedParentById(Number(params.id));
      setClient(data);
      setEditData(data);
      
      // 显示成功提示
      showToastMessage(t('saveSuccess') || '保存成功！', 'success');
    } catch (e) {
      console.error('🔧 保存失败:', e);
      showToastMessage(`${t('saveFailed') || '保存失败'}: ${e instanceof Error ? e.message : t('unknownError') || '未知错误'}`, 'error');
    }
    setSaving(false);
  }, [params?.id, editData, t, showToastMessage]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // ⚠️ 重要：所有 Hooks 必须在条件返回之前调用，以保持 Hooks 调用顺序一致
  // 使用 useMemo 缓存数据源，避免每次渲染重新计算
  const data = useMemo(() => editMode ? editData : client, [editMode, editData, client]);
  
  const basic = useMemo(() => data?.basic_information, [data]);
  const contact = useMemo(() => data?.contact_information, [data]);
  const family = useMemo(() => data?.family_profile, [data]);
  const program = useMemo(() => data?.program_interests, [data]);
  const referral = useMemo(() => data?.referral, [data]);

  const text = {
    EN: {
      title: "Client Profile",
      basicInfo: "Basic Information",
      embryoInfo: "Embryo Information",
      uploadDocs: "Upload Documents",
      trustAccount: "Trust Account",
      clientManager: "Client Manager",
      medicalRecords: "Medical Records",
      doctorInfo: "Doctor Information",
      clinicInfo: "Clinic Information",
      upcomingAppts: "Upcoming Appointments",
      pastAppts: "Past Appointments",
      medicationTracker: "Medication Tracker",
      name: "Name",
      phone: "Phone",
      email: "Email",
      language: "Language",
      trustId: "Trust ID",
      trustBalance: "Trust Balance",
      status: "Status",
      passport: "Passport",
      agreement: "Agreement",
      authentication: "Authorization",
      preBirthOrder: "Pre-Birth Order",
      viewDetails: "View Details",
      edit: "Edit",
      active: "Active",
      complete: "Complete",
      pending: "Pending",
      date: "Date",
      type: "Type",
      doctor: "Doctor",
      clinic: "Clinic",
      time: "Time",
      medication: "Medication",
      instructions: "Instructions",
      dailyReminders: "Daily Reminders",
      october2023: "October 2023",
      unreadMessage: "Unread Message",
      visitReport: "Visit Report",
      doctorsNotes: "Doctor's Notes",
    },
    CN: {
      title: "客户档案",
      basicInfo: "基本信息",
      embryoInfo: "胚胎信息",
      uploadDocs: "上传文件",
      trustAccount: "信托账户",
      clientManager: "客户经理",
      medicalRecords: "医疗记录",
      doctorInfo: "医生信息",
      clinicInfo: "诊所信息",
      upcomingAppts: "即将到来的预约",
      pastAppts: "过往预约",
      medicationTracker: "用药跟踪",
      name: "姓名",
      phone: "电话",
      email: "邮箱",
      language: "语言",
      trustId: "信托ID",
      trustBalance: "信托余额",
      status: "状态",
      passport: "护照",
      agreement: "协议",
      authentication: "授权",
      preBirthOrder: "出生前令",
      viewDetails: "查看详情",
      edit: "编辑",
      active: "活跃",
      complete: "完成",
      pending: "待处理",
      date: "日期",
      type: "类型",
      doctor: "医生",
      clinic: "诊所",
      time: "时间",
      medication: "药物",
      instructions: "说明",
      dailyReminders: "每日提醒",
      october2023: "2023年10月",
      unreadMessage: "未读消息",
      visitReport: "访问报告",
      doctorsNotes: "医生笔记",
    },
  }

  // ✅ 所有 Hooks 调用完毕，现在可以安全地进行条件渲染

  // 认证检查 loading
  if (isAuthenticated === null) {
    return <div className="p-8 text-sage-600 font-medium">{t('loading')}</div>;
  }

  // 未认证，等待重定向
  if (!isAuthenticated) {
    return null;
  }

  // 数据加载中（认证后才会设置 loading）
  if (loading || !client) {
    return <div className="p-8 text-sage-600 font-medium">{t('loading')}</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12">
            {/* 返回按钮 */}
            <CustomButton
              className="mb-4 px-5 py-2 rounded-full flex items-center gap-2 bg-[#E3E8E3] text-[#271F18] font-serif text-base font-semibold shadow hover:bg-[#f8f8f8] cursor-pointer"
              onClick={handleBack}
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}>
                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t('back', '返回')}
            </CustomButton>
        <div className="flex items-center justify-between pt-6 pb-2">
          <h1 className="text-2xl font-semibold text-sage-800">{t('clientProfiles.title')}</h1>
          <div className="flex items-center gap-4">
            {!editMode && (
              <CustomButton className="bg-sage-600 text-white font-medium cursor-pointer" onClick={handleEdit}>{t('edit', '编辑')}</CustomButton>
            )}
            {editMode && (
              <>
                <CustomButton className="font-medium cursor-pointer border border-sage-300 bg-white text-sage-800" onClick={handleCancel} disabled={saving}>{t('cancel', '取消')}</CustomButton>
                <CustomButton className="bg-sage-600 text-white font-medium cursor-pointer" onClick={handleSave} disabled={saving}>{saving ? t('saving', '保存中...') : t('save', '保存')}</CustomButton>
              </>
            )}
            {/* <Button
              variant="outline"
              onClick={() => router.push('/admin/client-profiles')}
              className="bg-white font-medium hover:cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backToClientProfiles')}
            </Button> */}
          </div>
        </div>

        {/* 基本信息 */}
        <Card className="bg-white border-sage-200 animate-slide-in-left overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium">{t('basicInformation')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <Label className="text-sage-600 text-sm font-medium">{capitalize(t('firstName'))} / {capitalize(t('lastName'))}:</Label>
                {editMode ? (
                  <input type="text" className="border rounded px-2 py-1 w-full font-medium text-sage-800" style={{ textTransform: 'capitalize' }} value={basic?.firstName || ''} onChange={e => handleFieldChange('basic_information', 'firstName', e.target.value)} />
                ) : (
                  <p className="font-medium text-sage-800 break-words" style={{ textTransform: 'capitalize' }}>{formatValue(basic?.firstName)} {formatValue(basic?.lastName)}</p>
                )}
              </div>
              <div>
                <Label className="text-sage-600 text-sm font-medium">{capitalize(t('pronouns') || '代词')}:</Label>
                {editMode ? (
                  <input type="text" className="border rounded px-2 py-1 w-full font-medium text-sage-800" style={{ textTransform: 'capitalize' }} value={basic?.pronouns || ''} onChange={e => handleFieldChange('basic_information', 'pronouns', e.target.value)} />
                ) : (
                  <p className="font-medium text-sage-800 break-words" style={{ textTransform: 'capitalize' }}>{formatValue(basic?.pronouns)}</p>
                )}
              </div>
              <div>
                <Label className="text-sage-600 text-sm font-medium">{capitalize(t('genderIdentity'))}:</Label>
                {editMode ? (
                  <input type="text" className="border rounded px-2 py-1 w-full font-medium text-sage-800" style={{ textTransform: 'capitalize' }} value={basic?.gender_identity || ''} onChange={e => handleFieldChange('basic_information', 'gender_identity', e.target.value)} />
                ) : (
                  <p className="font-medium text-sage-800 break-words" style={{ textTransform: 'capitalize' }}>{formatValue(basic?.gender_identity)}</p>
                )}
              </div>
              <div>
                <Label className="text-sage-600 text-sm font-medium">{capitalize(t('dateOfBirth'))}:</Label>
                {editMode ? (
                  <input type="date" className="border rounded px-2 py-1 w-full font-medium text-sage-800" value={basic?.date_of_birth || ''} onChange={e => handleFieldChange('basic_information', 'date_of_birth', e.target.value)} />
                ) : (
                  <p className="font-medium text-sage-800 break-words">{formatValue(basic?.date_of_birth)}</p>
                )}
              </div>
              <div className="col-span-2">
                <Label className="text-sage-600 text-sm font-medium">{capitalize(t('ethnicity'))}:</Label>
                {editMode ? (
                  <input type="text" className="border rounded px-2 py-1 w-full font-medium text-sage-800" style={{ textTransform: 'capitalize' }} value={basic?.ethnicity || ''} onChange={e => handleFieldChange('basic_information', 'ethnicity', e.target.value)} />
                ) : (
                  <p className="font-medium text-sage-800 break-words" style={{ textTransform: 'capitalize' }}>{formatArray(basic?.ethnicity?.split(","))}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 联系信息 */}
        <Card className="bg-white border-sage-200 animate-slide-in-left overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium">{t('contactInformation')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <Label className="text-sage-600 text-sm font-medium">{capitalize(t('phone'))}:</Label>
                {editMode ? (
                  <div className="flex gap-2">
                    <input type="text" placeholder="区号" className="border rounded px-2 py-1 w-20 font-medium text-sage-800" value={contact?.cell_phone_country_code || ''} onChange={e => handleFieldChange('contact_information', 'cell_phone_country_code', e.target.value)} />
                    <input type="text" placeholder="手机号" className="border rounded px-2 py-1 w-full font-medium text-sage-800" value={contact?.cell_phone || ''} onChange={e => handleFieldChange('contact_information', 'cell_phone', e.target.value)} />
                  </div>
                ) : (
                  <p className="font-medium text-sage-800 break-words">{contact?.cell_phone_country_code ? `+${contact?.cell_phone_country_code} ` : ""}{formatValue(contact?.cell_phone)}</p>
                )}
              </div>
              <div>
                <Label className="text-sage-600 text-sm font-medium">{capitalize(t('email'))}:</Label>
                {editMode ? (
                  <input type="email" className="border rounded px-2 py-1 w-full font-medium text-sage-800" style={{ textTransform: 'lowercase' }} value={contact?.email_address || ''} onChange={e => handleFieldChange('contact_information', 'email_address', e.target.value)} />
                ) : (
                  <p className="font-medium text-sage-800 break-words" style={{ textTransform: 'lowercase' }}>{contact?.email_address || "-"}</p>
                )}
              </div>
              <div>
                <Label className="text-sage-600 text-sm font-medium">{capitalize(t('languages'))}:</Label>
                {editMode ? (
                  <input type="text" className="border rounded px-2 py-1 w-full font-medium text-sage-800" value={Array.isArray(contact?.primary_languages_selected_keys) ? contact?.primary_languages_selected_keys.join(',') : ''} onChange={e => handleFieldChange('contact_information', 'primary_languages_selected_keys', e.target.value.split(','))} />
                ) : (
                  <p className="font-medium text-sage-800 break-words">{formatArray(contact?.primary_languages_selected_keys)}</p>
                )}
              </div>
              <div>
                <Label className="text-sage-600 text-sm font-medium">{capitalize(t('clientProfileDetail.agreeToReceiveMessages'))}:</Label>
                {editMode ? (
                  <select className="border rounded px-2 py-1 w-full font-medium text-sage-800 cursor-pointer" value={contact?.is_agree_cell_phone_receive_messages ? 'yes' : 'no'} onChange={e => handleFieldChange('contact_information', 'is_agree_cell_phone_receive_messages', e.target.value === 'yes')}>
                    <option value="yes">{t('yes', '是')}</option>
                    <option value="no">{t('no', '否')}</option>
                  </select>
                ) : (
                  <p className="font-medium text-sage-800 break-words">{contact?.is_agree_cell_phone_receive_messages ? t('yes') : t('no')}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 家庭资料 */}
        <Card className="bg-white border-sage-200 animate-slide-in-left overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium">{t('familyProfile')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <Label className="text-sage-600 text-sm font-medium">{capitalize(t('sexualOrientation'))}:</Label>
                {editMode ? (
                  <input type="text" className="border rounded px-2 py-1 w-full font-medium text-sage-800" style={{ textTransform: 'capitalize' }} value={family?.sexual_orientation || ''} onChange={e => handleFieldChange('family_profile', 'sexual_orientation', e.target.value)} />
                ) : (
                  <p className="font-medium text-sage-800 break-words" style={{ textTransform: 'capitalize' }}>{formatValue(family?.sexual_orientation)}</p>
                )}
              </div>
              <div>
                <Label className="text-sage-600 text-sm font-medium">{capitalize(t('city'))}:</Label>
                {editMode ? (
                  <input type="text" className="border rounded px-2 py-1 w-full font-medium text-sage-800" style={{ textTransform: 'capitalize' }} value={family?.city || ''} onChange={e => handleFieldChange('family_profile', 'city', e.target.value)} />
                ) : (
                  <p className="font-medium text-sage-800 break-words" style={{ textTransform: 'capitalize' }}>{formatValue(family?.city)}</p>
                )}
              </div>
              <div>
                <Label className="text-sage-600 text-sm font-medium">{capitalize(t('country'))}:</Label>
                {editMode ? (
                  <input type="text" className="border rounded px-2 py-1 w-full font-medium text-sage-800" style={{ textTransform: 'capitalize' }} value={family?.country || ''} onChange={e => handleFieldChange('family_profile', 'country', e.target.value)} />
                ) : (
                  <p className="font-medium text-sage-800 break-words" style={{ textTransform: 'capitalize' }}>{formatValue(family?.country)}</p>
                )}
              </div>
              <div>
                <Label className="text-sage-600 text-sm font-medium">{capitalize(t('stateOrProvince'))}:</Label>
                {editMode ? (
                  <input type="text" className="border rounded px-2 py-1 w-full font-medium text-sage-800" style={{ textTransform: 'capitalize' }} value={family?.state_or_province || ''} onChange={e => handleFieldChange('family_profile', 'state_or_province', e.target.value)} />
                ) : (
                  <p className="font-medium text-sage-800 break-words" style={{ textTransform: 'capitalize' }}>{formatValue(family?.state_or_province)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 项目意向 */}
        <Card className="bg-white border-sage-200 animate-slide-in-left overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium">{t('programInterests')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <Label className="text-sage-600 text-sm font-medium">{capitalize(t('serviceNeeds'))}:</Label>
                {editMode ? (
                  <input type="text" className="border rounded px-2 py-1 w-full font-medium text-sage-800" style={{ textTransform: 'capitalize' }} value={program?.interested_services || ''} onChange={e => handleFieldChange('program_interests', 'interested_services', e.target.value)} />
                ) : (
                  <p className="font-medium text-sage-800 break-words" style={{ textTransform: 'capitalize' }}>{formatValue(program?.interested_services)}</p>
                )}
              </div>
              <div>
                <Label className="text-sage-600 text-sm font-medium">{capitalize(t('journeyStartTiming'))}:</Label>
                {editMode ? (
                  <input type="text" className="border rounded px-2 py-1 w-full font-medium text-sage-800" style={{ textTransform: 'capitalize' }} value={program?.journey_start_timing || ''} onChange={e => handleFieldChange('program_interests', 'journey_start_timing', e.target.value)} />
                ) : (
                  <p className="font-medium text-sage-800 break-words" style={{ textTransform: 'capitalize' }}>{formatValue(program?.journey_start_timing)}</p>
                )}
              </div>
              <div>
                <Label className="text-sage-600 text-sm font-medium">{capitalize(t('desiredChildrenCount'))}:</Label>
                {editMode ? (
                  <input type="text" className="border rounded px-2 py-1 w-full font-medium text-sage-800" style={{ textTransform: 'capitalize' }} value={program?.desired_children_count || ''} onChange={e => handleFieldChange('program_interests', 'desired_children_count', e.target.value)} />
                ) : (
                  <p className="font-medium text-sage-800 break-words" style={{ textTransform: 'capitalize' }}>{formatValue(program?.desired_children_count)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 渠道及初步沟通 */}
        <Card className="bg-white border-sage-200 animate-slide-in-left overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium">{t('referral')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
              <div>
                <Label className="text-sage-600 text-sm font-medium">{capitalize(t('referralSource'))}:</Label>
                {editMode ? (
                  <input type="text" className="border rounded px-2 py-1 w-full font-medium text-sage-800" style={{ textTransform: 'capitalize' }} value={referral?.referral_source || ''} onChange={e => handleFieldChange('referral', 'referral_source', e.target.value)} />
                ) : (
                  <p className="font-medium text-sage-800 break-words" style={{ textTransform: 'capitalize' }}>{formatValue(referral?.referral_source)}</p>
                )}
              </div>
              <div>
                <Label className="text-sage-600 text-sm font-medium">{capitalize(t('initialQuestions'))}:</Label>
                {editMode ? (
                  <textarea
                    className="border rounded px-2 py-1 w-full font-medium text-sage-800 resize-y min-h-[40px] max-h-[300px]"
                    value={referral?.initial_questions || ''}
                    onChange={e => handleFieldChange('referral', 'initial_questions', e.target.value)}
                    rows={Math.max(2, (referral?.initial_questions || '').split('\n').length)}
                    placeholder={t('initialQuestions')}
                  />
                ) : (
                  <p className="font-medium text-sage-800 break-words">{formatValue(referral?.initial_questions)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 同意条款 */}
        <Card className="bg-white border-sage-200 animate-slide-in-left overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="text-sage-800 text-lg font-medium">{capitalize(t('agreement'))}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-y-2">
              <div>
                <Label className="text-sage-600 text-sm font-medium">{capitalize(t('sharePersonalInfo'))}:</Label>
                {editMode ? (
                  <select className="border rounded px-2 py-1 w-full font-medium text-sage-800" value={contact?.is_agree_cell_phone_receive_messages ? 'yes' : 'no'} onChange={e => handleFieldChange('contact_information', 'is_agree_cell_phone_receive_messages', e.target.value === 'yes')}>
                    <option value="yes">{t('yes', '是')}</option>
                    <option value="no">{t('no', '否')}</option>
                  </select>
                ) : (
                  <p className="font-medium text-sage-800 break-words">{contact?.is_agree_cell_phone_receive_messages ? t('yes') : t('no')}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 其他区块（原有内容保留） */}
        {/* ...existing code... */}
      </div>

      {/* Toast 通知组件 */}
      {showToast && (
        <div className="fixed top-4 right-4 z-[9999] animate-fadeIn">
          <div className={`px-4 py-3 rounded-lg shadow-lg border-l-4 flex items-center gap-3 min-w-[300px] max-w-[500px] ${
            toastType === 'success' 
              ? 'bg-green-50 border-green-400 text-green-800' 
              : toastType === 'error'
              ? 'bg-red-50 border-red-400 text-red-800'
              : 'bg-yellow-50 border-yellow-400 text-yellow-800'
          }`}>
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
              toastType === 'success' 
                ? 'bg-green-100' 
                : toastType === 'error'
                ? 'bg-red-100'
                : 'bg-yellow-100'
            }`}>
              {toastType === 'success' && (
                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {toastType === 'error' && (
                <svg className="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
              {toastType === 'warning' && (
                <svg className="w-3 h-3 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <span className="text-sm font-medium flex-1">{toastMessage}</span>
            <button
              onClick={() => setShowToast(false)}
              className={`w-5 h-5 rounded-full flex items-center justify-center hover:bg-opacity-20 transition-colors ${
                toastType === 'success' 
                  ? 'hover:bg-green-600' 
                  : toastType === 'error'
                  ? 'hover:bg-red-600'
                  : 'hover:bg-yellow-600'
              }`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

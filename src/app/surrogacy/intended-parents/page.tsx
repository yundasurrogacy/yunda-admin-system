'use client'

import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { User, Phone, Mail, MapPin, Heart, Calendar, FileText } from 'lucide-react'
import '../../../i18n'
import { CustomButton } from '@/components/ui/CustomButton';
import { useRouter} from 'next/navigation'

export default function IntendedParents() {
  const { t } = useTranslation('common')
  const router = useRouter();
  const [parentInfo, setParentInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError('')
      try {
        function getCookie(name: string) {
          if (typeof document === 'undefined') return undefined;
          const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
          return match ? match[2] : undefined;
        }
        const surrogateId = typeof document !== 'undefined' ? getCookie('userId_surrogacy') : null;
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

  // 格式化多选和枚举展示
  const formatArray = (arr: string[] | undefined): string => Array.isArray(arr) && arr.length ? arr.join(", ") : t('noData', '暂无数据')
  const formatValue = (val: string | undefined): string => val ? val : t('noData', '暂无数据')

  return (
    <div className="min-h-screen bg-main-bg space-y-6 animate-fade-in px-4 lg:px-12">
      <div className="flex items-center justify-between pt-6 pb-2">
              {/* 返回按钮 */}
              <CustomButton
                className="mb-4 px-5 py-2 rounded-full flex items-center gap-2 bg-[#E3E8E3] text-[#271F18] font-serif text-base font-semibold shadow hover:bg-[#f8f8f8] cursor-pointer"
                onClick={() => router.back()}
              >
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}>
                  <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t('back', '返回')}
              </CustomButton>
        <h1 className="text-2xl font-medium text-sage-800">{t('intendedParents.title')}</h1>
        {/* <Badge variant="outline" className="px-3 py-1 bg-green-100 text-green-800 border-green-200">
          {t('intendedParents.status.matched', '已匹配')}
        </Badge> */}
      </div>

      {/* 基本信息卡片 */}
      <Card className="bg-white border-sage-200 animate-slide-in-left">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-sage-800 text-lg font-medium">
            <User className="w-5 h-5" />
            {t('intendedParents.basicInfo.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-sage-100 text-sage-800 text-2xl font-medium">
                {basic.firstName?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-sage-800 mb-2">
                {formatValue(basic.firstName)} {formatValue(basic.lastName)}
              </h2>
              <p className="text-sage-500 mb-4">{t('intendedParents.trustAccount.email')}: {parentInfo?.email}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <div>
                  <Label className="text-sage-600 text-sm">{t('intendedParents.basicInfo.dob')}:</Label>
                  <p className="font-medium text-sage-800">{formatValue(basic.date_of_birth)}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">{t('intendedParents.basicInfo.pronouns')}:</Label>
                  <p className="font-medium text-sage-800">{formatValue(basic.pronouns)}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">{t('intendedParents.basicInfo.genderIdentity')}:</Label>
                  <p className="font-medium text-sage-800">{formatValue(basic.gender_identity)}</p>
                </div>
                <div>
                  <Label className="text-sage-600 text-sm">{t('intendedParents.basicInfo.ethnicity')}:</Label>
                  <p className="font-medium text-sage-800">{formatValue(basic.ethnicity)}</p>
                </div>
              </div>
            </div>
            
            {/* 信托账户余额显示 */}
            {/* <div className="text-right">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <Label className="text-sage-600 text-sm">{t('intendedParents.trustAccount.title')}</Label>
                <p className="text-2xl font-bold text-green-700">${parentInfo?.trust_account_balance ?? 0}</p>
              </div>
            </div> */}
          </div>
        </CardContent>
      </Card>

      {/* 联系信息 */}
      <Card className="bg-white border-sage-200 animate-slide-in-left">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-sage-800 text-lg font-medium">
            <Phone className="w-5 h-5" />
            {t('intendedParents.contactInfo.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.contactInfo.cellPhone')}:</Label>
              <p className="font-medium text-sage-800">{contact.cell_phone_country_code ? `+${contact.cell_phone_country_code} ` : ""}{formatValue(contact.cell_phone)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.contactInfo.email')}:</Label>
              <p className="font-medium text-sage-800">{formatValue(contact.email_address)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.contactInfo.primaryLanguages')}:</Label>
              <p className="font-medium text-sage-800">{formatArray(contact.primary_languages_selected_keys)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.contactInfo.agreeToReceiveMessages')}:</Label>
              <p className="font-medium text-sage-800">{contact.is_agree_cell_phone_receive_messages ? t('yes') : t('no')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 家庭资料 */}
      <Card className="bg-white border-sage-200 animate-slide-in-left">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-sage-800 text-lg font-medium">
            <MapPin className="w-5 h-5" />
            {t('intendedParents.familyProfile.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.familyProfile.city')}:</Label>
              <p className="font-medium text-sage-800">{formatValue(family.city)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.familyProfile.stateProvince')}:</Label>
              <p className="font-medium text-sage-800">{formatValue(family.state_or_province)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.familyProfile.country')}:</Label>
              <p className="font-medium text-sage-800">{formatValue(family.country)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.familyProfile.sexualOrientation')}:</Label>
              <p className="font-medium text-sage-800">{formatValue(family.sexual_orientation)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 项目意向 */}
      <Card className="bg-white border-sage-200 animate-slide-in-left">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-sage-800 text-lg font-medium">
            <Heart className="w-5 h-5" />
            {t('intendedParents.programInterests.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.programInterests.interestedServices')}:</Label>
              <p className="font-medium text-sage-800">{formatValue(program.interested_services)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.programInterests.journeyStartTiming')}:</Label>
              <p className="font-medium text-sage-800">{formatValue(program.journey_start_timing)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.programInterests.desiredChildrenCount')}:</Label>
              <p className="font-medium text-sage-800">{formatValue(program.desired_children_count)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 渠道及初步沟通 */}
      <Card className="bg-white border-sage-200 animate-slide-in-left">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-sage-800 text-lg font-medium">
            <FileText className="w-5 h-5" />
            {t('intendedParents.referral.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.referral.referralSource')}:</Label>
              <p className="font-medium text-sage-800">{formatValue(referral.referral_source)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.referral.initialQuestions')}:</Label>
              <p className="font-medium text-sage-800">{formatValue(referral.initial_questions)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 账户信息 */}
      {/* <Card className="bg-white border-sage-200 animate-slide-in-left">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-sage-800 text-lg font-medium">
            <Calendar className="w-5 h-5" />
            {t('intendedParents.accountInfo', '账户信息')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.trustAccount.created')}:</Label>
              <p className="font-medium text-sage-800">{formatValue(parentInfo?.created_at)}</p>
            </div>
            <div>
              <Label className="text-sage-600 text-sm">{t('intendedParents.trustAccount.updated')}:</Label>
              <p className="font-medium text-sage-800">{formatValue(parentInfo?.updated_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  )
}

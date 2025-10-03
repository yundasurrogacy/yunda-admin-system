"use client";
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { useSearchParams } from 'next/navigation';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function SurrogateMatch() {
  const { t } = useTranslation('common');
  // const searchParams = useSearchParams();
  // const parentId = searchParams?.get('parentId') || '';
  const [parentId, setParentId] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // 只在客户端执行 localStorage 读取
    if (typeof window !== 'undefined') {
      const storedParentId = localStorage.getItem('parentId');
      setParentId(storedParentId);
    }
  }, []);

  useEffect(() => {
    if (!parentId) return;
    setLoading(true);
    fetch(`/api/cases-by-parent?parentId=${parentId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("获取案子失败");
        const data = await res.json();
        const casesRaw = data;
        const formattedCases = casesRaw.map((item: any) => ({
          id: item.id,
          process_status: item.process_status,
          trust_account_balance: item.trust_account_balance,
          surrogate_mother: item.surrogate_mother
            ? {
                id: item.surrogate_mother.id,
                email: item.surrogate_mother.email,
                name: item.surrogate_mother.contact_information?.name || item.surrogate_mother.contact_information || '',
              }
            : undefined,
          intended_parent: item.intended_parent
            ? {
                id: item.intended_parent.id,
                email: item.intended_parent.email,
                name: item.intended_parent.basic_information?.name || item.intended_parent.basic_information || '',
              }
            : undefined,
        }));
        const firstCase = formattedCases[0];
        if (!firstCase || !firstCase.surrogate_mother?.id) {
          setError('未找到匹配的代孕母');
          setLoading(false);
          return;
        }
        if (firstCase.intended_parent && firstCase.intended_parent.id) {
          localStorage.setItem('parentId', firstCase.intended_parent.id);
        }
        fetch(`/api/surrogate_mothers-detail?surrogacy=${firstCase.surrogate_mother.id}`)
          .then(res => res.json())
          .then(surrogateData => {
            if (surrogateData.error) setError(surrogateData.error);
            else setData(surrogateData);
          })
          .catch(() => setError('获取代孕母信息失败'))
          .finally(() => setLoading(false));
      })
      .catch(() => {
        setError('获取案子信息失败');
        setLoading(false);
      });
  }, [parentId]);

  if (loading) return <div className="p-8">{t('loadingText') || '加载中...'}</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  // 结构示例：data.about_you, data.contact_information, data.pregnancy_and_health, data.upload_photos
  const about = data?.about_you || {};
  const contact = data?.contact_information || {};
  const health = data?.pregnancy_and_health || {};
  const photos = Array.isArray(data?.upload_photos) ? data.upload_photos : [];

  return (
    <div className="p-8 min-h-screen" style={{ background: "#FBF0DA40" }}>
      <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-2">{t('surrogacyProfile.title', 'Surrogate Profile')}</h1>
      <p className="text-[#271F18] font-serif mb-8">{t('surrogacyProfile.description', 'View the details of your matched surrogate mother.')}</p>
      {/* About You */}
      <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6 flex flex-col">
        <h2 className="text-xl font-serif mb-4">{t('surrogacyProfile.aboutYou.title', 'About You')}</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 w-full">
          <div><span className="font-medium">{t('surrogacyProfile.aboutYou.occupation', 'Occupation')}:</span> {about.occupation}</div>
          <div><span className="font-medium">{t('surrogacyProfile.aboutYou.contactSource', 'Contact Source')}:</span> {about.contact_source}</div>
          <div><span className="font-medium">{t('surrogacyProfile.aboutYou.maritalStatus', 'Marital Status')}:</span> {about.marital_status}</div>
          <div><span className="font-medium">{t('surrogacyProfile.aboutYou.educationLevel', 'Education Level')}:</span> {about.education_level}</div>
          <div><span className="font-medium">{t('surrogacyProfile.aboutYou.partnerSupport', 'Partner Support')}:</span> {about.partner_support}</div>
          <div><span className="font-medium">{t('surrogacyProfile.aboutYou.householdIncome', 'Household Income')}:</span> {about.household_income}</div>
          <div><span className="font-medium">{t('surrogacyProfile.aboutYou.isFormerSurrogate', 'Is Former Surrogate')}:</span> {about.is_former_surrogate ? t('surrogacyProfile.yes', 'Yes') : t('surrogacyProfile.no', 'No')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.aboutYou.surrogateExperience', 'Surrogate Experience')}:</span> {about.surrogate_experience}</div>
          <div><span className="font-medium">{t('surrogacyProfile.aboutYou.hasHighSchoolDiploma', 'Has High School Diploma')}:</span> {about.has_high_school_diploma ? t('surrogacyProfile.yes', 'Yes') : t('surrogacyProfile.no', 'No')}</div>
        </div>
      </div>
      {/* Contact Information */}
      <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
        <h2 className="text-xl font-serif mb-4">{t('surrogacyProfile.contactInfo.title', 'Contact Information')}</h2>
        <div className="space-y-2 mt-2 grid grid-cols-2 gap-x-8 gap-y-1">
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.firstName', 'First Name')}:</span> {contact.first_name}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.lastName', 'Last Name')}:</span> {contact.last_name}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.dob', 'Date of Birth')}:</span> {contact.date_of_birth}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.email', 'Email')}:</span> {contact.email_address}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.cellPhone', 'Cell Phone')}:</span> {contact.cell_phone_country_code} {contact.cell_phone}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.agreeToReceiveMessages', 'Agree to Receive Messages')}:</span> {contact.is_agree_cell_phone_receive_messages ? t('surrogacyProfile.yes', 'Yes') : t('surrogacyProfile.no', 'No')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.city', 'City')}:</span> {contact.city}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.stateProvince', 'State/Province')}:</span> {contact.state_or_province}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.country', 'Country')}:</span> {contact.country}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.zipCode', 'Zip Code')}:</span> {contact.zip_code}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.ethnicity', 'Ethnicity')}:</span> {contact.ethnicity}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.bmi', 'BMI')}:</span> {contact.bmi}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.height', 'Height')}:</span> {contact.height}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.weight', 'Weight')}:</span> {contact.weight}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.usCitizenOrVisaStatus', 'US Citizen/Visa Status')}:</span> {contact.us_citizen_or_visa_status}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.surrogacyExperienceCount', 'Surrogacy Experience Count')}:</span> {contact.surrogacy_experience_count}</div>
        </div>
      </div>
      {/* Pregnancy & Health */}
      <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
        <h2 className="text-xl font-serif mb-4">{t('surrogacyProfile.health.title', 'Pregnancy & Health')}</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 w-full">
          <div><span className="font-medium">{t('surrogacyProfile.health.arrests', 'Arrests')}:</span> {health.arrests ? t('surrogacyProfile.yes', 'Yes') : t('surrogacyProfile.no', 'No')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.birthDetails', 'Birth Details')}:</span> {health.birth_details}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.felonyCharges', 'Felony Charges')}:</span> {health.felony_charges ? t('surrogacyProfile.yes', 'Yes') : t('surrogacyProfile.no', 'No')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.hasStillbirth', 'Has Stillbirth')}:</span> {health.has_stillbirth ? t('surrogacyProfile.yes', 'Yes') : t('surrogacyProfile.no', 'No')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.hasGivenBirth', 'Has Given Birth')}:</span> {health.has_given_birth ? t('surrogacyProfile.yes', 'Yes') : t('surrogacyProfile.no', 'No')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.substanceAbuse', 'Substance Abuse')}:</span> {health.substance_abuse ? t('surrogacyProfile.yes', 'Yes') : t('surrogacyProfile.no', 'No')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.closestHospital', 'Closest Hospital')}:</span> {health.closest_hospital}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.closestNICUIII', 'Closest NICU III')}:</span> {health.closest_nicu_iii}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.formalProbation', 'Formal Probation')}:</span> {health.formal_probation ? t('surrogacyProfile.yes', 'Yes') : t('surrogacyProfile.no', 'No')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.isBreastfeeding', 'Is Breastfeeding')}:</span> {health.is_breastfeeding ? t('surrogacyProfile.yes', 'Yes') : t('surrogacyProfile.no', 'No')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.medicationsList', 'Medications List')}:</span> {health.medications_list}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.domesticViolence', 'Domestic Violence')}:</span> {health.domestic_violence ? t('surrogacyProfile.yes', 'Yes') : t('surrogacyProfile.no', 'No')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.medicalConditions', 'Medical Conditions')}:</span> {Array.isArray(health.medical_conditions) ? health.medical_conditions.join(', ') : ''}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.childAbuseNeglect', 'Child Abuse/Neglect')}:</span> {health.child_abuse_neglect ? t('surrogacyProfile.yes', 'Yes') : t('surrogacyProfile.no', 'No')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.outstandingWarrant', 'Outstanding Warrant')}:</span> {health.outstanding_warrant ? t('surrogacyProfile.yes', 'Yes') : t('surrogacyProfile.no', 'No')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.pregnancyHistories', 'Pregnancy Histories')}:</span> {Array.isArray(health.pregnancy_histories) ? health.pregnancy_histories.join(', ') : ''}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.currentBirthControl', 'Current Birth Control')}:</span> {health.current_birth_control}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.isCurrentlyPregnant', 'Is Currently Pregnant')}:</span> {health.is_currently_pregnant ? t('surrogacyProfile.yes', 'Yes') : t('surrogacyProfile.no', 'No')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.isTakingMedications', 'Is Taking Medications')}:</span> {health.is_taking_medications ? t('surrogacyProfile.yes', 'Yes') : t('surrogacyProfile.no', 'No')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.backgroundCheckStatus', 'Background Check Status')}:</span> {health.background_check_status}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.childProtectionInvestigation', 'Child Protection Investigation')}:</span> {health.child_protection_investigation ? t('surrogacyProfile.yes', 'Yes') : t('surrogacyProfile.no', 'No')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.seriousPregnancyComplications', 'Serious Pregnancy Complications')}:</span> {health.serious_pregnancy_complications ? t('surrogacyProfile.yes', 'Yes') : t('surrogacyProfile.no', 'No')}</div>
        </div>
      </div>
      {/* Upload Photos */}
      <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
        <h2 className="text-xl font-serif mb-4">{t('surrogacyProfile.photos.title', 'Upload Photos')}</h2>
        <div className="flex gap-4 flex-wrap">
          {photos.length > 0 ? (
            photos.map((photo: any, idx: number) => (
              <a key={idx} href={photo.url} target="_blank" rel="noopener noreferrer">
                <img src={photo.url} alt={photo.name || `${t('surrogacyProfile.photos.photo', 'Photo')} ${idx + 1}`} className="w-24 h-24 object-cover rounded border hover:scale-105 transition" />
              </a>
            ))
          ) : (
            <span className="text-gray-500">{t('surrogacyProfile.photos.noPhotos', 'No photos uploaded yet.')}</span>
          )}
        </div>
      </div>
    </div>
  );
}

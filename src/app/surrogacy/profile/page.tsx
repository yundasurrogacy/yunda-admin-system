"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";

export default function SurrogacyProfile() {
  const { t } = useTranslation('common');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const surrogacyId = typeof window !== "undefined" ? localStorage.getItem("surrogateId") : null;
    if (!surrogacyId) {
      setError(t('surrogacyProfile.error.noUserId'));
      setLoading(false);
      return;
    }
    fetch(`/api/surrogate_mothers-detail?surrogacy=${surrogacyId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(t('surrogacyProfile.error.fetchFailed'));
        const result = await res.json();
        setData(result);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [t]);

  if (loading) return <div className="p-8">{t('loadingText')}</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  const about = data?.about_you || {};
  const contact = data?.contact_information || {};
  const health = data?.pregnancy_and_health || {};
  const photos = Array.isArray(data?.upload_photos) ? data.upload_photos : [];

  return (
    <div className="p-8 min-h-screen" style={{ background: "#FBF0DA40" }}>
      <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-2">{t('surrogacyProfile.title')}</h1>
      <p className="text-[#271F18] font-serif mb-8">{t('surrogacyProfile.description')}</p>
      {/* About You */}
      <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6 flex flex-col">
        <h2 className="text-xl font-serif mb-4">{t('surrogacyProfile.aboutYou.title')}</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 w-full">
          <div><span className="font-medium">{t('surrogacyProfile.aboutYou.occupation')}:</span> {about.occupation}</div>
          <div><span className="font-medium">{t('surrogacyProfile.aboutYou.contactSource')}:</span> {about.contact_source}</div>
          <div><span className="font-medium">{t('surrogacyProfile.aboutYou.maritalStatus')}:</span> {about.marital_status}</div>
          <div><span className="font-medium">{t('surrogacyProfile.aboutYou.educationLevel')}:</span> {about.education_level}</div>
          <div><span className="font-medium">{t('surrogacyProfile.aboutYou.partnerSupport')}:</span> {about.partner_support}</div>
          <div><span className="font-medium">{t('surrogacyProfile.aboutYou.householdIncome')}:</span> {about.household_income}</div>
          <div><span className="font-medium">{t('surrogacyProfile.aboutYou.isFormerSurrogate')}:</span> {about.is_former_surrogate ? t('yes') : t('no')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.aboutYou.surrogateExperience')}:</span> {about.surrogate_experience}</div>
          <div><span className="font-medium">{t('surrogacyProfile.aboutYou.hasHighSchoolDiploma')}:</span> {about.has_high_school_diploma ? t('yes') : t('no')}</div>
        </div>
      </div>
      {/* Contact Information */}
      <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
        <h2 className="text-xl font-serif mb-4">{t('surrogacyProfile.contactInfo.title')}</h2>
        <div className="space-y-2 mt-2 grid grid-cols-2 gap-x-8 gap-y-1">
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.firstName')}:</span> {contact.first_name}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.lastName')}:</span> {contact.last_name}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.dob')}:</span> {contact.date_of_birth}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.email')}:</span> {contact.email_address}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.cellPhone')}:</span> {contact.cell_phone_country_code} {contact.cell_phone}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.agreeToReceiveMessages')}:</span> {contact.is_agree_cell_phone_receive_messages ? t('yes') : t('no')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.city')}:</span> {contact.city}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.stateProvince')}:</span> {contact.state_or_province}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.country')}:</span> {contact.country}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.zipCode')}:</span> {contact.zip_code}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.ethnicity')}:</span> {contact.ethnicity}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.bmi')}:</span> {contact.bmi}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.height')}:</span> {contact.height}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.weight')}:</span> {contact.weight}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.usCitizenVisa')}:</span> {contact.us_citizen_or_visa_status}</div>
          <div><span className="font-medium">{t('surrogacyProfile.contactInfo.surrogacyExperienceCount')}:</span> {contact.surrogacy_experience_count}</div>
        </div>
      </div>
      {/* Pregnancy & Health */}
      <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
        <h2 className="text-xl font-serif mb-4">{t('surrogacyProfile.health.title')}</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 w-full">
          <div><span className="font-medium">{t('surrogacyProfile.health.arrests')}:</span> {health.arrests ? t('yes') : t('no')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.birthDetails')}:</span> {health.birth_details}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.felonyCharges')}:</span> {health.felony_charges ? t('yes') : t('no')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.hasStillbirth')}:</span> {health.has_stillbirth ? t('yes') : t('no')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.hasGivenBirth')}:</span> {health.has_given_birth ? t('yes') : t('no')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.substanceAbuse')}:</span> {health.substance_abuse ? t('yes') : t('no')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.closestHospital')}:</span> {health.closest_hospital}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.closestNICU')}:</span> {health.closest_nicu_iii}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.formalProbation')}:</span> {health.formal_probation ? t('yes') : t('no')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.isBreastfeeding')}:</span> {health.is_breastfeeding ? t('yes') : t('no')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.medicationsList')}:</span> {health.medications_list}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.domesticViolence')}:</span> {health.domestic_violence ? t('yes') : t('no')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.medicalConditions')}:</span> {Array.isArray(health.medical_conditions) ? health.medical_conditions.join(', ') : ''}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.childAbuseNeglect')}:</span> {health.child_abuse_neglect ? t('yes') : t('no')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.outstandingWarrant')}:</span> {health.outstanding_warrant ? t('yes') : t('no')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.pregnancyHistories')}:</span> {Array.isArray(health.pregnancy_histories) ? health.pregnancy_histories.join(', ') : ''}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.currentBirthControl')}:</span> {health.current_birth_control}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.isCurrentlyPregnant')}:</span> {health.is_currently_pregnant ? t('yes') : t('no')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.isTakingMedications')}:</span> {health.is_taking_medications ? t('yes') : t('no')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.backgroundCheckStatus')}:</span> {health.background_check_status}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.childProtectionInvestigation')}:</span> {health.child_protection_investigation ? t('yes') : t('no')}</div>
          <div><span className="font-medium">{t('surrogacyProfile.health.seriousPregnancyComplications')}:</span> {health.serious_pregnancy_complications ? t('yes') : t('no')}</div>
        </div>
      </div>
      {/* Upload Photos */}
      <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
        <h2 className="text-xl font-serif mb-4">{t('surrogacyProfile.photos.title')}</h2>
        <div className="flex gap-4 flex-wrap">
          {photos.length > 0 ? (
            photos.map((photo: any, idx: number) => (
              <a key={idx} href={photo.url} target="_blank" rel="noopener noreferrer">
                <img src={photo.url} alt={photo.name || `${t('surrogacyProfile.photos.photo')} ${idx + 1}`} className="w-24 h-24 object-cover rounded border hover:scale-105 transition" />
              </a>
            ))
          ) : (
            <span className="text-gray-500">{t('surrogacyProfile.photos.noPhotos')}</span>
          )}
        </div>
      </div>
      {/* Login Settings */}
      {/* <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6 flex flex-col">
        <h2 className="text-xl font-serif mb-4">Login Settings</h2>
        <div className="text-gray-500 text-xs">仅用于查看，无修改功能</div>
      </div> */}
    </div>
  );
}

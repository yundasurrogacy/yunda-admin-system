"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function SurrogacyProfile() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const surrogacyId = typeof window !== "undefined" ? localStorage.getItem("surrogateId") : null;
    if (!surrogacyId) {
      setError("未找到用户ID，请重新登录。");
      setLoading(false);
      return;
    }
    fetch(`/api/surrogate_mothers-detail?surrogacy=${surrogacyId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("获取信息失败");
        const result = await res.json();
        setData(result);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-8">加载中...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;

  const about = data?.about_you || {};
  const contact = data?.contact_information || {};
  const health = data?.pregnancy_and_health || {};
  const photos = Array.isArray(data?.upload_photos) ? data.upload_photos : [];

  return (
    <div className="p-8 min-h-screen" style={{ background: "#FBF0DA40" }}>
      <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-2">My Profile</h1>
      <p className="text-[#271F18] font-serif mb-8">Manage your profile details here. Update your personal information, email address, or password to keep your profile up-to-date.</p>
      {/* About You */}
      <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6 flex flex-col">
        <h2 className="text-xl font-serif mb-4">About You</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 w-full">
          <div><span className="font-medium">Occupation:</span> {about.occupation}</div>
          <div><span className="font-medium">Contact Source:</span> {about.contact_source}</div>
          <div><span className="font-medium">Marital Status:</span> {about.marital_status}</div>
          <div><span className="font-medium">Education Level:</span> {about.education_level}</div>
          <div><span className="font-medium">Partner Support:</span> {about.partner_support}</div>
          <div><span className="font-medium">Household Income:</span> {about.household_income}</div>
          <div><span className="font-medium">Is Former Surrogate:</span> {about.is_former_surrogate ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Surrogate Experience:</span> {about.surrogate_experience}</div>
          <div><span className="font-medium">Has High School Diploma:</span> {about.has_high_school_diploma ? 'Yes' : 'No'}</div>
        </div>
      </div>
      {/* Contact Information */}
      <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
        <h2 className="text-xl font-serif mb-4">Contact Information</h2>
        <div className="space-y-2 mt-2 grid grid-cols-2 gap-x-8 gap-y-1">
          <div><span className="font-medium">First Name:</span> {contact.first_name}</div>
          <div><span className="font-medium">Last Name:</span> {contact.last_name}</div>
          <div><span className="font-medium">Date of Birth:</span> {contact.date_of_birth}</div>
          <div><span className="font-medium">Email:</span> {contact.email_address}</div>
          <div><span className="font-medium">Cell Phone:</span> {contact.cell_phone_country_code} {contact.cell_phone}</div>
          <div><span className="font-medium">Agree to Receive Messages:</span> {contact.is_agree_cell_phone_receive_messages ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">City:</span> {contact.city}</div>
          <div><span className="font-medium">State/Province:</span> {contact.state_or_province}</div>
          <div><span className="font-medium">Country:</span> {contact.country}</div>
          <div><span className="font-medium">Zip Code:</span> {contact.zip_code}</div>
          <div><span className="font-medium">Ethnicity:</span> {contact.ethnicity}</div>
          <div><span className="font-medium">BMI:</span> {contact.bmi}</div>
          <div><span className="font-medium">Height:</span> {contact.height}</div>
          <div><span className="font-medium">Weight:</span> {contact.weight}</div>
          <div><span className="font-medium">US Citizen/Visa Status:</span> {contact.us_citizen_or_visa_status}</div>
          <div><span className="font-medium">Surrogacy Experience Count:</span> {contact.surrogacy_experience_count}</div>
        </div>
      </div>
      {/* Pregnancy & Health */}
      <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
        <h2 className="text-xl font-serif mb-4">Pregnancy & Health</h2>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 w-full">
          <div><span className="font-medium">Arrests:</span> {health.arrests ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Birth Details:</span> {health.birth_details}</div>
          <div><span className="font-medium">Felony Charges:</span> {health.felony_charges ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Has Stillbirth:</span> {health.has_stillbirth ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Has Given Birth:</span> {health.has_given_birth ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Substance Abuse:</span> {health.substance_abuse ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Closest Hospital:</span> {health.closest_hospital}</div>
          <div><span className="font-medium">Closest NICU III:</span> {health.closest_nicu_iii}</div>
          <div><span className="font-medium">Formal Probation:</span> {health.formal_probation ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Is Breastfeeding:</span> {health.is_breastfeeding ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Medications List:</span> {health.medications_list}</div>
          <div><span className="font-medium">Domestic Violence:</span> {health.domestic_violence ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Medical Conditions:</span> {Array.isArray(health.medical_conditions) ? health.medical_conditions.join(', ') : ''}</div>
          <div><span className="font-medium">Child Abuse/Neglect:</span> {health.child_abuse_neglect ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Outstanding Warrant:</span> {health.outstanding_warrant ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Pregnancy Histories:</span> {Array.isArray(health.pregnancy_histories) ? health.pregnancy_histories.join(', ') : ''}</div>
          <div><span className="font-medium">Current Birth Control:</span> {health.current_birth_control}</div>
          <div><span className="font-medium">Is Currently Pregnant:</span> {health.is_currently_pregnant ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Is Taking Medications:</span> {health.is_taking_medications ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Background Check Status:</span> {health.background_check_status}</div>
          <div><span className="font-medium">Child Protection Investigation:</span> {health.child_protection_investigation ? 'Yes' : 'No'}</div>
          <div><span className="font-medium">Serious Pregnancy Complications:</span> {health.serious_pregnancy_complications ? 'Yes' : 'No'}</div>
        </div>
      </div>
      {/* Upload Photos */}
      <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] mb-6">
        <h2 className="text-xl font-serif mb-4">Upload Photos</h2>
        <div className="flex gap-4 flex-wrap">
          {photos.length > 0 ? (
            photos.map((photo: any, idx: number) => (
              <a key={idx} href={photo.url} target="_blank" rel="noopener noreferrer">
                <img src={photo.url} alt={photo.name || `Photo ${idx + 1}`} className="w-24 h-24 object-cover rounded border hover:scale-105 transition" />
              </a>
            ))
          ) : (
            <span className="text-gray-500">No photos uploaded.</span>
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

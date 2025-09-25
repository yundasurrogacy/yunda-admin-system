"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const typeOptions = [
  { value: "ClinicOverview", label: "ClinicOverview（诊所概览）" },
  { value: "EmbryoJourney", label: "EmbryoJourney（胚胎历程）" },
  { value: "SurrogateAppointments", label: "SurrogateAppointments（代孕母预约）" },
  { value: "MedicationTracker", label: "MedicationTracker（用药追踪）" },
  { value: "DoctorNotes", label: "DoctorNotes（医生备注）" },
];

const AddIvfClinicForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId") || "";

  const [type, setType] = useState("");
  const [data, setData] = useState<string>("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let jsonData;
      try {
        jsonData = data ? JSON.parse(data) : {};
      } catch {
        setError("诊所信息需为合法 JSON 格式");
        setLoading(false);
        return;
      }
      const body = { caseId, type, data: jsonData, desc };
      const res = await fetch("/api/add-ivf-clinic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("提交失败");
      router.push(`/client-manager/my-cases/${caseId}`);
    } catch (err: any) {
      setError(err.message || "未知错误");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="p-8 w-full max-w-lg">
        <div className="mb-4">
          <Button variant="outline" size="sm" onClick={() => router.push(`/client-manager/my-cases/${caseId}`)}>
            返回
          </Button>
        </div>
        <h2 className="text-xl font-bold mb-6">新增 IVF Clinic</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">类型</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={type}
              onChange={e => setType(e.target.value)}
              required
            >
              <option value="">请选择类型</option>
              {typeOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">诊所信息（JSON 格式）</label>
            <textarea
              className="border rounded px-3 py-2 w-full font-mono"
              value={data}
              onChange={e => setData(e.target.value)}
              rows={6}
              placeholder={'如：{ "clinicName": "xxx", "address": "xxx" }'}
              required
            />
            <div className="text-xs text-gray-500 mt-1">请填写合法 JSON 格式内容</div>
          </div>
          <div>
            <label className="block mb-1 font-medium">描述</label>
            <textarea
              className="border rounded px-3 py-2 w-full"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={3}
            />
          </div>
          {data && (
            <div className="bg-gray-50 border rounded p-2 text-xs font-mono mt-2">
              <div className="mb-1 text-gray-600">诊所信息预览：</div>
              <pre>{(() => { try { return JSON.stringify(JSON.parse(data), null, 2); } catch { return "JSON 格式错误"; } })()}</pre>
            </div>
          )}
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "提交中..." : "提交"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddIvfClinicForm;
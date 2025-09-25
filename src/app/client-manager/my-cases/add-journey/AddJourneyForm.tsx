"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const stageOptions = [
  { value: "1", label: "步骤1" },
  { value: "2", label: "步骤2" },
  { value: "3", label: "步骤3" },
  { value: "4", label: "步骤4" },
  { value: "5", label: "步骤5" },
  { value: "6", label: "步骤6" },
  { value: "7", label: "步骤7" },
];
const categoryOptions = [
  { value: "EmbryoDocs", label: "胚胎文件" },
  { value: "SurrogateInfo", label: "代孕母信息" },
  { value: "LegalDocs", label: "法律文件" },
  { value: "Other", label: "其他" },
];

const AddJourneyForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseId = searchParams.get("caseId") || "";

  const [title, setTitle] = useState("");
  const [stage, setStage] = useState<string>("");
  const [category, setCategory] = useState("");
  const [fileType, setFileType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("caseId", caseId);
      formData.append("title", title);
      formData.append("stage", stage);
      formData.append("category", category);
      formData.append("fileType", fileType);
      if (file) formData.append("file", file);
      const res = await fetch("/api/add-journey", {
        method: "POST",
        body: formData,
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
        <h2 className="text-xl font-bold mb-6">新增 Journey</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">标题</label>
            <input
              type="text"
              className="border rounded px-3 py-2 w-full"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">步骤序号</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={stage}
              onChange={e => setStage(e.target.value)}
              required
            >
              <option value="">请选择步骤</option>
              {stageOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="border-t pt-4 mt-4">
            <div className="font-semibold mb-2">上传相关文件（可选）</div>
            <div className="mb-2">
              <label className="block mb-1 font-medium">文件分类</label>
              <select
                className="border rounded px-3 py-2 w-full"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="">请选择分类</option>
                {categoryOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label className="block mb-1 font-medium">文件类型</label>
              <input
                type="text"
                className="border rounded px-3 py-2 w-full"
                value={fileType}
                onChange={e => setFileType(e.target.value)}
                placeholder="如：pdf、jpg、docx"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">文件上传</label>
              <input
                type="file"
                className="border rounded px-3 py-2 w-full"
                onChange={e => setFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "提交中..." : "提交"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default AddJourneyForm;
"use client";
import React from "react";

export default function SurrogacyFilesPage() {
  // 示例文件数据
  const completedFiles = [
    {
      name: "Lab Report",
      date: "Feb 15, 2025",
      status: "Signed",
      action: "Download",
    },
    {
      name: "Lab Report",
      date: "Feb 15, 2025",
      status: "Signed",
      action: "Download",
    },
    {
      name: "Lab Report",
      date: "Feb 15, 2025",
      status: "Signed",
      action: "Download",
    },
  ];
  const incompleteFiles = [
    {
      name: "Medical History",
      date: "Feb 15, 2025",
      status: "Signature Needed",
      action: "Upload",
    },
    {
      name: "Screening Report",
      date: "Feb 15, 2025",
      status: "Review",
      action: "Download",
    },
    {
      name: "Lab Photo",
      date: "Feb 15, 2025",
      status: "Review",
      action: "Download",
    },
  ];
  const advisors = [
    {
      title: "Legal Advisor",
      name: "John Doe",
      phone: "(123) 456 - 7890",
      email: "123456@gmail.com",
    },
    {
      title: "Yunda Advisor",
      name: "John Doe",
      phone: "(123) 456 - 7890",
      email: "123456@gmail.com",
    },
  ];

  // 文件上传与签署状态交互
  const [uploading, setUploading] = React.useState(false);
  const [signed, setSigned] = React.useState(false);
  const handleUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setSigned(true);
    }, 1500);
  };
  return (
    <div
      className="min-h-screen bg-[#FBF0DA40] font-serif text-[#271F18] px-8 py-6 flex flex-col items-center"
      style={{ fontFamily: 'Source Serif 4, serif' }}
    >
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold mb-1">My Files</h1>
        <div className="flex gap-8 mt-4">
          {/* 左侧文件分组区 */}
          <div className="flex-1 flex gap-8">
            {/* Completed */}
            <div className="flex-1">
              <div className="text-lg font-semibold mb-4">Completed</div>
              <div className="flex flex-col gap-4">
                {completedFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="font-medium">{file.name}</div>
                      <div className="text-xs opacity-60">{file.date}</div>
                    </div>
                    <div className="text-xs px-3 py-1 bg-[#E6F2ED] text-[#271F18] rounded-full shadow font-medium">
                      {file.status}
                    </div>
                    <button className="ml-2 px-3 py-1 bg-[#E6F2ED] text-[#271F18] rounded-full text-xs font-medium shadow hover:bg-[#d0e7db] transition">
                      {file.action}
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {/* 分组竖线 */}
            <div className="w-px bg-[#E6E6E6] mx-2" />
            {/* Incomplete */}
            <div className="flex-1">
              <div className="text-lg font-semibold mb-4">Incomplete</div>
              <div className="flex flex-col gap-4">
                {incompleteFiles.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="font-medium">{file.name}</div>
                      <div className="text-xs opacity-60">{file.date}</div>
                    </div>
                    <div className="text-xs px-3 py-1 bg-[#E6F2ED] text-[#271F18] rounded-full shadow font-medium">
                      {file.status}
                    </div>
                    {/* 文件上传与签署按钮 */}
                    {file.action === "Upload" ? (
                      <button
                        className={`ml-2 px-3 py-1 bg-[#E6F2ED] text-[#271F18] rounded-full text-xs font-medium shadow hover:bg-[#d0e7db] transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={handleUpload}
                        disabled={uploading}
                      >
                        {uploading ? "Uploading..." : "Upload"}
                      </button>
                    ) : (
                      <button className="ml-2 px-3 py-1 bg-[#E6F2ED] text-[#271F18] rounded-full text-xs font-medium shadow hover:bg-[#d0e7db] transition">
                        {file.action}
                      </button>
                    )}
                    {/* 电子签名状态展示 */}
                    {file.status === "Signature Needed" && (
                      <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${signed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>
                        {signed ? "已签署 (eSign)" : "待签署 (eSign)"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* 右侧顾问信息区 */}
          <div className="w-[340px] flex flex-col gap-4">
            {advisors.map((advisor, idx) => (
              <div key={idx} className="bg-[#FBF0DA] rounded-xl shadow-md p-4 flex gap-4 items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <svg width="32" height="32" fill="#271F18" className="opacity-40"><circle cx="16" cy="12" r="7"/><ellipse cx="16" cy="24" rx="10" ry="6"/></svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold mb-1">{advisor.title}</div>
                  <div className="text-sm">Name: <span className="font-medium">{advisor.name}</span></div>
                  <div className="text-sm">Phone: <span className="font-medium">{advisor.phone}</span></div>
                  <div className="text-sm">Email: <span className="font-medium">{advisor.email}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

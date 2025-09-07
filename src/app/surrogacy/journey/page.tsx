"use client";
import React, { useState } from "react";

const stages: { key: "match" | "legal" | "pregnancy" | "complete"; label: string }[] = [
  { key: "match", label: "Matching" },
  { key: "legal", label: "Legal Stage" },
  { key: "pregnancy", label: "Pregnancy" },
  { key: "complete", label: "Completed" },
];

const todosByStage: Record<"match" | "legal" | "pregnancy" | "complete", string[]> = {
  match: ["签约身份验证", "上传协议文件", "等待匹配"],
  legal: ["签署法律文件", "身份认证", "等待律师反馈"],
  pregnancy: ["产检预约", "用药提醒", "上传医疗报告"],
  complete: ["流程总结", "归档所有文件", "通知相关人员"],
};

export default function SurrogacyJourneyPage() {
  const [currentStage, setCurrentStage] = useState<"match" | "legal" | "pregnancy" | "complete">("match");
  const [todos, setTodos] = useState(todosByStage[currentStage].map((t) => ({ text: t, done: false })));

  // 切换阶段时刷新待办
  const handleStageChange = (key: "match" | "legal" | "pregnancy" | "complete") => {
    setCurrentStage(key);
    setTodos(todosByStage[key].map((t) => ({ text: t, done: false })));
  };

  // 勾选待办
  const toggleTodo = (idx: number) => {
    setTodos((prev) => prev.map((todo, i) => i === idx ? { ...todo, done: !todo.done } : todo));
  };

  // 模拟预约列表
  const appointments = [
    { date: "2025-10-10", type: "Ultrasound", doctor: "Dr. John Doe", clinic: "Hope IVF Center", address: "123 Main St, City", time: "9:30 AM" },
    { date: "2025-10-15", type: "Consultation", doctor: "Dr. Jane Smith", clinic: "Hope IVF Center", address: "123 Main St, City", time: "2:00 PM" },
  ];

  return (
    <div className="min-h-screen bg-[#FBF0DA40] font-serif text-[#271F18] px-8 py-6 flex flex-col items-center" style={{ fontFamily: 'Source Serif 4, serif' }}>
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6">
        <h1 className="text-2xl font-bold mb-1">Journey</h1>
        <p className="mb-4 text-base">我的流程进度与待办事项</p>
        {/* 阶段切换 */}
        <div className="flex gap-4 mb-6">
          {stages.map((stage) => (
            <button
              key={stage.key}
              className={`px-5 py-2 rounded-full font-medium shadow text-sm transition border ${currentStage === stage.key ? 'bg-[#271F18] text-white' : 'bg-[#E6F2ED] text-[#271F18]'}`}
              onClick={() => handleStageChange(stage.key)}
            >
              {stage.label}
            </button>
          ))}
        </div>
        {/* 待办事项列表 */}
        <div className="bg-[#FBF0DA] rounded-xl shadow-md p-6 mb-6">
          <div className="font-semibold text-lg mb-4">待办事项</div>
          <ul className="flex flex-col gap-3">
            {todos.map((todo, idx) => (
              <li key={idx} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.done}
                  onChange={() => toggleTodo(idx)}
                  className="accent-[#271F18] w-5 h-5 rounded"
                />
                <span className={`text-base ${todo.done ? 'line-through opacity-50' : ''}`}>{todo.text}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* 预约列表与诊所信息（Calendar联动） */}
        <div className="bg-[#FBF0DA] rounded-xl shadow-md p-6">
          <div className="font-semibold text-lg mb-4">预约列表</div>
          <table className="w-full text-left border-separate border-spacing-y-2 mb-4">
            <thead>
              <tr className="text-[#271F18] opacity-80 text-sm">
                <th>日期</th>
                <th>类型</th>
                <th>医生</th>
                <th>诊所</th>
                <th>时间</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((item, idx) => (
                <tr key={idx} className="bg-white rounded-md shadow-sm">
                  <td className="py-2 px-3">{item.date}</td>
                  <td className="py-2 px-3">{item.type}</td>
                  <td className="py-2 px-3">{item.doctor}</td>
                  <td className="py-2 px-3">{item.clinic}</td>
                  <td className="py-2 px-3">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* 医生与诊所信息 */}
          <div className="mt-2">
            <div className="font-semibold mb-1">主治医生信息</div>
            <div className="text-sm">姓名：Dr. John Doe</div>
            <div className="text-sm">诊所：Hope IVF Center</div>
            <div className="text-sm">地址：123 Main St, City</div>
            <div className="text-sm">电话：123-456-7890</div>
          </div>
        </div>
      </div>
    </div>
  );
}

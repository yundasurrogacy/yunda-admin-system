"use client"

import { useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AdminLayout } from "../../../components/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Alert, AlertDescription } from "../../../components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"

export default function DashboardPage() {
  const [language, setLanguage] = useState<"EN" | "CN">("EN")

  const text = {
    EN: {
      dashboard: "DASHBOARD",
      totalActiveCases: "Total Active Cases",
      stageDistribution: "Stage Distribution",
      activeCasesByManager: "Active Cases By Customer Manager",
      systemAlerts: "System Alerts",
      name: "Name",
      caseNumber: "Case Number",
      viewDetails: "View Details",
      matching: "Matching",
      legalStage: "Legal Stage",
      pregnancy: "Pregnancy",
      noUpdatesAlert: "John Doe has no updates for over 3 Days",
    },
    CN: {
      dashboard: "仪表板",
      totalActiveCases: "活跃案例总数",
      stageDistribution: "阶段分布",
      activeCasesByManager: "客户经理活跃案例",
      systemAlerts: "系统警报",
      name: "姓名",
      caseNumber: "案例编号",
      viewDetails: "查看详情",
      matching: "匹配中",
      legalStage: "法律阶段",
      pregnancy: "怀孕期",
      noUpdatesAlert: "John Doe 超过3天没有更新",
    },
  }

  const stageData = [
    { name: text[language].matching, value: 10, count: "(10)" },
    { name: text[language].legalStage, value: 8, count: "(8)" },
    { name: text[language].pregnancy, value: 10, count: "(10)" },
  ]

  // Sample data for active cases
  const [activeCases, setActiveCases] = useState<Case[]>([
    {
      name: "John Doe",
      center: "Lincoln Surrogacy Center",
      stage: "Matching",
      status: "Legal",
      progress: 20,
      review: "Surrogacy agreement signed/preparing account",
      notice: "Agreement upload needed",
      messages: [
        { user: "John", content: "I have reviewed the draft. Please let me know if...", time: "2 hours ago" },
      ],
    },
    // 可添加更多案例
  ])

  // 最新案件模拟数据
  const [latestCases, setLatestCases] = useState([
    { name: "John Doe", date: "May 12" },
    { name: "Mary Hill", date: "May 13" },
    { name: "Siren Far", date: "May 14" },
  ])

  // 新增案子类型定义
  interface Case {
    name: string;
    center: string;
    stage: string;
    status: string;
    progress: number;
    review: string;
    notice: string;
    messages: { user: string; content: string; time: string }[];
  }

  // 新增案子表单初始值
  const initialForm: Case = {
    name: "",
    center: "",
    stage: "Matching",
    status: "Legal",
    progress: 0,
    review: "",
    notice: "",
    messages: [],
  };

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<Case>(initialForm);
  const [addLoading, setAddLoading] = useState(false);

  // 新增案子表单提交
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      setActiveCases(cases => [form, ...cases]);
      setAddOpen(false);
      setForm(initialForm);
    } finally {
      setAddLoading(false);
    }
  };

  const chartColors = ["#e8e2d5", "#c4a484", "#8b6f47"]

  // 阶段筛选按钮
  const stages = ["Matching", "Legal Stage", "Cycle Prep", "Pregnant", "Transferred"];
  const [selectedStage, setSelectedStage] = useState<string>("Matching");

  return (
    <AdminLayout>
      <div className="space-y-8 p-6">
        <div>
          <h1 className="text-2xl font-normal tracking-wide text-sage-800 mb-8">{text[language].dashboard}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Total Active Cases Card */}
          <Card className="bg-white border-sage-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-normal text-sage-700">{text[language].totalActiveCases}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-light text-sage-800">28</div>
            </CardContent>
          </Card>

          {/* Stage Distribution Chart */}
          <Card className="bg-white border-sage-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-normal text-sage-700">{text[language].stageDistribution}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stageData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                    <XAxis hide />
                    <YAxis hide />
                    <Bar dataKey="value" radius={[2, 2, 0, 0]} barSize={60}>
                      {stageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-between text-xs text-sage-600">
                {stageData.map((item, index) => (
                  <div key={item.name} className="text-center">
                    <span>
                      {item.name}
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 最新案件区块 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-base font-normal text-sage-700 mb-4">Latest Update</h2>
          <div className="flex gap-4 overflow-x-auto">
            {latestCases.map((item, idx) => (
              <div key={idx} className="bg-sage-50 rounded-lg p-4 min-w-[160px] flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-sage-200 flex items-center justify-center mb-2">
                  <span className="text-sage-700 font-bold text-lg">{item.name[0]}</span>
                </div>
                <div className="text-sage-800 font-medium mb-1">{item.name}</div>
                <div className="text-xs text-sage-500 mb-2">{item.date}</div>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            ))}
          </div>
        </div>
        <Card className="bg-white border-sage-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-normal text-sage-700">{text[language].activeCasesByManager}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-0">
              {/* Table Header */}
              <div className="grid grid-cols-3 gap-4 pb-3 border-b border-sage-200">
                <div className="text-sm font-medium text-sage-700">{text[language].name}</div>
                <div className="text-sm font-medium text-sage-700">{text[language].caseNumber}</div>
                <div></div>
              </div>

              {/* Table Rows */}
              {activeCases.map((caseItem, index) => (
                <div
                  key={index}
                  className="grid grid-cols-3 gap-4 items-center py-3 border-b border-sage-100 last:border-b-0"
                >
                  <div className="text-sm text-sage-800">{caseItem.name}</div>
                  <div className="text-sm text-sage-800">{index + 1}</div>
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-sage-100 text-sage-700 hover:bg-sage-200 border-sage-300 text-xs px-3 py-1 h-7"
                    >
                      {text[language].viewDetails}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-sage-200 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-normal text-sage-700">{text[language].systemAlerts}</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm">{text[language].noUpdatesAlert}</AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      {/* 底部操作按钮 */}
      <div className="flex gap-4 justify-end mt-8">
        <Button onClick={() => setAddOpen(true)} variant="default">Add New Client</Button>
        <Button variant="outline">Upload File</Button>
        <Button variant="outline">Export Report</Button>
      </div>
      {/* 新增案子弹窗表单 */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <form onSubmit={handleAdd} className="space-y-4 p-4 w-96">
          <h2 className="text-lg font-bold mb-2">新增案例</h2>
          <Label>姓名<Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required /></Label>
          <Label>机构<Input value={form.center} onChange={e => setForm(f => ({ ...f, center: e.target.value }))} required /></Label>
          <Label>阶段
            <select value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))} className="border rounded px-2 py-1 ml-2">
              <option value="Matching">Matching</option>
              <option value="Legal Stage">Legal Stage</option>
              <option value="Cycle Prep">Cycle Prep</option>
              <option value="Pregnant">Pregnant</option>
              <option value="Transferred">Transferred</option>
            </select>
          </Label>
          <Label>状态<Input value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} required /></Label>
          <Label>进度
            <input type="number" min={0} max={100} value={form.progress} onChange={e => setForm(f => ({ ...f, progress: Number(e.target.value) }))} className="border rounded px-2 py-1 ml-2 w-20" required />%
          </Label>
          <Label>审核<Input value={form.review} onChange={e => setForm(f => ({ ...f, review: e.target.value }))} /></Label>
          <Label>通知<Input value={form.notice} onChange={e => setForm(f => ({ ...f, notice: e.target.value }))} /></Label>
          <div className="flex gap-2 mt-2">
            <Button type="submit" disabled={addLoading}>提交</Button>
            <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>取消</Button>
          </div>
        </form>
      </Dialog>

      </div>
    </AdminLayout>
  )
}

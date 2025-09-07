import ManagerLayout from '@/components/manager-layout'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

export default function SurrogateProfileDetail() {
  // 模拟数据
  const surrogate = {
    name: 'John Doe',
    phone: '(123) 456 - 7890',
    email: '12345@gmail.com',
    language: 'English',
    country: 'United States',
    status: 'Active',
    trustId: '1123456',
    trustBalance: '$25,000.00',
    trustStatus: 'Active',
    manager: 'David Johns',
    documents: [
      { name: 'Passport', uploaded: false },
      { name: 'Agreement', uploaded: false },
      { name: 'Authorization', uploaded: false },
      { name: 'Pre-Birth Order', uploaded: false },
    ],
  }

  return (
    <ManagerLayout>
      <div className="p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
        <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-8">Surrogate Profile</h1>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <Card className="rounded-xl bg-white p-6 font-serif text-[#271F18]">
            <h2 className="text-lg font-medium mb-4 font-serif text-[#271F18]">Basic Information</h2>
            <div className="flex gap-4 items-center">
              <Avatar className="w-14 h-14">
                <AvatarFallback className="bg-[#E2E8F0] font-serif text-[#271F18]">JD</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div>Name: {surrogate.name}</div>
                <div>Phone: {surrogate.phone}</div>
                <div>Email: {surrogate.email}</div>
                <div>Language: {surrogate.language}</div>
              </div>
            </div>
          </Card>
          <Card className="rounded-xl bg-white p-6 font-serif text-[#271F18]">
            <h2 className="text-lg font-medium mb-4 font-serif text-[#271F18]">Embryo Information</h2>
            <div className="h-10" />
          </Card>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <Card className="rounded-xl bg-white p-6 font-serif text-[#271F18]">
            <h2 className="text-lg font-medium mb-4 font-serif text-[#271F18]">Upload Documents</h2>
            <div className="grid grid-cols-2 gap-4">
              {surrogate.documents.map((doc, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="font-serif text-[#271F18]">{doc.name}</span>
                  <Button className="rounded bg-[#E3E8E3] text-[#271F18] font-serif px-3 py-1 text-xs shadow-none">+ Upload</Button>
                </div>
              ))}
            </div>
          </Card>
          <Card className="rounded-xl bg-white p-6 font-serif text-[#271F18]">
            <h2 className="text-lg font-medium mb-4 font-serif text-[#271F18]">Trust Account</h2>
            <div className="space-y-1">
              <div>Trust ID: {surrogate.trustId}</div>
              <div>Trust Balance: {surrogate.trustBalance}</div>
              <div>Status: {surrogate.trustStatus}</div>
            </div>
          </Card>
        </div>
        <Card className="rounded-xl bg-white p-6 font-serif text-[#271F18] mb-6">
          <h2 className="text-lg font-medium mb-4 font-serif text-[#271F18]">Client Manager</h2>
          <div>{surrogate.manager}</div>
        </Card>
        <Card className="rounded-xl bg-white p-6 font-serif text-[#271F18]">
          <h2 className="text-lg font-medium mb-4 font-serif text-[#271F18]">Medical Record</h2>
        </Card>
      </div>
    </ManagerLayout>
  )
}

'use client'
import React, { useState } from 'react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const folders = [
  'Inbox',
  'Replied',
  'Notifications',
  'Starred',
]

const messages = [
  { id: 1, sender: 'Legal Partner', subject: 'Legal Update', preview: 'Advice appointment needed for ultrasound needs; medication needs; awaiting test for more', date: 'April 18, 2025', starred: false },
  { id: 2, sender: 'IVF Doctor', subject: 'Test Results', preview: 'Advice appointment needed for ultrasound needs; medication needs; awaiting test for more', date: 'April 18, 2025', starred: false },
  { id: 3, sender: 'IVF Doctor', subject: 'Medication Update', preview: 'Advice appointment needed for ultrasound needs; medication needs; awaiting test for more', date: 'April 18, 2025', starred: true },
]

export default function Messages() {
  const [selectedFolder, setSelectedFolder] = useState('Inbox')
  const [selectedMessage, setSelectedMessage] = useState<number | null>(null)
  const [search, setSearch] = useState('')

  const filteredMessages = messages.filter(m => m.subject.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* 左侧菜单 */}
        <div className="md:col-span-1">
          <h2 className="font-serif text-lg text-[#271F18] mb-4">Messages</h2>
          <ul className="space-y-2">
            {folders.map(f => (
              <li key={f}>
                <Button
                  className={`w-full text-left font-serif px-4 py-2 rounded ${selectedFolder === f ? 'bg-[#E3E8E3] text-[#271F18]' : 'bg-transparent text-[#271F18]'}`}
                  onClick={() => setSelectedFolder(f)}
                >
                  {f}
                </Button>
              </li>
            ))}
          </ul>
        </div>
        {/* 右侧内容区 */}
        <div className="md:col-span-4">
          <div className="flex justify-between items-center mb-4">
            <input
              className="w-1/3 px-4 py-2 rounded bg-white font-serif text-[#271F18] border-none shadow focus:ring-0 focus:outline-none"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {/* 消息列表或详情 */}
          {selectedMessage === null ? (
            <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18]">
              <table className="w-full text-[#271F18] font-serif">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 text-left">Sender</th>
                    <th className="text-left">Subject</th>
                    <th className="text-left">Preview</th>
                    <th className="text-left">Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map(m => (
                    <tr key={m.id} className="hover:bg-[#E3E8E3] cursor-pointer" onClick={() => setSelectedMessage(m.id)}>
                      <td className="py-2">{m.sender}</td>
                      <td>{m.subject}</td>
                      <td>{m.preview}</td>
                      <td>{m.date}</td>
                      <td><Button className="rounded bg-[#D9D9D9] text-[#271F18] font-serif px-3 py-1 text-xs shadow-none hover:bg-[#E3E8E3]">View</Button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18]">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-[#E2E8F0] font-serif text-[#271F18]">JD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-serif text-lg">John Doe</div>
                  <div className="text-xs text-[#271F18]">April 18, 2025</div>
                </div>
              </div>
              <div className="mb-4 font-serif text-base">Legal Update is Updated!</div>
              <div className="mb-4 text-sm text-[#271F18]">Your account is updated. Please review it in your notification or contact your account team for more questions. See latest update below.</div>
              <div className="flex gap-2">
                <Button className="rounded bg-[#E3E8E3] text-[#271F18] font-serif px-3 py-1 text-xs shadow-none hover:bg-[#D9D9D9]">Reply</Button>
                <Button className="rounded bg-[#E3E8E3] text-[#271F18] font-serif px-3 py-1 text-xs shadow-none hover:bg-[#D9D9D9]">Star</Button>
              </div>
              <div className="mt-6">
                <Button className="rounded bg-[#D9D9D9] text-[#271F18] font-serif px-3 py-1 text-xs shadow-none hover:bg-[#E3E8E3]" onClick={() => setSelectedMessage(null)}>Back</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

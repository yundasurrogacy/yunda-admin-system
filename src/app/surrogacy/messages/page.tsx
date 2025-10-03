'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

const tabs = [
  'From Intended Parent',
  'From Case Manager',
]

const parentMessages = [
  { sender: 'John Doe', text: 'hi my name is John Doe', date: 'April 18, 2025' },
  { sender: 'John Doe', text: 'hi my name is John Doe', date: 'April 18, 2025' },
  { sender: 'John Doe', text: 'hi my name is John Doe', date: 'April 18, 2025' },
]

const managerMessages = [
  { sender: 'Luna Yuna', text: 'hi my name is John Doe' },
  { sender: 'Luna Yuna', text: 'hi my name is John Doe' },
  { sender: 'Luna Yuna', text: 'hi my name is John Doe' },
  { sender: 'Luna Yuna', text: 'hi my name is John Doe' },
  { sender: 'Luna Yuna', text: 'hi my name is John Doe' },
]

export default function SurrogacyMessages() {
  const [activeTab, setActiveTab] = useState('From Intended Parent')
  const [input, setInput] = useState('')

  return (
    <div className="p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
      <div className="rounded-xl bg-[#FBF0DA40] p-6 font-serif text-[#271F18] grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* 左侧菜单 */}
        <div className="md:col-span-1">
          <h2 className="font-serif text-lg text-[#271F18] mb-4">Messages</h2>
          <ul className="space-y-2">
            {tabs.map(tab => (
              <li key={tab}>
                <Button
                  className={`w-full text-left font-serif px-4 py-2 rounded ${activeTab === tab ? 'bg-[#E3E8E3] text-[#271F18]' : 'bg-transparent text-[#271F18]'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Button>
              </li>
            ))}
          </ul>
        </div>
        {/* 右侧内容区 */}
        <div className="md:col-span-4">
          {activeTab === 'From Intended Parent' ? (
            <div>
              <div className="mb-6">
                <h3 className="font-serif text-base mb-2">Send a message to your intended parent:</h3>
                <textarea
                  className="w-full rounded bg-[#E3E8E3] px-3 py-2 font-serif text-[#271F18] mb-2"
                  rows={3}
                  placeholder="Write a message...."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                />
                <Button className="rounded bg-[#D9D9D9] text-[#271F18] font-serif px-4 py-1 text-xs shadow-none hover:bg-[#E3E8E3]">Send</Button>
              </div>
              <h3 className="font-serif text-base mb-2">Recent messages from your intended parent:</h3>
              {parentMessages.map((msg, idx) => (
                <div key={idx} className="bg-[#E3E8E3] rounded p-2 mb-2 flex justify-between items-center">
                  <span>{msg.sender}: “{msg.text}”</span>
                  <span className="text-xs text-[#271F18] ml-4">{msg.date}</span>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <h3 className="font-serif text-base mb-2">Case Manager - Luna Yuna</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex flex-col gap-2">
                  {managerMessages.map((msg, idx) => (
                    <div key={idx} className="bg-[#E3E8E3] rounded p-2 mb-2">{msg.sender}: “{msg.text}”</div>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  {managerMessages.slice(2).map((msg, idx) => (
                    <div key={idx} className="bg-[#E3E8E3] rounded p-2 mb-2">{msg.sender}: “{msg.text}”</div>
                  ))}
                </div>
              </div>
              <textarea
                className="w-full rounded bg-[#E3E8E3] px-3 py-2 font-serif text-[#271F18] mb-2"
                rows={2}
                placeholder="Write a message...."
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <Button className="rounded bg-[#D9D9D9] text-[#271F18] font-serif px-4 py-1 text-xs shadow-none hover:bg-[#E3E8E3]">Send</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

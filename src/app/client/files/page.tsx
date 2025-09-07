import React from 'react'
import { Button } from '@/components/ui/button'

const files = [
  {
    category: 'Embryo Docs',
    items: [
      { name: 'Lab Report', date: 'Feb 15, 2025', status: 'Signed' },
      { name: 'Lab Report', date: 'Feb 15, 2025', status: 'Signature Needed' },
      { name: 'Lab Report', date: 'Feb 15, 2025', status: 'Signature Needed' },
    ],
  },
  {
    category: 'Surrogate Info',
    items: [
      { name: 'Medical History', date: 'Feb 15, 2025', status: 'Downloaded' },
      { name: 'Screening Report', date: 'Feb 15, 2025', status: 'Downloaded' },
      { name: 'Lab Photo', date: 'Feb 15, 2025', status: 'Downloaded' },
    ],
  },
  {
    category: 'Legal Docs',
    items: [
      { name: 'Surrogacy Agreement', date: 'Feb 15, 2025', status: 'Signed' },
      { name: 'Pre- Birth Order', date: 'Feb 15, 2025', status: 'Signature Needed' },
      { name: 'Lab Photo', date: 'Feb 15, 2025', status: 'Uploaded' },
    ],
  },
  {
    category: 'Other',
    items: [
      { name: 'Passport', date: 'Feb 15, 2025', status: 'Uploaded' },
      { name: 'Insurance', date: 'Feb 15, 2025', status: 'Uploaded' },
    ],
  },
]

export default function Files() {
  return (
    <div className="p-8 min-h-screen" style={{ background: '#FBF0DA40' }}>
      <h1 className="text-2xl font-semibold font-serif text-[#271F18] mb-8">My Files</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {files.map((group) => (
          <div key={group.category} className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-serif text-lg text-[#271F18]">{group.category}</h2>
              <Button className="rounded bg-[#D9D9D9] text-[#271F18] font-serif px-3 py-1 text-xs shadow-none hover:bg-[#E3E8E3]">+ Upload</Button>
            </div>
            <div className="border-l border-[#D9D9D9] pl-4">
              {group.items.map((file, idx) => (
                <div key={idx} className="mb-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-serif text-[#271F18]">{file.name}</div>
                      <div className="text-xs text-[#271F18]">{file.date}</div>
                    </div>
                    <div className="text-xs text-[#271F18]">{file.status}</div>
                  </div>
                  <Button className="mt-2 rounded bg-[#E3E8E3] text-[#271F18] font-serif px-3 py-1 text-xs shadow-none hover:bg-[#D9D9D9]">Download</Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

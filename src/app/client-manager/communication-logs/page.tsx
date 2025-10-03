import ManagerLayout from '@/components/manager-layout'
import { Button } from '@/components/ui/button'
import React from 'react'

const logs = [
  {
    title: 'Phone call with client',
    tag: 'Important',
    tagColor: 'bg-yellow-100 text-yellow-800',
    desc: 'Reviewed recent updates and next steps',
    time: '9:30 AM',
  },
  {
    title: 'WeChat with surrogate',
    tag: 'Replied',
    tagColor: 'bg-sage-100 text-sage-700',
    desc: 'Reviewed recent updates and next steps',
    time: '10:30 AM',
  },
  {
    title: 'Email to client',
    tag: 'Follow Up Needed',
    tagColor: 'bg-sage-100 text-sage-700',
    desc: 'Reviewed recent updates and next steps',
    time: '9:30 AM',
  },
  {
    title: 'Email to client',
    tag: 'Follow Up Needed',
    tagColor: 'bg-sage-100 text-sage-700',
    desc: 'Reviewed recent updates and next steps',
    time: '9:30 AM',
  },
  {
    title: 'Email to client',
    tag: 'Follow Up Needed',
    tagColor: 'bg-sage-100 text-sage-700',
    desc: 'Reviewed recent updates and next steps',
    time: '9:30 AM',
  },
]

export default function CommunicationLogsPage() {
  return (
    <ManagerLayout>
      <div className="p-8">
        <h1 className="text-2xl font-medium mb-8">Communication Log</h1>
        <div className="bg-sage-50 rounded-xl p-8 shadow-sm max-w-4xl mx-auto">
          <div className="flex flex-col gap-8 relative">
            {/* Timeline vertical line */}
            <div className="absolute left-5 top-6 bottom-6 w-px bg-sage-300" />
            {logs.map((log, idx) => (
              <div key={idx} className="flex items-center">
                {/* Timeline dot */}
                <div className="relative z-10">
                  <div className="w-5 h-5 rounded-full border-2 border-sage-400 bg-white flex items-center justify-center" />
                </div>
                <div className="ml-6 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-lg">{log.title}</span>
                    <span className={`px-2 py-0.5 rounded bg-sage-100 text-sage-700 text-xs font-medium ${log.tag === 'Important' ? 'bg-yellow-100 text-yellow-800' : ''}`}>{log.tag}</span>
                  </div>
                  <div className="text-sage-700 text-sm mt-1">{log.desc}</div>
                </div>
                <div className="flex flex-col items-end min-w-[120px]">
                  <span className="text-sage-700 text-sm mb-2">{log.time}</span>
                  <Button variant="outline" className="bg-sage-100 text-sage-700 px-4 py-1 rounded-full text-xs font-medium hover:bg-sage-200">Upload</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ManagerLayout>
  )
}

import ManagerLayout from '@/components/manager-layout'
import React from 'react'

const tasks = [
  {
    title: 'Follow up with the Mary',
    desc: 'Reviewed recent updates and next steps',
    tag: 'On Hold',
    tagColor: 'bg-sage-100 text-sage-700',
    input: false,
  },
  {
    title: 'Document missing from Vanessa Cruz',
    desc: 'Draft a progress report',
    tag: 'Action Needed',
    tagColor: 'bg-yellow-100 text-yellow-800',
    input: true,
  },
  {
    title: 'Submit contract for review',
    desc: 'Reviewed recent updates and next steps',
    tag: 'Incomplete',
    tagColor: 'bg-sage-100 text-sage-700',
    input: false,
  },
  {
    title: 'Follow up with the Mary',
    desc: 'Reviewed recent updates and next steps',
    tag: 'On Hold',
    tagColor: 'bg-sage-100 text-sage-700',
    input: false,
  },
  {
    title: 'Follow up with the Mary',
    desc: 'Reviewed recent updates and next steps',
    tag: 'On Hold',
    tagColor: 'bg-sage-100 text-sage-700',
    input: false,
  },
]

export default function DailyTasksPage() {
  return (
    <ManagerLayout>
      <div className="p-8">
        <h1 className="text-2xl font-medium mb-8">Daily Tasks</h1>
        <div className="flex flex-col gap-4 max-w-3xl mx-auto">
          {tasks.map((task, idx) => (
            <div key={idx} className="bg-sage-50 rounded-xl p-6 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <input type="checkbox" className="w-5 h-5 rounded border-sage-400 focus:ring-sage-400" />
                <div>
                  <div className="font-medium text-lg">{task.title}</div>
                  <div className="text-sage-700 text-sm mt-1">{task.desc}</div>
                  {task.input && (
                    <input type="text" className="mt-2 w-64 rounded border border-sage-300 px-2 py-1 text-sm bg-white" placeholder="" />
                  )}
                </div>
              </div>
              <span className={`px-3 py-1 rounded text-xs font-medium ${task.tagColor}`}>{task.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </ManagerLayout>
  )
}

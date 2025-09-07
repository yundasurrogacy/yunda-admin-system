'use client'

import ManagerLayout from '@/components/manager-layout'
import React from 'react'
import { AlertTriangle } from 'lucide-react'

const notifications = [
	{ title: 'Agreement is expiring soon', sender: 'John Homes', time: '2 hours ago' },
	{ title: 'Document is missing', sender: 'John Homes', time: '2 hours ago' },
	{ title: 'New file uploaded by client', sender: 'John Homes', time: '2 hours ago' },
	{ title: 'Agreement is expiring soon', sender: 'John Homes', time: '2 hours ago' },
	{ title: 'Agreement is expiring soon', sender: 'John Homes', time: '2 hours ago' },
	{ title: 'Agreement is expiring soon', sender: 'John Homes', time: '2 hours ago' },
	{ title: 'Document is expiring soon', sender: 'John Homes', time: '2 hours ago' },
	{ title: 'Embryo transfer scheduled in 3 days', sender: 'John Homes', time: '2 hours ago' },
	{ title: 'Agreement is expiring soon', sender: 'John Homes', time: '2 hours ago' },
	{ title: 'Agreement is expiring soon', sender: 'John Homes', time: '2 hours ago' },
	{ title: 'Agreement is expiring soon', sender: 'John Homes', time: '2 hours ago' },
]

export default function NotificationsPage() {
	return (
		<ManagerLayout>
			<div className="p-8">
				<h1 className="text-2xl font-medium mb-8">通知</h1>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{notifications.map((n, idx) => (
						<div
							key={idx}
							className="bg-sage-50 rounded-xl p-4 flex items-center justify-between shadow-sm"
						>
							<div className="flex items-center gap-3">
								<span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-sage-400 bg-white text-sage-500">
									<AlertTriangle className="w-4 h-4" />
								</span>
								<div>
									<div className="font-medium text-base">{n.title}</div>
									<div className="text-sage-700 text-sm">{n.sender}</div>
								</div>
							</div>
							<div className="text-sage-700 text-sm">{n.time}</div>
						</div>
					))}
				</div>
			</div>
		</ManagerLayout>
	)
}

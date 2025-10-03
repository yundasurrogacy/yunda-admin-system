"use client"

import { Card } from "@/components/ui/card"
import { AuthGuard } from "@/components/auth-guard"

export default function ClientDashboardPage() {
  return (
    <AuthGuard requiredRole="client">
      <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">DASHBOARD</h1>
        <p className="text-sm text-gray-600 mt-1">
          Welcome to your Dashboard! Access your progress, important information, digital signatures, and a variety of references to support your journey.
        </p>
      </div>

      {/* Current Status Section */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-800">Current Status</h2>
        <div className="bg-sage-50 border border-sage-200 rounded-md p-4">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">Application Status</span>
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">COMPLETED</span>
          </div>
          <div className="w-full bg-sage-200 rounded-full h-1.5 mt-3">
            <div className="bg-sage-600 h-1.5 rounded-full w-full"></div>
          </div>
        </div>
      </div>

      {/* Next Steps Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">Next Steps</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Initial Authentication */}
          <Card className="p-4 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 bg-sage-50 rounded-md flex items-center justify-center border border-sage-200">
                <svg className="h-4 w-4 text-sage-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium">Initial Authentication</h3>
          </Card>
          
          {/* Sign Agreement */}
          <Card className="p-4 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 bg-sage-50 rounded-md flex items-center justify-center border border-sage-200">
                <svg className="h-4 w-4 text-sage-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium">Sign Agreement</h3>
          </Card>
          
          {/* Sign Agreement (duplicate for UI) */}
          <Card className="p-4 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 bg-sage-50 rounded-md flex items-center justify-center border border-sage-200">
                <svg className="h-4 w-4 text-sage-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium">Sign Agreement</h3>
          </Card>
          
          {/* Sign Agreement (last one) */}
          <Card className="p-4 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 bg-sage-50 rounded-md flex items-center justify-center border border-sage-200">
                <svg className="h-4 w-4 text-sage-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <svg className="h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium">Sign Agreement</h3>
          </Card>
        </div>

        {/* Second row of steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Make Appointment */}
          <Card className="p-4 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 bg-sage-50 rounded-md flex items-center justify-center border border-sage-200">
                <svg className="h-4 w-4 text-sage-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500">Action needed</span>
            </div>
            <h3 className="text-sm font-medium">Make an Appointment</h3>
          </Card>
          
          {/* Upload File */}
          <Card className="p-4 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 bg-sage-50 rounded-md flex items-center justify-center border border-sage-200">
                <svg className="h-4 w-4 text-sage-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <span className="text-xs text-gray-500">Waiting</span>
            </div>
            <h3 className="text-sm font-medium">Upload File</h3>
          </Card>
          
          {/* Upload File (duplicate for UI) */}
          <Card className="p-4 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 bg-sage-50 rounded-md flex items-center justify-center border border-sage-200">
                <svg className="h-4 w-4 text-sage-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <span className="text-xs text-gray-500">Waiting</span>
            </div>
            <h3 className="text-sm font-medium">Upload File</h3>
          </Card>
          
          {/* Upload File (last one) */}
          <Card className="p-4 flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <div className="w-8 h-8 bg-sage-50 rounded-md flex items-center justify-center border border-sage-200">
                <svg className="h-4 w-4 text-sage-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <span className="text-xs text-gray-500">Waiting</span>
            </div>
            <h3 className="text-sm font-medium">Upload File</h3>
          </Card>
        </div>
      </div>
      
      {/* Recent Updates Section */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-800">Recent Updates</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* New Document Uploaded */}
          <Card className="p-4 flex items-start space-x-4">
            <div className="p-2 bg-sage-50 rounded-md border border-sage-200">
              <svg className="h-5 w-5 text-sage-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium">New Document Uploaded</h3>
                <span className="text-xs text-gray-500">2 days ago</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">A new document has been uploaded to your account</p>
            </div>
          </Card>
          
          {/* Legal Contract Approved */}
          <Card className="p-4 flex items-start space-x-4">
            <div className="p-2 bg-sage-50 rounded-md border border-sage-200">
              <svg className="h-5 w-5 text-sage-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-sm font-medium">Legal Contract Approved</h3>
                <span className="text-xs text-gray-500">yesterday</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">The contract has been approved by both parties</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
    </AuthGuard>
  )
}

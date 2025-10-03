'use client'

import * as React from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import ManagerLayout from '@/components/manager-layout'

interface Document {
  name: string
  type: string
  status: string
  uploadedBy: string
  clientName: string
}

const mockDocuments: Document[] = [
  {
    name: 'Passport',
    type: 'Identification',
    status: 'Review Needed',
    uploadedBy: 'John Doe',
    clientName: 'John Doe',
  },
  {
    name: 'Agreement',
    type: 'Legal Document',
    status: 'Awaiting Clients',
    uploadedBy: 'John Doe',
    clientName: 'John Doe',
  },
  {
    name: 'Medical Records',
    type: 'Medical',
    status: 'Viewed',
    uploadedBy: 'John Doe',
    clientName: 'John Doe',
  },
  // Repeat the same pattern for demonstration
  ...Array(4).fill(null).map(() => ({
    name: 'Passport',
    type: 'Identification',
    status: 'Review Needed',
    uploadedBy: 'John Doe',
    clientName: 'John Doe',
  }))
]

const documentTypes = [
  { label: 'All', value: 'all' },
  { label: 'Legal Documents', value: 'legal' },
  { label: 'Medical Records', value: 'medical' },
  { label: 'Identification', value: 'identification' },
  { label: 'Photos', value: 'photos' },
]

export default function Documents() {
  const [activeTab, setActiveTab] = React.useState('client')
  const [searchTerm, setSearchTerm] = React.useState('')
  const [selectedType, setSelectedType] = React.useState('all')

  return (
    <ManagerLayout>
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-medium">Documents</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              className="w-[240px] pl-9"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs and Filters */}
        <div className="mb-6 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="client">Client</TabsTrigger>
              <TabsTrigger value="surrogate">Surrogate</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-2">
            {documentTypes.map(type => (
              <Button
                key={type.value}
                variant={selectedType === type.value ? "default" : "outline"}
                onClick={() => setSelectedType(type.value)}
                size="sm"
              >
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Uploaded By</TableHead>
                <TableHead>Client Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockDocuments.map((doc, index) => (
                <TableRow key={index}>
                  <TableCell>{doc.name}</TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.status}</TableCell>
                  <TableCell>{doc.uploadedBy}</TableCell>
                  <TableCell>{doc.clientName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Add Document Button */}
        <div className="mt-6">
          <Button variant="outline" size="sm" className="bg-sage-50 text-sage-700">
            Add Document
          </Button>
        </div>
      </div>
    </ManagerLayout>
  )
}

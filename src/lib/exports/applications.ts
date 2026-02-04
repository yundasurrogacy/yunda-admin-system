import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import type { Application } from '@/types/applications'

interface ExportRow {
  id: number
  type: string
  status: string
  name: string
  email: string
  phone: string
  createdAt: string
}

function mapApplicationToRow(app: Application): ExportRow {
  const data = app.application_data as any
  const isSurrogate = app.application_type === 'surrogate_mother'
  let name = ''
  let email = ''
  let phone = ''

  if (isSurrogate) {
    const generalInfo = data?.gc_intake?.general_info || {}
    name = generalInfo.full_name || ''
    email = generalInfo.email || ''
    phone = [generalInfo.country_code, generalInfo.phone].filter(Boolean).join(' ').trim()
  }
  else {
    const basicInfo = data?.basic_information || {}
    const contactInfo = data?.contact_information || {}
    name = [basicInfo.firstName, basicInfo.lastName].filter(Boolean).join(' ').trim()
    email = contactInfo.email_address || ''
    phone = [contactInfo.cell_phone_country_code, contactInfo.cell_phone].filter(Boolean).join(' ').trim()
  }

  return {
    id: app.id,
    type: app.application_type,
    status: app.status,
    name: name || '—',
    email: email || '—',
    phone: phone || '—',
    createdAt: new Date(app.created_at).toLocaleString(),
  }
}

export function exportApplicationsToExcel(applications: Application[], filename: string = 'applications.xlsx') {
  const rows = applications.map(mapApplicationToRow)
  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications')
  XLSX.writeFile(workbook, filename)
}

export function exportApplicationsToPdf(applications: Application[], filename: string = 'applications.pdf') {
  const rows = applications.map(mapApplicationToRow)
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
    format: 'a4',
  })

  autoTable(doc, {
    head: [['ID', 'Type', 'Status', 'Name', 'Email', 'Phone', 'Submitted At']],
    body: rows.map(row => [
      row.id,
      row.type,
      row.status,
      row.name,
      row.email,
      row.phone,
      row.createdAt,
    ]),
    styles: {
      fontSize: 9,
    },
    headStyles: {
      fillColor: [164, 176, 160],
    },
    startY: 40,
  })

  doc.save(filename)
}

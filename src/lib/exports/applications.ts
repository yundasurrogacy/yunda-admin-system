import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'
import type { Application } from '@/types/applications'

interface FlattenedRow {
  id: number
  type: string
  status: string
  createdAt: string
  field: string
  value: string
}

export interface DetailExportRow {
  section: string
  label: string
  value: string
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined)
    return ''
  if (typeof value === 'boolean')
    return value ? 'Yes' : 'No'
  if (typeof value === 'number')
    return String(value)
  if (typeof value === 'string')
    return value
  if (Array.isArray(value))
    return value.map(item => formatValue(item)).filter(Boolean).join(', ')
  if (typeof value === 'object')
    return JSON.stringify(value)
  return String(value)
}

function flattenObject(
  obj: Record<string, any>,
  prefix: string = '',
  rows: Array<{ field: string, value: string }> = [],
) {
  Object.entries(obj || {}).forEach(([key, value]) => {
    const field = prefix ? `${prefix}.${key}` : key
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (item && typeof item === 'object') {
          flattenObject(item, `${field}[${index}]`, rows)
        }
        else {
          rows.push({ field: `${field}[${index}]`, value: formatValue(item) })
        }
      })
      if (!value.length)
        rows.push({ field, value: '' })
      return
    }
    if (value && typeof value === 'object') {
      flattenObject(value, field, rows)
      return
    }
    rows.push({ field, value: formatValue(value) })
  })
  return rows
}

function buildFlattenedRows(app: Application): FlattenedRow[] {
  const createdAt = new Date(app.created_at).toLocaleString()
  const flattened = flattenObject(app.application_data as any)
  if (!flattened.length) {
    return [{
      id: app.id,
      type: app.application_type,
      status: app.status,
      createdAt,
      field: 'application_data',
      value: '',
    }]
  }
  return flattened.map(item => ({
    id: app.id,
    type: app.application_type,
    status: app.status,
    createdAt,
    field: item.field,
    value: item.value,
  }))
}

export function exportApplicationsToExcel(applications: Application[], filename: string = 'applications.xlsx') {
  const rows = applications.flatMap(buildFlattenedRows)
  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Applications')
  XLSX.writeFile(workbook, filename)
}

export function exportApplicationsToPdf(applications: Application[], filename: string = 'applications.pdf') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  })

  let currentY = 40
  applications.forEach((app, index) => {
    if (index > 0)
      doc.addPage()

    doc.setFontSize(12)
    doc.text(
      `Application #${app.id} (${app.application_type}) - ${app.status}`,
      40,
      currentY,
    )
    currentY += 16
    doc.setFontSize(10)
    doc.text(`Submitted: ${new Date(app.created_at).toLocaleString()}`, 40, currentY)
    currentY += 12

    const rows = buildFlattenedRows(app).map(row => [row.field, row.value])
    autoTable(doc, {
      head: [['Field', 'Value']],
      body: rows,
      styles: { fontSize: 8, cellPadding: 4 },
      headStyles: { fillColor: [164, 176, 160] },
      startY: currentY + 8,
      margin: { left: 40, right: 40 },
    })
    currentY = 40
  })

  doc.save(filename)
}

export function exportDetailToExcel(rows: DetailExportRow[], filename: string = 'application-detail.xlsx') {
  const worksheet = XLSX.utils.json_to_sheet(rows)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Application Detail')
  XLSX.writeFile(workbook, filename)
}

/** 固定列导出：表头顺序与 row 键顺序一致，一行一个孕妈，便于批量导出与合并 */
export function exportSurrogateDetailFixedToExcel(
  headers: string[],
  rows: Record<string, string>[],
  filename: string = 'surrogate-detail-fixed.xlsx',
) {
  const data = rows.map((row) => headers.map((h) => row[h] ?? ''))
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, '孕妈详情')
  XLSX.writeFile(workbook, filename)
}

export function exportDetailToPdf(title: string, rows: DetailExportRow[], filename: string = 'application-detail.pdf') {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  })
  doc.setFontSize(12)
  doc.text(title, 40, 40)
  autoTable(doc, {
    head: [['Section', 'Field', 'Value']],
    body: rows.map(row => [row.section, row.label, row.value]),
    styles: { fontSize: 8, cellPadding: 4 },
    headStyles: { fillColor: [164, 176, 160] },
    startY: 60,
    margin: { left: 40, right: 40 },
  })
  doc.save(filename)
}

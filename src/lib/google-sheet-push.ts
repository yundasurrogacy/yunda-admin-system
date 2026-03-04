/**
 * 代孕母申请提交后推送到 Google Sheet
 * 数据格式与孕母表单详情页导出的 Excel 一致（surrogate-fixed-rows）
 */
import type { Application } from '@/types/applications'
import { buildSurrogateDetailFixedRow, parseSurrogateApplicationData } from '@/lib/exports/surrogate-fixed-rows'
import { fetchWithTimeout } from '@/lib/fetch-with-timeout'

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzm5c5coyW1uu1hBjr0d3inYkUoxhESrztSyC63OxdE364u6Keo8R6xQSR-eVJoItdZdw/exec'
const PUSH_TIMEOUT_MS = 15000

/** 简单翻译：返回 fallback（API 环境无 i18n，使用英文） */
function simpleT(key: string, opts?: { defaultValue?: string }) {
  return opts?.defaultValue ?? key
}

export async function pushSurrogateApplicationToGoogleSheet(
  application: Application,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const parsedData = parseSurrogateApplicationData(application)
    if (!parsedData.isGcIntake) {
      return { ok: false, error: 'Only gc_intake format is supported' }
    }
    const { headers, row } = buildSurrogateDetailFixedRow(
      application,
      parsedData,
      simpleT as any,
    )
    const res = await fetchWithTimeout(
      GOOGLE_SCRIPT_URL,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headers, row }),
      },
      PUSH_TIMEOUT_MS,
    )
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}` }
    }
    return { ok: true }
  }
  catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[Google Sheet] push failed:', msg)
    return { ok: false, error: msg }
  }
}

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBooleanLabel(
  value: boolean | null | undefined,
  t: (key: string, options?: Record<string, unknown>) => string,
  options?: { fallbackKey?: string },
) {
  if (value === true)
    return t('yes', { defaultValue: 'Yes' })
  if (value === false)
    return t('no', { defaultValue: 'No' })
  const fallbackKey = options?.fallbackKey ?? 'notAvailable'
  return t(fallbackKey, { defaultValue: 'N/A' })
}

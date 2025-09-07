import * as React from "react"
import { toast } from "@/components/ui/toast"

export interface ToastProps {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

export function useToast() {
  const showToast = React.useCallback(({ title, description, variant = "default", duration = 3000 }: ToastProps) => {
    toast({
      title,
      description,
      variant,
      duration,
    })
  }, [])

  return { toast: showToast }
}

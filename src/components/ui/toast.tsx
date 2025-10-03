import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cn } from "@/lib/utils"

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> & {
    variant?: "default" | "destructive"
    style?: React.CSSProperties
  }
>(({ className, variant = "default", style, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(
        "z-50 flex max-w-md items-center rounded-md border border-gray-200 bg-white px-6 py-4 shadow-lg",
        variant === "destructive" &&
          "border-red-600 bg-red-50 text-red-900",
        variant === "default" &&
          "border-green-200 bg-green-50 text-green-900",
        className
      )}
      style={style}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

export const toast = ({
  title,
  description,
  variant = "default",
  duration = 3000,
}: ToastProps) => {
  const toastEl = document.createElement("div")
  document.body.appendChild(toastEl)

  const toastComponent = (
    <Toast variant={variant}>
      {title && <ToastTitle>{title}</ToastTitle>}
      {description && <ToastDescription>{description}</ToastDescription>}
    </Toast>
  )

  // 使用 ReactDOM.render 渲染 toast
  // 在实际项目中，你可能需要使用更复杂的 toast 管理系统
  // 比如 react-hot-toast 或 react-toastify
  // 这里只是一个简化的示例
  // ReactDOM.render(toastComponent, toastEl)

  setTimeout(() => {
    document.body.removeChild(toastEl)
  }, duration)
}

export { Toast, ToastTitle, ToastDescription }

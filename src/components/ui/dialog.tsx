import * as React from "react"

export interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.3)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={() => onOpenChange(false)}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          minWidth: 400,
          minHeight: 100,
          boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
          padding: 24,
          position: "relative",
        }}
        onClick={e => e.stopPropagation()}
      >
        {children}
        <button
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "transparent",
            border: "none",
            fontSize: 20,
            cursor: "pointer",
          }}
          onClick={() => onOpenChange(false)}
        >×</button>
      </div>
    </div>
  )
}

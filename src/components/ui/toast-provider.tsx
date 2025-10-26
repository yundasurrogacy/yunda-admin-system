"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
import { Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";
import * as ToastPrimitives from "@radix-ui/react-toast";

interface ToastItem {
  id: number;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

interface ToastContextProps {
  showToast: (toast: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToastProvider = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToastProvider must be used within ToastProvider");
  return ctx;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const showToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, toast.duration || 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ToastPrimitives.Provider swipeDirection="right">
        {children}
        {/* 自定义的居中toast容器 */}
        <div style={{ 
          position: "fixed", 
          top: "50%", 
          left: "50%", 
          transform: "translate(-50%, -50%)", 
          zIndex: 10000,
          pointerEvents: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          width: "fit-content"
        }}>
          {toasts.map((toast) => (
            <Toast 
              key={toast.id} 
              variant={toast.variant} 
              style={{ 
                pointerEvents: "auto",
                minWidth: "320px",
                maxWidth: "500px",
                textAlign: "center",
                animation: "slideInFromTop 0.3s ease-out"
              }}
            >
              {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
              {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
            </Toast>
          ))}
        </div>
        {/* 完全隐藏默认的Viewport */}
        <ToastPrimitives.Viewport 
          style={{ 
            position: "fixed",
            top: "-9999px",
            left: "-9999px",
            visibility: "hidden",
            pointerEvents: "none",
            zIndex: -1
          }} 
        />
      </ToastPrimitives.Provider>
    </ToastContext.Provider>
  );
};

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
        <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9999 }}>
          {toasts.map((toast) => (
            <Toast key={toast.id} variant={toast.variant}>
              {toast.title && <ToastTitle>{toast.title}</ToastTitle>}
              {toast.description && <ToastDescription>{toast.description}</ToastDescription>}
            </Toast>
          ))}
        </div>
        <ToastPrimitives.Viewport />
      </ToastPrimitives.Provider>
    </ToastContext.Provider>
  );
};

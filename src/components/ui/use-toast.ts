import { useContext } from "react";
import { useToastProvider } from "@/components/ui/toast-provider";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

export function useToast() {
  const { showToast } = useToastProvider();
  return {
    toast: showToast,
  };
}

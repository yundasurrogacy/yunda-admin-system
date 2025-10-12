
import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast-provider";
import { GlobalAuthCheck } from "@/components/global-auth-check";
import { SidebarProvider } from "@/context/sidebar-context";
import { AppTypeProvider } from "@/context/app-type-context";
import LayoutWithGlobalSidebarHeader from "@/components/LayoutWithGlobalSidebarHeader";
// import { usePathname } from "next/navigation";

export const metadata: Metadata = {
  title: "云达代孕管理系统",
  description: "专业的代孕服务管理平台",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // 全局 sidebar/header 持久化渲染，sidebar config 根据 appType 自动切换
  return (
    <html lang="zh-CN">
      <body
        className="antialiased"
        style={{ background: 'rgba(250,241,224,0.25)' }}
      >
        <ToastProvider>
          <AppTypeProvider>
            <SidebarProvider>
              <LayoutWithGlobalSidebarHeader>{children}</LayoutWithGlobalSidebarHeader>
            </SidebarProvider>
          </AppTypeProvider>
        </ToastProvider>
      </body>
    </html>
  );
}


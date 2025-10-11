
import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast-provider";
import { GlobalAuthCheck } from "@/components/global-auth-check";

export const metadata: Metadata = {
  title: "云达代孕管理系统",
  description: "专业的代孕服务管理平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className="antialiased"
        style={{ background: 'rgba(250,241,224,0.25)' }}
      >
        <ToastProvider>
          <GlobalAuthCheck>
            {children}
          </GlobalAuthCheck>
        </ToastProvider>
      </body>
    </html>
  );
}

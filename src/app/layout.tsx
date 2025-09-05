import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

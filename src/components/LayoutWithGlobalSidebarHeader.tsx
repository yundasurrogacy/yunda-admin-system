"use client";

import { CommonSidebar } from "@/components/common-sidebar";
import { CommonHeader } from "@/components/common-header";
import { GlobalAuthCheck } from "@/components/global-auth-check";
import { useSidebar } from "@/context/sidebar-context";
import { useAppType } from "@/context/app-type-context";
import { getAdminSidebarConfig, getManagerSidebarConfig, getClientSidebarConfig, surrogacySidebarConfig } from "@/config/sidebar-config";

export default function LayoutWithGlobalSidebarHeader({ children }: { children: React.ReactNode }) {
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const { appType } = useAppType();
  // 根据 appType 自动切换 sidebar config
  let sidebarConfig = [];
  let sidebarType: "admin" | "client" | "manager" | "surrogacy" = "client";
  switch (appType) {
    case "admin":
      sidebarConfig = getAdminSidebarConfig();
      sidebarType = "admin";
      break;
    case "manager":
      sidebarConfig = getManagerSidebarConfig();
      sidebarType = "manager";
      break;
    case "client":
      sidebarConfig = getClientSidebarConfig();
      sidebarType = "client";
      break;
    case "surrogacy":
      sidebarConfig = surrogacySidebarConfig();
      sidebarType = "surrogacy";
      break;
    default:
      sidebarConfig = getClientSidebarConfig();
      sidebarType = "client";
  }
  return (
    <>
      {/* Sidebar 固定并层级高于 header */}
      <div style={{ position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 100, width: '16rem', pointerEvents: sidebarOpen ? 'auto' : 'none' }}>
        <CommonSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          groups={sidebarConfig}
          type={sidebarType}
        />
      </div>
      {/* Header 固定在顶部，zIndex 较低 */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, width: '100%' }}>
        <CommonHeader showMenuButton={true} />
      </div>
      <GlobalAuthCheck>
        <div style={{ paddingTop: '80px' /* header高度可根据实际调整 */ }}>
          {children}
        </div>
      </GlobalAuthCheck>
    </>
  );
}

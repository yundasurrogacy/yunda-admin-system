"use client"
import { cn } from "../lib/utils"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { useState } from "react"

// 定义菜单项类型
interface MenuItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

// 定义菜单分组类型
interface MenuGroup {
  items: MenuItem[];
}

interface CommonSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  theme?: "sage" | "blue" | "purple" | "default";
  groups: MenuGroup[]; // 菜单分组
  title?: string;
  type?: "manager" | "admin" | "client" | "surrogacy";
}

export function CommonSidebar({ 
  isOpen, 
  onClose, 
  theme = "sage",
  groups = [],
  title = "YUNDA",
  type = "client"
}: CommonSidebarProps) {
  const safeGroups = Array.isArray(groups) ? groups : [];
  const pathname = usePathname()

    const router = useRouter();

    // 菜单点击统一处理，未登录跳转登录页
    const [showLoginTip, setShowLoginTip] = useState(false);
    const handleMenuClick = (href: string) => {
      const role = localStorage.getItem("userRole")
      const email = localStorage.getItem("userEmail")
      if (role && email) {
        router.push(href)
        onClose()
      } else {
        setShowLoginTip(true)
      }
    }
  // ...existing code...

  // 统一使用设计规范的颜色
  const getThemeClasses = () => {
    // 所有端使用统一的背景色 #BFC9BF
    return {
      bg: "bg-[#BFC9BF]",
      border: "border-gray-200",
      itemBorder: "border-gray-200",
      text: "text-[#271F18] font-serif",
      hoverBg: "hover:bg-gray-200/50",
      activeBg: "bg-gray-200/50",
      activeText: "text-[#271F18] font-serif"
    }
  }

  const themeClasses = getThemeClasses()

  return (
    <>
      {/* 登录提示浮层（非模态） */}
      {showLoginTip && (
        <div className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="bg-white rounded-lg shadow-lg px-8 py-6 min-w-[260px] flex flex-col items-center border border-sage-300">
            <div className="text-base font-semibold mb-3 text-[#271F18]">请先登录后再访问页面</div>
            <div className="flex gap-4 mt-2">
              <button
                className="px-5 py-1.5 bg-sage-600 text-white rounded font-serif hover:bg-sage-700 transition"
                onClick={() => {
                  setShowLoginTip(false)
                  // let loginPath = "/client/login"
                  // if (type === "admin") loginPath = "/admin/login"
                  // else if (type === "manager") loginPath = "/manager/login"
                  // else if (type === "surrogacy") loginPath = "/surrogacy/login"
                  // router.push(loginPath)
                  onClose()
                }}
              >
                去登录
              </button>
              <button
                className="px-5 py-1.5 bg-gray-100 text-sage-700 rounded font-serif border border-sage-300 hover:bg-gray-200 transition"
                onClick={() => setShowLoginTip(false)}
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 半透明遮罩，仅在移动端显示sidebar时可见 */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden" 
          onClick={onClose}
        />
      )}
      
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-full w-64 transform transition-transform duration-300 ease-in-out shadow-xl",
          themeClasses.bg,
          `border-r ${themeClasses.border}`,
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Sidebar Header */}
        <div className={cn("h-16 flex items-center justify-center border-b", themeClasses.border)}>
          <span className={cn("font-semibold text-lg tracking-wider", themeClasses.text)}>
            {/* {title} */}
          </span>
        </div>

        {/* Sidebar Navigation */}
        <nav className="h-full overflow-y-auto pb-20">
          {type === "manager" ? (
            // Manager端特殊样式，带分隔线
            <div className="space-y-4">
              {safeGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-1">
                  {group.items.map((item) => (
                    <div
                      key={item.href}
                      className={cn(
                        "px-6 py-3 text-sm font-medium cursor-pointer transition-colors duration-200",
                        themeClasses.text,
                        themeClasses.hoverBg,
                        pathname === item.href && cn(themeClasses.activeBg, themeClasses.activeText, "font-semibold"),
                      )}
                      onClick={() => handleMenuClick(item.href)}
                    >
                      <div className="flex items-center gap-3">
                        {item.label}
                      </div>
                    </div>
                  ))}
                  {groupIndex < safeGroups.length - 1 && (
                    <div className="mx-4 my-4 border-t border-gray-200" />
                  )}
                </div>
              ))}
            </div>
          ) : type === "admin" ? (
            // Admin端特殊样式
            <div className="space-y-1">
              {safeGroups.map((group, groupIndex) => (
                <div key={groupIndex}>
                  {group.items.map((item) => (
                    <div
                      key={item.href}
                      className={cn(
                        "px-6 py-2.5 text-sm font-medium cursor-pointer transition-colors duration-200",
                        themeClasses.text,
                        themeClasses.hoverBg,
                        pathname === item.href && cn(themeClasses.activeBg, themeClasses.activeText, "font-semibold"),
                      )}
                      onClick={() => handleMenuClick(item.href)}
                    >
                      <div className="flex items-center gap-3">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            // Client和Surrogate端默认样式
            <div>
              {safeGroups.map((group, groupIndex) => (
                <div 
                  key={groupIndex} 
                  className={cn(
                    "py-2",
                    groupIndex < safeGroups.length - 1 ? `border-b ${themeClasses.itemBorder}` : ""
                  )}
                >
                  {group.items.map((item) => (
                    <div
                      key={item.href}
                      className={cn(
                        "px-6 py-2.5 text-sm font-medium cursor-pointer transition-colors duration-200",
                        themeClasses.text,
                        themeClasses.hoverBg,
                        pathname === item.href && cn(themeClasses.activeBg, themeClasses.activeText, "font-semibold"),
                      )}
                      onClick={() => handleMenuClick(item.href)}
                    >
                      <div className="flex items-center gap-3">
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </nav>

        {/* 关闭按钮 - 始终显示 */}
        <button
          className={cn(
            "absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center",
            themeClasses.hoverBg
          )}
          onClick={onClose}
        >
          <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </aside>
    </>
  )
}

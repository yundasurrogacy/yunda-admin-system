"use client"
import { cn } from "../lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

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
  groups,
  title = "YUNDA",
  type = "client"
}: CommonSidebarProps) {
  const pathname = usePathname()

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
              {groups.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-1">
                  {group.items.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <div
                        className={cn(
                          "px-6 py-3 text-sm font-medium cursor-pointer transition-colors duration-200",
                          themeClasses.text,
                          themeClasses.hoverBg,
                          pathname === item.href && cn(themeClasses.activeBg, themeClasses.activeText, "font-semibold"),
                        )}
                        onClick={onClose}
                      >
                        <div className="flex items-center gap-3">
                          {/* 不显示图标 */}
                          {item.label}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {groupIndex < groups.length - 1 && (
                    <div className="mx-4 my-4 border-t border-gray-200" />
                  )}
                </div>
              ))}
            </div>
          ) : type === "admin" ? (
            // Admin端特殊样式
            <div className="space-y-1">
              {groups.map((group, groupIndex) => (
                <div key={groupIndex}>
                  {group.items.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <div
                        className={cn(
                          "px-6 py-2.5 text-sm font-medium cursor-pointer transition-colors duration-200",
                          themeClasses.text,
                          themeClasses.hoverBg,
                          pathname === item.href && cn(themeClasses.activeBg, themeClasses.activeText, "font-semibold"),
                        )}
                        onClick={onClose}
                      >
                        <div className="flex items-center gap-3">
                          {/* 不显示图标 */}
                          {item.label}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            // Client和Surrogate端默认样式
            <div>
              {groups.map((group, groupIndex) => (
                <div 
                  key={groupIndex} 
                  className={cn(
                    "py-2",
                    groupIndex < groups.length - 1 ? `border-b ${themeClasses.itemBorder}` : ""
                  )}
                >
                  {group.items.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <div
                        className={cn(
                          "px-6 py-2.5 text-sm font-medium cursor-pointer transition-colors duration-200",
                          themeClasses.text,
                          themeClasses.hoverBg,
                          pathname === item.href && cn(themeClasses.activeBg, themeClasses.activeText, "font-semibold"),
                        )}
                        onClick={onClose}
                      >
                        <div className="flex items-center gap-3">
                          {/* 不显示图标 */}
                          {item.label}
                        </div>
                      </div>
                    </Link>
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

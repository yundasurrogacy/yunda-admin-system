import { cn } from "@/lib/utils"
import { Search } from "lucide-react"
import { useTranslation } from 'react-i18next'

interface PageHeaderProps {
  title: string
  onSearch?: (value: string) => void
  showSearch?: boolean
  rightContent?: React.ReactNode
  className?: string
}

interface PageContentProps {
  children: React.ReactNode
  className?: string
}

export function PageHeader({ title, onSearch, showSearch = false, rightContent, className }: PageHeaderProps) {
  const { t } = useTranslation('common');
  
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <h1 className="text-2xl md:text-3xl font-normal tracking-wide text-sage-800">{title}</h1>

      <div className="flex items-center gap-4">
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sage-400 w-4 h-4" />
            <input
              type="text"
              onChange={(e) => onSearch?.(e.target.value)}
              placeholder={t('pageLayout.searchPlaceholder', 'Search...')}
              className="pl-10 pr-4 py-2 border border-sage-200 rounded-full bg-sage-100/50 text-sage-800 placeholder-sage-500 focus:outline-none focus:ring-2 focus:ring-sage-300"
            />
          </div>
        )}
        {rightContent}
      </div>
    </div>
  )
}

export function PageContent({ children, className }: PageContentProps) {
  return (
    <div className={cn("space-y-6 px-6 md:px-8 py-3 md:py-4", className)}>
      {children}
    </div>
  )
}

"use client"

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LoadingSpinner } from './ui/loading-spinner'
import { useToast } from '@/hooks/useToast'

interface LoginFormProps {
  onSubmit: (username: string, password: string) => Promise<void>
  loading?: boolean
  className?: string
}

export function LoginForm({ onSubmit, loading = false, className }: LoginFormProps) {
  const { t } = useTranslation('common')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [formErrors, setFormErrors] = useState<{username?: string, password?: string}>({})
  const { toast } = useToast()

  const validateForm = () => {
    const errors: {username?: string, password?: string} = {}
    
    if (!username.trim()) {
      errors.username = t('emailRequired', { defaultValue: '请输入邮箱' })
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
      errors.username = t('emailInvalid', { defaultValue: '邮箱格式不正确' })
    }
    
    if (!password.trim()) {
      errors.password = t('passwordRequired', { defaultValue: '请输入密码' })
    } else if (password.length < 6) {
      errors.password = t('passwordTooShort', { defaultValue: '密码长度至少6位' })
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: t('formValidationError', { defaultValue: '表单验证失败' }),
        description: t('pleaseCheckInput', { defaultValue: '请检查输入信息' }),
        variant: 'destructive'
      })
      return
    }

    try {
      await onSubmit(username.trim(), password)
    } catch (error) {
      // 错误处理由父组件负责
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-4 ${className || ''}`}
    >
      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="email"
            className="block text-base font-medium text-sage-800 mb-2"
          >
            {t('emailLabel', { defaultValue: '邮箱' })}
          </label>
          <input
            id="email"
            type="email"
            required
            value={username}
            onChange={e => {
              setUsername(e.target.value)
              if (formErrors.username) {
                setFormErrors(prev => ({ ...prev, username: undefined }))
              }
            }}
            disabled={loading}
            style={{
              background: "#EAE9D0",
              border: formErrors.username ? "2px solid #ef4444" : "none",
              borderRadius: 18,
              fontSize: 20,
              height: 56,
              width: "100%",
              padding: "0 20px"
            }}
            className="font-medium text-sage-800 transition-colors disabled:opacity-50"
            placeholder={t('emailPlaceholder', { defaultValue: '请输入邮箱地址' })}
          />
          {formErrors.username && (
            <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.username}</p>
          )}
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-base font-medium text-sage-800 mb-2"
          >
            {t('passwordLabel', { defaultValue: '密码' })}
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={e => {
              setPassword(e.target.value)
              if (formErrors.password) {
                setFormErrors(prev => ({ ...prev, password: undefined }))
              }
            }}
            disabled={loading}
            style={{
              background: "#EAE9D0",
              border: formErrors.password ? "2px solid #ef4444" : "none",
              borderRadius: 18,
              fontSize: 20,
              height: 56,
              width: "100%",
              padding: "0 20px"
            }}
            className="font-medium text-sage-800 transition-colors disabled:opacity-50"
            placeholder={t('passwordPlaceholder', { defaultValue: '请输入密码' })}
          />
          {formErrors.password && (
            <p className="text-red-500 text-sm mt-1 font-medium">{formErrors.password}</p>
          )}
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{
          background: loading ? "#9CA3AF" : "#BFC9BF",
          color: "#fff",
          borderRadius: 18,
          padding: "18px 0",
          fontSize: 22,
          fontWeight: 600,
          width: "33.33%",
          alignSelf: "left",
          border: "none",
          boxShadow: loading ? "none" : "0 6px 24px rgba(191,201,191,0.22)",
          cursor: loading ? "not-allowed" : "pointer",
          margin: "auto 0",
          transition: "all 0.3s ease"
        }}
        className="font-semibold flex items-center justify-center hover:shadow-lg text-sage-800"
      >
        {loading ? (
          <div className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            <span>{t('loggingIn', { defaultValue: '登录中...' })}</span>
          </div>
        ) : (
          t('loginButton', { defaultValue: '登录' })
        )}
      </button>
    </form>
  )
}
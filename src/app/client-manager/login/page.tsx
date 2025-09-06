'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getHasuraClient } from '@/config-lib/hasura-graphql-client/hasura-graphql-client'

export default function ManagerLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError('')
      
      const hasuraClient = getHasuraClient()
      const result = await hasuraClient.datas({
        table: 'managers',
        args: {
          where: {
            email: { _eq: email },
            password: { _eq: password } // 实际应用中应该使用加密密码
          }
        },
        datas_fields: ['id', 'email']
      })
      
      if (result && result.length > 0) {
        // 登录成功，重定向到仪表盘
        router.push('/client-manager/dashboard')
      } else {
        setError('邮箱或密码错误')
      }
    } catch (err) {
      console.error('登录失败:', err)
      setError('登录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      {/* 左侧：品牌展示区 */}
      <div className="relative hidden bg-gray-900 md:block">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-20" />
        <div className="relative flex h-full flex-col justify-between p-8">
          <div className="flex items-center space-x-3">
            <Image
              src="/yunda-logo.svg"
              alt="Yunda Logo"
              width={40}
              height={40}
              className="brightness-0 invert"
            />
            <span className="text-2xl font-semibold text-white">YUNDA</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white">
              Welcome back to<br />Yunda Client Manager
            </h1>
            <p className="text-gray-400">
              Manage your clients and surrogates efficiently with our comprehensive management system.
            </p>
          </div>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} Yunda. All rights reserved.
          </div>
        </div>
      </div>

      {/* 右侧：登录表单 */}
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-[420px] space-y-8">
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              Client Manager Login
            </h2>
            <p className="text-sm text-gray-500">
              Enter your email below to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <a
                    href="/client-manager/forgot-password"
                    className="text-sm text-gray-500 hover:text-gray-900"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-2"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* 语言切换 */}
          <div className="flex justify-center space-x-4 text-sm text-gray-500">
            <button className="hover:text-gray-900">English</button>
            <span>/</span>
            <button className="hover:text-gray-900">中文</button>
          </div>

          {/* 移动端 Logo */}
          <div className="flex items-center justify-center space-x-2 md:hidden">
            <Image
              src="/yunda-logo.svg"
              alt="Yunda Logo"
              width={24}
              height={24}
            />
            <span className="text-sm font-medium">YUNDA</span>
          </div>
        </div>
      </div>
    </div>
  )
}

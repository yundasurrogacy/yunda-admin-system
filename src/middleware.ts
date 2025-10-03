import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 定义需要保护的路由
const protectedPaths = {
  admin: ['/admin/dashboard', '/admin/client-manager', '/admin/surrogacy'],
  client: ['/client/dashboard', '/client/profile', '/client/cases'],
  manager: ['/client-manager/my-cases', '/client-manager/dashboard'],
  surrogacy: ['/surrogacy/dashboard', '/surrogacy/journal', '/surrogacy/profile']
}

// 定义登录页面路径
const loginPaths = {
  admin: '/admin/login',
  client: '/client/login', 
  manager: '/client-manager/login',
  surrogacy: '/surrogacy/login'
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 跳过静态资源和API路由
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.') // 静态文件
  ) {
    return NextResponse.next()
  }

  // 检查是否为保护的路由
  let requiredRole: string | null = null
  for (const [role, paths] of Object.entries(protectedPaths)) {
    if (paths.some(path => pathname.startsWith(path))) {
      requiredRole = role
      break
    }
  }

  // 如果不是保护的路由，允许访问
  if (!requiredRole) {
    return NextResponse.next()
  }

  // 检查用户认证状态（从cookie或header中获取）
  const userRole = request.cookies.get('userRole')?.value
  const userEmail = request.cookies.get('userEmail')?.value
  const userId = request.cookies.get('userId')?.value

  // 如果未认证，重定向到对应的登录页面
  if (!userRole || !userEmail || !userId) {
    const loginPath = loginPaths[requiredRole as keyof typeof loginPaths] || '/client/login'
    return NextResponse.redirect(new URL(loginPath, request.url))
  }

  // 检查角色权限
  if (userRole !== requiredRole) {
    const userLoginPath = loginPaths[userRole as keyof typeof loginPaths] || '/client/login'
    return NextResponse.redirect(new URL(userLoginPath, request.url))
  }

  // 认证通过，允许访问
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * 匹配所有路径除了:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
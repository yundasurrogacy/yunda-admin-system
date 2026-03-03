import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// 定义需要保护的路由
const protectedPaths = {
  admin: ['/admin/dashboard', '/admin/client-manager', '/admin/surrogacy'],
  client: ['/client/dashboard', '/client/profile', '/client/cases'],
  manager: ['/client-manager/my-cases', '/client-manager/dashboard'],
  surrogacy: ['/surrogacy/dashboard', '/surrogacy/journal', '/surrogacy/profile']
}

// 统一登录页，通过 role 参数预选端
const loginPaths = {
  admin: '/?role=admin',
  client: '/?role=client',
  manager: '/?role=manager',
  surrogacy: '/?role=surrogacy',
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

  // 多端 cookie 名称映射
  const cookieKeyMap: Record<string, { role: string, email: string, id: string }> = {
    admin: {
      role: 'userRole_admin',
      email: 'userEmail_admin',
      id: 'userId_admin',
    },
    client: {
      role: 'userRole_client',
      email: 'userEmail_client',
      id: 'userId_client',
    },
    manager: {
      role: 'userRole_manager',
      email: 'userEmail_manager',
      id: 'userId_manager',
    },
    surrogacy: {
      role: 'userRole_surrogacy',
      email: 'userEmail_surrogacy',
      id: 'userId_surrogacy',
    },
  }
  const keys = cookieKeyMap[requiredRole]
  const userRole = request.cookies.get(keys.role)?.value
  const userEmail = request.cookies.get(keys.email)?.value
  const userId = request.cookies.get(keys.id)?.value

  // 如果未认证，重定向到统一登录页并预选端
  if (!userRole || !userEmail || !userId) {
    const loginPath = loginPaths[requiredRole as keyof typeof loginPaths] || '/'
    return NextResponse.redirect(new URL(loginPath, request.url))
  }

  // 检查角色权限，角色不匹配时跳转到用户对应端的首页（由前端处理）
  if (userRole !== requiredRole) {
    const homePaths: Record<string, string> = {
      admin: '/admin/dashboard',
      client: '/client/dashboard',
      manager: '/client-manager/dashboard',
      surrogacy: '/surrogacy/dashboard',
    }
    const homePath = homePaths[userRole] || '/'
    return NextResponse.redirect(new URL(homePath, request.url))
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
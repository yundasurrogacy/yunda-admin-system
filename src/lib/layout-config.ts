// 布局配置
export const adminLayoutConfig = {
  // 未登录页面配置
  unauthenticated: {
    showHeader: true,
    isLoggedIn: false,
  },
  
  // 已登录页面配置
  authenticated: {
    showHeader: true,
    isLoggedIn: true,
  },
}

// 获取页面配置
export function getPageConfig(isAuthPage: boolean = true) {
  return isAuthPage ? adminLayoutConfig.authenticated : adminLayoutConfig.unauthenticated
}

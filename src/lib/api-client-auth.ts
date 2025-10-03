interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

interface LoginRequest {
  username: string
  password: string
}

interface LoginResponse {
  success: boolean
  manager?: {
    id: string
    email: string
    name?: string
  }
  parent?: {
    id: string
    email: string
    name?: string
  }
  surrogate?: {
    id: string
    email: string
    name?: string
  }
  error?: string
}

class ApiClient {
  private baseUrl: string

  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          error: data.error || `HTTP error! status: ${response.status}`
        }
      }

      return {
        success: true,
        data
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '网络请求失败'
      }
    }
  }

  // 管理员登录
  async adminLogin(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/admin-login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  // 客户登录
  async clientLogin(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/intended-parent-login', {
      method: 'POST',
      body: JSON.stringify({ email: credentials.username, password: credentials.password }),
    })
  }

  // 客户经理登录
  async managerLogin(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/client-manager-login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  // 代理母亲登录
  async surrogateLogin(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/surrogate-login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
  }

  // 验证令牌
  async validateToken(): Promise<ApiResponse<{ valid: boolean, user?: any }>> {
    return this.request('/validate-token', {
      method: 'GET',
    })
  }

  // 刷新令牌
  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return this.request('/refresh-token', {
      method: 'POST',
    })
  }
}

export const apiClient = new ApiClient()
export type { ApiResponse, LoginRequest, LoginResponse }
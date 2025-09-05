// src/services/api.ts
class ApiClient {
    private baseURL: string
  
    constructor(baseURL: string) {
      this.baseURL = baseURL
    }
  
    async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
      const url = `${this.baseURL}${endpoint}`
      
      const config: RequestInit = {
        ...options,
        credentials: 'include', // Для HTTP-Only cookies
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      }
  
      const response = await fetch(url, config)
      
      if (response.status === 401) {
        // Токен истёк, пытаемся обновить
        const refreshed = await this.refreshToken()
        if (refreshed) {
          // Повторяем запрос с новым токеном
          return this.request<T>(endpoint, options)
        } else {
          // Редирект на логин
          window.location.href = '/login'
          throw new Error('Authentication required')
        }
      }
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
  
      return response.json()
    }
  
    private async refreshToken(): Promise<boolean> {
      try {
        const response = await fetch(`${this.baseURL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include'
        })
        return response.ok
      } catch {
        return false
      }
    }
  }
  
  export const apiClient = new ApiClient(import.meta.env.VITE_API_URL || 'http://localhost:3001')
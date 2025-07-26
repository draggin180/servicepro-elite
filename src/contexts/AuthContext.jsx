import { createContext, useContext, useState, useEffect } from 'react'
import apiService from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        apiService.setToken(token)
        const response = await apiService.getCurrentUser()
        if (response.success) {
          setUser(response.user)
        } else {
          localStorage.removeItem('token')
          apiService.setToken(null)
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('token')
      apiService.setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setError(null)
      const response = await apiService.login({ email, password })
      
      if (response.success) {
        apiService.setToken(response.token)
        setUser(response.user)
        return { success: true, user: response.user }
      } else {
        setError(response.error || 'Login failed')
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const register = async (name, email, password) => {
    try {
      setError(null)
      const response = await apiService.register({ name, email, password })
      
      if (response.success) {
        apiService.setToken(response.token)
        setUser(response.user)
        return { success: true, user: response.user }
      } else {
        setError(response.error || 'Registration failed')
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Registration failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const completeOnboarding = async (onboardingData) => {
    try {
      setError(null)
      const response = await apiService.completeOnboarding(onboardingData)
      
      if (response.success) {
        setUser(response.user)
        return { success: true, user: response.user }
      } else {
        setError(response.error || 'Onboarding failed')
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Onboarding failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const updateProfile = async (profileData) => {
    try {
      setError(null)
      const response = await apiService.updateProfile(profileData)
      
      if (response.success) {
        setUser(response.user)
        return { success: true, user: response.user }
      } else {
        setError(response.error || 'Profile update failed')
        return { success: false, error: response.error }
      }
    } catch (error) {
      const errorMessage = error.message || 'Profile update failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    apiService.setToken(null)
    setUser(null)
    setError(null)
  }

  const clearError = () => {
    setError(null)
  }

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    completeOnboarding,
    updateProfile,
    clearError,
    isAuthenticated: !!user,
    isOnboardingComplete: user?.onboarding_completed || false
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}


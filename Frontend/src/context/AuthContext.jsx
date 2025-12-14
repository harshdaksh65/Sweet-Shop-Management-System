import React, { createContext, useEffect, useState } from 'react'
import axios from '../api/axiosconfig'

export const AuthDataContext = createContext()

function AuthContext({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refreshUser = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/auth/me')
      setUser(response.data?.user || null)
      setError(null)
    } catch (err) {
      setUser(null)
      if (err.response && err.response.status === 401) {
        setError('Not logged in')
      } else {
        setError('Failed to load user details')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  return (
    <AuthDataContext.Provider value={{ user, setUser, loading, error, refreshUser }}>
      {children}
    </AuthDataContext.Provider>
  )
}

export default AuthContext
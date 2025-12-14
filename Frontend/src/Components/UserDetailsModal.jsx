import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axiosconfig'
import { AuthDataContext } from '../context/AuthContext'

function UserDetailsModal({ show, onClose, user, loading, error }) {
  if (!show) return null

  const { refreshUser } = useContext(AuthDataContext)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [logoutError, setLogoutError] = useState(null)
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      setLogoutLoading(true)
      setLogoutError(null)
      await axios.post('/api/auth/logout')
      if (refreshUser) {
        await refreshUser()
      }
      if (onClose) {
        onClose()
      }
      navigate('/login')
    } catch (err) {
      setLogoutError('Failed to logout')
      console.error('Logout failed:', err)
    } finally {
      setLogoutLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 p-6 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md relative">
        <button
          className="absolute -top-3 -right-3 bg-white rounded-full hover:text-red-500 cursor-pointer w-8 h-8 flex items-center justify-center shadow-md text-gray-600 hover:bg-gray-100"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-2">User Details</h2>
        {logoutError && (
          <p className="text-xs text-red-500 mb-1">{logoutError}</p>
        )}
        {loading ? (
          <p className="text-sm text-gray-500">Loading user...</p>
        ) : user ? (
          <form className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={user.username}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <input
                type="text"
                value={user.role}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-100"
              />
            </div>
          </form>
        ) : (
          <p className="text-sm text-gray-500">
            {error || 'No user details available.'}
          </p>
        )}
        <button
          type="button"
          onClick={handleLogout}
          disabled={logoutLoading}
          className="mt-4 w-full bg-red-500 hover:bg-red-400 text-white font-semibold py-2 rounded-lg text-sm disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
        >
          {logoutLoading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  )
}

export default UserDetailsModal

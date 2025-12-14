import React from 'react'

function UserDetailsModal({ show, onClose, user, loading, error }) {
  if (!show) return null

  return (
    <div className="fixed inset-0 p-6 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md relative">
        <button
          className="absolute -top-3 -right-3 bg-white rounded-full hover:text-red-500 cursor-pointer w-8 h-8 flex items-center justify-center shadow-md text-gray-600 hover:bg-gray-100"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">User Details</h2>
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
          className="mt-4 w-full bg-red-500 hover:bg-red-400 text-white font-semibold py-2 rounded-lg text-sm cursor-not-allowed opacity-80"
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default UserDetailsModal

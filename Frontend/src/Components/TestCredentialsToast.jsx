import React, { useState } from 'react'

function TestCredentialsToast() {
  const [visible, setVisible] = useState(true)

  const handleClose = () => {
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-white border border-gray-200 shadow-xl rounded-lg">
      <div className="flex items-start p-4">
        <div className="flex-1 mr-2">
          <h3 className="text-sm font-semibold text-gray-800 mb-1">Test Login Credentials</h3>
          <p className="text-xs text-gray-500 mb-2">
            Use these accounts to login while testing the app or register with new account as user.
          </p>
          <div className="space-y-2 text-xs text-gray-700">
            <div>
              <p className="font-semibold text-gray-800">Admin</p>
              <p>Email: <span className="font-mono">harsh@admin.com</span></p>
              <p>Username: <span className="font-mono">harsh49</span></p>
              <p>Password: <span className="font-mono">123456</span></p>
            </div>
            <div>
              <p className="font-semibold text-gray-800">User</p>
              <p>Email: <span className="font-mono">user@test.com</span></p>
              <p>Username: <span className="font-mono">user01</span></p>
              <p>Password: <span className="font-mono">123456</span></p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleClose}
          className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label="Close test credentials notification"
        >
              &times;
        </button>
      </div>
    </div>
  )
}

export default TestCredentialsToast

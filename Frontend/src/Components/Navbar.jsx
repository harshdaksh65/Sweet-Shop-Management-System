import React, { useContext, useState } from 'react'
import { FaUser, FaRegUser } from 'react-icons/fa6'
import UserDetailsModal from './UserDetailsModal'
import { AuthDataContext } from '../context/AuthContext'

function Navbar({ onAddSweetClick }) {
  const [showUserModal, setShowUserModal] = useState(false)
  const { user, loading: loadingUser, error: userError } = useContext(AuthDataContext)

  const handleUserClick = () => {
    setShowUserModal((prev) => !prev)
  }

  return (
    <>
      <nav className="w-full bg-white rounded-2xl shadow-md px-6 py-4 mb-6 flex items-center justify-between">
        <div className="flex items-baseline justify-start ">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Sweet Shop</h1>
          {user && user.role === 'admin' && (
            <span className="text-xs  font-semibold uppercase tracking-wide text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full">
              Admin
            </span>
          )}
        </div>
        <div className="flex gap-3">
          {user && user.role === 'admin' && (
            <button
              className="px-4 py-2 rounded-lg text-sm cursor-pointer font-semibold bg-purple-500 text-white hover:bg-purple-400"
              onClick={onAddSweetClick}
            >
              Add Sweet
            </button>
          )}
          <button
            className="px-3 py-2 rounded-lg text-sm cursor-pointer font-semibold bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200 flex items-center justify-center"
            onClick={handleUserClick}
          >
            {showUserModal ? <FaUser size={18} className="text-purple-500" /> : <FaRegUser size={18} />}
          </button>
        </div>
      </nav>
      <UserDetailsModal
        show={showUserModal}
        onClose={() => setShowUserModal(false)}
        user={user}
        loading={loadingUser}
        error={userError}
      />
    </>
  )
}

export default Navbar

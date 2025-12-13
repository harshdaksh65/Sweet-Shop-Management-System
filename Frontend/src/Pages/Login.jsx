import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axiosconfig'

function Login() {
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    const email = e.target.email.value
    const username = e.target.username.value
    const password = e.target.password.value
    try {
      const response = await axios.post('/api/auth/login', {
        email: email || undefined,
        username: username || undefined,
        password,
      })
      console.log(response.data)
      navigate('/')
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  return (
    <div className="h-screen  flex items-center justify-center min-h-screen bg-gray-100">
      <div
        className="relative flex flex-col m-6 space-y-8 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0"
      >
        {/* <!-- left side --> */}
        <form
          className="flex flex-col justify-center p-8 md:p-14"
          onSubmit={handleLogin}
        >
          <span className="mb-3 text-4xl font-bold">Login</span>
          <span className="font-light text-gray-400 mb-8">
            Please login to continue
          </span>
          <div className="py-2">
            <span className="mb-2 text-md">Email</span>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              name="email"
              id="email"
            />
          </div>
          <div className="py-2">
            <span className="mb-2 text-md">Username</span>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
              name="username"
              id="username"
            />
          </div>
          <div className="py-2">
            <span className="mb-2 text-md">Password</span>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full p-2 border border-gray-300 rounded-md placeholder:font-light placeholder:text-gray-500"
            />
          </div>
          <button
            className="w-full bg-black text-white p-2 rounded-lg mb-6 cursor-pointer hover:bg-white hover:text-black hover:border hover:border-gray-300"
            type="submit"
          >
            Log In
          </button>
          <div className="text-center text-gray-400">
            Don't have an account?{' '}
            <button
              type="button"
              className="font-bold text-black hover:underline cursor-pointer"
              onClick={() => navigate('/register')}
            >
              Sign Up
            </button>
          </div>
        </form>
        {/* <!-- right side --> */}
        <div className="relative">
          <img
            src="/image.jpg"
            alt="img"
            className="w-100 hidden rounded-r-2xl md:block object-cover h-full"
          />
          <div
            className="absolute hidden bottom-10 right-6 left-6 p-6 rounded-2xl bg-white/10 bg-opacity-30 backdrop-blur-sm rounded drop-shadow-lg md:block"
          >
            <span className="text-white text-xl">
              " Streamline your sweets, savor the success."
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
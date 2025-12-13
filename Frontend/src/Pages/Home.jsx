import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axiosconfig'
import SweetsCard from '../Components/SweetsCard'

function Home() {
  const [sweets, setSweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handlePurchase = async (id) => {
    try {
      const response = await axios.post(`/api/sweets/${id}/purchase`, {
        quantity: 1,
      })
      const updatedSweet = response.data?.sweet
      if (updatedSweet) {
        setSweets((prev) =>
          prev.map((s) => (s._id === id ? updatedSweet : s))
        )
      }
    } catch (err) {
      console.error('Purchase failed:', err)
    }
  }

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        setLoading(true)
        const response = await axios.get('/api/sweets')
        setSweets(response.data?.sweets || [])
        setError(null)
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate('/login')
        } else {
          setError('Failed to load sweets')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchSweets()
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">Loading sweets...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Sweets</h1>
      {!sweets.length ? (
        <p className="text-center text-gray-500">No sweets found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {sweets.map((sweet) => (
					<SweetsCard
						key={sweet._id}
						sweet={sweet}
						onPurchase={handlePurchase}
					/>
          ))}
        </div>
      )}
    </div>
  )
}

export default Home
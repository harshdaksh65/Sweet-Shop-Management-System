import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axiosconfig'
import SweetsCard from '../Components/SweetsCard'
import Category from '../Components/Category'
import Navbar from '../Components/Navbar'
import AddSweets from '../Components/AddSweets'
import UpdateSweet from '../Components/UpdateSweet'

function Home() {
  const [sweets, setSweets] = useState([])
  const [allSweets, setAllSweets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(null)
  const [showAddSweet, setShowAddSweet] = useState(false)
  const [showUpdateSweet, setShowUpdateSweet] = useState(false)
  const [selectedSweet, setSelectedSweet] = useState(null)
  const navigate = useNavigate()
  const isInitialLoad = useRef(true)

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
          setAllSweets((prev) =>
            prev.map((s) => (s._id === id ? updatedSweet : s))
          )
      }
    } catch (err) {
      console.error('Purchase failed:', err)
    }
  }

  const handleDeleteSweet = async (id) => {
    try {
      await axios.delete(`/api/sweets/${id}`)
      setSweets((prev) => prev.filter((s) => s._id !== id))
        setAllSweets((prev) => prev.filter((s) => s._id !== id))
    } catch (err) {
      console.error('Delete sweet failed:', err)
    }
  }

  const handleUpdateSweet = (sweetToUpdate) => {
    setSelectedSweet(sweetToUpdate)
    setShowUpdateSweet(true)
  }

  useEffect(() => {
    const fetchSweets = async () => {
      try {
        if (isInitialLoad.current) {
          setLoading(true)
        }

        const params = {}
        if (searchTerm) params.name = searchTerm
        if (selectedCategory !== 'All') params.category = selectedCategory
        if (selectedMaxPrice != null) {
          params.minPrice = 0
          params.maxPrice = selectedMaxPrice
        }

        const hasFilters = Object.keys(params).length > 0

        if (!hasFilters) {
          const response = await axios.get('/api/sweets')
            const data = response.data?.sweets || []
            setSweets(data)
            setAllSweets(data)
        } else {
          const response = await axios.get('/api/sweets/search', { params })
          setSweets(response.data?.sweets || [])
        }

        setError(null)
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate('/login')
        } else if (err.response && err.response.status === 404) {
          setSweets([])
          setError(null)
        } else {
          setError('Failed to load sweets')
        }
      } finally {
        if (isInitialLoad.current) {
          setLoading(false)
          isInitialLoad.current = false
        }
      }
    }

    fetchSweets()
  }, [navigate, searchTerm, selectedCategory, selectedMaxPrice])

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

  const categories = Array.from(
    new Set(allSweets.map((s) => s.category).filter(Boolean)),
  )

  const maxPrice = allSweets.length
    ? Math.max(...allSweets.map((s) => Number(s.price) || 0))
    : 0

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <Navbar onAddSweetClick={() => setShowAddSweet(true)} />
      {showAddSweet && (
        <div className="fixed p-6 inset-0 z-50 flex items-center justify-center bg-black/40">
          <AddSweets
            onSweetAdded={(createdSweet) => {
              if (!createdSweet) return
              setSweets((prev) => [...prev, createdSweet])
              setAllSweets((prev) => [...prev, createdSweet])
            }}
            onClose={() => setShowAddSweet(false)}
          />
        </div>
      )}

      
      {showUpdateSweet && selectedSweet && (
        <div className="fixed p-6 inset-0 z-50 flex items-center justify-center bg-black/40">
          <UpdateSweet
            sweet={selectedSweet}
            onUpdated={(updatedSweet) => {
              setSweets((prev) =>
                prev.map((s) => (s._id === updatedSweet._id ? updatedSweet : s)),
              )
              setAllSweets((prev) =>
                prev.map((s) => (s._id === updatedSweet._id ? updatedSweet : s)),
              )
            }}
            onClose={() => {
              setShowUpdateSweet(false)
              setSelectedSweet(null)
            }}
          />
        </div>
      )}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar */}
        <Category
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          maxPrice={maxPrice}
          selectedMaxPrice={selectedMaxPrice}
          onMaxPriceChange={setSelectedMaxPrice}
        />

        {/* Right content */}
        <main className="w-full md:w-2/3 lg:w-3/4">
          {!sweets.length ? (
            <div className="flex items-center justify-center h-full min-h-[200px] bg-white rounded-2xl shadow-md">
              <p className="text-center text-gray-500">No sweets found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sweets.map((sweet) => (
                <SweetsCard
                  key={sweet._id}
                  sweet={sweet}
                  onPurchase={handlePurchase}
                  onDelete={handleDeleteSweet}
                  onUpdate={handleUpdateSweet}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Home
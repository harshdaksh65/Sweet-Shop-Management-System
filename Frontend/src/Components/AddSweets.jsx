import React from 'react'
import axios from '../api/axiosconfig'

function AddSweets({ onSweetAdded, onClose }) {
  const handleSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const name = form.name.value.trim()
    const imageUrl = form.imageUrl.value.trim()
    const category = form.category.value.trim()
    const price = Number(form.price.value)
    const quantity = Number(form.quantity.value)
    const inStock = quantity > 1

    try {
      const response = await axios.post('/api/sweets', {
        name,
        imageUrl,
        category,
        price,
        quantity,
        inStock,
      })
      const createdSweet = response.data?.sweet
      if (onSweetAdded && createdSweet) {
        onSweetAdded(createdSweet)
      }
      form.reset()
      if (onClose) {
        onClose()
      }
    } catch (error) {
      console.error('Failed to add sweet:', error)
    }
  }
  return (
    <div className="relative bg-white rounded-2xl shadow-md p-6 w-full max-w-xl">
      {onClose && (
        <button
          type="button"
          className="absolute -top-3 -right-3 cursor-pointer hover:text-red-500 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md text-gray-600 hover:bg-gray-100"
          onClick={onClose}
        >
          ✕
        </button>
      )}
      <h2 className="text-2xl font-semibold mb-4">Add New Sweet</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter sweet name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            id="imageUrl"
            name="imageUrl"
            type="text"
            placeholder="https://..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            id="category"
            name="category"
            type="text"
            placeholder="e.g. Milk, Dry Fruit"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (₹)
            </label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              placeholder="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              placeholder="10"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-2 w-full bg-purple-500 cursor-pointer hover:bg-purple-400 text-white font-semibold py-2 rounded-lg text-sm"
        >
          Add Sweet
        </button>
      </form>
    </div>
  )
}

export default AddSweets
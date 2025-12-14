import React, { useState, useEffect } from 'react'
import axios from '../api/axiosconfig'

function UpdateSweet({ sweet, onUpdated, onClose }) {
  const [form, setForm] = useState({
    name: '',
    imageUrl: '',
    category: '',
    price: '',
    quantity: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (sweet) {
      setForm({
        name: sweet.name || '',
        imageUrl: sweet.imageUrl || '',
        category: sweet.category || '',
        price: sweet.price ?? '',
        quantity: sweet.quantity ?? '',
      })
    }
  }, [sweet])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!sweet) return

    try {
      setSubmitting(true)
      setError(null)

      const payload = {
        name: form.name,
        imageUrl: form.imageUrl,
        category: form.category,
        price: Number(form.price),
        quantity: Number(form.quantity),
        inStock: Number(form.quantity) > 0,
      }

      const response = await axios.put(`/api/sweets/${sweet._id}`, payload)
      const updatedSweet = response.data?.sweet
      if (updatedSweet && onUpdated) {
        onUpdated(updatedSweet)
      }
      onClose && onClose()
    } catch (err) {
      setError('Failed to update sweet')
      console.error('Update sweet failed:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (!sweet) return null

  return (
    <div className="relative bg-white rounded-2xl shadow-md p-6 w-full max-w-md">
      {onClose && (
        <button
          type="button"
          className="absolute -top-3 -right-3 cursor-pointer hover:text-red-500 bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md text-gray-600 hover:bg-gray-100"
          onClick={onClose}
        >
          ✕
        </button>
      )}
      <h2 className="text-xl font-semibold mb-4">Update Sweet</h2>
      {error && <p className="text-sm text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL
          </label>
          <input
            type="text"
            name="imageUrl"
            value={form.imageUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              required
              min="0"
              step="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-purple-500 hover:bg-purple-400 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
          >
            {submitting ? 'Updating...' : 'Update Sweet'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdateSweet

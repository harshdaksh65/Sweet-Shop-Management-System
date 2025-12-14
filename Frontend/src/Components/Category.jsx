import React, { useState } from 'react'
import { RiArrowDropDownLine } from 'react-icons/ri'

function Category({
  categories,
  selectedCategory,
  onSelectCategory,
  searchTerm,
  onSearchChange,
  maxPrice,
  selectedMaxPrice,
  onMaxPriceChange,
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <aside className="w-full md:w-1/3 lg:w-1/4 bg-white rounded-2xl shadow-md p-4 h-max">
      <div className="flex items-center justify-between mb-2">
        <button
          type="button"
          className="flex w-full items-center justify-between md:cursor-default md:pointer-events-none"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <h2 className="text-xl font-semibold">Categories</h2>
          <span className="md:hidden text-3xl leading-none text-gray-600 hover:text-purple-500 cursor-pointer">
            <RiArrowDropDownLine
              className={`transition-transform duration-300 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </span>
        </button>
      </div>

      <div
        className={`mt-2 md:mt-3 overflow-hidden transition-all duration-500 ${
          isOpen
            ? 'max-h-[1000px] opacity-100'
            : 'max-h-0 opacity-0 md:max-h-none md:opacity-100'
        } md:overflow-visible`}
      >
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search sweets..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            value={searchTerm}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <button
            className={`text-left px-3 py-1 rounded-lg text-sm font-medium border ${
              selectedCategory === 'All'
                ? 'bg-purple-500 text-white border-purple-500'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
            onClick={() => onSelectCategory('All')}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`text-left px-3 py-1 rounded-lg text-sm font-medium border ${
                selectedCategory === category
                  ? 'bg-purple-500 text-white border-purple-500'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => onSelectCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        <div className="border-t pt-4 mt-2">
          <p className="text-sm font-semibold text-gray-700 mb-2">Filters</p>
          <p className="text-xs text-gray-500 mb-3">
            Select a category above or adjust price range.
          </p>
          {maxPrice > 0 && (
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>₹0</span>
                <span>₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min={0}
                max={maxPrice}
                step={1}
                value={
                  selectedMaxPrice != null ? selectedMaxPrice : maxPrice
                }
                onChange={(e) =>
                  onMaxPriceChange &&
                  onMaxPriceChange(Number(e.target.value))
                }
                className="w-full accent-purple-500"
              />
              <p className="mt-1 text-xs text-gray-700">
                Up to{' '}
                <span className="font-semibold">
                  ₹{selectedMaxPrice != null ? selectedMaxPrice : maxPrice}
                </span>
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

export default Category

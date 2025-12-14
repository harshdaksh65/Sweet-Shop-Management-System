import React, { useContext, useState } from 'react'
import { CiMenuKebab } from 'react-icons/ci'
import { AuthDataContext } from '../context/AuthContext'

function SweetsCard({ sweet, onPurchase, onUpdate, onDelete }) {
  const { _id, name, imageUrl, category, inStock, price, quantity } = sweet
  const { user } = useContext(AuthDataContext)
  const [showMenu, setShowMenu] = useState(false)
  const isAdmin = user && user.role === 'admin'

  return (
    <div className="relative bg-white rounded-2xl shadow-md flex flex-col mb-6">
      <img
        src={
          imageUrl ||
          'https://i.pinimg.com/736x/ac/96/c2/ac96c2dfb6a00807fa48629951921d5d.jpg'
        }
        alt={name}
        className="w-full h-40 object-cover rounded-t-2xl"
      />
      <div className="rounded-2xl bg-white -mt-4 px-4 py-2">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-xl font-semibold">{name}</h2>
          {isAdmin && (
            <div className="relative">
              <button
                type="button"
                className="p-1 rounded-full hover:bg-gray-100 cursor-pointer"
                onClick={() => setShowMenu((prev) => !prev)}
              >
                <CiMenuKebab size={18} />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm cursor-pointer font-semibold hover:bg-gray-100"
                    onClick={() => {
                      setShowMenu(false)
                      onUpdate && onUpdate(sweet)
                    }}
                  >
                    Update Sweet
                  </button>
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 text-sm text-red-600 cursor-pointer font-semibold hover:bg-red-50"
                    onClick={() => {
                      setShowMenu(false)
                      onDelete && onDelete(_id)
                    }}
                  >
                    Delete Sweet
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className=" flex justify-start gap-2 items-center">
          <p className="border font-semibold rounded-2xl px-2 py-0.5 text-[12px]">
            {category}
          </p>
          <p
            className={`border font-semibold rounded-2xl px-2 py-0.5 text-[12px] ${
              inStock ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {inStock ? 'In Stock' : 'Out of Stock'}
          </p>
        </div>
        <p className="absolute font-semibold top-4 right-4 bg-white/50 px-2 py-0.5 rounded-full mb-1">
          Qty: {quantity}
        </p>
        <div className="flex justify-between w-full mt-6 items-center">
          <p className="text-gray-800 font-medium  ">
            <p className="font-semibold opacity-50 text-[12px] -mb-2">PRICE</p>
            <p className="text-xl font-semibold ">₹{price}</p>
          </p>
          <button
            className="bg-purple-500 px-3 py-1 cursor-pointer hover:bg-purple-400 rounded-2xl text-white font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={quantity <= 0}
            onClick={() => onPurchase && onPurchase(_id)}
          >
            Purchase
          </button>
        </div>
      </div>
    </div>
  );
}

export default SweetsCard;

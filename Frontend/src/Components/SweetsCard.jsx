import React from "react";

function SweetsCard({ sweet, onPurchase }) {
  const { _id, name, imageUrl, category, inStock, price, quantity } = sweet;

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
        <h2 className="text-xl font-semibold mb-1">{name}</h2>
        <div className="w-3/4 flex justify-start gap-2 items-center">
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
        <p className="absolute font-semibold top-4 right-4 bg-white px-2 py-0.5 rounded-full mb-1">
          Qty: {quantity}
        </p>
        <div className="flex justify-between w-full mt-6 items-center">
          <p className="text-gray-800 font-medium mb-1">
            <span className="font-semibold opacity-50 text-[12px]">PRICE</span>
            <br />
            <span className="-mt-2 text-xl font-semibold">₹{price}</span>
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

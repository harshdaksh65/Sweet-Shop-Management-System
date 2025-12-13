const mongoose = require('mongoose');

const sweetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  price: {  
    type: Number,
    required: true,
  },
    category: {
      type: String,
      required: true,
    },
  quantity: {
    type: Number,
    required: true,
  },
    inStock: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const sweetModel = mongoose.model('sweet', sweetSchema);
module.exports = sweetModel;
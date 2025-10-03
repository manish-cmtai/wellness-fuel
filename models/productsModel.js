import mongoose, { Schema } from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  
  category: {
    type: String,
    required: true
  },
  
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'Rs'
    },
    mrp:{
      type: Number,
    }
  },
  
  stockQuantity: {
    type: Number,
    required: true,
    default: 0
  },
  
  shortDescription: {
    type: String,
    required: true
  },
  
  weightSize: {
    value: Number,
    unit: String
  },
  
  longDescription: {
    type: String,
    required: true
  },
  
  expiryDate: {
    type: Date,
    required: true
  },
  
  ingredients: [{
    type: String
  }],
  
  benefits: [{
    type: String
  }],
  
  dosageInstructions: {
    type: String,
    required: true
  },
  
  manufacturer: {
    type: String,
    required: true
  },
  images:[{
    type: String
  }]
  
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product;

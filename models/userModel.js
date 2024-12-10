const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
   
    trim: true,
  },
  address: [
    {
      label: {
        type: String,
        default: 'Home',
        trim: true,
     
      },
    },
  ],
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer',
  },
  cart: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'foods' },
      quantity: { type: Number, default:1 },
    },
  ]
});

const users = mongoose.model('users', userSchema);

module.exports = users;



// test usermodel


const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  name: {type: String, required: true},
  price: {type: Number, required: true},
  location: {type: String, required: true},
  rating: {type: Number, required: true},
  imageUrl: String,
  description: String
})

module.exports = mongoose.model("Home", homeSchema);
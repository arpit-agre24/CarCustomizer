const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a car name'],
    trim: true
  },
  brand: {
    type: String,
    required: [true, 'Please provide a brand name'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Please provide a model name'],
    trim: true
  },
  basePrice: {
    type: Number,
    required: [true, 'Please provide a base price'],
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  specifications: {
    engine: String,
    horsepower: String,
    torque: String,
    transmission: String,
    fuelType: String,
    seatingCapacity: Number,
    dimensions: {
      length: String,
      width: String,
      height: String
    }
  },
  modelPath: {
    type: String,
    required: [true, 'Please provide 3D model path']
  },
  thumbnail: {
    type: String,
    required: true
  },
  images: [String],
  customizationOptions: {
    colors: [{
      name: String,
      code: String,
      price: {
        type: Number,
        default: 0
      },
      materialName: String
    }],
    wheels: [{
      name: String,
      image: String,
      price: {
        type: Number,
        default: 0
      },
      modelPath: String
    }],
    bumpers: [{
      name: String,
      image: String,
      price: {
        type: Number,
        default: 0
      },
      modelPath: String
    }],
    spoilers: [{
      name: String,
      image: String,
      price: {
        type: Number,
        default: 0
      },
      modelPath: String
    }],
    extras: [{
      name: String,
      description: String,
      price: {
        type: Number,
        default: 0
      }
    }]
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Car', carSchema);

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Car = require('./models/Car');
const User = require('./models/User');
const Order = require('./models/Order');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const cars = [
  {
    name: 'Tesla Model S Plaid',
    brand: 'Tesla',
    model: 'Model S Plaid',
    basePrice: 7490000,
    description: 'The quickest, most powerful sedan on the road. Model S Plaid has 1,020 horsepower and accelerates from 0-60 mph in 1.99 seconds. Experience the pinnacle of electric performance.',
    specifications: {
      engine: 'Tri Motor All-Wheel Drive',
      horsepower: '1,020 hp',
      torque: '1,050 lb-ft',
      transmission: 'Single-Speed Automatic',
      fuelType: 'Electric',
      seatingCapacity: 5,
      dimensions: {
        length: '196 in',
        width: '77.3 in',
        height: '56.9 in'
      }
    },
    modelPath: '/models/tesla-model-s.glb',
    thumbnail: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800',
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800',
      'https://images.unsplash.com/photo-1583792664554-a46e5c423725?w=800',
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800'
    ],
    customizationOptions: {
      colors: [
        {
          name: 'Pearl White Multi-Coat',
          code: '#F4F4F4',
          price: 0,
          materialName: 'Body'
        },
        {
          name: 'Solid Black',
          code: '#000000',
          price: 165000,
          materialName: 'Body'
        },
        {
          name: 'Midnight Silver Metallic',
          code: '#393C41',
          price: 165000,
          materialName: 'Body'
        },
        {
          name: 'Deep Blue Metallic',
          code: '#1e4470',
          price: 165000,
          materialName: 'Body'
        },
        {
          name: 'Red Multi-Coat',
          code: '#c71414',
          price: 290000,
          materialName: 'Body'
        }
      ],
      wheels: [
        {
          name: '19" Tempest Wheels',
          image: 'https://via.placeholder.com/200',
          price: 0,
          modelPath: '/models/wheels/tempest.glb'
        },
        {
          name: '21" Arachnid Wheels',
          image: 'https://via.placeholder.com/200',
          price: 455000,
          modelPath: '/models/wheels/arachnid.glb'
        }
      ],
      bumpers: [
        {
          name: 'Standard Bumper',
          image: 'https://via.placeholder.com/200',
          price: 0,
          modelPath: '/models/bumpers/standard.glb'
        },
        {
          name: 'Sport Bumper',
          image: 'https://via.placeholder.com/200',
          price: 250000,
          modelPath: '/models/bumpers/sport.glb'
        },
        {
          name: 'Carbon Fiber Bumper',
          image: 'https://via.placeholder.com/200',
          price: 455000,
          modelPath: '/models/bumpers/carbon.glb'
        }
      ],
      spoilers: [
        {
          name: 'No Spoiler',
          image: 'https://via.placeholder.com/200',
          price: 0,
          modelPath: null
        },
        {
          name: 'Lip Spoiler',
          image: 'https://via.placeholder.com/200',
          price: 165000,
          modelPath: '/models/spoilers/lip.glb'
        },
        {
          name: 'Wing Spoiler',
          image: 'https://via.placeholder.com/200',
          price: 375000,
          modelPath: '/models/spoilers/wing.glb'
        }
      ],
      extras: [
        {
          name: 'Enhanced Autopilot',
          description: 'Navigate on Autopilot, Auto Lane Change, Autopark, Summon',
          price: 665000
        },
        {
          name: 'Full Self-Driving Capability',
          description: 'All Enhanced Autopilot features plus Traffic Light and Stop Sign Control',
          price: 995000
        },
        {
          name: 'Premium Audio',
          description: '22-speaker, 960-watt audio system with active noise cancelling',
          price: 290000
        },
        {
          name: 'Yoke Steering Wheel',
          description: 'Aircraft-inspired yoke steering wheel for enhanced visibility',
          price: 125000
        },
        {
          name: 'Track Package',
          description: 'High-performance brake cooling and track-ready tires',
          price: 580000
        }
      ]
    },
    isAvailable: true
  },
  {
    name: 'Porsche 911 Turbo S',
    brand: 'Porsche',
    model: '911 Turbo S',
    basePrice: 19200000,
    description: 'The 911 Turbo S is the pinnacle of 911 performance. With its twin-turbocharged flat-six engine producing 640 horsepower, it offers breathtaking acceleration and handling.',
    specifications: {
      engine: '3.8L Twin-Turbo Flat-6',
      horsepower: '640 hp',
      torque: '590 lb-ft',
      transmission: '8-Speed PDK Automatic',
      fuelType: 'Premium Gasoline',
      seatingCapacity: 4,
      dimensions: {
        length: '177.9 in',
        width: '74.0 in',
        height: '51.0 in'
      }
    },
    modelPath: '/models/porsche-911.glb',
    thumbnail: '/porsche_911.jpg',
    images: [
      '/porsche_911.jpg',
      '/porsche_911.jpg',
      '/porsche_911.jpg'
    ],
    customizationOptions: {
      colors: [
        {
          name: 'Carrara White Metallic',
          code: '#FFFFFF',
          price: 0,
          materialName: 'Body'
        },
        {
          name: 'Jet Black Metallic',
          code: '#000000',
          price: 310000,
          materialName: 'Body'
        },
        {
          name: 'Racing Yellow',
          code: '#FFD700',
          price: 310000,
          materialName: 'Body'
        },
        {
          name: 'Guards Red',
          code: '#E32119',
          price: 310000,
          materialName: 'Body'
        },
        {
          name: 'Miami Blue',
          code: '#00A6FF',
          price: 310000,
          materialName: 'Body'
        },
        {
          name: 'GT Silver Metallic',
          code: '#C0C0C0',
          price: 310000,
          materialName: 'Body'
        },
        {
          name: 'Gentian Blue Metallic',
          code: '#1F3A93',
          price: 310000,
          materialName: 'Body'
        },
        {
          name: 'Chalk',
          code: '#D4CFC7',
          price: 310000,
          materialName: 'Body'
        }
      ],
      wheels: [
        {
          name: '20/21" Turbo S Wheels',
          image: 'https://via.placeholder.com/200',
          price: 0,
          modelPath: '/models/wheels/turbos.glb'
        },
        {
          name: '20/21" Sport Classic Wheels',
          image: 'https://via.placeholder.com/200',
          price: 520000,
          modelPath: '/models/wheels/sportclassic.glb'
        },
        {
          name: '21" RS Spyder Design Wheels',
          image: 'https://via.placeholder.com/200',
          price: 415000,
          modelPath: '/models/wheels/rsspyder.glb'
        }
      ],
      bumpers: [
        {
          name: 'Standard Bumper',
          image: 'https://via.placeholder.com/200',
          price: 0,
          modelPath: '/models/bumpers/porsche_standard.glb'
        },
        {
          name: 'Aerokit Bumper',
          image: 'https://via.placeholder.com/200',
          price: 575000,
          modelPath: '/models/bumpers/porsche_aerokit.glb'
        },
        {
          name: 'SportDesign Bumper',
          image: 'https://via.placeholder.com/200',
          price: 705000,
          modelPath: '/models/bumpers/porsche_sportdesign.glb'
        },
        {
          name: 'Front Axle Lift System',
          image: 'https://via.placeholder.com/200',
          price: 235000,
          modelPath: '/models/bumpers/porsche_lift.glb'
        }
      ],
      spoilers: [
        {
          name: 'No Spoiler',
          image: 'https://via.placeholder.com/200',
          price: 0,
          modelPath: null
        },
        {
          name: 'Retractable Rear Spoiler',
          image: 'https://via.placeholder.com/200',
          price: 0,
          modelPath: '/models/spoilers/porsche_retractable.glb'
        },
        {
          name: 'Fixed Rear Wing',
          image: 'https://via.placeholder.com/200',
          price: 355000,
          modelPath: '/models/spoilers/porsche_fixed.glb'
        },
        {
          name: 'GT3 Style Wing',
          image: 'https://via.placeholder.com/200',
          price: 960000,
          modelPath: '/models/spoilers/porsche_gt3_wing.glb'
        }
      ],
      extras: [
        {
          name: 'Sport Chrono Package',
          description: 'Includes stopwatch, performance display, and SPORT PLUS mode',
          price: 525000
        },
        {
          name: 'Burmester High-End Sound System',
          description: '12-channel amplifier with 855 watts total output power',
          price: 485000
        },
        {
          name: 'Carbon Ceramic Brakes (PCCB)',
          description: 'Fade-resistant ceramic composite brake discs',
          price: 820000
        },
        {
          name: 'Sport Exhaust System',
          description: 'Distinctive exhaust note with tailpipe trim in high-gloss black',
          price: 290000
        },
        {
          name: 'LED-Matrix Headlights',
          description: 'Adaptive LED headlights with PDLS+ system',
          price: 358000
        },
        {
          name: 'Rear-Axle Steering',
          description: 'Improves agility and stability at all speeds',
          price: 198000
        },
        {
          name: 'Porsche Active Suspension Management',
          description: 'Continuously variable damping control',
          price: 248000
        },
        {
          name: 'Roll Bars',
          description: 'Fixed roll bars behind rear seats for safety',
          price: 158000
        }
      ]
    },
    isAvailable: true
  }
];

const adminUser = {
  name: 'Admin User',
  email: 'admin@carcustomizer.com',
  password: 'admin123',
  role: 'admin'
};

const seedDB = async () => {
  try {
    await connectDB();

    console.log('⚠️  WARNING: This will DELETE ALL existing data!');
    console.log('Clearing ALL existing data...');
    
    // Clear ALL existing data
    await Car.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    
    console.log('✅ All existing data cleared');

    // Add cars
    const createdCars = await Car.insertMany(cars);
    console.log(`\n✅ ${createdCars.length} cars added`);

    // Create admin user
    const admin = await User.create(adminUser);
    console.log('✅ Admin user created:', admin.email);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nAdmin Credentials:');
    console.log('Email: admin@carcustomizer.com');
    console.log('Password: admin123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();

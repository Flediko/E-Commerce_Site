require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Product data sources with real images
const categories = [
  { name: 'Electronics', description: 'Latest gadgets and electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500' },
  { name: 'Fashion', description: 'Trending fashion and apparel', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=500' },
  { name: 'Home & Kitchen', description: 'Home essentials and kitchenware', image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=500' },
  { name: 'Beauty', description: 'Beauty and personal care products', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500' },
  { name: 'Sports', description: 'Sports and fitness equipment', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500' },
  { name: 'Books', description: 'Books and stationery', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500' },
  { name: 'Toys', description: 'Toys and games for all ages', image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500' },
  { name: 'Jewelry', description: 'Fashion jewelry and accessories', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500' }
];

// Fetch products from DummyJSON API (100 products)
const fetchDummyJSONProducts = async () => {
  try {
    console.log('📦 Fetching products from DummyJSON...');
    const response = await axios.get('https://dummyjson.com/products?limit=100');
    return response.data.products;
  } catch (error) {
    console.error('Error fetching from DummyJSON:', error.message);
    return [];
  }
};

// Generate additional products with variety
const generateAdditionalProducts = (categoryMap, users) => {
  const products = [];
  
  const electronicsData = [
    { name: 'Dell XPS 15 Laptop', brand: 'Dell', price: 89999, images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800'] },
    { name: 'MacBook Pro M3', brand: 'Apple', price: 189999, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'] },
    { name: 'Sony WH-1000XM5 Headphones', brand: 'Sony', price: 29999, images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'] },
    { name: 'Samsung Galaxy S24 Ultra', brand: 'Samsung', price: 124999, images: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800'] },
    { name: 'iPad Air', brand: 'Apple', price: 59999, images: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'] },
    { name: 'LG 55" 4K OLED TV', brand: 'LG', price: 89999, images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800'] },
    { name: 'Canon EOS R6 Camera', brand: 'Canon', price: 224999, images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'] },
    { name: 'Bose SoundLink Speaker', brand: 'Bose', price: 14999, images: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800'] },
    { name: 'Apple Watch Series 9', brand: 'Apple', price: 41999, images: ['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800'] },
    { name: 'Gaming Mouse RGB', brand: 'Logitech', price: 4999, images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800'] },
  ];

  const fashionData = [
    { name: 'Levi\'s Denim Jacket', brand: 'Levis', price: 4999, images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'] },
    { name: 'Nike Air Max Sneakers', brand: 'Nike', price: 8999, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'] },
    { name: 'Adidas Track Pants', brand: 'Adidas', price: 2999, images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800'] },
    { name: 'Ray-Ban Aviator Sunglasses', brand: 'Ray-Ban', price: 12999, images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800'] },
    { name: 'Leather Handbag', brand: 'Fossil', price: 6999, images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800'] },
    { name: 'Formal Shirt White', brand: 'Arrow', price: 1999, images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'] },
    { name: 'Winter Puffer Jacket', brand: 'North Face', price: 14999, images: ['https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800'] },
    { name: 'Casio Analog Watch', brand: 'Casio', price: 3499, images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800'] },
    { name: 'Cotton T-Shirt Pack', brand: 'H&M', price: 1499, images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'] },
    { name: 'Running Shoes', brand: 'Puma', price: 5999, images: ['https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800'] },
  ];

  const homeKitchenData = [
    { name: 'Philips Air Fryer', brand: 'Philips', price: 7999, images: ['https://images.unsplash.com/photo-1585515320310-259814833e62?w=800'] },
    { name: 'Mixer Grinder', brand: 'Bajaj', price: 3499, images: ['https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800'] },
    { name: 'Non-Stick Cookware Set', brand: 'Prestige', price: 4999, images: ['https://images.unsplash.com/photo-1584990347449-a2e24eca1096?w=800'] },
    { name: 'Coffee Maker', brand: 'Nespresso', price: 12999, images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800'] },
    { name: 'Bedsheet Set Cotton', brand: 'Home Centre', price: 2499, images: ['https://images.unsplash.com/photo-1631049035182-249067d7618e?w=800'] },
    { name: 'Vacuum Cleaner', brand: 'Dyson', price: 34999, images: ['https://images.unsplash.com/photo-1558317374-067fb5f30001?w=800'] },
    { name: 'Dining Table Set', brand: 'IKEA', price: 24999, images: ['https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800'] },
    { name: 'LED Desk Lamp', brand: 'Xiaomi', price: 1999, images: ['https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800'] },
    { name: 'Wall Clock Modern', brand: 'Seiko', price: 2999, images: ['https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800'] },
    { name: 'Kitchen Knife Set', brand: 'Chef\'s Choice', price: 3999, images: ['https://images.unsplash.com/photo-1593618998160-e34014e67546?w=800'] },
  ];

  const beautyData = [
    { name: 'Lakme Lipstick Set', brand: 'Lakme', price: 999, images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800'] },
    { name: 'Moisturizer Cream', brand: 'Nivea', price: 499, images: ['https://images.unsplash.com/photo-1556228841-0f34a62e8c5c?w=800'] },
    { name: 'Hair Dryer Professional', brand: 'Philips', price: 2499, images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800'] },
    { name: 'Perfume Gift Set', brand: 'Calvin Klein', price: 4999, images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800'] },
    { name: 'Face Wash', brand: 'Cetaphil', price: 699, images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800'] },
    { name: 'Makeup Brush Set', brand: 'Morphe', price: 1999, images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800'] },
    { name: 'Sunscreen SPF 50', brand: 'Neutrogena', price: 899, images: ['https://images.unsplash.com/photo-1556228852-80c4e74f09b8?w=800'] },
    { name: 'Hair Straightener', brand: 'Dyson', price: 34999, images: ['https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=800'] },
    { name: 'Nail Polish Set', brand: 'Maybelline', price: 599, images: ['https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800'] },
    { name: 'Electric Shaver', brand: 'Braun', price: 7999, images: ['https://images.unsplash.com/photo-1499088513455-674b6f2dcc13?w=800'] },
  ];

  const sportsData = [
    { name: 'Yoga Mat Premium', brand: 'Reebok', price: 1999, images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800'] },
    { name: 'Dumbbell Set 20kg', brand: 'Kore', price: 2999, images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800'] },
    { name: 'Cricket Bat Professional', brand: 'MRF', price: 4999, images: ['https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800'] },
    { name: 'Football Size 5', brand: 'Nivia', price: 899, images: ['https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?w=800'] },
    { name: 'Badminton Racket', brand: 'Yonex', price: 3499, images: ['https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=800'] },
    { name: 'Gym Bag Sports', brand: 'Wildcraft', price: 1499, images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'] },
    { name: 'Swimming Goggles', brand: 'Speedo', price: 1299, images: ['https://images.unsplash.com/photo-1530549387789-4c1017266635?w=800'] },
    { name: 'Treadmill Home Use', brand: 'Lifelong', price: 24999, images: ['https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800'] },
    { name: 'Resistance Bands Set', brand: 'Boldfit', price: 699, images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=800'] },
    { name: 'Cycling Helmet', brand: 'Btwin', price: 1999, images: ['https://images.unsplash.com/photo-1557827386-cc34d38d0de4?w=800'] },
  ];

  const booksData = [
    { name: 'The Great Gatsby', brand: 'Penguin', price: 299, images: ['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800'] },
    { name: 'Notebook Diary Set', brand: 'Classmate', price: 199, images: ['https://images.unsplash.com/photo-1517842645767-c639042777db?w=800'] },
    { name: 'Art Supplies Kit', brand: 'Faber-Castell', price: 1499, images: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'] },
    { name: 'Encyclopedia Set', brand: 'Britannica', price: 4999, images: ['https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800'] },
    { name: 'Fountain Pen Luxury', brand: 'Parker', price: 2999, images: ['https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=800'] },
    { name: 'Bookmark Collection', brand: 'Handmade', price: 149, images: ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800'] },
    { name: 'Study Desk Organizer', brand: 'IKEA', price: 899, images: ['https://images.unsplash.com/photo-1584473457493-c605c315e077?w=800'] },
    { name: 'Calculator Scientific', brand: 'Casio', price: 799, images: ['https://images.unsplash.com/photo-1598768854953-4df27a2b0e94?w=800'] },
    { name: 'World Atlas', brand: 'National Geographic', price: 1499, images: ['https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800'] },
    { name: 'Coloring Book Adult', brand: 'Johanna Basford', price: 599, images: ['https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=800'] },
  ];

  const toysData = [
    { name: 'LEGO City Set', brand: 'LEGO', price: 3999, images: ['https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=800'] },
    { name: 'Remote Control Car', brand: 'Hot Wheels', price: 2499, images: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800'] },
    { name: 'Barbie Doll House', brand: 'Barbie', price: 4999, images: ['https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800'] },
    { name: 'Board Game Monopoly', brand: 'Hasbro', price: 1999, images: ['https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=800'] },
    { name: 'Puzzle 1000 Pieces', brand: 'Ravensburger', price: 899, images: ['https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800'] },
    { name: 'Soft Teddy Bear', brand: 'Archies', price: 799, images: ['https://images.unsplash.com/photo-1590736969955-71cc94901144?w=800'] },
    { name: 'Action Figure Set', brand: 'Marvel', price: 1999, images: ['https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=800'] },
    { name: 'Educational Toy Kit', brand: 'Fisher Price', price: 2999, images: ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800'] },
    { name: 'Drone with Camera', brand: 'DJI', price: 34999, images: ['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800'] },
    { name: 'Kids Bicycle', brand: 'Hero', price: 4999, images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'] },
  ];

  const jewelryData = [
    { name: 'Gold Plated Necklace', brand: 'Tanishq', price: 12999, images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'] },
    { name: 'Diamond Earrings', brand: 'Giva', price: 4999, images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'] },
    { name: 'Silver Bracelet', brand: 'Melorra', price: 2999, images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'] },
    { name: 'Pearl Pendant', brand: 'Mia', price: 1999, images: ['https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?w=800'] },
    { name: 'Fashion Ring Set', brand: 'Accessorize', price: 899, images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'] },
    { name: 'Anklet Traditional', brand: 'CaratLane', price: 3499, images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800'] },
    { name: 'Brooch Collection', brand: 'Zaveri Pearls', price: 599, images: ['https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800'] },
    { name: 'Hair Accessories Set', brand: 'Forever 21', price: 499, images: ['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800'] },
    { name: 'Cufflinks Luxury', brand: 'Mont Blanc', price: 7999, images: ['https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800'] },
    { name: 'Charm Bracelet', brand: 'Pandora', price: 5999, images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800'] },
  ];

  const allData = [
    { data: electronicsData, category: 'Electronics' },
    { data: fashionData, category: 'Fashion' },
    { data: homeKitchenData, category: 'Home & Kitchen' },
    { data: beautyData, category: 'Beauty' },
    { data: sportsData, category: 'Sports' },
    { data: booksData, category: 'Books' },
    { data: toysData, category: 'Toys' },
    { data: jewelryData, category: 'Jewelry' }
  ];

  allData.forEach(({ data, category }) => {
    data.forEach((item, index) => {
      const rating = (3.5 + Math.random() * 1.5).toFixed(1);
      const numReviews = Math.floor(Math.random() * 500) + 50;
      const stock = Math.floor(Math.random() * 100) + 10;
      const discountPrice = item.price > 5000 ? item.price - Math.floor(Math.random() * 2000) - 500 : 0;

      products.push({
        name: item.name,
        description: `High quality ${item.name.toLowerCase()} from ${item.brand}. Perfect for your needs with excellent features and durability.`,
        price: item.price,
        discountPrice,
        category: categoryMap[category],
        images: item.images,
        brand: item.brand,
        stock,
        rating: parseFloat(rating),
        numReviews,
        reviews: generateReviews(Math.min(numReviews, 5), users),
        tags: [category.toLowerCase(), item.brand.toLowerCase()],
        specifications: {
          'Brand': item.brand,
          'Category': category,
          'Warranty': '1 Year'
        }
      });
    });
  });

  return products;
};

// Generate sample reviews
const generateReviews = (count, users) => {
  const reviewComments = [
    'Excellent product! Highly recommended.',
    'Good value for money.',
    'Quality is great, delivery was fast.',
    'Very satisfied with this purchase.',
    'Worth every penny!',
    'Amazing quality and finish.',
    'Exactly as described.',
    'Fast delivery and great packaging.',
    'My family loves it!',
    'Will definitely buy again.'
  ];

  const names = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Arjun', 'Kavya', 'Rohan', 'Anjali'];

  const reviews = [];
  for (let i = 0; i < count; i++) {
    reviews.push({
      user: users[Math.floor(Math.random() * users.length)]._id,
      name: names[Math.floor(Math.random() * names.length)],
      rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
      comment: reviewComments[Math.floor(Math.random() * reviewComments.length)]
    });
  }
  return reviews;
};

// Map DummyJSON products to our schema
const mapDummyJSONProducts = (dummyProducts, categoryMap, users) => {
  return dummyProducts.map(product => {
    // Map category
    let categoryId = categoryMap['Electronics'];
    if (product.category.toLowerCase().includes('beauty') || product.category.toLowerCase().includes('fragrances')) {
      categoryId = categoryMap['Beauty'];
    } else if (product.category.toLowerCase().includes('furniture') || product.category.toLowerCase().includes('home')) {
      categoryId = categoryMap['Home & Kitchen'];
    } else if (product.category.toLowerCase().includes('clothing') || product.category.toLowerCase().includes('mens') || product.category.toLowerCase().includes('womens')) {
      categoryId = categoryMap['Fashion'];
    } else if (product.category.toLowerCase().includes('sports')) {
      categoryId = categoryMap['Sports'];
    }

    return {
      name: product.title,
      description: product.description,
      price: Math.round(product.price * 80), // Convert USD to INR approximately
      discountPrice: Math.round(product.price * 80 * (1 - product.discountPercentage / 100)),
      category: categoryId,
      images: product.images || [product.thumbnail],
      brand: product.brand || 'Generic',
      stock: product.stock,
      rating: product.rating,
      numReviews: Math.floor(Math.random() * 200) + 20,
      reviews: generateReviews(Math.min(5, Math.floor(Math.random() * 5) + 1), users),
      tags: [product.category.toLowerCase(), product.brand?.toLowerCase() || 'generic'],
      specifications: {
        'Brand': product.brand || 'Generic',
        'Category': product.category,
        'Warranty': product.warrantyInformation || '1 Year'
      }
    };
  });
};

const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Cart.deleteMany({});

    console.log('👤 Creating users...');
    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@ecom.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create sample users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'user'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        role: 'user'
      }
    ]);

    console.log('✅ Users created!');

    console.log('📁 Creating categories...');
    const createdCategories = await Category.create(categories);
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });
    console.log('✅ Categories created!');

    console.log('📦 Fetching and creating products...');
    
    // Fetch from DummyJSON
    const dummyProducts = await fetchDummyJSONProducts();
    const mappedDummyProducts = mapDummyJSONProducts(dummyProducts, categoryMap, users);
    
    // Generate additional products
    const additionalProducts = generateAdditionalProducts(categoryMap, users);
    
    // Combine all products
    const allProducts = [...mappedDummyProducts, ...additionalProducts];
    
    console.log(`🎯 Creating ${allProducts.length} products...`);
    const createdProducts = await Product.create(allProducts);
    
    console.log(`✅ ${createdProducts.length} products created!`);

    console.log('🛒 Creating sample orders...');
    // Create a sample order
    const sampleOrder = await Order.create({
      user: users[0]._id,
      items: [
        {
          product: createdProducts[0]._id,
          name: createdProducts[0].name,
          quantity: 2,
          price: createdProducts[0].price,
          image: createdProducts[0].images[0]
        },
        {
          product: createdProducts[1]._id,
          name: createdProducts[1].name,
          quantity: 1,
          price: createdProducts[1].price,
          image: createdProducts[1].images[0]
        }
      ],
      shippingAddress: {
        street: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001',
        country: 'India'
      },
      paymentMethod: 'COD',
      itemsPrice: createdProducts[0].price * 2 + createdProducts[1].price,
      shippingPrice: 100,
      taxPrice: 0,
      totalPrice: createdProducts[0].price * 2 + createdProducts[1].price + 100,
      orderStatus: 'Processing'
    });

    console.log('✅ Sample order created!');

    console.log('\n🎉 DATABASE SEEDED SUCCESSFULLY!\n');
    console.log('📊 Summary:');
    console.log(`   👥 Users: ${(await User.countDocuments())}`);
    console.log(`   📁 Categories: ${(await Category.countDocuments())}`);
    console.log(`   📦 Products: ${(await Product.countDocuments())}`);
    console.log(`   🛒 Orders: ${(await Order.countDocuments())}`);
    console.log('\n🔐 Login Credentials:');
    console.log('   Admin: admin@ecom.com / admin123');
    console.log('   User: john@example.com / password123');
    console.log('\n💡 Next Steps:');
    console.log('   1. Start the server: npm run dev');
    console.log('   2. Get Gemini API key from: https://makersuite.google.com/app/apikey');
    console.log('   3. Add it to your .env file\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

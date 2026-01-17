const { GoogleGenerativeAI } = require('@google/generative-ai');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Rule-based intent detection with improved patterns
const detectIntent = (text) => {
  const lowerText = text.toLowerCase().trim();
  
  // Navigation commands
  if (lowerText.match(/\b(go to|open|show me|take me to|navigate to)\s+(home|homepage|main page)/i)) {
    return { type: 'NAVIGATE_HOME', confidence: 'high' };
  }
  
  if (lowerText.match(/\b(go to|open|show|view|check)\s+(cart|shopping cart|my cart|basket)/i)) {
    return { type: 'VIEW_CART', confidence: 'high' };
  }
  
  if (lowerText.match(/\b(go to|open|show|view)\s+(products|all products|product page|shop)/i)) {
    return { type: 'SHOW_PRODUCTS', confidence: 'high' };
  }
  
  // Cart actions
  if (lowerText.match(/\b(add|put|place)\s+(this|that|it)?\s*(to|in|into)?\s*(cart|basket)/i)) {
    return { type: 'ADD_TO_CART', confidence: 'high' };
  }
  
  if (lowerText.match(/\b(remove|delete|take out)\s+from\s+cart/i)) {
    return { type: 'REMOVE_FROM_CART', confidence: 'high' };
  }
  
  // Order/Checkout
  if (lowerText.match(/\b(checkout|place order|buy now|purchase|proceed to checkout)/i)) {
    return { type: 'CHECKOUT', confidence: 'high' };
  }
  
  if (lowerText.match(/\b(my orders|order history|previous orders|past orders)/i)) {
    return { type: 'VIEW_ORDERS', confidence: 'high' };
  }
  
  // Search by category - more natural patterns
  if (lowerText.match(/\b(show|find|get|search|look for|looking for)\s+(me\s+)?(some\s+)?(smartphones?|phones?|mobiles?)/i)) {
    return { type: 'SEARCH_CATEGORY', category: 'smartphones', confidence: 'high' };
  }
  
  if (lowerText.match(/\b(show|find|get|search|look for|looking for)\s+(me\s+)?(some\s+)?(laptops?|computers?|notebooks?)/i)) {
    return { type: 'SEARCH_CATEGORY', category: 'laptops', confidence: 'high' };
  }
  
  if (lowerText.match(/\b(show|find|get|search|look for|looking for)\s+(me\s+)?(some\s+)?(headphones?|earphones?|earbuds?)/i)) {
    return { type: 'SEARCH_CATEGORY', category: 'headphones', confidence: 'high' };
  }
  
  if (lowerText.match(/\b(show|find|get|search|look for|looking for)\s+(me\s+)?(some\s+)?(watches?|smartwatches?)/i)) {
    return { type: 'SEARCH_CATEGORY', category: 'watches', confidence: 'high' };
  }
  
  if (lowerText.match(/\b(show|find|get|search|look for|looking for)\s+(me\s+)?(some\s+)?(cameras?)/i)) {
    return { type: 'SEARCH_CATEGORY', category: 'cameras', confidence: 'high' };
  }
  
  if (lowerText.match(/\b(show|find|get|search|look for|looking for)\s+(me\s+)?(some\s+)?(tv|tvs|television)/i)) {
    return { type: 'SEARCH_CATEGORY', category: 'tvs', confidence: 'high' };
  }
  
  if (lowerText.match(/\b(show|find|get|search|look for|looking for)\s+(me\s+)?(some\s+)?(tablets?|ipads?)/i)) {
    return { type: 'SEARCH_CATEGORY', category: 'tablets', confidence: 'high' };
  }
  
  // Price-based search - improved patterns
  if (lowerText.match(/\b(under|below|less than|cheaper than|budget of|max|maximum)\s*\$?\s*(\d+)/i)) {
    const match = lowerText.match(/\$?\s*(\d+)/);
    return { type: 'SEARCH_BY_PRICE', maxPrice: parseInt(match[1]), confidence: 'high' };
  }
  
  if (lowerText.match(/\b(between|from)\s*\$?\s*(\d+)\s*(to|and|-)\s*\$?\s*(\d+)/i)) {
    const match = lowerText.match(/(\d+)\s*(?:to|and|-)\s*(\d+)/);
    return { type: 'SEARCH_BY_PRICE_RANGE', minPrice: parseInt(match[1]), maxPrice: parseInt(match[2]), confidence: 'high' };
  }
  
  // Recommendations - more natural patterns
  if (lowerText.match(/\b(what are|show me|find|get)\s+(the\s+)?(best|top|highest rated|popular|recommended)/i)) {
    return { type: 'RECOMMENDATION', confidence: 'high' };
  }
  
  if (lowerText.match(/\b(recommend|suggest)\s+(me\s+)?(a|an|some)/i)) {
    return { type: 'RECOMMENDATION', confidence: 'high' };
  }
  
  // Comparison
  if (lowerText.match(/\b(compare|difference between|which is better)/i)) {
    return { type: 'COMPARISON', confidence: 'medium' };
  }
  
  // Sorting preferences
  if (lowerText.match(/\b(cheapest|lowest price|most affordable)/i)) {
    return { type: 'SORT_PRICE_LOW', confidence: 'high' };
  }
  
  if (lowerText.match(/\b(most expensive|highest price|premium)/i)) {
    return { type: 'SORT_PRICE_HIGH', confidence: 'high' };
  }
  
  if (lowerText.match(/\b(newest|latest|recent)/i)) {
    return { type: 'SORT_NEWEST', confidence: 'high' };
  }
  
  // Help command
  if (lowerText.match(/\b(help|what can you do|how to use|commands)/i)) {
    return { type: 'HELP', confidence: 'high' };
  }
  
  // Default to search if contains product-related keywords
  if (lowerText.match(/\b(show|find|search|get|looking for|want|need)\b/i)) {
    return { type: 'SEARCH', confidence: 'medium' };
  }
  
  // If nothing matches, return general search
  return { type: 'SEARCH', confidence: 'low' };
};

// @desc    Process voice command with AI
// @route   POST /api/ai/voice-command
// @access  Public
exports.processVoiceCommand = async (req, res) => {
  try {
    const { command, context } = req.body;
    
    if (!command) {
      return res.status(400).json({ message: 'Command is required' });
    }

    // Detect intent
    const intent = detectIntent(command);

    // Handle simple commands with rules
    if (intent.confidence === 'high') {
      const result = handleSimpleCommand(intent);
      
      // If it's a search command, fetch products
      if (result.action === 'SEARCH_CATEGORY') {
        const products = await searchByCategory(result.category);
        return res.json({
          intent: intent.type,
          response: result.message,
          action: result.action,
          category: result.category,
          products: products
        });
      }
      
      if (result.action === 'SEARCH_PRICE') {
        const products = await searchByPrice(null, result.maxPrice);
        return res.json({
          intent: intent.type,
          response: result.message,
          action: result.action,
          products: products
        });
      }
      
      if (result.action === 'SEARCH_PRICE_RANGE') {
        const products = await searchByPrice(result.minPrice, result.maxPrice);
        return res.json({
          intent: intent.type,
          response: result.message,
          action: result.action,
          products: products
        });
      }
      
      return res.json({
        intent: intent.type,
        response: result.message,
        action: result.action,
        url: result.url
      });
    }

    // For recommendations, use specialized function
    if (intent.type === 'RECOMMENDATION') {
      const products = await Product.find({ isActive: true })
        .populate('category', 'name')
        .sort({ rating: -1, numReviews: -1 })
        .limit(10);
      
      return res.json({
        intent: 'RECOMMENDATION',
        response: 'Here are our top-rated products based on customer reviews.',
        action: 'SHOW_RESULTS',
        products: products
      });
    }

    // Use Gemini AI for complex queries or medium confidence
    const aiResponse = await handleComplexQuery(command, context);
    
    res.json(aiResponse);
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ 
      message: 'Error processing command',
      response: 'Sorry, I encountered an error. Please try again.'
    });
  }
};

// Handle simple rule-based commands
const handleSimpleCommand = (intent) => {
  const responses = {
    'NAVIGATE_HOME': {
      message: 'Taking you to the home page.',
      action: 'NAVIGATE',
      url: '/'
    },
    'ADD_TO_CART': {
      message: 'I can help you add items to your cart. Please select a product first, then say "add to cart".',
      action: null
    },
    'REMOVE_FROM_CART': {
      message: 'You can remove items from your cart by clicking the remove button.',
      action: 'VIEW_CART',
      url: '/cart'
    },
    'VIEW_CART': {
      message: 'Opening your shopping cart now.',
      action: 'NAVIGATE',
      url: '/cart'
    },
    'CHECKOUT': {
      message: 'Taking you to checkout.',
      action: 'NAVIGATE',
      url: '/checkout'
    },
    'SHOW_PRODUCTS': {
      message: 'Showing all products.',
      action: 'NAVIGATE',
      url: '/products'
    },
    'VIEW_ORDERS': {
      message: 'Opening your order history.',
      action: 'NAVIGATE',
      url: '/orders'
    },
    'SORT_PRICE_LOW': {
      message: 'Showing products from lowest to highest price.',
      action: 'NAVIGATE',
      url: '/products?sort=price-asc'
    },
    'SORT_PRICE_HIGH': {
      message: 'Showing products from highest to lowest price.',
      action: 'NAVIGATE',
      url: '/products?sort=price-desc'
    },
    'SORT_NEWEST': {
      message: 'Showing the newest products first.',
      action: 'NAVIGATE',
      url: '/products?sort=newest'
    },
    'HELP': {
      message: 'I can help you with: searching products, finding items by category or price, viewing your cart, checking out, and getting recommendations. Try saying "show me smartphones" or "find laptops under 1000".',
      action: null
    }
  };
  
  const result = responses[intent.type];
  if (result) {
    return result;
  }
  
  // Handle category search
  if (intent.type === 'SEARCH_CATEGORY') {
    return {
      message: `Let me find ${intent.category} for you.`,
      action: 'SEARCH_CATEGORY',
      category: intent.category
    };
  }
  
  // Handle price search
  if (intent.type === 'SEARCH_BY_PRICE') {
    return {
      message: `Searching for products under $${intent.maxPrice}.`,
      action: 'SEARCH_PRICE',
      maxPrice: intent.maxPrice
    };
  }
  
  if (intent.type === 'SEARCH_BY_PRICE_RANGE') {
    return {
      message: `Searching for products between $${intent.minPrice} and $${intent.maxPrice}.`,
      action: 'SEARCH_PRICE_RANGE',
      minPrice: intent.minPrice,
      maxPrice: intent.maxPrice
    };
  }
  
  return {
    message: 'How can I help you?',
    action: null
  };
};

// Handle complex queries with Gemini AI
const handleComplexQuery = async (command, context = {}) => {
  try {
    // Get relevant products based on command
    const products = await getRelevantProducts(command);
    const categories = await Category.find({ isActive: true });

    // If no API key, use fallback
    if (!process.env.GEMINI_API_KEY) {
      return {
        intent: 'FALLBACK',
        response: `I found ${products.length} products matching your search. Check them out!`,
        products: products.slice(0, 5),
        action: products.length > 0 ? 'SHOW_RESULTS' : null
      };
    }

    // Build context for AI
    const productContext = products.slice(0, 10).map(p => ({
      name: p.name,
      price: p.price,
      rating: p.rating,
      category: p.category?.name,
      brand: p.brand
    }));

    const prompt = `
You are a helpful shopping assistant for an e-commerce store. 

User command: "${command}"

Available products (sample):
${JSON.stringify(productContext, null, 2)}

Available categories: ${categories.map(c => c.name).join(', ')}

Context: ${JSON.stringify(context)}

Provide a helpful, concise response (2-3 sentences max). If recommending products, mention specific product names and why they're good choices. If the user is asking for price comparisons or searches, suggest relevant filters.

Response:`;

    // Use the updated model name for Gemini 1.5
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return {
      intent: 'AI_RESPONSE',
      response: text,
      products: products.slice(0, 5),
      action: 'SHOW_RESULTS'
    };
  } catch (error) {
    console.error('Gemini AI Error:', error);
    // Fallback to rule-based response
    const products = await getRelevantProducts(command);
    return {
      intent: 'FALLBACK',
      response: products.length > 0 
        ? `I found ${products.length} products for you. Take a look!`
        : 'I can help you find products. Try asking about specific items or categories.',
      products: products.slice(0, 5),
      action: products.length > 0 ? 'SHOW_RESULTS' : null
    };
  }
};

// Get relevant products based on command
const getRelevantProducts = async (command) => {
  const lowerCommand = command.toLowerCase();
  let query = { isActive: true };
  
  // Extract price if mentioned
  const priceMatch = lowerCommand.match(/(\d+)/);
  if (priceMatch && (lowerCommand.includes('under') || lowerCommand.includes('below'))) {
    query.price = { $lte: parseInt(priceMatch[1]) };
  }
  
  // Extract category mentions
  const categories = await Category.find({ isActive: true });
  for (let category of categories) {
    if (lowerCommand.includes(category.name.toLowerCase())) {
      query.category = category._id;
      break;
    }
  }
  
  // Search for product keywords
  const keywords = lowerCommand.split(' ').filter(word => word.length > 3);
  if (keywords.length > 0 && !query.category) {
    query.$or = keywords.map(keyword => ({
      $or: [
        { name: new RegExp(keyword, 'i') },
        { description: new RegExp(keyword, 'i') },
        { brand: new RegExp(keyword, 'i') }
      ]
    }));
  }
  
  try {
    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ rating: -1 })
      .limit(20);
    
    return products;
  } catch (error) {
    console.error('Product search error:', error);
    return [];
  }
};

// Search by category helper
const searchByCategory = async (categoryName) => {
  try {
    const category = await Category.findOne({ 
      name: new RegExp(categoryName, 'i'),
      isActive: true 
    });
    
    if (!category) {
      // Try to find products with keyword in name
      return await Product.find({ 
        $or: [
          { name: new RegExp(categoryName, 'i') },
          { description: new RegExp(categoryName, 'i') }
        ],
        isActive: true 
      })
      .populate('category', 'name')
      .sort({ rating: -1 })
      .limit(20);
    }
    
    return await Product.find({ 
      category: category._id,
      isActive: true 
    })
    .populate('category', 'name')
    .sort({ rating: -1 })
    .limit(20);
  } catch (error) {
    console.error('Category search error:', error);
    return [];
  }
};

// Search by price helper
const searchByPrice = async (minPrice, maxPrice) => {
  try {
    let query = { isActive: true };
    
    if (minPrice && maxPrice) {
      query.price = { $gte: minPrice, $lte: maxPrice };
    } else if (maxPrice) {
      query.price = { $lte: maxPrice };
    } else if (minPrice) {
      query.price = { $gte: minPrice };
    }
    
    return await Product.find(query)
      .populate('category', 'name')
      .sort({ price: 1 })
      .limit(20);
  } catch (error) {
    console.error('Price search error:', error);
    return [];
  }
};

// @desc    Get product recommendations
// @route   POST /api/ai/recommendations
// @access  Public
exports.getRecommendations = async (req, res) => {
  try {
    const { category, priceRange, preferences } = req.body;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (priceRange) {
      query.price = { 
        $gte: priceRange.min || 0,
        $lte: priceRange.max || 999999
      };
    }
    
    const products = await Product.find(query)
      .populate('category', 'name')
      .sort({ rating: -1, numReviews: -1 })
      .limit(10);
    
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search products with voice
// @route   POST /api/ai/search
// @access  Public
exports.voiceSearch = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }
    
    const products = await getRelevantProducts(query);
    
    res.json({
      query,
      results: products,
      count: products.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

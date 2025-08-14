
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Ollama } = require('ollama');

const app = express();
const port = 3001;


const ollama = new Ollama({ host: 'http://localhost:11435' });
console.log('🤖 Ollama client initialized at localhost:11435');


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'recipe_sharing',
  password: '12345678',
  port: 5432,
});


async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully to recipe_sharing');
    client.release();
  } catch (err) {
    console.error('❌ Database connection error:', err);
  }
}


if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
  console.log('📁 Created uploads directory');
}


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'recipe-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});


app.post('/api/recipes', upload.single('image'), async (req, res) => {
  console.log('📝 Received recipe submission:', req.body);
  console.log('📷 Uploaded file:', req.file);
  
  try {
    const { name, ingredients, steps, cooking_time } = req.body;
    
    if (!name || !ingredients || !steps || !cooking_time) {
      return res.status(400).json({ 
        success: false,
        error: 'All fields except image are required' 
      });
    }
    
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    
    const result = await pool.query(
      'INSERT INTO recipes (name, ingredients, steps, cooking_time, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, ingredients, steps, cooking_time, imageUrl]
    );
    
    console.log('✅ Recipe created successfully:', result.rows[0]);
    
    res.status(201).json({
      success: true,
      message: 'Recipe shared successfully!',
      recipe: result.rows[0]
    });
  } catch (err) {
    console.error('❌ Database error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to save recipe. Please try again.' 
    });
  }
});

// 获取所有食谱
app.get('/api/recipes', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM recipes ORDER BY created_at DESC'
    );
    
    res.json({
      success: true,
      recipes: result.rows
    });
  } catch (err) {
    console.error('❌ Database error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch recipes' 
    });
  }
});

// 搜索食谱 - 根据食材搜索
app.get('/api/recipes/search', async (req, res) => {
  try {
    const { ingredient } = req.query;
    
    if (!ingredient || ingredient.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide an ingredient to search for'
      });
    }
    
    console.log('🔍 Searching for recipes with ingredient:', ingredient);
    
    // 使用ILIKE进行不区分大小写的模糊搜索
    const result = await pool.query(
      'SELECT id, name, ingredients, steps, cooking_time, image_url FROM recipes WHERE ingredients ILIKE $1 ORDER BY created_at DESC',
      [`%${ingredient.trim()}%`]
    );
    
    console.log('📊 Found', result.rows.length, 'recipes');
    
    res.json({
      success: true,
      recipes: result.rows,
      searchTerm: ingredient.trim(),
      count: result.rows.length
    });
  } catch (err) {
    console.error('❌ Search error:', err);
    res.status(500).json({ 
      success: false,
      error: 'Failed to search recipes' 
    });
  }
});

// AI菜谱建议 - 基于现有食材推荐新菜谱
app.post('/api/suggest-recipe', async (req, res) => {
  console.log('🎲 Received AI suggestion request:', req.body);
  
  try {
    const { ingredients } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide at least one ingredient'
      });
    }
    
    console.log('🤖 Calling Ollama for recipe suggestion with ingredients:', ingredients);
    
    // 构建提示词
    let prompt;
        if (ingredients.includes('surprise me')) {
            prompt = `You are a creative chef helping users discover new recipes. Please suggest ONE delicious and interesting recipe with common ingredients that most people have at home.

Please respond ONLY with a valid JSON object in this exact format:
{
    "title": "Recipe name",
    "ingredients": ["ingredient1", "ingredient2", "ingredient3"],
    "instructions": "Step-by-step cooking instructions",
  "cookingTime": "25 minutes",
  "wasteReduction": "How this recipe helps reduce food waste or makes good use of common ingredients"
}

Make sure the recipe is practical, uses common ingredients, and the instructions are clear and easy to follow.`;
        } else {
            prompt = `You are a creative chef helping users reduce food waste. Based on the following ingredients: ${ingredients.join(', ')}, please suggest ONE delicious recipe that uses as many of these ingredients as possible.

Please respond ONLY with a valid JSON object in this exact format:
{
  "title": "Recipe name",
  "ingredients": ["ingredient1", "ingredient2", "ingredient3"],
  "instructions": "Step-by-step cooking instructions",
  "cookingTime": "25 minutes",
  "wasteReduction": "How this recipe helps reduce food waste"
}

Make sure the recipe is practical and uses common cooking techniques. The instructions should be clear and easy to follow.`;
        }
    
    // 调用Ollama
    const response = await ollama.chat({
      model: 'llama3.2:3b', // 使用WSL2中的轻量级模型
      messages: [{ role: 'user', content: prompt }],
      stream: false
    });
    
    console.log('🤖 Raw Ollama response:', response.message.content);
    
    // 尝试解析JSON响应
    let suggestion;
    try {
      // 清理响应，移除可能的markdown代码块标记
      let cleanedResponse = response.message.content.trim();
      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedResponse.startsWith('```')) {
        cleanedResponse = cleanedResponse.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      suggestion = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('❌ Failed to parse AI response as JSON:', parseError);
      
      // 如果解析失败，返回一个默认的建议
      suggestion = {
        title: "Ingredient Stir-Fry",
        ingredients: ingredients.concat(["soy sauce", "garlic", "oil"]),
        instructions: `Heat oil in a pan, add minced garlic, then add ${ingredients.join(', ')} and stir-fry for 5-10 minutes. Season with soy sauce and serve hot.`,
        cookingTime: "15 minutes",
        wasteReduction: "This recipe helps you use up various ingredients in your fridge, preventing them from going bad."
      };
    }
    
    console.log('✅ Processed suggestion:', suggestion);
    
    res.json({
      success: true,
      suggestion: suggestion,
      inputIngredients: ingredients
    });
    
  } catch (err) {
    console.error('❌ AI suggestion error:', err);
    
    // 如果Ollama服务不可用，返回一个友好的错误信息
    if (err.code === 'ECONNREFUSED' || err.message.includes('connect')) {
      res.status(503).json({
        success: false,
        error: 'AI service is temporarily unavailable. Please make sure Ollama is running.'
      });
    } else {
      res.status(500).json({ 
        success: false,
        error: 'Failed to generate recipe suggestion. Please try again.'
      });
    }
  }
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// 错误处理
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File too large. Maximum size is 5MB.'
      });
    }
  }
  
  console.error('❌ Unexpected error:', error);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!'
  });
});

// 启动服务器
app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
  console.log(`📊 API endpoints available:`);
  console.log(`   POST http://localhost:${port}/api/recipes - Create recipe`);
  console.log(`   GET  http://localhost:${port}/api/recipes - Get all recipes`);
  console.log(`   GET  http://localhost:${port}/api/recipes/search?ingredient=<name> - Search recipes`);
  console.log(`   POST http://localhost:${port}/api/suggest-recipe - AI recipe suggestions`);
  console.log(`   GET  http://localhost:${port}/api/health - Health check`);
  console.log(`🤖 Ollama integration enabled at localhost:11435`);
  testConnection();
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  pool.end(() => {
    console.log('📊 Database pool closed');
    process.exit(0);
  });
});
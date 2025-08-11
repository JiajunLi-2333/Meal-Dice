// 服务器启动脚本 (CommonJS格式)
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// 数据库连接配置
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'recipe_sharing',
  password: '12345678',
  port: 5432,
});

// 测试数据库连接
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Database connected successfully to recipe_sharing');
    client.release();
  } catch (err) {
    console.error('❌ Database connection error:', err);
  }
}

// 创建uploads目录
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
  console.log('📁 Created uploads directory');
}

// 配置multer用于文件上传
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

// API路由

// 创建新食谱
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
  console.log(`   GET  http://localhost:${port}/api/health - Health check`);
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
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const { checkSchema, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

// Secret for signing JWT tokens
const JWT_SECRET = 'supersecretkey';
const JWT_EXPIRATION = '1h';

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Rate Limiting (e.g., 100 requests per 15 minutes)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use(apiLimiter);

// Swagger Documentation Setup
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Mock API Server',
            version: '1.0.0',
            description: 'API documentation for the mock server with enhanced features',
        },
        servers: [{ url: `http://localhost:${port}` }],
    },
    apis: ['./server.js'], // Files with documentation comments
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Create and initialize SQLite database
const db = new sqlite3.Database('./mockapi.db');

// Initialize tables (if not exists)
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        productId INTEGER UNIQUE,
        name TEXT,
        stock INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        productId INTEGER,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (productId) REFERENCES products(id)
    )`);
});

/**
 * Middleware to validate JWT token for protected routes
 */
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token is required' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

/**
 * Role-based Authorization Middleware
 */
function authorizeRole(role) {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ error: 'Access denied' });
        }
        next();
    };
}

/**
 * Register a new user.
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *               - role
 *     responses:
 *       201:
 *         description: User registered successfully
 */
app.post('/register', async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ error: 'Username, password, and role are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if user already exists
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (user) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Insert user into the database
        db.run('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(201).json({ userId: this.lastID, username });
        });
    });
});

/**
 * Login a user and return a token.
 * @swagger
 * /login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 */
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token for the user
        const token = jwt.sign({ userId: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
        res.status(200).json({ token });
    });
});

/**
 * Add a product to the system (requires admin role).
 * @swagger
 * /addProduct:
 *   post:
 *     summary: Add a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *               name:
 *                 type: string
 *               stock:
 *                 type: integer
 *             required:
 *               - productId
 *               - name
 *               - stock
 *     responses:
 *       201:
 *         description: Product added successfully
 */
app.post('/addProduct', authenticateToken, authorizeRole('admin'), checkSchema({
    productId: {
        in: ['body'],
        isInt: true,
        errorMessage: 'Product ID must be an integer',
    },
    name: {
        in: ['body'],
        isString: true,
        errorMessage: 'Product name must be a string',
    },
    stock: {
        in: ['body'],
        isInt: true,
        errorMessage: 'Stock must be an integer',
    }
}), (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { productId, name, stock } = req.body;

    db.get('SELECT * FROM products WHERE productId = ?', [productId], (err, product) => {
        if (product) {
            return res.status(409).json({ error: 'Product already exists' });
        }

        db.run('INSERT INTO products (productId, name, stock) VALUES (?, ?, ?)', [productId, name, stock], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Internal server error' });
            }
            res.status(201).json({ productId: this.lastID });
        });
    });
});

/**
 * Fetch paginated products (public).
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products with pagination
 *     tags: [Products]
 *     parameters:
 *       - name: page
 *         in: query
 *         description: Page number
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: Number of items per page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Successfully retrieved products
 */
app.get('/products', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    db.all('SELECT * FROM products LIMIT ? OFFSET ?', [limit, offset], (err, products) => {
        if (err) {
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.status(200).json({ page, limit, products });
    });
});

/**
 * Handle 404 for undefined routes.
 */
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Start the server
app.listen(port, () => {
    console.log(`Mock server running at http://localhost:${port}`);
});

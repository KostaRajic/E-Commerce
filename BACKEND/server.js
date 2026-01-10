import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import { checkConnection, pool } from './database.js';
import backendProducts from './data/products.js';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:2000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

async function seedAdmin() {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const email = 'admin@shop.com';

    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length === 0) {
        await pool.query(
            `INSERT INTO users(firstName, lastName, email, password, role) VALUES (?, ?, ?, ?, ?)`,
            ['admin', 'user', email, hashedPassword, 'admin'])
        console.log('Admin created successfully.');
    } else {
        console.log('Admin already exists.');
    }
}

app.post('/api/user', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ error: 'Name and email and password are required.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const query = `
            INSERT INTO users (firstName, lastName, email, password, role)
            VALUES (?, ?, ?, ?, ?)
        `

        const role = 'user'
        await pool.query(query, [firstName, lastName, email, hashedPassword, role])
        console.log('User recived from:', firstName, lastName);
        res.status(201).json({ message: 'User registered successfully!' });
    }
    catch (err) {
        console.error('Error saving user:', err);
        res.status(500).json({ error: 'Error saving user.' });
    }

})

app.get('/api/users', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT id, firstName, lastName, email, password, role FROM users WHERE role != 'admin'");
        res.json(rows);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Error fetching users." });
    }
});

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) return res.status(401).json({ error: 'No token provided!' })

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" })

        req.user = user;
        next()
    })
}

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' })
    }

    try {
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            return res.json({ auth: false, msg: "USER NOT FOUND" });
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password.' });
        }

        const token = jwt.sign({
            id: user.id, email: user.email, role: user.role
        },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

        res.json({
            message: "Login successful!",
            token,
            user: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                auth: true
            }
        })

    }
    catch (e) {
        console.log('Error: ', e);
        res.status(500).json({ error: "Server error." })
    }
})

async function seedProducts() {
    try {

        for (let p of backendProducts) {

            const [rows] = await pool.query(`SELECT id FROM products WHERE name = ?`, [p.name])
            if (rows.length === 0) {
                await pool.query(`
            INSERT INTO products (name, price, img, rating, category, description )
            VALUES (?, ?, ?, ?, ?, ?)`
                    , [
                        p.name,
                        p.price,
                        p.img,
                        parseFloat(p.rating),
                        p.category,
                        p.description
                    ]
                )
            }

        }
        console.log("All  products in the database");
    } catch (err) {
        console.error("Error seeding products:", err);
    }
}


app.post('/api/products', async (req, res) => {
    const { name, price, img, rating, category, description } = req.body;
    try {
        const query = `
            INSERT INTO products (name, price, img, rating, category, description )
            VALUES (?, ?, ?, ?, ?, ?)
        `
        await pool.query(query, [name, price, img, rating, category, description])
        console.log('Product recived:', name);
        res.status(201).json({ message: 'Product recived successfully!' });
    }
    catch (err) {
        console.error('Error saving user:', err);
        res.status(500).json({ error: 'Error saving user.' });
    }
})

app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM products`)
        res.json(rows)
    } catch (e) {
        console.error(err);
        res.status(500).json({ error: 'Server error' })
    }
})

app.get('/api/products/:id', authenticateToken, async (req, res) => {
    try {
        const [rows] = await pool.query(`SELECT * FROM products WHERE id = ?`, [req.params.id])
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(rows)
    } catch (e) {
        console.error(err);
        res.status(500).json({ error: 'Server error' })
    }
})

app.use('/images', express.static('public/images'));

const PORT = process.env.PORT || 2010;

app.listen(PORT, async () => {
    console.log('Server is running on http://localhost:2010')
    await checkConnection()
    await seedProducts();
    await seedAdmin();
})
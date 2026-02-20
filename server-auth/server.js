const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Enkripsi password
const jwt = require('jsonwebtoken'); // Token JWT

const app = express();
app.use(cors());
app.use(bodyParser.json());

const SECRET_KEY = "kunci_rahasia_akses"; // Kunci token JWT

// ============================
// 1. KONEKSI DATABASE
// ============================
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'p12kampus'
});

db.connect((err) => {
  if (err) {
    console.log('❌ Database error:', err);
  } else {
    console.log('✅ Database connected');
  }
});

// ============================
// 2. ENDPOINT REGISTER
// ============================
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke DB
    const sql = 'INSERT INTO users (username, password_hash) VALUES (?, ?)';
    db.query(sql, [username, hashedPassword], (err, result) => {
      if (err) {
        return res.status(400).json({ error: 'Username sudah digunakan!' });
      }
      res.json({ message: 'Registrasi berhasil!' });
    });

  } catch (error) {
    res.status(500).json({ error: 'Server error saat register' });
  }
});

// ============================
// 3. ENDPOINT LOGIN
// ============================
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Cari user
  db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
    if (results.length === 0) {
      return res.status(401).json({ error: 'Username tidak ditemukan!' });
    }

    const user = results[0];

    // Cek password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Password salah!' });
    }

    // Buat token
    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login sukses',
      token: token
    });
  });
});

// ============================
// 4. JALANKAN SERVER
// ============================
app.listen(3000, () => {
  console.log('🚀 Server Auth berjalan di http://localhost:3000');
});

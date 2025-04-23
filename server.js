const express = require('express');
const jwt = require('jsonwebtoken');
const { encrypt, decrypt } = require('./script');

const app = express();
app.use(express.json());

const SECRET_KEY = 'mySuperSecretKey123';


// Dummy login endpoint
app.post('/login', (req, res) => {
  const { username } = req.body;
  const userPayload = { username, role: 'student' };

  const token = jwt.sign(userPayload, SECRET_KEY, { expiresIn: '1h' });

  res.json({ token });
});

// ✅ Protected dashboard endpoint
app.get('/dashboard', (req, res) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token required' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({
      message: 'Welcome to your dashboard!',
      user: decoded
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});

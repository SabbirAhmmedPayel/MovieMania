const express = require('express');
const router = express.Router();
const { pool } = require('../pool');





async function signup(username, name, email, birthDate, password) {
  const query = `
    INSERT INTO "Users" (username, "Name", "Email", "BirthDate", password)
    VALUES ($1, $2, $3, $4, $5)
  `;
  const values = [username, name, email, birthDate, password];

  try {
    await pool.query(query, values);
    console.log('✅ User registered:', username);
    return true;
  } catch (err) {
    console.error('Signup error:', err);

    if (err.code === '23505') { // unique violation
      console.error('❌ Username or Email already exists');
    }
    
    // Check for invalid input errors
    if (err.code === '22007') { // invalid_datetime format
      console.error('❌ Invalid date format for BirthDate');
    }

    return false;
  }
};


async function signin(username, password) {
   const query = `
    SELECT username, "Name", "Email", "BirthDate", iseditor
    FROM "Users"
    WHERE username = $1 AND password = $2
    LIMIT 1
  `;
  const values = [username, password];

  try {
    const result = await pool.query(query, values);
    if (result.rows.length === 1) {
      return result.rows[0]; // user object with iseditor
    } else {
      return null; // invalid credentials
    }
  } catch (err) {
    console.error('❌ Signin error:', err.message);
    throw err;
  }

}

// Signup route
router.post('/signup', async (req, res) => {
  const { username, name, email, birthDate, password } = req.body;

  if (!username || !name || !email || !birthDate || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const success = await signup(username, name, email, birthDate, password);
    if (success) {
      return res.status(201).json({ message: 'User registered successfully' });
    } else {
      return res.status(409).json({ error: 'Username or Email already exists' });
    }
  } catch (err) {
    console.error('Signup route error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Signin route
router.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  try {
    const user = await signin(username, password);
    if (user) {
      return res.status(200).json({ message: 'Sign-in successful', user });
    } else {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (err) {
    console.error('Signin route error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

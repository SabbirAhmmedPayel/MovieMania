import React, { useState } from 'react';

function Signup() {
  const [form, setForm] = useState({
    username: '',
    name: '',
    email: '',
    birthDate: '',
    password: '',
  });

  const [message, setMessage] = useState('');

  // Handle input changes
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit signup data to backend
  const handleSignup = async () => {
    // Basic validation (optional)
    if (!form.username || !form.name || !form.email || !form.birthDate || !form.password) {
      setMessage('Please fill all fields');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Signup successful! Please sign in.');
        setForm({ username: '', name: '', email: '', birthDate: '', password: '' });
      } else {
        setMessage(data.error || 'Signup failed');
      }
    } catch (error) {
      setMessage('Error connecting to server');
      console.error(error);
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>

      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
      />

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        name="birthDate"
        type="date"
        placeholder="Birth Date"
        value={form.birthDate}
        onChange={handleChange}
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />

      <button onClick={handleSignup}>Sign Up</button>

      <p className={`message ${message.includes('successful') ? 'success' : ''}`}>
        {message}
      </p>
    </div>

    
  );
}

export default Signup;

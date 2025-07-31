// src/components/Signin.js
import React, { useState } from 'react';
import '../styles/Signin.css';


function Signin({ onLogin }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignin = async () => {
    const res = await fetch('http://localhost:3000/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (res.ok) {
      setMessage(`Welcome, ${data.user.Name}!`);
       onLogin(data.user);
    } else {
      setMessage(data.error || 'Signin failed');
    }
  };

return (
  <div className="form-container">
    <h2>Sign In</h2>
    <input
      placeholder="Username"
      value={username}
      onChange={e => setUsername(e.target.value)}
    />
    <input
      placeholder="Password"
      type="password"
      value={password}
      onChange={e => setPassword(e.target.value)}
    />
    <button onClick={handleSignin}>Sign In</button>
    <p className={`message ${message.includes('Welcome') ? 'success' : ''}`}>{message}</p>
  </div>
);

}

export default Signin;

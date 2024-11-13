import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'username') {
      setUsername(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch('http://localhost:3001/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
      .then(async (response) => {
        if (!response.ok) {
          const json = await response.json();
          throw new Error(json.message || 'Login failed');
        }
        const { token } = await response.json();
        localStorage.setItem('token', token); // Store token in localStorage
        navigate('/'); // Redirect to home page after successful login
      })
      .catch((error) => {
        console.error('Error during login:', error);
        alert('Login failed: ' + error.message);
      });
  };

  const clickedCreateAccountBtn = () =>{
    navigate("/signup")
  }

  return (
    <div className="login-page">
        <div className = "login-form-container">
      <h1 className="login-page-heading">Login Here</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <br/>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={handleChange}
            className = "input-field"
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <br/>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handleChange}
            className = "input-field"
            required
          />
        </div>
        <button type="submit" className = "login-btn">Login</button>

        <button type="submit" className = "alrdy-have-acnt-btn" onClick = {clickedCreateAccountBtn}>Create Account?</button>
      </form>
      </div>
    </div>
  );
};

export default LoginPage;

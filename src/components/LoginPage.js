import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
 
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });
      console.log(response.data);

      if (response.data.role) {
        localStorage.setItem('role', response.data.role);
        if (response.data.role === 'admin') {
          navigate('/admin');
        } else {
          setError('Only admins can access this page');
        }
      }
    } catch (error) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          className="login-input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" type="submit">
          Login
        </button>
      </form>
      {error && <div className="login-error">{error}</div>}
    </div>
  );
}

export default LoginPage;

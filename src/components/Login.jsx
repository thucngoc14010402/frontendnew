import React, { useState } from 'react';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';

  function Login() {
    const [formData, setFormData] = useState({ phoneNumber: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://localhost:8081/api/v1/members/login', formData);
        alert("Login successful!");
        navigate('/'); // Redirect to home or dashboard
      } catch (error) {
        console.error("Login error:", error.response ? error.response.data : error.message);
        setError("Login failed! Check credentials or console.");
      }
    };

    return (
      <div className="container mt-5" style={{ maxWidth: '400px', background: '#f0f0f0', padding: '20px', borderRadius: '10px' }}>
        <h2 className="text-primary text-center mb-4">Member Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Phone Number *</label>
            <input type="tel" className="form-control" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password *</label>
            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-warning w-100 mb-3">Login</button>
          <p className="text-center">
            Don’t have an account? <a href="/">Register now</a>
          </p>
        </form>
      </div>
    );
  }

  export default Login;
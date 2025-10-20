import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Alert } from 'react-bootstrap';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  // Email regex for validation
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const validateForm = () => {
    const newErrors = [];

    // Email validation
    if (!email) {
      newErrors.push('Email is required');
    } else if (!emailRegex.test(email)) {
      newErrors.push('Please enter a valid email address');
    }

    // Password validation
    if (!password) {
      newErrors.push('Password is required');
    } else if (password.length < 6) {
      newErrors.push('Password must be at least 6 characters long');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run validation
    if (!validateForm()) {
      return;
    }

    // Proceed with login if validation passes
    const success = await login(email, password);
    if (success) {
      setErrors([]); // Clear errors on successful login
      navigate('/quizzes');
    } else {
      setErrors(['Login failed. Please check your credentials.']);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center mb-4">Login</h2>

      {/* Error Alert */}
      {errors.length > 0 && (
        <Alert
          variant="danger"
          onClose={() => setErrors([])}
          dismissible
          className="w-50 mx-auto"
        >
          <Alert.Heading>Validation Errors</Alert.Heading>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="w-50 mx-auto">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.length > 0) setErrors([]); // Clear errors on input change
            }}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.length > 0) setErrors([]); // Clear errors on input change
            }}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={errors.length > 0}
        >
          Login
        </button>
      </form>
      <p className="text-center mt-3">
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default Login;
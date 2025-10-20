import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Alert } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);

  // Email regex for validation
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const validateForm = () => {
    const newErrors = [];

    // Name validation
    if (!name) {
      newErrors.push('Name is required');
    } else if (name.length < 3) {
      newErrors.push('Name must be at least 3 characters long');
    }

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

    // Proceed with registration
    try {
      const success = await register(name, email, password);
      if (success) {
        toast.success('Registration successful!', {
          position: 'top-center',
          autoClose: 3000,
        });
        setErrors([]);
        navigate('/quizzes');
      } else {
        toast.error('Registration failed. Please try again.', {
          position: 'top-center',
          autoClose: 3000,
        });
        setErrors(['Registration failed. Please check your details.']);
      }
    } catch (err) {
      toast.error('Registration failed. Please try again.', {
        position: 'top-center',
        autoClose: 3000,
      });
      setErrors(['Registration failed due to server error.']);
    }
  };

  return (
    <div className="container my-5">
      <ToastContainer />
      <h2 className="text-center mb-4">Register</h2>

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
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.length > 0) setErrors([]);
            }}
            required
          />
        </div>
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
              if (errors.length > 0) setErrors([]);
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
              if (errors.length > 0) setErrors([]);
            }}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={errors.length > 0}
        >
          Register
        </button>
      </form>
      <p className="text-center mt-3">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Register;
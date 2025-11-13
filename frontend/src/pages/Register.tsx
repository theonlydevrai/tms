/**
 * Register Page (UC1) - Enhanced Version
 * Features:
 * - Password strength validation
 * - Email validation
 * - Phone number validation
 * - Confirm password field
 * - Better error handling
 * - Loading states
 */

import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  Paper,
  LinearProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on input change
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
  };

  const getPasswordStrength = (password: string): {
    score: number;
    label: string;
    color: string;
  } => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { score: 33, label: 'Weak', color: 'error' };
    if (score <= 4) return { score: 66, label: 'Medium', color: 'warning' };
    return { score: 100, label: 'Strong', color: 'success' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return 'Please enter your full name';
    }

    if (!formData.email.trim()) {
      return 'Please enter your email address';
    }

    if (!validateEmail(formData.email)) {
      return 'Please enter a valid email address';
    }

    if (!formData.phoneNumber.trim()) {
      return 'Please enter your phone number';
    }

    if (!validatePhoneNumber(formData.phoneNumber)) {
      return 'Please enter a valid 10-digit phone number';
    }

    if (!formData.password) {
      return 'Please enter a password';
    }

    if (formData.password.length < 8) {
      return 'Password must be at least 8 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register(formData);
      localStorage.setItem('accessToken', response.data.tokens.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/movies');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Create Account
          </Typography>

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="name"
              label="Full Name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
              error={formData.name.length > 0 && formData.name.trim().length < 2}
              helperText={
                formData.name.length > 0 && formData.name.trim().length < 2
                  ? 'Name must be at least 2 characters'
                  : ''
              }
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={formData.email.length > 0 && !validateEmail(formData.email)}
              helperText={
                formData.email.length > 0 && !validateEmail(formData.email)
                  ? 'Please enter a valid email'
                  : ''
              }
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="phoneNumber"
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={formData.phoneNumber.length > 0 && !validatePhoneNumber(formData.phoneNumber)}
              helperText={
                formData.phoneNumber.length > 0 && !validatePhoneNumber(formData.phoneNumber)
                  ? 'Enter a valid 10-digit phone number'
                  : ''
              }
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {formData.password && (
              <Box sx={{ mt: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Password strength:
                  </Typography>
                  <Typography
                    variant="caption"
                    color={`${passwordStrength.color}.main`}
                    fontWeight="bold"
                  >
                    {passwordStrength.label}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={passwordStrength.score}
                  color={passwordStrength.color as any}
                  sx={{ height: 6, borderRadius: 1 }}
                />
              </Box>
            )}

            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              error={
                formData.confirmPassword.length > 0 &&
                formData.password !== formData.confirmPassword
              }
              helperText={
                formData.confirmPassword.length > 0 &&
                formData.password !== formData.confirmPassword
                  ? 'Passwords do not match'
                  : ''
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Link href="/login" variant="body2">
                Already have an account? Login
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;

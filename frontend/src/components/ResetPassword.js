import React, { useState } from 'react';
import {
  Avatar,
  Button,
  TextField,
  Typography,
  Container,
  Box,
  Alert,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import axios from 'axios';
import config from '../config';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(config.RESET_PASSWORD_URL, { email });
      setMessage('Password reset instructions have been sent to your email.');
      setMessageType('success');
    } catch (error) {
      console.error('Password reset failed:', error);
      let errorMsg = 'Failed to send password reset email.';
      if (error.response && error.response.data && error.response.data.detail) {
        errorMsg = error.response.data.detail;
      }
      setMessage(errorMsg);
      setMessageType('error');
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
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockResetIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Reset Password
        </Typography>
        {message && (
          <Alert severity={messageType} sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Send Reset Email
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ResetPassword; 
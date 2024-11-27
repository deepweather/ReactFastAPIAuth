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
import { useParams, useNavigate } from 'react-router-dom';
import config from '../config';

function ResetPasswordConfirm() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('info');
  const { zs_token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(`${config.RESET_PASSWORD_CONFIRM_URL}/${zs_token}`, {
        new_password: password,
      });
      setMessage('Your password has been reset successfully.');
      setMessageType('success');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      console.error('Password reset failed:', error);
      let errorMsg = 'Failed to reset password.';
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
          Set New Password
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
            label="New Password"
            type="password"
            name="password"
            autoComplete="new-password"
            autoFocus
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Reset Password
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default ResetPasswordConfirm; 
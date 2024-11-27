import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  TextField,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  checkAuthentication,
  getCurrentUser,
  updateUser,
  deleteUser,
  logoutUser,
} from '../utils/auth';

function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);
  const [formValues, setFormValues] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authenticate = async () => {
      const authStatus = await checkAuthentication();
      if (!authStatus) {
        navigate('/login');
        return;
      }
      setIsAuthenticated(authStatus);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setFormValues({
        name: currentUser.name || '',
        email: currentUser.email || '',
        password: '',
      });
      setLoading(false);
    };

    authenticate();
  }, [navigate]);

  if (isAuthenticated === null || loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleUpdateUser = async (event) => {
    event.preventDefault();
    try {
      const updatedUser = await updateUser(user.id, {
        name: formValues.name,
        email: formValues.email,
        password: formValues.password || undefined, // Only send password if changed
      });
      setUser(updatedUser);
      alert('User information updated successfully.');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user information.');
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(user.id);
      alert('Your account has been deleted.');
      navigate('/signup'); // Redirect to signup or homepage after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete your account.');
    }
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Box mt={4}>
          <Typography variant="h4" gutterBottom>
            Welcome, {user.name || user.email}!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Profile Information
          </Typography>
          <form onSubmit={handleUpdateUser}>
            <TextField
              label="Name"
              name="name"
              value={formValues.name}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={formValues.email}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="email"
            />
            <TextField
              label="Password"
              name="password"
              value={formValues.password}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="password"
              helperText="Leave blank to keep current password"
            />
            <Box mt={2} display="flex" justifyContent="space-between">
              <Button variant="contained" color="primary" type="submit">
                Update Profile
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleOpenDeleteDialog}>
                Delete Account
              </Button>
            </Box>
          </form>
        </Box>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete your account? This action is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteUser} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Dashboard; 
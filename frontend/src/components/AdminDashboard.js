import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  CircularProgress,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { checkAdminAuthentication } from '../utils/auth';
import { getPendingUsers, activateUser, getAllUserIds, getUserById } from '../api/admin';

function AdminDashboard() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [allUserIds, setAllUserIds] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetailsOpen, setUserDetailsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authenticate = async () => {
      const authStatus = await checkAdminAuthentication();
      if (!authStatus) {
        navigate('/login');
      } else {
        setIsAdminAuthenticated(true);
        try {
          const [users, userIds] = await Promise.all([
            getPendingUsers(),
            getAllUserIds(),
          ]);
          setPendingUsers(users);
          setAllUserIds(userIds);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    authenticate();
  }, [navigate]);

  if (isAdminAuthenticated === null) {
    // Render a loading indicator
    return <CircularProgress />;
  }

  const handleLogout = () => {
    // Perform logout actions
    navigate('/logout');
  };

  const handleActivateUser = async (userId) => {
    try {
      await activateUser(userId);
      // Refresh the list of pending users after activation
      const users = await getPendingUsers();
      setPendingUsers(users);
    } catch (error) {
      console.error('Error during user activation:', error);
    }
  };

  const handleViewUserDetails = async (userId) => {
    try {
      const user = await getUserById(userId);
      setSelectedUser(user);
      setUserDetailsOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleCloseUserDetails = () => {
    setUserDetailsOpen(false);
    setSelectedUser(null);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Admin Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Grid container spacing={3} sx={{ padding: 3 }}>
        <Grid item xs={12}>
          <Typography variant="h4">Welcome to your Admin Dashboard!</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">Pending Users</Typography>
            {pendingUsers.length === 0 ? (
              <Typography>No pending users.</Typography>
            ) : (
              <List>
                {pendingUsers.map((user) => (
                  <ListItem key={user.id} divider>
                    <ListItemText
                      primary={`${user.name} - ${user.email}`}
                      secondary={`ID: ${user.id}`}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleActivateUser(user.id)}
                      sx={{ marginRight: 1 }}
                    >
                      Activate
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => handleViewUserDetails(user.id)}
                    >
                      View Details
                    </Button>
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">All Users</Typography>
            <List>
              {allUserIds.map((userId) => (
                <ListItem key={userId} divider>
                  <ListItemText primary={`User ID: ${userId}`} />
                  <Button
                    variant="outlined"
                    onClick={() => handleViewUserDetails(userId)}
                  >
                    View Details
                  </Button>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        open={userDetailsOpen}
        onClose={handleCloseUserDetails}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser ? (
            <div>
              <Typography><strong>ID:</strong> {selectedUser.id}</Typography>
              <Typography><strong>Name:</strong> {selectedUser.name}</Typography>
              <Typography><strong>Email:</strong> {selectedUser.email}</Typography>
              <Typography><strong>Status:</strong> {selectedUser.status}</Typography>
              <Typography><strong>Role:</strong> {selectedUser.role}</Typography>
            </div>
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUserDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AdminDashboard;

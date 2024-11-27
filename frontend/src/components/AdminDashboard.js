import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { checkAdminAuthentication } from '../utils/auth';
import { getPendingUsers, activateUser } from '../api/admin';

function AdminDashboard() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const authenticate = async () => {
      const authStatus = await checkAdminAuthentication();
      if (!authStatus) {
        navigate('/login');
      } else {
        setIsAdminAuthenticated(true);
        try {
          const users = await getPendingUsers();
          setPendingUsers(users);
        } catch (error) {
          console.error('Error fetching pending users:', error);
        }
      }
    };

    authenticate();
  }, [navigate]);

  if (isAdminAuthenticated === null) {
    // Optionally, render a loading indicator
    return null;
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
      <h1>Welcome to your Admin Dashboard!</h1>
      <h2>Pending Users</h2>
      <ul>
        {pendingUsers.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
            <Button onClick={() => handleActivateUser(user.id)}>Activate</Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminDashboard;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { checkAuthentication } from '../utils/auth';

function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const authenticate = async () => {
      const authStatus = await checkAuthentication();
      if (!authStatus) {
        navigate('/login');
      }
      setIsAuthenticated(authStatus);
    };

    authenticate();
  }, [navigate]);

  if (isAuthenticated === null) {
    return null;
  }

  const handleLogout = () => {
    navigate('/logout');
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
      <h1>Welcome to your Dashboard!</h1>
    </div>
  );
}

export default Dashboard; 
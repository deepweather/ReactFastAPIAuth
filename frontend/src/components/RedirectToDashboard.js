import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthentication } from '../utils/auth';

function RedirectToDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = async () => {
      const isAuthenticated = await checkAuthentication();

      if (isAuthenticated) {
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    };

    redirect();
  }, [navigate]);

  return null;
}

export default RedirectToDashboard; 
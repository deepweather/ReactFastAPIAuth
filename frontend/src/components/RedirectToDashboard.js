import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';

function RedirectToDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = async () => {
      const user = await getCurrentUser();

      if (user) {
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        navigate('/login');
      }
    };

    redirect();
  }, [navigate]);

  return null;
}

export default RedirectToDashboard; 
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('zs_token');
    navigate('/');
  }, [navigate]);

  return null;
}

export default Logout; 
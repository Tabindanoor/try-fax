
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();
  
  // Redirect to Home page
  useEffect(() => {
    navigate('/home');
  }, [navigate]);
  
  return null;
};

export default Index;

import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { isAuthenticated, handleTokenExpiration } from '../utils/authUtils';

interface TokenGuardProps {
  children: React.ReactNode;
}

export const TokenGuard: React.FC<TokenGuardProps> = ({ children }) => {
  const { isLoggedIn, logoutDueToExpiration } = useAppContext();

  useEffect(() => {
    // Function to check token validity periodically
    const checkTokenValidity = () => {
      if (isLoggedIn && !isAuthenticated()) {
        // User is supposed to be logged in but tokens are missing
        logoutDueToExpiration();
        handleTokenExpiration();
      }
    };

    // Check immediately
    checkTokenValidity();

    // Set up periodic check every 30 seconds
    const interval = setInterval(checkTokenValidity, 30000);

    return () => clearInterval(interval);
  }, [isLoggedIn, logoutDueToExpiration]);

  return <>{children}</>;
};

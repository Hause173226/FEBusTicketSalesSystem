import { userServices } from './userServices';

export const signoutService = {
  /**
   * Handle user signout
   * - Clears local storage
   * - Calls the signout API endpoint
   * 
   * @returns {Promise<boolean>} True if signout successful
   */
  handleSignout: async () => {
    try {
      // Call the signout API endpoint first
      await userServices.signout();
      
      // Then clear all data from localStorage
      localStorage.clear();

      // Redirect to login page without showing notification
      window.location.href = '/login';
      
      return true;
    } catch (error) {
      // Even if API call fails, we still want to clear local storage and redirect
      localStorage.clear();
      window.location.href = '/login';
      return false;
    }
  }
}; 
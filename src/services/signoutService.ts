import { userServices } from "./userServices";

export const signoutService = {
  /**
   * Handles the complete sign out process
   * - Calls the signout API endpoint
   * - Clears local storage tokens
   * - Handles errors gracefully
   */
  handleSignout: async () => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    
    // If no tokens, just return success
    if (!token && !refreshToken) {
      return { success: true };
    }
    
    try {
      // Call the signout API endpoint
      await userServices.signout();
      
    } catch (error) {
      console.error('Signout error:', error);
    } finally {
      // Always clear tokens on logout attempt, regardless of API success
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
    
    return { success: true };
  }
}; 
import { userServices } from "./userServices";

export const signoutService = {
  /**
   * Handles the complete sign out process
   * - Calls the signout API endpoint
   * - Clears local storage
   * - Handles errors gracefully
   */
  handleSignout: async () => {
    const token = localStorage.getItem('token');
    
    // If no token, just clear local storage
    if (!token) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { success: true };
    }
    
    try {
      // Call the signout API endpoint
      await userServices.signout();
      
      // Clear authentication token and user data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return { success: true };
    } catch (error) {
      console.error('Signout error:', error);
      // Still clear local storage even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return {
        success: false,
        error: 'Đã xảy ra lỗi khi đăng xuất. Vui lòng thử lại.'
      };
    }
  }
}; 
/**
 * Utility functions for managing profile image persistence
 * Ensures profile images are preserved across login/logout sessions
 */

const PROFILE_IMAGE_KEY = 'savedProfileImage';
const USER_PROFILE_IMAGE_KEY = 'userProfileImages'; // For multiple users

/**
 * Save profile image for a specific user
 */
export const saveProfileImage = (userId: string, imageUrl: string): void => {
  try {
    const existingImages = getUserProfileImages();
    existingImages[userId] = imageUrl;
    localStorage.setItem(USER_PROFILE_IMAGE_KEY, JSON.stringify(existingImages));
  } catch (error) {
    console.error('Error saving profile image:', error);
  }
};

/**
 * Get profile image for a specific user
 */
export const getProfileImage = (userId: string): string | null => {
  try {
    const userImages = getUserProfileImages();
    return userImages[userId] || null;
  } catch (error) {
    console.error('Error getting profile image:', error);
    return null;
  }
};

/**
 * Remove profile image for a specific user
 */
export const removeProfileImage = (userId: string): void => {
  try {
    const userImages = getUserProfileImages();
    delete userImages[userId];
    localStorage.setItem(USER_PROFILE_IMAGE_KEY, JSON.stringify(userImages));
  } catch (error) {
    console.error('Error removing profile image:', error);
  }
};

/**
 * Get all user profile images
 */
const getUserProfileImages = (): Record<string, string> => {
  try {
    const saved = localStorage.getItem(USER_PROFILE_IMAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error('Error parsing user profile images:', error);
    return {};
  }
};

/**
 * Migrate old saved profile image to new format
 * This is for backward compatibility
 */
export const migrateLegacyProfileImage = (userId: string): string | null => {
  try {
    const legacyImage = localStorage.getItem(PROFILE_IMAGE_KEY);
    if (legacyImage && userId) {
      // Save to new format
      saveProfileImage(userId, legacyImage);
      // Remove legacy storage
      localStorage.removeItem(PROFILE_IMAGE_KEY);
      return legacyImage;
    }
    return null;
  } catch (error) {
    console.error('Error migrating legacy profile image:', error);
    return null;
  }
};

/**
 * Clear all profile images (useful for admin or cleanup)
 */
export const clearAllProfileImages = (): void => {
  try {
    localStorage.removeItem(USER_PROFILE_IMAGE_KEY);
    localStorage.removeItem(PROFILE_IMAGE_KEY); // Also remove legacy
  } catch (error) {
    console.error('Error clearing profile images:', error);
  }
};

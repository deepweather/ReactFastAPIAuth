import axios from 'axios';
import config from '../config';

/**
 * Fetches a list of pending users awaiting activation.
 * @returns {Promise<Array>} A promise that resolves to an array of pending users.
 */
export const getPendingUsers = async () => {
  const token = localStorage.getItem('zs_token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await axios.get(config.ADMIN_PENDING_USERS_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data; // Assuming the API returns an array of pending users
  } catch (error) {
    console.error('Error fetching pending users:', error);
    throw error;
  }
};

/**
 * Activates a pending user by their user ID.
 * @param {number} userId - The ID of the user to activate.
 * @returns {Promise<void>}
 */
export const activateUser = async (userId) => {
  const token = localStorage.getItem('zs_token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    await axios.post(config.ADMIN_ACTIVATE_USER_URL(userId), null, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(`Error activating user with ID ${userId}:`, error);
    throw error;
  }
};
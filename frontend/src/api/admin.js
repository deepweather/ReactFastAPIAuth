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
    const response = await axios.get(`${config.API_BASE_URL}/v1/admin/pending-users`, {
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
 * @returns {Promise<Object>} A promise that resolves to the activated user data.
 */
export const activateUser = async (userId) => {
  const token = localStorage.getItem('zs_token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await axios.post(`${config.API_BASE_URL}/v1/admin/activate-user/${userId}`, null, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data; // Assuming the API returns the activated user data
  } catch (error) {
    console.error(`Error activating user with ID ${userId}:`, error);
    throw error;
  }
};

/**
 * Fetches all user IDs.
 * @returns {Promise<Array<number>>} A promise that resolves to an array of user IDs.
 */
export const getAllUserIds = async () => {
  const token = localStorage.getItem('zs_token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await axios.get(`${config.API_BASE_URL}/v1/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data; // Assuming response.data is an array of user IDs
  } catch (error) {
    console.error('Error fetching all user IDs:', error);
    throw error;
  }
};

/**
 * Fetches user details by user ID.
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Object>} A promise that resolves to the user details.
 */
export const getUserById = async (userId) => {
  const token = localStorage.getItem('zs_token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await axios.get(`${config.API_BASE_URL}/v1/admin/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data; // Assuming response.data is the user details object
  } catch (error) {
    console.error(`Error fetching user with ID ${userId}:`, error);
    throw error;
  }
};
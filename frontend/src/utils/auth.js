import axios from 'axios';
import config from '../config';

/**
 * Checks if the user is authenticated by verifying the token with the server.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating authentication status.
 */
export const checkAuthentication = async () => {
  const token = localStorage.getItem('zs_token');
  if (!token) {
    return false;
  }

  try {
    const response = await axios.get(config.IS_LOGGED_IN_URL, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data.logged_in === true;
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Checks if the user is an admin by fetching the user's details and verifying the role.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating admin authentication status.
 */
export const checkAdminAuthentication = async () => {
  const token = localStorage.getItem('zs_token');
  if (!token) {
    return false;
  }

  try {
    const response = await axios.get(`${config.API_BASE_URL}/v1/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.data.role === 'admin';
  } catch (error) {
    console.error('Error checking admin authentication:', error);
    return false;
  }
};

/**
 * Logs in a user with the provided username and password.
 * @param {string} username - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<object>} A promise that resolves to the response data containing the access token.
 */
export const loginUser = async (username, password) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', username);
  params.append('password', password);
  params.append('scope', '');
  params.append('client_id', '');
  params.append('client_secret', '');

  try {
    const response = await axios.post(config.LOGIN_URL, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    // Save the token to localStorage
    localStorage.setItem('zs_token', response.data.access_token);
    return response.data;
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error);
    throw error;
  }
};

/**
 * Registers a new user with the provided information.
 * @param {string} firstName - The user's first name.
 * @param {string} lastName - The user's last name.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's chosen password.
 * @returns {Promise<object>} A promise that resolves to the response data.
 */
export const registerUser = async (firstName, lastName, email, password) => {
  try {
    const response = await axios.post(config.SIGNUP_URL, {
      name: `${firstName} ${lastName}`,
      email: email,
      password: password,
    });
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error.response ? error.response.data : error);
    throw error;
  }
};

/**
 * Logs out the user by removing the token from localStorage.
 */
export const logoutUser = () => {
  localStorage.removeItem('zs_token');
};

/**
 * Fetches the current user's details.
 * @returns {Promise<Object|null>} A promise that resolves to the user object if authenticated, or null if not authenticated.
 */
export const getCurrentUser = async () => {
  const token = localStorage.getItem('zs_token');
  if (!token) {
    return null;
  }

  try {
    const response = await axios.get(`${config.API_BASE_URL}/v1/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data; // User object containing details like role
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};

/**
 * Updates the user's information.
 * @param {number} userId - The user's ID.
 * @param {Object} userData - The user data to update (e.g., { name, email, password }).
 * @returns {Promise<Object>} A promise that resolves to the updated user data.
 */
export const updateUser = async (userId, userData) => {
  const token = localStorage.getItem('zs_token');
  if (!token) {
    throw new Error('Not authenticated');
  }

  try {
    const response = await axios.put(`${config.API_BASE_URL}/v1/users/${userId}`, userData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data; // Updated user object
  } catch (error) {
    console.error('Error updating user:', error.response ? error.response.data : error);
    throw error;
  }
};

/**
 * Deletes the user account.
 * @param {number} userId - The user's ID.
 * @returns {Promise<void>} A promise that resolves when the user is deleted.
 */
export const deleteUser = async (userId) => {
  const token = localStorage.getItem('zs_token');
  if (!token) {
    throw new Error('Not authenticated');
  }

  try {
    await axios.delete(`${config.API_BASE_URL}/v1/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    // Remove token and perform any necessary cleanup
    logoutUser();
  } catch (error) {
    console.error('Error deleting user:', error.response ? error.response.data : error);
    throw error;
  }
}; 
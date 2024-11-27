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
    const response = await axios.get(`${config.API_BASE_URL}/v1/users/is_logged_in`, {
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
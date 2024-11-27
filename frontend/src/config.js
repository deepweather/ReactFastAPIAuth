const ENV = process.env.REACT_APP_ENV || 'development';

const CONFIG = {
  development: {
    API_BASE_URL: 'http://localhost:8001',
  },
  staging: {
    API_BASE_URL: 'https://staging.yourapi.com',
  },
  production: {
    API_BASE_URL: 'https://api.yourdomain.com',
  },
};

const API_BASE_URL = CONFIG[ENV].API_BASE_URL;

const config = {
  API_BASE_URL,
  LOGIN_URL: `${API_BASE_URL}/v1/auth/token`,
  SIGNUP_URL: `${API_BASE_URL}/v1/users/`,
  RESET_PASSWORD_URL: `${API_BASE_URL}/v1/password-reset`,
  RESET_PASSWORD_CONFIRM_URL: `${API_BASE_URL}/v1/reset-password`,
  IS_LOGGED_IN_URL: `${API_BASE_URL}/v1/users/is_logged_in`,
  LOGOUT_URL: `${API_BASE_URL}/v1/users/logout`,
  // Admin-specific URLs
  ADMIN_PENDING_USERS_URL: `${API_BASE_URL}/v1/admin/pending-users`,
  ADMIN_ACTIVATE_USER_URL: (userId) => `${API_BASE_URL}/v1/admin/activate-user/${userId}`,
};

export default config;
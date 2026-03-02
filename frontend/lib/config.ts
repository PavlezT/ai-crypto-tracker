// Frontend configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  ENDPOINTS: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    WATCHLIST: '/watchlist',
  },
  TOKEN_KEY: 'access_token',
  TOKEN_TYPE: 'Bearer',
};

// src/config.js
const config = {
  // Uses the environment variable if available, otherwise defaults to localhost just in case
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000'
};

export default config;
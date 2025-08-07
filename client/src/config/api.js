const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const API_URL = `${API_BASE_URL}/api`;
export const UPLOADS_URL = `${API_BASE_URL}/uploads`;

export default {
  API_URL,
  UPLOADS_URL
};

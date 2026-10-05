const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000')
  .replace(/\/$/, '')

export const DATA_URL = `${API_BASE_URL}/data`

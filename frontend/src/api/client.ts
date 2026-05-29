/** Shared Axios instance for all API calls — avoids duplicate configuration */
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export default api;
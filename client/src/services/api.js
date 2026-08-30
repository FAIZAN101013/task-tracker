import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Required so the browser sends and stores the httpOnly session cookie
  withCredentials: true,
});

export default API;

import axios from "axios";

const API = axios.create({
  baseURL: "https://task-tracker-7rss.onrender.com/api",
});

export default API;
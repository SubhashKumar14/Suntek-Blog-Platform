import axios from "axios";

const fallbackApiUrl = "http://localhost:3000";
const rawApiUrl = import.meta.env.VITE_API_URL || fallbackApiUrl;

export const api = axios.create({
  baseURL: rawApiUrl.replace(/\/+$/, ""),
  withCredentials: true,
});
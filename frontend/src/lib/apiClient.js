import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const fallbackApiUrl = import.meta.env.DEV ? "http://localhost:3000" : "";
const rawApiUrl = configuredApiUrl || fallbackApiUrl;

if (!configuredApiUrl && import.meta.env.PROD) {
  console.warn(
    "VITE_API_URL is missing in this deployment. Set it in Vercel for both Production and Preview environments.",
  );
}

export const api = axios.create({
  baseURL: rawApiUrl ? rawApiUrl.replace(/\/+$/, "") : undefined,
  withCredentials: true,
});
import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api";

export const apiClient = axios.create({
  baseURL: baseURL.replace(/\/$/, ""),
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

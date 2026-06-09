import axios from "axios";

const baseURL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://cert-chain-backend.onrender.com/api/";
const bearerToken = process.env.NEXT_PUBLIC_BEARER_TOKEN || "";

const defaultHeaders: Record<string, string> = {};
if (bearerToken) {
  defaultHeaders.Authorization = `Bearer ${bearerToken}`;
}

export const backend = axios.create({
  baseURL,
  headers: defaultHeaders,
});

export const params = {
  headers: defaultHeaders,
};

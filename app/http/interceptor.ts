import axios from "axios";

export default function AxiosInterceptor(): void {
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:5091/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      return response; // Just return response if successful
    },
    (error) => {
      if (error.response?.status === 401) {
        console.warn("Unauthorized! Redirecting to login...");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
}

import axios from "axios";

const api=axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:3001",
    headers:{
        "Content-Type": "application/json",
    }
})

// Request Interceptor → attach token to every request
api.interceptors.request.use(
  (config) => {
    const session = localStorage.getItem("session");
    if (session) {
      const { token } = JSON.parse(session);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor → handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("session");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
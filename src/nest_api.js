import axios from "axios";

const API_BASE_URL = "http://localhost:8888"; // Change this to your backend URL

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor (Attach Token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor (Error Handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);


export const createState = async (url,data) => {
  try {
    const response = await api.post(url,data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStates = async (url) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};  

export const toCheckState = async (url, params) => {
  try {
    const response = await api.get(url, {params});
    return response.data;
  } catch (error) {
    throw error;
  }
};
export default api;

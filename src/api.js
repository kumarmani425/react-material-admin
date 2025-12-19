import axios from "axios";

const API_BASE_URL = "http://localhost:8080"; // Change this to your backend URL

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

// Generic GET Request
export const getUser = async (url, params = {}) => {
  try {
    const response = await api.get(url, {params});
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Generic GET Request
export const getCall = async (url) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Generic GET Request
export const getAllUsers = async (url) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error;
  }
};
// Generic GET Request
export const getScroll = async (url,params = {}) => {
  console.log("params",params)
  try {
    const response = await api.get(url,{params});
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generic POST Request
export const getDipositor = async (url, params = {}) => {
  try {
    const response = await api.get(url, {params});
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generic PUT Request
export const depTransactions = async (url, params = {}) => {
  try {
    const response = await api.get(url, {params});
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generic PUT Request
export const getPendingTnks = async (url, params = {}) => {
  try {
    const response = await api.get(url, {params});
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const depPayment = async (url,data) => {
  try {
    const response = await api.post(url,data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const depAddAmount = async (url,data) => {
  try {
    const response = await api.post(url,data);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const createDipositor = async (url,data) => {
  try {
    const response = await api.post(url,data);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const createSeller = async (url,data) => {
  try {
    const response = await api.post(url,data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;

// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000/api",
// });

// API.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("userToken");

//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// export default API;


import axios from "axios";

const configuredApiUrl = import.meta.env.VITE_API_URL
  ?.trim()
  .replace(/\/+$/, "");

const API = axios.create({
  baseURL: configuredApiUrl ? `${configuredApiUrl}/api` : "/api",
});

API.interceptors.request.use(
  (config) => {
    if (import.meta.env.PROD && !configuredApiUrl) {
      return Promise.reject(
        new Error("VITE_API_URL must be configured for the production client.")
      );
    }

    const token = localStorage.getItem("userToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;

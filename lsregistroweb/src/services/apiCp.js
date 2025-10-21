// src/services/apiCp.js
import axios from "axios";

const baseURL = import.meta.env.DEV
  ? "/cp"  // -> proxy a Cloud Run (ya configurado en vite.config)
  : (import.meta.env.VITE_CP_API ||
     "https://catalogos-nom024-fastapi-bigquery-967885369144.europe-west1.run.app");

const apiCp = axios.create({
  baseURL,
  timeout: 25000,
  withCredentials: false,
});

export default apiCp;

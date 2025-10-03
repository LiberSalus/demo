// src/services/api.js
import axios from "axios";

const baseURL = import.meta.env.DEV
  ? "/api" // proxy en dev → 8040
  : (import.meta.env.VITE_PREREG_API || "https://libersalus.com/api/preregistro");

const api = axios.create({
  baseURL,
  timeout: 30000,
  withCredentials: false, // en registro, por ahora sin cookies
});

let _accessToken = null;
export function setAuthToken(t){ _accessToken = t ?? null; }
export function clearAuthToken(){ _accessToken = null; }
export function getAuthToken(){ return _accessToken; }

api.interceptors.request.use((config) => {
  const t = getAuthToken();
  if (t) config.headers.Authorization = `Bearer ${t}`;
  return config;
});

// refresh con cookie HttpOnly (igual que ya lo tenías)
let isRefreshing = false, queue = [];
function flushQueue(err, newTok){ queue.forEach(({resolve,reject}) => err?reject(err):resolve(newTok)); queue=[]; }
const raw = axios.create({ baseURL, withCredentials: true, timeout: 15000 });
async function refreshAccess(){
  const { data } = await raw.post("/auth/refresh");
  const newTok = data?.access_token || null;
  setAuthToken(newTok);
  return newTok;
}
api.interceptors.response.use(
  (r)=>r,
  async (error)=>{
    const { config, response } = error;
    if (!response || response.status !== 401 || config._retry) return Promise.reject(error);
    config._retry = true;
    if (!isRefreshing){
      isRefreshing = true;
      try { const t = await refreshAccess(); isRefreshing = false; flushQueue(null, t); }
      catch(e){ isRefreshing = false; flushQueue(e, null); clearAuthToken(); return Promise.reject(e); }
    }
    return new Promise((resolve,reject)=>{
      queue.push({ resolve:(t)=>{ if(t) config.headers.Authorization=`Bearer ${t}`; resolve(api(config)); }, reject });
    });
  }
);

export default api;

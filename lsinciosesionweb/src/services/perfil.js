//src\services\perfil.js
import api from './apiClient';

// GET foto
export async function getProfilePhoto(size = 'original') {
  // importante: NO pongas Content-Type, deja que el navegador lo maneje
  const { data } = await api.get(`/perfil/foto/perfil`, {
    params: { size },
    withCredentials: true, // 👈 manda la cookie access_token
    responseType: 'blob',   // recibimos imagen
  });
  return data; // blob
}

// POST subir foto
export async function uploadProfilePhoto(file) {
  const fd = new FormData();
  fd.append('file', file); // 👈 el backend espera el campo 'file'

  const { data } = await api.post(`/perfil/foto/perfil`, fd, {
    withCredentials: true, // 👈 manda la cookie
    // no seteamos Content-Type para que ponga el boundary correcto
  });
  return data; // string o lo que devuelva tu API
}


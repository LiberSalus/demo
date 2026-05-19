import { API_KEYS } from './apiConfig'
import { crearApiClient } from './apiClient'
import { API_ROUTES } from './apiRoutes'

const catalogosApi = crearApiClient(API_KEYS.catalogos)
const rutasCatalogos = API_ROUTES.catalogos

export function consultarCodigoPostal(codigoPostal) {
  return catalogosApi(rutasCatalogos.consultarCodigoPostal(codigoPostal), {
    credentials: 'omit',
  })
}

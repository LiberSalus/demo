import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/config/routes'
import { iniciarSesion } from '@/services/auth'
import ContenedorAutenticacion from './componentes/ContenedorAutenticacion'
import { configuracionInicioSesion } from './configuracion/flujoAutenticacion'
import VistaInicioSesion from './vistas/VistaInicioSesion'

const datosInicioSesionIniciales = {
  correoElectronico: '',
  contrasena: '',
}

function validarInicioSesion({ correoElectronico, contrasena }) {
  const correo = correoElectronico.trim()

  if (!correo) return 'El correo es obligatorio.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return 'Formato de correo invalido.'
  if (!contrasena) return 'La contraseña es obligatoria.'

  return ''
}

function Autenticacion() {
  const navigate = useNavigate()
  const location = useLocation()
  const rutaDestino = location.state?.from?.pathname || ROUTES.INICIO

  const [datosInicioSesion, setDatosInicioSesion] = useState(datosInicioSesionIniciales)
  const [estadoInicioSesion, setEstadoInicioSesion] = useState({
    cargando: false,
    error: '',
  })

  const actualizarDatosInicioSesion = (evento) => {
    const { name, value } = evento.target

    setDatosInicioSesion((estadoActual) => ({
      ...estadoActual,
      [name]: value,
    }))
    setEstadoInicioSesion((estadoActual) => ({
      ...estadoActual,
      error: '',
    }))
  }

  const enviarInicioSesion = async (evento) => {
    evento.preventDefault()

    const errorValidacion = validarInicioSesion(datosInicioSesion)

    if (errorValidacion) {
      setEstadoInicioSesion({ cargando: false, error: errorValidacion })
      return
    }

    setEstadoInicioSesion({ cargando: true, error: '' })

    try {
      await iniciarSesion({
        correo: datosInicioSesion.correoElectronico,
        contrasena: datosInicioSesion.contrasena,
      })

      navigate(rutaDestino, { replace: true })
    } catch (error) {
      setEstadoInicioSesion({
        cargando: false,
        error: error.message || 'No fue posible iniciar sesión. Inténtalo de nuevo.',
      })
    }
  }

  const cambiarARegistro = () => {
    setEstadoInicioSesion({
      cargando: false,
      error: 'El registro se migrara despues de validar el inicio de sesion.',
    })
  }

  return (
    <ContenedorAutenticacion>
      <VistaInicioSesion
        configuracion={configuracionInicioSesion}
        datosInicioSesion={datosInicioSesion}
        estadoInicioSesion={estadoInicioSesion}
        onCambiarARegistro={cambiarARegistro}
        onEnviarInicioSesion={enviarInicioSesion}
        onInputInicioSesionChange={actualizarDatosInicioSesion}
      />
    </ContenedorAutenticacion>
  )
}

export default Autenticacion

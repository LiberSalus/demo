import { useState } from 'react'
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

  const enviarInicioSesion = (evento) => {
    evento.preventDefault()

    const errorValidacion = validarInicioSesion(datosInicioSesion)

    if (errorValidacion) {
      setEstadoInicioSesion({ cargando: false, error: errorValidacion })
      return
    }

    // Fase 1 solo valida y pinta la UI; la conexion real se integra en Fase 2.
    setEstadoInicioSesion({
      cargando: false,
      error: 'Login nuevo listo visualmente. Falta conectar sesion en la siguiente fase.',
    })
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

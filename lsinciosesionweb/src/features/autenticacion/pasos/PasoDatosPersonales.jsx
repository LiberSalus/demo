import BotonPrincipal from '../componentes/BotonPrincipal'
import CampoFormulario from '../componentes/CampoFormulario'
import estilos from '../estilos/autenticacion.module.css'

function PasoDatosPersonales({ contenido, preregistro }) {
  const {
    datos,
    estado,
    actualizarDatosPersonales,
    guardarDatosPersonales,
    limpiarMensajes,
  } = preregistro
  const datosPersonales = datos.datosPersonales

  const actualizarCampo = (campo, valor) => {
    limpiarMensajes()
    actualizarDatosPersonales({ [campo]: valor })
  }

  return (
    <section className={`${estilos.pasoFormulario} ${estilos.pasoDatosPersonales}`}>
      <div className={`${estilos.rejillaFormulario} ${estilos.rejillaFormularioDosColumnas}`}>
        <CampoFormulario
          etiqueta="CURP"
          nombre="curp"
          marcador="Tu CURP"
          valor={datosPersonales.curp}
          onChange={(evento) => actualizarCampo('curp', evento.target.value.toUpperCase())}
        />
        <CampoFormulario
          etiqueta="Nombre"
          nombre="nombre"
          marcador="Tu nombre"
          valor={datosPersonales.nombre}
          onChange={(evento) => actualizarCampo('nombre', evento.target.value)}
        />
        <CampoFormulario
          etiqueta="Apellido paterno"
          nombre="apellidoPaterno"
          marcador="Apellido paterno"
          valor={datosPersonales.apellidoPaterno}
          onChange={(evento) => actualizarCampo('apellidoPaterno', evento.target.value)}
        />
        <CampoFormulario
          etiqueta="Apellido materno"
          nombre="apellidoMaterno"
          marcador="Apellido materno"
          valor={datosPersonales.apellidoMaterno}
          onChange={(evento) => actualizarCampo('apellidoMaterno', evento.target.value)}
        />
        <CampoFormulario
          etiqueta="Fecha de nacimiento"
          nombre="fechaNacimiento"
          tipo="date"
          valor={datosPersonales.fechaNacimiento}
          onChange={(evento) => actualizarCampo('fechaNacimiento', evento.target.value)}
        />
        <CampoFormulario
          etiqueta="Sexo CURP"
          nombre="sexo"
          tipo="select"
          marcador="Selecciona"
          valor={datosPersonales.sexo}
          opciones={[
            { valor: 'H', etiqueta: 'Hombre' },
            { valor: 'M', etiqueta: 'Mujer' },
          ]}
          onChange={(evento) => actualizarCampo('sexo', evento.target.value)}
        />
        <CampoFormulario
          etiqueta="Nacionalidad"
          nombre="nacionalidad"
          marcador="MEX"
          valor={datosPersonales.nacionalidad}
          onChange={(evento) => actualizarCampo('nacionalidad', evento.target.value.toUpperCase())}
        />
        <CampoFormulario
          etiqueta="Estado de nacimiento"
          nombre="estadoNacimiento"
          marcador="Estado"
          valor={datosPersonales.estadoNacimiento}
          onChange={(evento) => actualizarCampo('estadoNacimiento', evento.target.value)}
        />
        <CampoFormulario
          etiqueta="Abreviatura entidad"
          nombre="abrEntidad"
          marcador="Ej. CDMX"
          valor={datosPersonales.abrEntidad}
          onChange={(evento) => actualizarCampo('abrEntidad', evento.target.value.toUpperCase())}
        />
      </div>

      {estado.error ? (
        <p className={estilos.mensajeFormularioError}>{estado.error}</p>
      ) : null}
      {estado.exito ? (
        <p className={estilos.mensajeFormularioExito}>{estado.exito}</p>
      ) : null}

      <BotonPrincipal cargando={estado.cargando} onClick={guardarDatosPersonales}>
        {estado.cargando ? 'Guardando...' : contenido.textoBoton}
      </BotonPrincipal>
    </section>
  )
}

export default PasoDatosPersonales

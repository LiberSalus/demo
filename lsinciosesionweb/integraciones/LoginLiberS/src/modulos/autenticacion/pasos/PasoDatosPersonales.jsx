import BotonPrincipal from '../componentes/BotonPrincipal'
import CampoFormulario from '../componentes/CampoFormulario'
import estilos from '../estilos/autenticacion.module.css'

function PasoDatosPersonales({ contenido, preregistro }) {
  const { campos, textoBoton, textoBotonValidarCurp, textoLimpiarDatos } = contenido
  const [campoCurp, ...camposRestantes] = campos
  const {
    datos,
    estadoDatosPersonales,
    actualizarDatosPersonales,
    guardarDatosPersonales,
    limpiarMensajesDatosPersonales,
    validarCurp: validarCurpAutomaticamente,
  } = preregistro
  const datosPersonales = datos.datosPersonales

  const normalizarValorCampo = (campo, valor) => {
    if (campo.tipo === 'date' || campo.tipo === 'select') {
      return valor
    }

    return valor.toUpperCase()
  }

  const intentarValidarCurp = () => {
    void validarCurpAutomaticamente()
  }

  const limpiarDatos = () => {
    limpiarMensajesDatosPersonales()
    actualizarDatosPersonales({
      curp: '',
      nombre: '',
      apellidoPaterno: '',
      apellidoMaterno: '',
      fechaNacimiento: '',
      sexo: '',
      nacionalidad: 'MEX',
      entidadNacimiento: '',
      abrEntidad: '',
      municipioRegistro: '',
    })
  }

  return (
    <section className={`${estilos.pasoFormulario} ${estilos.pasoDatosPersonales}`}>
      <div className={estilos.filaValidacionCurp}>
        <div className={estilos.filaValidacionCurpCampo}>
          <CampoFormulario
            key={campoCurp.nombre}
            {...campoCurp}
            valor={datosPersonales[campoCurp.nombre] ?? ''}
            onChange={(evento) => {
              limpiarMensajesDatosPersonales()
              actualizarDatosPersonales({
                [campoCurp.nombre]: normalizarValorCampo(campoCurp, evento.target.value),
              })
            }}
          />
        </div>

        <button
          className={estilos.botonValidarCurp}
          type="button"
          onClick={intentarValidarCurp}
        >
          {textoBotonValidarCurp}
        </button>
      </div>

      {estadoDatosPersonales.error ? (
        <p className={estilos.mensajeFormularioError}>{estadoDatosPersonales.error}</p>
      ) : null}
      {estadoDatosPersonales.exito ? (
        <p className={estilos.mensajeFormularioExito}>{estadoDatosPersonales.exito}</p>
      ) : null}

      <div className={`${estilos.rejillaFormulario} ${estilos.rejillaFormularioDosColumnas}`}>
        {camposRestantes.map((campo) => (
          <CampoFormulario
            key={campo.nombre}
            {...campo}
            valor={datosPersonales[campo.nombre] ?? ''}
            onChange={(evento) => {
              limpiarMensajesDatosPersonales()
              actualizarDatosPersonales({
                [campo.nombre]: normalizarValorCampo(campo, evento.target.value),
              })
            }}
          />
        ))}
      </div>
      <BotonPrincipal
        cargando={estadoDatosPersonales.cargando}
        onClick={guardarDatosPersonales}
      >
        {estadoDatosPersonales.cargando ? 'Guardando...' : textoBoton}
      </BotonPrincipal>
      <button className={estilos.accionLimpiarDatos} type="button" onClick={limpiarDatos}>
        {textoLimpiarDatos}
      </button>
    </section>
  )
}

export default PasoDatosPersonales

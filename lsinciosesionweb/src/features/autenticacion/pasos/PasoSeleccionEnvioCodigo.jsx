import BotonPrincipal from '../componentes/BotonPrincipal'
import estilos from '../estilos/autenticacion.module.css'

function PasoSeleccionEnvioCodigo({ contenido, preregistro }) {
  const { datos, estado, enviarCodigoPorCorreo } = preregistro

  return (
    <section className={`${estilos.pasoGenerico} ${estilos.pasoSeleccionEnvioCodigo}`}>
      <label className={estilos.opcionEnvioCodigo}>
        <input
          checked
          readOnly
          className={estilos.opcionEnvioCodigoInput}
          name="opcionEnvioCodigo"
          type="radio"
          value="correo"
        />
        <span className={estilos.opcionEnvioCodigoIndicador} />
        <span className={estilos.opcionEnvioCodigoContenido}>
          <span className={estilos.opcionEnvioCodigoEtiqueta}>
            Enviar código por correo electrónico a:
          </span>
          <span className={estilos.opcionEnvioCodigoValor}>{datos.correo}</span>
        </span>
      </label>

      {estado.error ? (
        <p className={estilos.mensajeFormularioError}>{estado.error}</p>
      ) : null}
      {estado.exito ? (
        <p className={estilos.mensajeFormularioExito}>{estado.exito}</p>
      ) : null}

      <BotonPrincipal
        claseAdicional={estilos.botonSeleccionEnvioCodigo}
        cargando={estado.cargando}
        onClick={enviarCodigoPorCorreo}
      >
        {estado.cargando ? 'Enviando...' : contenido.textoBoton}
      </BotonPrincipal>
    </section>
  )
}

export default PasoSeleccionEnvioCodigo

import { useState } from 'react'
import BotonPrincipal from '../componentes/BotonPrincipal'
import estilos from '../estilos/autenticacion.module.css'

function PasoSeleccionEnvioCodigo({ contenido, preregistro }) {
  const { opcionInicial, textoBoton } = contenido
  const { estado, opcionesEnvioCodigo, enviarCodigoPorCorreo, limpiarMensajes } = preregistro
  const [opcionSeleccionada, setOpcionSeleccionada] = useState(opcionInicial)
  const opciones = opcionesEnvioCodigo

  return (
    <section className={`${estilos.pasoGenerico} ${estilos.pasoSeleccionEnvioCodigo}`}>
      {opciones.map((opcion) => (
        <label className={estilos.opcionEnvioCodigo} key={opcion.id}>
          <input
            checked={opcionSeleccionada === opcion.id}
            className={estilos.opcionEnvioCodigoInput}
            name="opcionEnvioCodigo"
            type="radio"
            value={opcion.id}
            onChange={() => {
              limpiarMensajes()
              setOpcionSeleccionada(opcion.id)
            }}
          />
          <span className={estilos.opcionEnvioCodigoIndicador} />
          <span className={estilos.opcionEnvioCodigoContenido}>
            <span className={estilos.opcionEnvioCodigoEtiqueta}>{opcion.etiqueta}</span>
            <span className={estilos.opcionEnvioCodigoValor}>{opcion.valorMascara}</span>
          </span>
        </label>
      ))}

      {estado.error ? (
        <p className={estilos.mensajeFormularioError}>{estado.error}</p>
      ) : null}
      {estado.exito ? (
        <p className={estilos.mensajeFormularioExito}>{estado.exito}</p>
      ) : null}

      <BotonPrincipal
        claseAdicional={estilos.botonSeleccionEnvioCodigo}
        deshabilitado={!opcionSeleccionada}
        cargando={estado.cargando}
        onClick={enviarCodigoPorCorreo}
      >
        {estado.cargando ? 'Enviando...' : textoBoton}
      </BotonPrincipal>
    </section>
  )
}

export default PasoSeleccionEnvioCodigo

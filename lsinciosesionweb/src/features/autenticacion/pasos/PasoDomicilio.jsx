import BotonPrincipal from '../componentes/BotonPrincipal'
import CampoFormulario from '../componentes/CampoFormulario'
import estilos from '../estilos/autenticacion.module.css'

function PasoDomicilio({ contenido, preregistro }) {
  const { datos, estado, actualizarDomicilio, guardarDomicilio, limpiarMensajes } =
    preregistro
  const domicilio = datos.domicilio

  const actualizarCampo = (campo, valor) => {
    limpiarMensajes()
    actualizarDomicilio({ [campo]: valor })
  }

  return (
    <section className={`${estilos.pasoFormulario} ${estilos.pasoDomicilio}`}>
      <div className={`${estilos.rejillaFormulario} ${estilos.rejillaFormularioDosColumnas}`}>
        <CampoFormulario
          etiqueta="Código postal"
          nombre="codigoPostal"
          marcador="5 dígitos"
          valor={domicilio.codigoPostal}
          onChange={(evento) =>
            actualizarCampo('codigoPostal', evento.target.value.replace(/\D/g, '').slice(0, 5))
          }
        />
        <CampoFormulario
          etiqueta="Estado"
          nombre="estado"
          marcador="Estado"
          valor={domicilio.estado}
          onChange={(evento) => actualizarCampo('estado', evento.target.value)}
        />
        <CampoFormulario
          etiqueta="Delegación o municipio"
          nombre="municipio"
          marcador="Municipio"
          valor={domicilio.municipio}
          onChange={(evento) => actualizarCampo('municipio', evento.target.value)}
        />
        <CampoFormulario
          etiqueta="Ciudad"
          nombre="ciudad"
          marcador="Ciudad"
          valor={domicilio.ciudad}
          onChange={(evento) => actualizarCampo('ciudad', evento.target.value)}
        />
        <CampoFormulario
          etiqueta="Colonia"
          nombre="colonia"
          marcador="Colonia"
          valor={domicilio.colonia}
          onChange={(evento) => actualizarCampo('colonia', evento.target.value)}
        />
        <CampoFormulario
          etiqueta="Calle"
          nombre="calle"
          marcador="Calle"
          valor={domicilio.calle}
          onChange={(evento) => actualizarCampo('calle', evento.target.value)}
        />
        <CampoFormulario
          etiqueta="Número exterior"
          nombre="numeroExterior"
          marcador="Exterior"
          valor={domicilio.numeroExterior}
          onChange={(evento) => actualizarCampo('numeroExterior', evento.target.value)}
        />
        <CampoFormulario
          etiqueta="Número interior"
          nombre="numeroInterior"
          marcador="Interior"
          valor={domicilio.numeroInterior}
          onChange={(evento) => actualizarCampo('numeroInterior', evento.target.value)}
        />
        <CampoFormulario
          etiqueta="Referencia"
          nombre="referencia"
          marcador="Referencia opcional"
          valor={domicilio.referencia}
          onChange={(evento) => actualizarCampo('referencia', evento.target.value)}
        />
      </div>

      {estado.error ? (
        <p className={estilos.mensajeFormularioError}>{estado.error}</p>
      ) : null}
      {estado.exito ? (
        <p className={estilos.mensajeFormularioExito}>{estado.exito}</p>
      ) : null}

      <BotonPrincipal cargando={estado.cargando} onClick={guardarDomicilio}>
        {estado.cargando ? 'Guardando...' : contenido.textoBoton}
      </BotonPrincipal>
    </section>
  )
}

export default PasoDomicilio

import { useMemo, useState } from 'react'
import BotonPrincipal from '../componentes/BotonPrincipal'
import CampoFormulario from '../componentes/CampoFormulario'
import estilos from '../estilos/autenticacion.module.css'

function PasoDomicilio({ contenido, preregistro }) {
  const {
    campos,
    textoBoton,
    textoBotonValidarCodigoPostal,
    textoLimpiarDatos,
    tituloModalColonias,
    marcadorBusquedaColonias,
    textoBotonModalColonias,
  } = contenido
  const {
    datos,
    estadoDomicilio,
    actualizarDomicilio,
    consultarCodigoPostal,
    guardarDomicilio,
    limpiarMensajesDomicilio,
  } = preregistro
  const domicilio = datos.domicilio
  const [modalColoniasAbierto, setModalColoniasAbierto] = useState(false)
  const [busquedaColonias, setBusquedaColonias] = useState('')
  const [coloniasDisponibles, setColoniasDisponibles] = useState([])
  const [coloniaSeleccionadaId, setColoniaSeleccionadaId] = useState('')

  const normalizarValorCampo = (campo, valor) => {
    const camposSinMayusculas = new Set(['codigoPostal', 'numeroExterior', 'numeroInterior'])

    if (camposSinMayusculas.has(campo.nombre)) {
      return valor
    }

    return valor.toUpperCase()
  }

  const coloniasFiltradas = useMemo(() => {
    const terminoBusqueda = busquedaColonias.trim().toUpperCase()

    if (!terminoBusqueda) {
      return coloniasDisponibles
    }

    return coloniasDisponibles.filter((colonia) =>
      colonia.colonia.toUpperCase().includes(terminoBusqueda),
    )
  }, [busquedaColonias, coloniasDisponibles])

  const cerrarModalColonias = () => {
    setModalColoniasAbierto(false)
    setBusquedaColonias('')
  }

  const confirmarColonia = () => {
    const coloniaSeleccionada = coloniasDisponibles.find(
      (colonia) => colonia.id === coloniaSeleccionadaId,
    )

    if (!coloniaSeleccionada) {
      return
    }

    actualizarDomicilio({
      colonia: coloniaSeleccionada.colonia.toUpperCase(),
      estado: coloniaSeleccionada.estado.toUpperCase(),
      municipio: coloniaSeleccionada.municipio.toUpperCase(),
      ciudad: coloniaSeleccionada.ciudad.toUpperCase(),
    })
    cerrarModalColonias()
  }

  const validarCodigoPostal = async () => {
    limpiarMensajesDomicilio()
    const resultados = await consultarCodigoPostal(domicilio.codigoPostal)

    setColoniasDisponibles(resultados)

    if (resultados.length > 1) {
      setColoniaSeleccionadaId(resultados[0].id)
      setModalColoniasAbierto(true)
      return
    }

    setColoniaSeleccionadaId(resultados[0]?.id ?? '')
    cerrarModalColonias()
  }

  const limpiarFormulario = () => {
    limpiarMensajesDomicilio()
    setColoniasDisponibles([])
    setColoniaSeleccionadaId('')
    cerrarModalColonias()
    actualizarDomicilio({
      codigoPostal: '',
      colonia: '',
      estado: '',
      municipio: '',
      ciudad: '',
      calle: '',
      numeroExterior: '',
      numeroInterior: '',
      referencia: '',
    })
  }

  return (
    <section className={`${estilos.pasoFormulario} ${estilos.pasoDomicilio}`}>
      <div className={estilos.filaValidacionCodigoPostal}>
        <div className={estilos.filaValidacionCodigoPostalCampo}>
          <CampoFormulario
            {...campos.find((campo) => campo.nombre === 'codigoPostal')}
            valor={domicilio.codigoPostal}
            onChange={(evento) => {
              limpiarMensajesDomicilio()
              actualizarDomicilio({ codigoPostal: evento.target.value })
            }}
          />
        </div>

        <button
          className={estilos.botonValidarCodigoPostal}
          type="button"
          onClick={validarCodigoPostal}
        >
          {textoBotonValidarCodigoPostal}
        </button>
      </div>

      {estadoDomicilio.error ? (
        <p className={estilos.mensajeFormularioError}>{estadoDomicilio.error}</p>
      ) : null}
      {estadoDomicilio.exito ? (
        <p className={estilos.mensajeFormularioExito}>{estadoDomicilio.exito}</p>
      ) : null}

      <div className={`${estilos.rejillaFormulario} ${estilos.rejillaFormularioDosColumnas}`}>
        {campos
          .filter((campo) => campo.nombre !== 'codigoPostal')
          .map((campo) => (
          <CampoFormulario
            key={campo.nombre}
            {...campo}
            valor={domicilio[campo.nombre] ?? ''}
            onChange={(evento) => {
              limpiarMensajesDomicilio()
              actualizarDomicilio({
                [campo.nombre]: normalizarValorCampo(campo, evento.target.value),
              })
            }}
          />
        ))}
      </div>
      <BotonPrincipal cargando={estadoDomicilio.cargando} onClick={guardarDomicilio}>
        {estadoDomicilio.cargando ? 'Guardando...' : textoBoton}
      </BotonPrincipal>
      <button
        className={estilos.accionLimpiarDatos}
        type="button"
        onClick={limpiarFormulario}
      >
        {textoLimpiarDatos}
      </button>

      {modalColoniasAbierto ? (
        <div className={estilos.modalColoniasOverlay} role="presentation">
          <div className={estilos.modalColonias} role="dialog" aria-modal="true">
            <h3 className={estilos.modalColoniasTitulo}>{tituloModalColonias}</h3>
            <label className={estilos.modalColoniasBusqueda}>
              <span className={estilos.modalColoniasBusquedaIcono} aria-hidden="true">
                &#128269;
              </span>
              <input
                className={estilos.modalColoniasBusquedaInput}
                type="text"
                placeholder={marcadorBusquedaColonias}
                value={busquedaColonias}
                onChange={(evento) => setBusquedaColonias(evento.target.value)}
              />
            </label>

            <div className={estilos.modalColoniasLista}>
              {coloniasFiltradas.map((colonia) => (
                <button
                  key={colonia.id}
                  type="button"
                  className={[
                    estilos.modalColoniasOpcion,
                    colonia.id === coloniaSeleccionadaId
                      ? estilos.modalColoniasOpcionActiva
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setColoniaSeleccionadaId(colonia.id)}
                >
                  {colonia.colonia}
                </button>
              ))}
            </div>

            <BotonPrincipal
              className={estilos.modalColoniasBoton}
              onClick={confirmarColonia}
              deshabilitado={!coloniaSeleccionadaId}
            >
              {textoBotonModalColonias}
            </BotonPrincipal>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default PasoDomicilio

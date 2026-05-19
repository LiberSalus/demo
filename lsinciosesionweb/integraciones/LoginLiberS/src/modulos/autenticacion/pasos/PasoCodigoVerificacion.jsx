import { useEffect, useMemo, useRef, useState } from 'react'
import BotonPrincipal from '../componentes/BotonPrincipal'
import estilos from '../estilos/autenticacion.module.css'

function PasoCodigoVerificacion({ contenido, preregistro }) {
  const {
    cantidadDigitos,
    segundosIniciales,
    textoBoton,
    textoAyuda,
    textoReenvio,
  } = contenido
  const { estado, confirmarCodigoYRegistrar, reenviarCodigoCorreo, limpiarMensajes } =
    preregistro

  const [codigo, setCodigo] = useState(() => Array(cantidadDigitos).fill(''))
  const [segundosRestantes, setSegundosRestantes] = useState(segundosIniciales)
  const referenciasInputs = useRef([])

  useEffect(() => {
    setCodigo(Array(cantidadDigitos).fill(''))
    referenciasInputs.current = []
  }, [cantidadDigitos])

  useEffect(() => {
    setSegundosRestantes(segundosIniciales)
  }, [segundosIniciales])

  useEffect(() => {
    if (segundosRestantes <= 0) {
      return undefined
    }

    const temporizador = window.setInterval(() => {
      setSegundosRestantes((valorActual) => valorActual - 1)
    }, 1000)

    return () => window.clearInterval(temporizador)
  }, [segundosRestantes])

  const codigoCompleto = useMemo(
    () => codigo.every((digito) => digito.trim().length === 1),
    [codigo],
  )
  const codigoConContenido = useMemo(
    () => codigo.some((digito) => digito.trim().length === 1),
    [codigo],
  )
  const estadoValidacionDemo = codigoCompleto
    ? 'exito'
    : codigoConContenido
      ? 'error'
      : 'inicial'

  const tiempoFormateado = useMemo(() => {
    const minutos = String(Math.floor(segundosRestantes / 60)).padStart(2, '0')
    const segundos = String(segundosRestantes % 60).padStart(2, '0')

    return `${minutos}:${segundos}`
  }, [segundosRestantes])

  const manejarCambioDigito = (indice, valor) => {
    limpiarMensajes()
    const valorNormalizado = valor.replace(/\D/g, '').slice(-1)
    const nuevoCodigo = [...codigo]
    nuevoCodigo[indice] = valorNormalizado
    setCodigo(nuevoCodigo)

    if (valorNormalizado && indice < referenciasInputs.current.length - 1) {
      referenciasInputs.current[indice + 1]?.focus()
    }
  }

  const manejarTecla = (indice, evento) => {
    if (evento.key === 'Backspace' && !codigo[indice] && indice > 0) {
      referenciasInputs.current[indice - 1]?.focus()
    }
  }

  const manejarReenvio = () => {
    setCodigo(Array(cantidadDigitos).fill(''))
    setSegundosRestantes(segundosIniciales)
    referenciasInputs.current[0]?.focus()
    void reenviarCodigoCorreo()
  }

  return (
    <section className={`${estilos.pasoGenerico} ${estilos.pasoCodigoVerificacion}`}>
      <div className={estilos.codigoVerificacion}>
        {Array.from({ length: cantidadDigitos }, (_, indice) => (
          <input
            key={indice}
            className={[
              estilos.codigoVerificacionCasilla,
              estadoValidacionDemo === 'error' ? estilos.codigoVerificacionCasillaError : '',
              estadoValidacionDemo === 'exito' ? estilos.codigoVerificacionCasillaExito : '',
            ]
              .filter(Boolean)
              .join(' ')}
            inputMode="numeric"
            maxLength="1"
            value={codigo[indice]}
            aria-label={`Dígito ${indice + 1}`}
            onChange={(evento) => manejarCambioDigito(indice, evento.target.value)}
            onKeyDown={(evento) => manejarTecla(indice, evento)}
            ref={(elemento) => {
              referenciasInputs.current[indice] = elemento
            }}
          />
        ))}
      </div>

      <p className={estilos.codigoVerificacionTemporizador}>{tiempoFormateado}</p>

      {estado.error ? (
        <p className={estilos.mensajeFormularioError}>{estado.error}</p>
      ) : null}
      {estado.exito ? (
        <p className={estilos.mensajeFormularioExito}>{estado.exito}</p>
      ) : null}

      <BotonPrincipal
        deshabilitado={!codigoCompleto}
        cargando={estado.cargando}
        onClick={() => confirmarCodigoYRegistrar(codigo.join(''))}
      >
        {estado.cargando ? 'Validando...' : textoBoton}
      </BotonPrincipal>

      <div className={estilos.codigoVerificacionAyuda}>
        <p>{textoAyuda}</p>
        <button className={estilos.accionTexto} type="button" onClick={manejarReenvio}>
          {textoReenvio}
        </button>
      </div>
    </section>
  )
}

export default PasoCodigoVerificacion

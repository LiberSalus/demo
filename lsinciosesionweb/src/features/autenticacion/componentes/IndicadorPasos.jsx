import estilos from '../estilos/autenticacion.module.css'
import icoPasos1 from '../assets/icoPasos1.svg'
import icoPasos2 from '../assets/icoPasos2.svg'
import icoPasos2Blco from '../assets/icoPasos2Blco.svg'
import icoPasos3 from '../assets/icoPasos3.svg'

const obtenerIconoPaso = (indice, estaActivo, estaCompletado) => {
  if (indice === 0) {
    return icoPasos1
  }

  if (indice === 1) {
    return estaActivo || estaCompletado ? icoPasos2 : icoPasos2Blco
  }

  return icoPasos3
}

function IndicadorPasos({ pasos, pasoActivo }) {
  const indiceActivo = pasos.findIndex((item) => item.id === pasoActivo)

  return (
    <ol className={estilos.indicadorPasos}>
      {pasos.map((paso, indice) => {
        const estaActivo = paso.id === pasoActivo
        const estaCompletado = indice < indiceActivo
        const iconoPaso = obtenerIconoPaso(indice, estaActivo, estaCompletado)

        return (
          <li className={estilos.indicadorPasosItem} key={paso.id}>
            <img className={estilos.indicadorPasosIcono} src={iconoPaso} alt={`Paso ${indice + 1}`} />
            <div className={estilos.indicadorPasosContenido}>
              <span className={estilos.indicadorPasosLinea}>
                {paso.titulo}
                {paso.tituloFuerte ? <strong>{paso.tituloFuerte}</strong> : null}
              </span>
              {paso.descripcion ? <span>{paso.descripcion}</span> : null}
              {paso.descripcionFuerte ? (
                <strong className={estilos.indicadorPasosDescripcionFuerte}>
                  {paso.descripcionFuerte}
                </strong>
              ) : null}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default IndicadorPasos

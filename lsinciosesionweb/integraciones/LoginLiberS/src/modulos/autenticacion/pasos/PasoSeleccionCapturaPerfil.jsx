import TarjetaOpcion from '../componentes/TarjetaOpcion'
import estilos from '../estilos/autenticacion.module.css'

function PasoSeleccionCapturaPerfil({ contenido, onIrAPaso }) {
  const { opciones } = contenido

  return (
    <section className={`${estilos.seleccionOpciones} ${estilos.pasoSeleccionCapturaPerfil}`}>
      {opciones.map((opcion) => (
        <TarjetaOpcion
          key={opcion.id}
          {...opcion}
          onClick={() =>
            onIrAPaso(opcion.id === 'manual' ? 'datosPersonales' : 'cargaDocumentos')
          }
        />
      ))}
    </section>
  )
}

export default PasoSeleccionCapturaPerfil

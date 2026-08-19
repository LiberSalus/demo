import TarjetaOpcion from '../componentes/TarjetaOpcion'
import estilos from '../estilos/autenticacion.module.css'

// REG-02 del diseno de pen.dev: seleccion de tipo de usuario antes de crear la
// cuenta. El flujo de profesional de la salud aun no esta definido en el
// diseno, por eso esa opcion aparece deshabilitada.
function PasoSeleccionTipoUsuario({ contenido, preregistro }) {
  const { opciones } = contenido
  const { seleccionarTipoUsuario } = preregistro

  return (
    <section className={`${estilos.seleccionOpciones} ${estilos.pasoTipoUsuario}`}>
      {opciones.map((opcion) => (
        <TarjetaOpcion
          key={opcion.clave}
          titulo={opcion.titulo}
          descripcion={opcion.descripcion}
          textoAccion={opcion.textoAccion}
          tipoIcono={opcion.tipoIcono}
          deshabilitado={opcion.deshabilitado}
          onClick={() => seleccionarTipoUsuario(opcion.clave)}
        />
      ))}
    </section>
  )
}

export default PasoSeleccionTipoUsuario

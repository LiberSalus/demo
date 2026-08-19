import BotonPrincipal from '../componentes/BotonPrincipal'
import estilos from '../estilos/autenticacion.module.css'

// REG-11 del diseno de pen.dev: resumen editable de la informacion capturada.
// Cada seccion tiene un boton de edicion que vuelve al formulario
// correspondiente (donde el boton pasa a "Guardar" y regresa a este resumen).
function PasoValidacionDatos({ contenido, preregistro, onAvanzar, onIrAPaso }) {
  const { datos } = preregistro
  const { datosPersonales, domicilio } = datos

  const seccionDatosPersonales = [
    { etiqueta: 'CURP', valor: datosPersonales.curp },
    { etiqueta: 'Nombre', valor: datosPersonales.nombre },
    { etiqueta: 'Apellido paterno', valor: datosPersonales.apellidoPaterno },
    { etiqueta: 'Apellido materno', valor: datosPersonales.apellidoMaterno },
    { etiqueta: 'Fecha de nacimiento', valor: datosPersonales.fechaNacimiento },
    { etiqueta: 'Sexo', valor: datosPersonales.sexo },
    { etiqueta: 'Nacionalidad', valor: datosPersonales.nacionalidad },
    { etiqueta: 'Estado de nacimiento', valor: datosPersonales.estadoNacimiento },
    { etiqueta: 'Abreviatura entidad', valor: datosPersonales.abrEntidad },
  ]

  const seccionDomicilio = [
    { etiqueta: 'Código postal', valor: domicilio.codigoPostal },
    { etiqueta: 'Estado', valor: domicilio.estado },
    { etiqueta: 'Municipio', valor: domicilio.municipio },
    { etiqueta: 'Ciudad', valor: domicilio.ciudad },
    { etiqueta: 'Colonia', valor: domicilio.colonia },
    { etiqueta: 'Calle', valor: domicilio.calle },
    { etiqueta: 'Número exterior', valor: domicilio.numeroExterior },
    { etiqueta: 'Número interior', valor: domicilio.numeroInterior },
    { etiqueta: 'Referencia', valor: domicilio.referencia },
  ]

  const renderizarSeccion = (titulo, campos, pasoDestino) => (
    <section className={estilos.resumenValidacionSeccion}>
      <h3 className={estilos.resumenValidacionTitulo}>
        {titulo}
        <button
          className={estilos.resumenValidacionEditar}
          type="button"
          onClick={() => onIrAPaso(pasoDestino)}
        >
          {contenido.textoEditar}
        </button>
      </h3>
      <ul className={estilos.resumenValidacionLista}>
        {campos.map((campo) => (
          <li key={campo.etiqueta} className={estilos.resumenValidacionItem}>
            <span className={estilos.resumenValidacionEtiqueta}>{campo.etiqueta}</span>
            <span className={estilos.resumenValidacionValor}>
              {campo.valor ? campo.valor : '—'}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )

  return (
    <section className={`${estilos.pasoFormulario} ${estilos.pasoValidacionDatos}`}>
      <div className={estilos.resumenValidacion}>
        {renderizarSeccion(
          contenido.tituloSeccionDatosPersonales,
          seccionDatosPersonales,
          'datosPersonales',
        )}
        {renderizarSeccion(contenido.tituloSeccionDomicilio, seccionDomicilio, 'domicilio')}
      </div>

      <BotonPrincipal onClick={onAvanzar}>{contenido.textoBoton}</BotonPrincipal>
    </section>
  )
}

export default PasoValidacionDatos

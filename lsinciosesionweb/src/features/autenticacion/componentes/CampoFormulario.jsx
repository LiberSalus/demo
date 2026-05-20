import { useState } from 'react'
import estilos from '../estilos/autenticacion.module.css'
import icoOjo from '../assets/icoOjo.svg'

function CampoFormulario({
  etiqueta,
  nombre,
  tipo = 'text',
  marcador,
  descripcion,
  opciones = [],
  prefijo,
  iconoFinal,
  error,
  permiteMostrarContrasena = false,
  soloLectura = false,
  valor,
  onChange,
}) {
  const [mostrarContrasena, setMostrarContrasena] = useState(false)

  const tipoControl =
    permiteMostrarContrasena && tipo === 'password'
      ? mostrarContrasena
        ? 'text'
        : 'password'
      : tipo

  return (
    <label className={estilos.campoFormulario} htmlFor={nombre}>
      <span className={estilos.campoFormularioEtiqueta}>{etiqueta}</span>
      {descripcion ? (
        <span className={estilos.campoFormularioDescripcion}>{descripcion}</span>
      ) : null}
      <span
        className={`${estilos.campoFormularioContenedor} ${
          error ? estilos.campoFormularioContenedorError : ''
        }`}
      >
        {prefijo ? <span className={estilos.campoFormularioPrefijo}>{prefijo}</span> : null}
        {tipo === 'select' ? (
          <select
            className={estilos.campoFormularioControl}
            id={nombre}
            name={nombre}
            value={valor ?? ''}
            onChange={onChange}
          >
            <option value="" disabled>
              {marcador}
            </option>
            {opciones.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.etiqueta}
              </option>
            ))}
          </select>
        ) : (
          <input
            className={estilos.campoFormularioControl}
            id={nombre}
            name={nombre}
            readOnly={soloLectura}
            type={tipoControl}
            placeholder={marcador}
            value={valor}
            onChange={onChange}
          />
        )}
        {permiteMostrarContrasena ? (
          <button
            className={[
              estilos.botonIconoCampo,
              mostrarContrasena ? estilos.botonIconoCampoActivo : '',
            ]
              .filter(Boolean)
              .join(' ')}
            type="button"
            aria-label={mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onClick={() => setMostrarContrasena((valorActual) => !valorActual)}
          >
            <img className={estilos.iconoCampo} src={icoOjo} alt="" />
          </button>
        ) : null}
        {iconoFinal ? (
          <span className={estilos.campoFormularioIconoFinal}>{iconoFinal}</span>
        ) : null}
      </span>
      {error ? (
        <span className={estilos.campoFormularioError} role="alert" aria-live="polite">
          {error}
        </span>
      ) : null}
    </label>
  )
}

export default CampoFormulario

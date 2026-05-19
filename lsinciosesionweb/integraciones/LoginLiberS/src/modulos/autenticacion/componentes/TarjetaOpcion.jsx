import estilos from '../estilos/autenticacion.module.css'

function IconoTarjetaOpcion({ tipoIcono }) {
  if (tipoIcono === 'documentoSubida') {
    return (
      <svg
        className={estilos.iconoDocumentoTarjeta}
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M22 6h15l13 13v18.5"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 6c-4.418 0-8 3.582-8 8v28c0 4.418 3.582 8 8 8h9"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M37 6v13h13"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M24 26h14M24 34h14M24 42h10"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle cx="47" cy="47" r="10" stroke="currentColor" strokeWidth="3.5" />
        <path
          d="M47 52V42m0 0-4 4m4-4 4 4"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg
      className={estilos.iconoDocumentoTarjeta}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M22 6h16l12 12v24c0 4.418-3.582 8-8 8H22c-4.418 0-8-3.582-8-8V14c0-4.418 3.582-8 8-8Z"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M38 6v12h12"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 26h16M24 34h16M24 42h16"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function TarjetaOpcion({ titulo, descripcion, textoAccion, tipoIcono, onClick }) {
  return (
    <article className={estilos.tarjetaOpcion}>
      <div className={estilos.tarjetaOpcionIcono} aria-hidden="true">
        <IconoTarjetaOpcion tipoIcono={tipoIcono} />
      </div>
      <h3 className={estilos.tarjetaOpcionTitulo}>{titulo}</h3>
      <p className={estilos.tarjetaOpcionDescripcion}>{descripcion}</p>
      <button className={estilos.tarjetaOpcionAccion} type="button" onClick={onClick}>
        {textoAccion}
      </button>
    </article>
  )
}

export default TarjetaOpcion

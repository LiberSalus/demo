import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import estilosAutenticacion from '../estilos/autenticacion.module.css'
import estilos from './modalDemoHub.module.css'

// Modal de entrada al modo offline: perfil de prueba, iniciar sesion con una
// cuenta registrada localmente, o crear una cuenta nueva en la demo.
function ModalDemoHub({ onPerfilPrueba, onIniciarSesion, onCrearCuenta, onCerrar }) {
  useEffect(() => {
    const manejarTecla = (evento) => {
      if (evento.key === 'Escape') onCerrar()
    }
    window.addEventListener('keydown', manejarTecla)

    return () => window.removeEventListener('keydown', manejarTecla)
  }, [onCerrar])

  const opciones = [
    {
      clave: 'perfilPrueba',
      titulo: 'Perfil de prueba',
      sub: 'Demo rápida',
      desc: 'Entra al instante con una persona de ejemplo: María, Juan, Rosa o Sofía.',
      cta: 'Elegir persona',
      accion: onPerfilPrueba,
      color: '#8b5cf6',
      icono: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      clave: 'iniciarSesion',
      titulo: 'Iniciar sesión',
      sub: 'Mi cuenta',
      desc: 'Entra con el correo y la contraseña de una cuenta registrada en esta demo.',
      cta: 'Ir a iniciar sesión',
      accion: onIniciarSesion,
      color: '#007cba',
      icono: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
          <polyline points="10 17 15 12 10 7" />
          <line x1="15" y1="12" x2="3" y2="12" />
        </svg>
      ),
    },
    {
      clave: 'crearCuenta',
      titulo: 'Crear cuenta',
      sub: 'Registro demo',
      desc: 'Regístrate en la demo; tu cuenta se guarda en este navegador y podrás entrar con ella.',
      cta: 'Crear cuenta',
      accion: onCrearCuenta,
      color: '#22c55e',
      icono: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="8.5" cy="7" r="4" />
          <line x1="20" y1="8" x2="20" y2="14" />
          <line x1="23" y1="11" x2="17" y2="11" />
        </svg>
      ),
    },
  ]

  return createPortal(
    <section
      className={estilos.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Opciones del modo demo"
    >
      <article className={estilos.dialogo}>
        <header className={estilos.cabecera}>
          <div>
            <h2 className={estilos.titulo}>¿Cómo quieres entrar a la demo?</h2>
            <p className={estilos.texto}>
              Estás en modo offline. Elige una persona de ejemplo, inicia sesión con tu
              cuenta registrada o crea una nueva.
            </p>
          </div>
          <button
            className={estilos.cerrar}
            type="button"
            aria-label="Cerrar"
            onClick={onCerrar}
          >
            ×
          </button>
        </header>

        <div className={estilos.opciones}>
          {opciones.map((opcion) => (
            <button
              key={opcion.clave}
              type="button"
              className={estilosAutenticacion.seleccionDemoOpcion}
              onClick={opcion.accion}
            >
              <span className={estilosAutenticacion.seleccionDemoOpcionEncabezado}>
                <span
                  className={estilosAutenticacion.seleccionDemoOpcionAvatar}
                  style={{ background: `${opcion.color}20`, color: opcion.color }}
                >
                  {opcion.icono}
                </span>
                <span className={estilosAutenticacion.seleccionDemoOpcionIdentidad}>
                  <span className={estilosAutenticacion.seleccionDemoOpcionNombre}>
                    {opcion.titulo}
                  </span>
                  <span className={estilosAutenticacion.seleccionDemoOpcionPills}>
                    <span
                      className={estilosAutenticacion.seleccionDemoOpcionPerfil}
                      style={{ background: `${opcion.color}15`, color: opcion.color }}
                    >
                      {opcion.sub}
                    </span>
                  </span>
                </span>
              </span>

              <span className={estilosAutenticacion.seleccionDemoOpcionDesc}>{opcion.desc}</span>

              <span
                className={estilosAutenticacion.seleccionDemoOpcionEntrar}
                style={{ background: opcion.color }}
              >
                <span>{opcion.cta}</span>
                <span className={estilosAutenticacion.seleccionDemoOpcionFlecha} aria-hidden="true">
                  →
                </span>
              </span>
            </button>
          ))}
        </div>
      </article>
    </section>,
    document.body,
  )
}

export default ModalDemoHub

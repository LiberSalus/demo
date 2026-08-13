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
      inicial: 'P',
      titulo: 'Perfil de prueba',
      sub: 'Demo rápida',
      desc: 'Entra al instante con una persona de ejemplo: María, Juan, Rosa o Sofía.',
      cta: 'Elegir persona',
      accion: onPerfilPrueba,
    },
    {
      clave: 'iniciarSesion',
      inicial: 'I',
      titulo: 'Iniciar sesión',
      sub: 'Mi cuenta',
      desc: 'Entra con el correo y la contraseña de una cuenta registrada en esta demo.',
      cta: 'Ir a iniciar sesión',
      accion: onIniciarSesion,
    },
    {
      clave: 'crearCuenta',
      inicial: 'R',
      titulo: 'Crear cuenta',
      sub: 'Registro demo',
      desc: 'Regístrate en la demo; tu cuenta se guarda en este navegador y podrás entrar con ella.',
      cta: 'Crear cuenta',
      accion: onCrearCuenta,
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
                <span className={estilosAutenticacion.seleccionDemoOpcionAvatar}>
                  {opcion.inicial}
                </span>
                <span className={estilosAutenticacion.seleccionDemoOpcionIdentidad}>
                  <span className={estilosAutenticacion.seleccionDemoOpcionNombre}>
                    {opcion.titulo}
                  </span>
                  <span className={estilosAutenticacion.seleccionDemoOpcionPills}>
                    <span className={estilosAutenticacion.seleccionDemoOpcionPerfil}>
                      {opcion.sub}
                    </span>
                  </span>
                </span>
              </span>

              <span className={estilosAutenticacion.seleccionDemoOpcionDesc}>{opcion.desc}</span>

              <span className={estilosAutenticacion.seleccionDemoOpcionEntrar}>
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

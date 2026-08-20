import EncabezadoAutenticacion from '../componentes/EncabezadoAutenticacion'
import PieAutenticacion from '../componentes/PieAutenticacion'
import { PERSONAS_DEMO } from '@/config/demo.config'
import estilos from '../estilos/autenticacion.module.css'

// Iconos SVG por género
const IconosGenero = {
  mujer: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    </svg>
  ),
  hombre: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="5" />
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    </svg>
  ),
}

// Colores por persona (Paleta 2 - Armonía Natural)
const COLORES_PERSONA = {
  mujer: { bg: '#f3e8ff', color: '#a78bfa', border: '#ddd6fe' },   // Lavanda
  hombre: { bg: '#ecfeff', color: '#22d3ee', border: '#a5f3fc' },  // Aguamarina
  mayor: { bg: '#fffbeb', color: '#fbbf24', border: '#fde68a' },   // Durazno
  menor: { bg: '#f0fdf4', color: '#4ade80', border: '#bbf7d0' },   // Esmeralda
}

// Iniciales visibles en el avatar de la persona demo.
function inicialesDe(persona) {
  const a = (persona.first_name || '').charAt(0)
  const b = (persona.last_name || '').charAt(0)
  return `${a}${b}`.toUpperCase()
}

// Etiqueta legible del perfil de salud de la persona.
const ETIQUETAS_PERFIL = {
  adulto_activo: 'Adulto activo',
  mayor_asistido: 'Mayor asistido',
  menor_tutor: 'Menor',
}

function etiquetaPerfil(perfil) {
  return ETIQUETAS_PERFIL[perfil] || perfil || 'Perfil'
}

// Renderiza un campo breve de la tarjeta de persona demo.
function DatoTarjetaDemo({ etiqueta, valor, color }) {
  return (
    <span className={estilos.seleccionDemoDato} style={{ borderColor: `${color}30` }}>
      <span className={estilos.seleccionDemoDatoEtiqueta} style={{ color }}>{etiqueta}</span>
      <span className={estilos.seleccionDemoDatoValor}>{valor}</span>
    </span>
  )
}

// Pantalla previa al panel: el usuario elige con que persona demo entrar.
function VistaSeleccionDemo({ estadoDemo, onEntrarDemo, onVolver }) {
  return (
    <section
      className={`${estilos.vistaAutenticacion} ${estilos.vistaAutenticacionInicio} ${estilos.vistaAutenticacionCentrada} ${estilos.seleccionDemoVista}`}
    >
      <div className={estilos.vistaAutenticacionPrincipal}>
        <EncabezadoAutenticacion />

        <div className={estilos.seleccionDemo}>
          <h3 className={estilos.seleccionDemoTitulo}>¿Con quién quieres explorar la demo?</h3>
          <p className={estilos.seleccionDemoTexto}>
            Elige una persona demo y entra al panel con su perfil completo.
          </p>

          <div className={estilos.seleccionDemoOpciones}>
            {PERSONAS_DEMO.map((persona) => {
              const colores = COLORES_PERSONA[persona.clave] || COLORES_PERSONA.mujer
              return (
                <button
                  key={persona.clave}
                  type="button"
                  className={estilos.seleccionDemoOpcion}
                  style={{
                    '--card-bg': colores.bg,
                    '--card-color': colores.color,
                    '--card-border': colores.border,
                  }}
                  onClick={() => onEntrarDemo(persona.clave)}
                  disabled={estadoDemo.cargando}
                >
                  <span className={estilos.seleccionDemoOpcionEncabezado}>
                    <span
                      className={estilos.seleccionDemoOpcionAvatar}
                      style={{ background: colores.bg, color: colores.color, borderColor: colores.border }}
                    >
                      {inicialesDe(persona)}
                    </span>
                    <span className={estilos.seleccionDemoOpcionIdentidad}>
                      <span className={estilos.seleccionDemoOpcionNombre}>{persona.nombre}</span>
                      <span className={estilos.seleccionDemoOpcionPills}>
                        <span className={estilos.seleccionDemoOpcionGen} style={{ background: `${colores.color}15`, color: colores.color }}>
                          {persona.genero || (persona.sexo === 'mujer' ? 'Mujer' : 'Hombre')}
                        </span>
                        <span className={estilos.seleccionDemoOpcionPerfil} style={{ background: `${colores.color}10`, color: colores.color }}>
                          {etiquetaPerfil(persona.perfil)}
                        </span>
                      </span>
                    </span>
                  </span>

                  {persona.descripcion ? (
                    <span className={estilos.seleccionDemoOpcionDesc}>{persona.descripcion}</span>
                  ) : null}

                  <span className={estilos.seleccionDemoOpcionDatos}>
                    <DatoTarjetaDemo etiqueta="Edad" valor={`${persona.edad} años`} color={colores.color} />
                    <DatoTarjetaDemo etiqueta="Peso" valor={`${persona.peso} kg`} color={colores.color} />
                    <DatoTarjetaDemo etiqueta="Sangre" valor={persona.sangre} color={colores.color} />
                    <DatoTarjetaDemo etiqueta="Estatura" valor={`${persona.estatura} cm`} color={colores.color} />
                  </span>

                  <span className={estilos.seleccionDemoOpcionEntrar} style={{ background: colores.color }}>
                    <span>
                      {estadoDemo.cargando ? 'Entrando...' : 'Entrar con este perfil'}
                    </span>
                    {!estadoDemo.cargando ? (
                      <span className={estilos.seleccionDemoOpcionFlecha} aria-hidden="true">→</span>
                    ) : null}
                  </span>
                </button>
              )
            })}
          </div>

          {estadoDemo.error ? (
            <p className={estilos.mensajeFormularioError}>{estadoDemo.error}</p>
          ) : null}

          {!estadoDemo.cargando ? (
            <button
              type="button"
              className={estilos.seleccionDemoVolver}
              onClick={onVolver}
            >
              Volver al inicio de sesión
            </button>
          ) : null}
        </div>

        <PieAutenticacion />
      </div>
    </section>
  )
}

export default VistaSeleccionDemo

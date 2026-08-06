import EncabezadoAutenticacion from '../componentes/EncabezadoAutenticacion'
import PieAutenticacion from '../componentes/PieAutenticacion'
import { PERSONAS_DEMO } from '@/config/demo.config'
import estilos from '../estilos/autenticacion.module.css'

// Iniciales visibles en el avatar de la persona demo.
function inicialesDe(persona) {
  const a = (persona.first_name || '').charAt(0)
  const b = (persona.last_name || '').charAt(0)
  return `${a}${b}`.toUpperCase()
}

// Etiqueta legible del perfil de salud de la persona.
const ETIQUETAS_PERFIL = {
  adulto_activo: 'Adulto',
  mayor_asistido: 'Mayor asistido',
  menor_tutor: 'Menor',
}

function etiquetaPerfil(perfil) {
  return ETIQUETAS_PERFIL[perfil] || perfil || 'Perfil'
}

// Renderiza un campo breve de la tarjeta de persona demo.
function DatoTarjetaDemo({ etiqueta, valor }) {
  return (
    <span className={estilos.seleccionDemoDato}>
      <span className={estilos.seleccionDemoDatoEtiqueta}>{etiqueta}</span> {valor}
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
            {PERSONAS_DEMO.map((persona) => (
              <button
                key={persona.clave}
                type="button"
                className={`${estilos.seleccionDemoOpcion} ${
                  // La clave viene en minuscula ("mujer", "mayor"...) y las
                  // clases CSS se llaman capitalizadas ("seleccionDemoOpcionMujer").
                  estilos[
                    `seleccionDemoOpcion${persona.clave.charAt(0).toUpperCase()}${persona.clave.slice(1)}`
                  ] || ''
                }`}
                onClick={() => onEntrarDemo(persona.clave)}
                disabled={estadoDemo.cargando}
              >
                <span className={estilos.seleccionDemoOpcionEncabezado}>
                  <span className={estilos.seleccionDemoOpcionAvatar}>
                    {inicialesDe(persona)}
                  </span>
                  <span className={estilos.seleccionDemoOpcionIdentidad}>
                    <span className={estilos.seleccionDemoOpcionNombre}>{persona.nombre}</span>
                    <span className={estilos.seleccionDemoOpcionPills}>
                      <span className={estilos.seleccionDemoOpcionGen}>
                        {persona.genero || (persona.sexo === 'mujer' ? 'Mujer' : 'Hombre')}
                      </span>
                      <span className={estilos.seleccionDemoOpcionPerfil}>
                        {etiquetaPerfil(persona.perfil)}
                      </span>
                    </span>
                  </span>
                </span>

                {persona.descripcion ? (
                  <span className={estilos.seleccionDemoOpcionDesc}>{persona.descripcion}</span>
                ) : null}

                <span className={estilos.seleccionDemoOpcionDatos}>
                  <DatoTarjetaDemo etiqueta="Edad" valor={`${persona.edad} años`} />
                  <DatoTarjetaDemo etiqueta="Peso" valor={`${persona.peso} kg`} />
                  <DatoTarjetaDemo etiqueta="Sangre" valor={persona.sangre} />
                  <DatoTarjetaDemo etiqueta="Estatura" valor={`${persona.estatura} cm`} />
                </span>

                <span className={estilos.seleccionDemoOpcionEntrar}>
                  <span>
                    {estadoDemo.cargando ? 'Entrando...' : 'Entrar con este perfil'}
                  </span>
                  {!estadoDemo.cargando ? (
                    <span className={estilos.seleccionDemoOpcionFlecha} aria-hidden="true">→</span>
                  ) : null}
                </span>
              </button>
            ))}
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

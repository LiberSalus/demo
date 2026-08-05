import EncabezadoAutenticacion from '../componentes/EncabezadoAutenticacion'
import PieAutenticacion from '../componentes/PieAutenticacion'
import { PERSONAS_DEMO } from '@/config/demo.config'
import estilos from '../estilos/autenticacion.module.css'

// Renderiza un campo breve de la tarjeta de persona demo.
function DatoTarjetaDemo({ etiqueta, valor }) {
  return (
    <p className={estilos.seleccionDemoDato}>
      <span className={estilos.seleccionDemoDatoEtiqueta}>{etiqueta}:</span> {valor}
    </p>
  )
}

// Pantalla previa al panel: el usuario elige con que persona demo entrar.
function VistaSeleccionDemo({ estadoDemo, onEntrarDemo, onVolver }) {
  return (
    <section
      className={`${estilos.vistaAutenticacion} ${estilos.vistaAutenticacionInicio} ${estilos.vistaAutenticacionCentrada}`}
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
                  estilos[`seleccionDemoOpcion${persona.clave}`] || ''
                }`}
                onClick={() => onEntrarDemo(persona.clave)}
                disabled={estadoDemo.cargando}
              >
                <span className={estilos.seleccionDemoOpcionNombre}>{persona.nombre}</span>
                <span className={estilos.seleccionDemoOpcionGen}>
                  {persona.sexo === 'mujer' ? 'Mujer' : 'Hombre'}
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
                  {estadoDemo.cargando ? 'Entrando...' : 'Entrar con este perfil'}
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
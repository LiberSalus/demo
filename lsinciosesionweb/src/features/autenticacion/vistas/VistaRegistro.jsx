import EncabezadoAutenticacion from '../componentes/EncabezadoAutenticacion'
import PieAutenticacion from '../componentes/PieAutenticacion'
import PasoCodigoVerificacion from '../pasos/PasoCodigoVerificacion'
import PasoConfirmacionCuenta from '../pasos/PasoConfirmacionCuenta'
import PasoRegistroCuenta from '../pasos/PasoRegistroCuenta'
import PasoSeleccionEnvioCodigo from '../pasos/PasoSeleccionEnvioCodigo'
import estilos from '../estilos/autenticacion.module.css'

const componentesPaso = {
  PasoRegistroCuenta,
  PasoSeleccionEnvioCodigo,
  PasoCodigoVerificacion,
  PasoConfirmacionCuenta,
}

function VistaRegistro({
  configuracionPaso,
  preregistro,
  onAvanzar,
  onCambiarAInicioSesion,
}) {
  const ComponentePaso = componentesPaso[configuracionPaso.nombreComponente]

  return (
    <section className={estilos.vistaAutenticacion}>
      <div
        className={`${estilos.vistaAutenticacionPrincipal} ${estilos.vistaAutenticacionPrincipalRegistro}`}
      >
        <EncabezadoAutenticacion
          titulo={configuracionPaso.titulo}
          subtitulo={configuracionPaso.subtitulo}
        />

        <ComponentePaso
          contenido={configuracionPaso.contenido}
          preregistro={preregistro}
          onAvanzar={onAvanzar}
          onCambiarAInicioSesion={onCambiarAInicioSesion}
        />

        <PieAutenticacion />
      </div>
    </section>
  )
}

export default VistaRegistro

import EncabezadoAutenticacion from '../componentes/EncabezadoAutenticacion'
import PieAutenticacion from '../componentes/PieAutenticacion'
import PasoCodigoVerificacion from '../pasos/PasoCodigoVerificacion'
import PasoCargaDocumentos from '../pasos/PasoCargaDocumentos'
import PasoConfirmacionCuenta from '../pasos/PasoConfirmacionCuenta'
import PasoConfirmacionPerfil from '../pasos/PasoConfirmacionPerfil'
import PasoDatosPersonales from '../pasos/PasoDatosPersonales'
import PasoDomicilio from '../pasos/PasoDomicilio'
import PasoRegistroCuenta from '../pasos/PasoRegistroCuenta'
import PasoSeleccionCapturaPerfil from '../pasos/PasoSeleccionCapturaPerfil'
import PasoSeleccionEnvioCodigo from '../pasos/PasoSeleccionEnvioCodigo'
import estilos from '../estilos/autenticacion.module.css'

const componentesPaso = {
  PasoRegistroCuenta,
  PasoSeleccionEnvioCodigo,
  PasoCodigoVerificacion,
  PasoConfirmacionCuenta,
  PasoSeleccionCapturaPerfil,
  PasoCargaDocumentos,
  PasoDatosPersonales,
  PasoDomicilio,
  PasoConfirmacionPerfil,
}

function VistaRegistro({
  configuracionPaso,
  preregistro,
  onAvanzar,
  onIrAPaso,
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
          onIrAPaso={onIrAPaso}
          onCambiarAInicioSesion={onCambiarAInicioSesion}
        />

        <PieAutenticacion />
      </div>
    </section>
  )
}

export default VistaRegistro

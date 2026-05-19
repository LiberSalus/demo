import EncabezadoAutenticacion from '../componentes/EncabezadoAutenticacion'
import PieAutenticacion from '../componentes/PieAutenticacion'
import PasoCargaDocumentos from '../pasos/PasoCargaDocumentos'
import PasoCodigoVerificacion from '../pasos/PasoCodigoVerificacion'
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
  tipoPerfil,
  onCambiarTipoPerfil,
  onAvanzar,
  onRetroceder,
  onIrAPaso,
  onCambiarAInicioSesion,
}) {
  // Cada paso recibe su bloque `contenido` para mantenerse presentacional y no
  // depender de textos o estructuras quemadas dentro del JSX.
  const ComponentePaso = componentesPaso[configuracionPaso.nombreComponente]
  const mostrarBotonRegreso = [
    'seleccionCapturaPerfil',
    'cargaDocumentos',
    'datosPersonales',
    'domicilio',
    'confirmacionPerfil',
  ].includes(configuracionPaso.id)

  return (
    <section className={estilos.vistaAutenticacion}>
      <div
        className={`${estilos.vistaAutenticacionPrincipal} ${estilos.vistaAutenticacionPrincipalRegistro}`}
      >
        <EncabezadoAutenticacion
          titulo={configuracionPaso.titulo}
          subtitulo={configuracionPaso.subtitulo}
          mostrarBotonRegreso={mostrarBotonRegreso}
          onRegresar={onRetroceder}
        />

        <ComponentePaso
          contenido={configuracionPaso.contenido}
          preregistro={preregistro}
          tipoPerfil={tipoPerfil}
          onCambiarTipoPerfil={onCambiarTipoPerfil}
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

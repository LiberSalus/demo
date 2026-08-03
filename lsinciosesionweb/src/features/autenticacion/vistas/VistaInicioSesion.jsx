import EncabezadoAutenticacion from '../componentes/EncabezadoAutenticacion'
import PieAutenticacion from '../componentes/PieAutenticacion'
import PasoInicioSesion from '../pasos/PasoInicioSesion'
import estilos from '../estilos/autenticacion.module.css'
import icoLSlateral from '../assets/icoLSlateral.svg'

function VistaInicioSesion({
  configuracion,
  datosInicioSesion,
  estadoInicioSesion,
  onCambiarARegistro,
  onEnviarInicioSesion,
  onInputInicioSesionChange,
  demoActivo = false,
  onEntrarDemo,
}) {
  return (
    <section className={`${estilos.vistaAutenticacion} ${estilos.vistaAutenticacionInicio}`}>
      {<div className={estilos.panelPromocional}>
        {/* <div className={`${estilos.panelPromocionalOla} ${estilos.panelPromocionalOlaUno}`} />
        <div className={`${estilos.panelPromocionalOla} ${estilos.panelPromocionalOlaDos}`} />
        <div className={`${estilos.panelPromocionalOla} ${estilos.panelPromocionalOlaTres}`} /> */}
        <p>{configuracion.panelPromocional.titular}</p>
        <img className={estilos.iconoLateral} src={icoLSlateral} alt="Libersalus" />
      </div>}

      <div className={estilos.vistaAutenticacionPrincipal}>
        <EncabezadoAutenticacion />
        <PasoInicioSesion
          datos={datosInicioSesion}
          error={estadoInicioSesion.error}
          cargando={estadoInicioSesion.cargando}
          onCambiarARegistro={onCambiarARegistro}
          onEnviar={onEnviarInicioSesion}
          onInputChange={onInputInicioSesionChange}
          demoActivo={demoActivo}
          onEntrarDemo={onEntrarDemo}
        />
        <PieAutenticacion />
      </div>
    </section>
  )
}

export default VistaInicioSesion

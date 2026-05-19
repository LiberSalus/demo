import { useState } from 'react'
import { CountrySelector, usePhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import BotonPrincipal from '../componentes/BotonPrincipal'
import CampoFormulario from '../componentes/CampoFormulario'
import ModalAvisoLegal from '../componentes/ModalAvisoLegal'
import SelectorPerfil from '../componentes/SelectorPerfil'
import { camposRegistroCuenta } from '../datos/camposRegistroCuenta'
import estilos from '../estilos/autenticacion.module.css'

const documentosLegales = {
  terminos: {
    titulo: 'Aviso de privacidad inrtegral',
    fechaActualizacion: '04 - Julio - 2025',
    etiquetaAceptacion: 'He leído y acepto los Términos y condiciones.',
    contenido: [
      {
        titulo: 'Indentidad y domicilio de responsable',
        parrafos: [
          <>Liber SAlus S.A de C.V (Liber Salus) con domicilio en Fernando Lizardi 42, Colonia Iztapalapa, Alcaldía Iztapalapa, C.P. 09270, Ciudad de México, CDMX, es responsable del tratamiento, uso, almacenamiento y protección de los datos personales que nos proporciones el usuario, incluidos  datos personales sensibles, en el cumplimiento con la <b> Ley Federal de Protección de Datos Personales en Posesión de los Particulares </b> (de ahora en adelante “Ley”) y su Reglamento (de ahora en adelante “Reglamento”). El tratamiento de sus datos personales y datos sensibles también se rige  por la <b>Ley General de Salud, NOM-024-SSA3-2012 y demás disposiciones aplicables en materia de salud, tecnologías de la información y protección de datos</b>.</>,
          <>Al acceder y utilizar nuestra plataforma www. libersalus.com, así como al proporcionarnos su información a través de diversos medios, usted acepta y otorga su consentimiento expreso para que “Liber Salus” recabe, procese, almacene y en su caso, transfiera sus datos personales sensibles conforme a los términos establecidos en este <b> aviso de privacidad</b>.</>,
        ],
      },
      /* {
        titulo: 'Responsabilidades del usuario',
        parrafos: [
          'El usuario es responsable de resguardar sus credenciales, proporcionar datos reales y mantener actualizada la información necesaria para su afiliación.',
          'El uso de la plataforma implica la aceptación de futuras actualizaciones publicadas en este mismo aviso.',
        ],
      }, */
    ],
  },
  politicas: {
    titulo: 'Aviso de privacidad integral',
    fechaActualizacion: '04 - Julio - 2025',
    etiquetaAceptacion: 'He leído y acepto el Aviso de Privacidad.',
    contenido: [
      {
        titulo: 'Identidad y domicilio de responsable',
        parrafos: [
          'Liber Salus S.A de C.V es responsable del tratamiento, uso, almacenamiento y protección de los datos personales que nos proporciones durante tu registro y uso de la plataforma.',
          'La información recopilada podrá incluir datos personales sensibles relacionados con tu proceso de afiliación y será tratada conforme a la legislación aplicable en materia de protección de datos y salud.',
        ],
      },
      {
        titulo: 'Finalidades del tratamiento',
        parrafos: [
          'Tus datos serán utilizados para validar tu identidad, gestionar tu cuenta, dar seguimiento a tu afiliación y ofrecerte una experiencia segura y personalizada.',
          'Al proporcionar tu información otorgas tu consentimiento para que Liber Salus la utilice únicamente bajo los términos establecidos en este aviso de privacidad.',
        ],
      },
    ],
  },
}

function PasoRegistroCuenta({
  contenido,
  preregistro,
  tipoPerfil,
  onCambiarTipoPerfil,
  onAvanzar,
  onCambiarAInicioSesion,
}) {
  const {
    opcionesPerfil,
    etiquetaCorreo,
    marcadorCorreo,
    etiquetaLada,
    etiquetaTelefono,
    marcadorTelefono,
    textoAceptacionInicial,
    textoTerminos,
    textoConectorPoliticas,
    textoPoliticas,
    textoBoton,
    textoCuentaExistente,
    textoAccionInicioSesion,
  } = contenido
  const [telefonoCompleto, setTelefonoCompleto] = useState('+52')
  const [documentosAceptados, setDocumentosAceptados] = useState({
    terminos: false,
    politicas: false,
  })
  const [modalLegalActual, setModalLegalActual] = useState(null)
  const [confirmacionModal, setConfirmacionModal] = useState(false)
  const [aceptacionFormulario, setAceptacionFormulario] = useState(false)
  const { datos, estado, actualizarDatos, limpiarMensajes, establecerError } = preregistro
  const camposSinTelefono = camposRegistroCuenta.filter(
    (campo) => campo.nombre !== 'lada' && campo.nombre !== 'telefonoCelular',
  )
  const { inputValue, handlePhoneValueChange, country, setCountry } = usePhoneInput({
    defaultCountry: 'mx',
    value: telefonoCompleto,
    disableDialCodeAndPrefix: true,
    onChange: (datosTelefono) => {
      setTelefonoCompleto(datosTelefono.phone)
      actualizarDatos({
        codeTelefono: `+${datosTelefono.country.dialCode}`,
        telefono: datosTelefono.inputValue.replace(/\D/g, ''),
      })
    },
  })
  const abrirModalLegal = (tipoDocumento) => {
    setModalLegalActual(tipoDocumento)
    setConfirmacionModal(false)
  }

  const cerrarModalLegal = () => {
    setModalLegalActual(null)
    setConfirmacionModal(false)
  }

  const aceptarDocumentoLegal = () => {
    if (!modalLegalActual || !confirmacionModal) {
      return
    }

    const siguienteEstadoDocumentos = {
      ...documentosAceptados,
      [modalLegalActual]: true,
    }

    setDocumentosAceptados(siguienteEstadoDocumentos)
    setAceptacionFormulario(true)

    setModalLegalActual(null)
    setConfirmacionModal(false)
  }

  const manejarCrearCuenta = () => {
    limpiarMensajes()

    if (!datos.correo.trim()) {
      establecerError('Captura tu correo para continuar.')
      return
    }

    if (!datos.contrasena.trim() || !datos.confirmarContrasena.trim()) {
      establecerError('Captura y confirma tu contraseña para continuar.')
      return
    }

    if (datos.contrasena !== datos.confirmarContrasena) {
      establecerError('Las contraseñas no coinciden.')
      return
    }

    onAvanzar()
  }

  return (
    <section className={`${estilos.pasoFormulario} ${estilos.pasoRegistroCuenta}`}>
      <SelectorPerfil
        opciones={opcionesPerfil}
        valorActivo={tipoPerfil}
        onCambiar={onCambiarTipoPerfil}
      />

      <div className={`${estilos.rejillaFormulario} ${estilos.rejillaFormularioDosColumnas}`}>
        <CampoFormulario
          etiqueta={etiquetaCorreo}
          nombre="correoElectronico"
          tipo="email"
          marcador={marcadorCorreo}
          valor={datos.correo}
          onChange={(evento) => {
            limpiarMensajes()
            actualizarDatos({ correo: evento.target.value.trim() })
          }}
        />

        <div className={estilos.grupoTelefono}>
          <div className={estilos.grupoTelefonoEtiquetas}>
            <span className={estilos.campoFormularioEtiqueta}>{etiquetaLada}</span>
            <span className={estilos.campoFormularioEtiqueta}>{etiquetaTelefono}</span>
          </div>
          <div className={estilos.telefonoInternacional}>
            <div className={estilos.telefonoInternacionalSelector}>
              <CountrySelector
                selectedCountry={country.iso2}
                onSelect={(paisIso2) => setCountry(paisIso2)}
                buttonStyle={{
                  border: '0.0625rem solid transparent',
                  outline: 'none',
                  boxShadow: 'none',
                  background: 'transparent',
                  padding: 0,
                  margin: 0,
                  minHeight: 'auto',
                }}
                buttonClassName={estilos.telefonoInternacionalBotonBandera}
                buttonContentWrapperClassName={estilos.telefonoInternacionalContenidoBandera}
                flagClassName={estilos.telefonoInternacionalBandera}
                dropdownArrowClassName={estilos.telefonoInternacionalFlecha}
              />
              <span className={estilos.telefonoInternacionalLada}>+{country.dialCode}</span>
            </div>

            <input
              id="telefono"
              name="telefono"
              className={estilos.telefonoInternacionalInput}
              placeholder={marcadorTelefono}
              value={inputValue}
              onChange={(evento) => {
                limpiarMensajes()
                handlePhoneValueChange(evento)
              }}
            />
          </div>
        </div>

        {camposSinTelefono.slice(1).map((campo) => (
          <CampoFormulario
            key={campo.nombre}
            {...campo}
            valor={datos[campo.nombre] ?? ''}
            onChange={(evento) => {
              limpiarMensajes()
              actualizarDatos({ [campo.nombre]: evento.target.value })
            }}
          />
        ))}
      </div>

      {estado.error ? (
        <p className={estilos.mensajeFormularioError}>{estado.error}</p>
      ) : null}

      <label className={estilos.aceptacionTerminos}>
        <input
          checked={aceptacionFormulario}
          name="terminos"
          type="checkbox"
          onChange={(evento) => setAceptacionFormulario(evento.target.checked)}
        />
        <span>
          {textoAceptacionInicial}{' '}
          <button
            className={estilos.accionTexto}
            type="button"
            onClick={() => abrirModalLegal('terminos')}
          >
            {textoTerminos}
          </button>{' '}
          {textoConectorPoliticas}{' '}
          <button
            className={estilos.accionTexto}
            type="button"
            onClick={() => abrirModalLegal('politicas')}
          >
            {textoPoliticas}
          </button>
          .
        </span>
      </label>

      <div className={estilos.cuentaExistente}>
        <p>
          {textoCuentaExistente}{' '}
          <button
            className={estilos.accionTexto}
            type="button"
            onClick={onCambiarAInicioSesion}
          >
            {textoAccionInicioSesion}
          </button>
        </p>
      </div>

      <BotonPrincipal deshabilitado={!aceptacionFormulario} onClick={manejarCrearCuenta}>
        {estado.cargando ? 'Procesando...' : textoBoton}
      </BotonPrincipal>

      <ModalAvisoLegal
        abierto={Boolean(modalLegalActual)}
        aceptado={confirmacionModal}
        contenido={modalLegalActual ? documentosLegales[modalLegalActual].contenido : []}
        etiquetaAceptacion={
          modalLegalActual
            ? documentosLegales[modalLegalActual].etiquetaAceptacion
            : ''
        }
        fechaActualizacion={
          modalLegalActual
            ? documentosLegales[modalLegalActual].fechaActualizacion
            : ''
        }
        titulo={modalLegalActual ? documentosLegales[modalLegalActual].titulo : ''}
        onAceptar={aceptarDocumentoLegal}
        onCambiarAceptacion={(evento) => setConfirmacionModal(evento.target.checked)}
        onCancelar={cerrarModalLegal}
      />
    </section>
  )
}

export default PasoRegistroCuenta

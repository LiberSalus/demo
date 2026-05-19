export const secuenciaPasoRegistro = [
  'registroCuenta',
  'seleccionEnvioCodigo',
  'codigoVerificacion',
  'confirmacionCuenta',
  'seleccionCapturaPerfil',
  'cargaDocumentos',
  'datosPersonales',
  'domicilio',
  'confirmacionPerfil',
]

const opcionesCapturaPerfil = [
  {
    id: 'manual',
    titulo: 'Llena tus datos',
    descripcion:
      'Completa los formularios de forma manual con tus datos para continuar.',
    textoAccion: 'Llenar datos manualmente',
    tipoIcono: 'documento',
  },
  {
    id: 'documentos',
    titulo: 'Adjuntar archivos',
    descripcion:
      'Adjunta una imagen o PDF que ya tengas guardado. Asegúrate que sea legible y esté completo.',
    textoAccion: 'Subir archivos',
    tipoIcono: 'documentoSubida',
  },
]

export const pasosRegistro = {
  registroCuenta: {
    id: 'registroCuenta',
    clavePanel: 'cuenta',
    mostrarPanelLateral: true,
    titulo: '',
    subtitulo: '',
    contenido: {
      textoAceptacionInicial: 'He leído y acepto los',
      textoTerminos: 'Términos y condiciones',
      textoConectorPoliticas: 'y el',
      textoPoliticas: 'Aviso de privacidad',
      textoBoton: 'Crear cuenta',
      textoCuentaExistente: '¿Ya tienes una cuenta?',
      textoAccionInicioSesion: 'Inicia sesión',
    },
    nombreComponente: 'PasoRegistroCuenta',
  },
  seleccionEnvioCodigo: {
    id: 'seleccionEnvioCodigo',
    clavePanel: 'cuenta',
    mostrarPanelLateral: true,
    titulo: 'Confirma tu información de contacto',
    subtitulo:
      'Antes de continuar, enviaremos un código a tu correo para proteger tu cuenta.',
    contenido: {
      textoBoton: 'Enviar código',
    },
    nombreComponente: 'PasoSeleccionEnvioCodigo',
  },
  codigoVerificacion: {
    id: 'codigoVerificacion',
    clavePanel: 'cuenta',
    mostrarPanelLateral: true,
    titulo: 'Ingresa tu código de verificación',
    subtitulo:
      'Ingresa el código de 6 dígitos que te hemos enviado para completar tu verificación.',
    contenido: {
      cantidadDigitos: 6,
      segundosIniciales: 299,
      textoBoton: 'Continuar',
      textoAyuda: '¿No recibiste tu código?',
      textoReenvio: 'Reenviar código',
    },
    nombreComponente: 'PasoCodigoVerificacion',
  },
  confirmacionCuenta: {
    id: 'confirmacionCuenta',
    clavePanel: 'cuenta',
    mostrarPanelLateral: true,
    titulo: '¡Tu cuenta está casi lista!',
    subtitulo:
      'Tu usuario ya quedó validado. Continúa con tus datos personales para completar el preregistro.',
    contenido: {
      tituloEstado: 'Cuenta confirmada',
      descripcionEstado:
        'Tu usuario quedó registrado correctamente. En el siguiente paso completaremos tu perfil.',
      textoBoton: 'Continuar',
    },
    nombreComponente: 'PasoConfirmacionCuenta',
  },
  seleccionCapturaPerfil: {
    id: 'seleccionCapturaPerfil',
    clavePanel: 'perfil',
    mostrarPanelLateral: true,
    titulo: 'Completa tu perfil',
    subtitulo:
      'Llena tus datos o sube tus documentos para confirmar tu identidad y continuar con el preregistro.',
    contenido: {
      opciones: opcionesCapturaPerfil,
    },
    nombreComponente: 'PasoSeleccionCapturaPerfil',
  },
  cargaDocumentos: {
    id: 'cargaDocumentos',
    clavePanel: 'perfil',
    mostrarPanelLateral: true,
    titulo: 'Sube tus documentos',
    subtitulo:
      'Adjunta tu identificación oficial y comprobante de domicilio en PDF o imagen legible.',
    contenido: {
      bloques: [
        {
          id: 'identificacionOficial',
          titulo: 'Identificación oficial',
          descripcion:
            'Incluye el frente y reverso de tu identificación en un archivo claro.',
          textoAccion: 'Seleccionar identificación',
        },
        {
          id: 'comprobanteDomicilio',
          titulo: 'Comprobante de domicilio',
          descripcion:
            'Usa un comprobante vigente y legible para validar tu domicilio.',
          textoAccion: 'Seleccionar comprobante',
        },
      ],
      textoBoton: 'Continuar',
    },
    nombreComponente: 'PasoCargaDocumentos',
  },
  datosPersonales: {
    id: 'datosPersonales',
    clavePanel: 'perfil',
    mostrarPanelLateral: true,
    titulo: 'Captura tus datos personales',
    subtitulo:
      'Ingresa tu información principal para continuar con el preregistro.',
    contenido: {
      textoBoton: 'Guardar datos personales',
    },
    nombreComponente: 'PasoDatosPersonales',
  },
  domicilio: {
    id: 'domicilio',
    clavePanel: 'perfil',
    mostrarPanelLateral: true,
    titulo: 'Captura tu domicilio',
    subtitulo:
      'Completa la dirección en la que resides actualmente para finalizar este bloque.',
    contenido: {
      textoBoton: 'Guardar domicilio',
    },
    nombreComponente: 'PasoDomicilio',
  },
  confirmacionPerfil: {
    id: 'confirmacionPerfil',
    clavePanel: 'confirmacion',
    mostrarPanelLateral: true,
    titulo: '',
    subtitulo: '',
    contenido: {
      tituloEstado: '¡Gracias! Tu información ha sido recibida',
      descripcionEstado:
        'Tus datos se guardaron correctamente. Ahora puedes iniciar sesión para entrar al dashboard.',
      textoBoton: 'Ir a inicio de sesión',
    },
    nombreComponente: 'PasoConfirmacionPerfil',
  },
}

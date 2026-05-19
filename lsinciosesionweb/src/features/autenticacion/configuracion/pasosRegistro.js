export const secuenciaPasoRegistro = [
  'registroCuenta',
  'seleccionEnvioCodigo',
  'codigoVerificacion',
  'confirmacionCuenta',
]

export const pasosRegistro = {
  registroCuenta: {
    id: 'registroCuenta',
    clavePanel: 'cuenta',
    mostrarPanelLateral: true,
    titulo: '',
    subtitulo: '',
    contenido: {
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
      'Tu usuario ya quedó validado. Ahora puedes iniciar sesión para entrar al dashboard.',
    contenido: {
      tituloEstado: 'Cuenta confirmada',
      descripcionEstado:
        'Tu usuario quedó registrado correctamente. Inicia sesión con tus credenciales.',
      textoBoton: 'Ir a inicio de sesión',
    },
    nombreComponente: 'PasoConfirmacionCuenta',
  },
}

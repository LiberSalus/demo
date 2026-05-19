
import { opcionesEnvioCodigo } from '../datos/opcionesEnvioCodigo'
import { opcionesCapturaPerfil } from '../datos/opcionesCapturaPerfil'
import { camposDatosPersonales } from '../datos/camposDatosPersonales'
import { camposDomicilio } from '../datos/camposDomicilio'

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

// Esta configuración concentra los metadatos del flujo para evitar ifs extensos dentro de las vistas.
export const pasosRegistro = {
  registroCuenta: {
    id: 'registroCuenta',
    clavePanel: 'cuenta',
    mostrarPanelLateral: true,
    titulo: '',
    subtitulo: '',
    contenido: {
      opcionesPerfil: [
        { valor: 'paciente', etiqueta: 'Paciente' },
        { valor: 'medico', etiqueta: 'Médico' },
      ],
      etiquetaCorreo: 'Correo electrónico',
      marcadorCorreo: 'Tu correo electrónico',
      etiquetaLada: 'Lada',
      etiquetaTelefono: 'Teléfono celular',
      marcadorTelefono: 'Tu teléfono',
      textoAceptacionInicial: 'He leído y acepto los',
      textoTerminos: 'Términos y condiciones',
      textoConectorPoliticas: 'y las',
      textoPoliticas: 'Políticas de privacidad',
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
      'Antes de continuar, elige a dónde deseas que te enviemos tu código de confirmación, esto nos permite asegurar que tus datos sean correctos y proteger tu cuenta.',
    contenido: {
      opcionInicial: 'correo',
      textoBoton: 'Enviar código',
      opciones: opcionesEnvioCodigo,
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
      'Completa tus formularios con tus datos para activar tu perfil y disfrutar una experiencia segura y personalizada.',
    contenido: {
      tituloEstado: 'Cuenta confirmada',
      descripcionEstado:
        'Tu usuario ya quedó validado. En el siguiente paso continuaremos con la captura de tu perfil.',
      textoBoton: 'Continuar',
    },
    nombreComponente: 'PasoConfirmacionCuenta',
  },
  seleccionCapturaPerfil: {
    id: 'seleccionCapturaPerfil',
    clavePanel: 'perfil',
    mostrarPanelLateral: true,
    titulo: 'Completa tu perfil',
    subtitulo:{
      inicio:'Llena tus datos o sube tus documentos ',
      destacado:'(identificación oficial y comprobante de domicilio)',
      cierre:'Así podremos confirmar tu identidad y ofrecerte una experiencia segura y personalizada.',
    }
      ,
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
      'Adjunta tus documentos en PDF, incluyendo el frente y reverso de tu identificación. Asegúrate de que sean claros, actualizados y no excedan 2 MB.',
    contenido: {
      bloques: [
        {
          id: 'identificacionOficial',
          titulo: 'Identificación oficial',
          descripcion:
            'Asegúrate de incluir el frente y reverso de tu identificación en un mismo archivo.',
          textoAccion: 'Haz clic aquí',
        },
        {
          id: 'comprobanteDomicilio',
          titulo: 'Comprobante de domicilio',
          descripcion:
            'Verifica que tu documento se vea claramente y no tenga más de 3 meses de antigüedad.',
          textoAccion: 'Haz clic aquí',
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
      'Ingresa la información principal para continuar con la afiliación.',
    contenido: {
      campos: camposDatosPersonales,
      textoBotonValidarCurp: 'Validar',
      textoBoton: 'Continuar',
      textoLimpiarDatos: 'Limpiar datos',
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
      campos: camposDomicilio,
      textoBotonValidarCodigoPostal: 'Validar',
      textoLimpiarDatos: 'Limpiar datos',
      tituloModalColonias: 'Selecciona tu colonia',
      marcadorBusquedaColonias: 'Buscar en esta lista',
      textoBotonModalColonias: 'Continuar',
      coloniasEjemplo: [
        'Colonia número 1',
        'Colonia número 2',
        'Colonia número 3',
        'Colonia número 4',
      ],
      textoBoton: 'Continuar',
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
        'Tus datos se han cargado correctamente. Estamos revisando su validez. Este proceso puede demorar hasta 48 horas hábiles.',
      textoBoton: 'Continuar',
    },
    nombreComponente: 'PasoConfirmacionPerfil',
  },
}

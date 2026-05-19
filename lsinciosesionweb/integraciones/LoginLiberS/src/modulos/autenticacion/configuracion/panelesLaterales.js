const pasosVisuales = [
  {
    id: 'cuenta',
    titulo: 'Crea tu usuario.',
    descripcion: 'Llena tus datos personales.',
  },
  {
    id: 'perfil',
    titulo: 'Sube tus documentos.',
    descripcion: 'CURP, INE y comprobante de domicilio.',
  },
  {
    id: 'confirmacion',
    titulo: 'Completa tus cuestionarios de salud.',
    descripcion: '',
  },
]

export const panelesLaterales = {
  cuenta: {
    titular: '¡Bienvenido a\nHCD Libersalus!',
    descripcion: 'Afíliate y toma control de tu bienestar',
    nota:
      'Para comenzar a usar nuestra plataforma, necesitas crear un usuario y afiliarte.\n\nEste proceso es sencillo y solo toma 3 pasos.',
    pasos: pasosVisuales,
    pasoActivo: 'cuenta',
  },
  perfil: {
    titular: 'Completa tu perfil',
    descripcion: 'Elige la forma en la que deseas registrar tus datos.',
    nota:
      'Puedes llenar tus datos manualmente o subir tus documentos para continuar con tu proceso de afiliación.',
    pasos: pasosVisuales,
    pasoActivo: 'perfil',
  },
  confirmacion: {
    titular: 'Registro casi listo',
    descripcion: 'Estamos cerrando los últimos detalles de tu afiliación.',
    nota:
      'Revisa la información capturada y confirma el método con el que completaste tu registro.',
    pasos: pasosVisuales,
    pasoActivo: 'confirmacion',
  },
}

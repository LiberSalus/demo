const pasosVisuales = [
  {
    id: 'cuenta',
    titulo: 'Crea tu ',
    tituloFuerte: 'usuario.',
    descripcion: 'Llena tus datos personales.',
  },
  {
    id: 'perfil',
    titulo: 'Sube tus documentos.',
    descripcionFuerte: 'CURP, INE y comprobante de domicilio.',
  },
  {
    id: 'confirmacion',
    titulo: 'Completa tus ',
    tituloFuerte: 'cuestionarios de salud.',
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
    titular: '¡Bienvenido a\nHCD Libersalus!',
    descripcion: 'Afíliate y toma control de tu bienestar',
    nota:
      'Para comenzar a usar nuestra plataforma, necesitas crear un usuario y afiliarte.\n\nEste proceso es sencillo y solo toma 3 pasos.',
    pasos: pasosVisuales,
    pasoActivo: 'perfil',
  },
  confirmacion: {
    titular: '¡Bienvenido a\nHCD Libersalus!',
    descripcion: 'Afíliate y toma control de tu bienestar',
    nota:
      'Para comenzar a usar nuestra plataforma, necesitas crear un usuario y afiliarte.\n\nEste proceso es sencillo y solo toma 3 pasos.',
    pasos: pasosVisuales,
    pasoActivo: 'confirmacion',
  },
}

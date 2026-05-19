const pasosVisuales = [
  {
    id: 'cuenta',
    titulo: 'Crea tu usuario.',
    descripcion: 'Registra y valida tu correo.',
  },
  {
    id: 'perfil',
    titulo: 'Completa tu perfil.',
    descripcion: 'Lo migraremos en el siguiente bloque.',
  },
  {
    id: 'confirmacion',
    titulo: 'Entra al dashboard.',
    descripcion: 'Usa tus credenciales validadas.',
  },
]

export const panelesLaterales = {
  cuenta: {
    titular: '¡Bienvenido a\nHCD Libersalus!',
    descripcion: 'Afíliate y toma control de tu bienestar',
    nota:
      'Primero crearemos tu usuario y validaremos tu correo. Después continuaremos con perfil y domicilio.',
    pasos: pasosVisuales,
    pasoActivo: 'cuenta',
  },
}

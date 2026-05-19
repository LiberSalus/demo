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
  perfil: {
    titular: 'Completa tu perfil',
    descripcion: 'Captura tus datos personales y domicilio.',
    nota:
      'Estos datos permiten terminar tu preregistro antes de iniciar sesión en el dashboard.',
    pasos: pasosVisuales,
    pasoActivo: 'perfil',
  },
  confirmacion: {
    titular: 'Registro casi listo',
    descripcion: 'Tu información fue recibida.',
    nota:
      'Al finalizar, vuelve al inicio de sesión para entrar con la cuenta que acabas de crear.',
    pasos: pasosVisuales,
    pasoActivo: 'confirmacion',
  },
}

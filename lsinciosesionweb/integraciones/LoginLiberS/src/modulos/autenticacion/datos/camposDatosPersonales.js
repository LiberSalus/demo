export const camposDatosPersonales = [
  {
    etiqueta: 'CURP',
    nombre: 'curp',
    marcador: 'Ingresa tu CURP',
  },
  {
    etiqueta: 'Nombre',
    nombre: 'nombre',
    marcador: 'Ingresa tu nombre',
  },
  {
    etiqueta: 'Apellido paterno',
    nombre: 'apellidoPaterno',
    marcador: 'Apellido paterno',
  },
  {
    etiqueta: 'Apellido materno',
    nombre: 'apellidoMaterno',
    marcador: 'Apellido materno',
  },
  {
    etiqueta: 'Fecha de nacimiento',
    nombre: 'fechaNacimiento',
    tipo: 'date',
    marcador: '',
  },
  {
    etiqueta: 'Sexo',
    nombre: 'sexo',
    tipo: 'select',
    marcador: 'Selecciona una opción',
    opciones: [
      { valor: 'H', etiqueta: 'Hombre' },
      { valor: 'M', etiqueta: 'Mujer' },
      { valor: 'X', etiqueta: 'No binario' },
    ],
  },
]

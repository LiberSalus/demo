<div className={styles.agenda}>
  <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DateCalendar
      value={fechaSeleccionada}
      onChange={(newValue) => setFechaSeleccionada(newValue)}
      showDaysOutsideCurrentMonth
      /* displayWeekNumber */
      sx={{
        width: "22.75rem",
        // Contenedor de cada semana (fila)
        "& .MuiDayCalendar-weekContainer": {
          minHeight: "1.2rem", // aún más compacto
          marginBottom: "0.1rem", // reduce espacio entre filas
          width: "100%",
        },

        // Cada día (célula)
        "& .MuiPickersDay-root": {
          height: "1.6rem", // reduce altura del botón
          width: "1.6rem", // opcional: para mantener proporción
          padding: 0, // elimina espacio interno
          margin: "0px  12px", // reduce separación entre días
          fontSize: "0.7rem",
        },

        // Texto del día
        "& .MuiTypography-root": {
          fontSize: "0.7rem",
          margin: "0px  7px",
        },

        // Encabezado del mes
        "& .MuiPickersCalendarHeader-label": {
          fontSize: "0.95rem",
          fontWeight: "bold",
          /* transform: "translateY(0.5rem)", */
        },
        // Botones de navegación
        // Contenedor de las flechas
        "& .MuiPickersArrowSwitcher-root": {
          justifyContent: "space-between", // o "center" si querés alinearlas distinto
          marginBottom: "0.5rem",
          transform: "translateY(0.5rem)",
        },

        // Botones de flecha
        "& .MuiPickersArrowSwitcher-button": {
          color: "#1976d2", // color del ícono
          padding: "4px",
          "&:hover": {
            backgroundColor: "transparent",
          },
          "& svg": {
            fontSize: "2rem", // tamaño del ícono
          },
        },
      }}
    />
  </LocalizationProvider>
</div>;

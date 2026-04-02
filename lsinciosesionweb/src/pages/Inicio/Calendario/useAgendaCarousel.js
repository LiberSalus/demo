import { useEffect, useRef, useState } from "react";

export default function useAgendaCarousel(dependencias = []) {
  const refScrollMedicamentos = useRef(null);
  const refScrollCitas = useRef(null);
  const [estadoScroll, setEstadoScroll] = useState({
    medicamentos: { canLeft: false, canRight: false },
    citas: { canLeft: false, canRight: false },
  });

  useEffect(() => {
    const contenedores = document.querySelectorAll(".scroll-container");

    // Permite desplazar horizontalmente las tarjetas con la rueda del mouse.
    const manejarWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        e.currentTarget.scrollLeft += e.deltaY;
      }
    };

    contenedores.forEach((contenedor) => {
      contenedor.addEventListener("wheel", manejarWheel, { passive: false });
    });

    return () => {
      contenedores.forEach((contenedor) => {
        contenedor.removeEventListener("wheel", manejarWheel);
      });
    };
  }, []);

  const actualizarBotonesScroll = (clave, elemento) => {
    if (!elemento) return;

    const maximoScrollIzquierda = elemento.scrollWidth - elemento.clientWidth;
    setEstadoScroll((previo) => ({
      ...previo,
      [clave]: {
        canLeft: elemento.scrollLeft > 8,
        canRight: maximoScrollIzquierda - elemento.scrollLeft > 8,
      },
    }));
  };

  useEffect(() => {
    const configuraciones = [
      { clave: "medicamentos", ref: refScrollMedicamentos },
      { clave: "citas", ref: refScrollCitas },
    ];

    const limpiezas = configuraciones
      .map(({ clave, ref }) => {
        const elemento = ref.current;
        if (!elemento) return null;

        const manejarActualizacion = () =>
          actualizarBotonesScroll(clave, elemento);

        manejarActualizacion();
        elemento.addEventListener("scroll", manejarActualizacion, {
          passive: true,
        });
        window.addEventListener("resize", manejarActualizacion);

        return () => {
          elemento.removeEventListener("scroll", manejarActualizacion);
          window.removeEventListener("resize", manejarActualizacion);
        };
      })
      .filter(Boolean);

    return () => limpiezas.forEach((limpieza) => limpieza());
  }, dependencias);

  const desplazarTarjetas = (ref, direccion, clave) => {
    const elemento = ref.current;
    if (!elemento) return;

    const distancia = Math.max(elemento.clientWidth * 0.72, 180);
    elemento.scrollBy({
      left: direccion * distancia,
      behavior: "smooth",
    });

    window.setTimeout(() => actualizarBotonesScroll(clave, elemento), 260);
  };

  return {
    refScrollMedicamentos,
    refScrollCitas,
    estadoScroll,
    desplazarTarjetas,
  };
}

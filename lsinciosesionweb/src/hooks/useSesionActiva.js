import { useCallback, useEffect, useRef, useState } from "react";
import {
  EVENTO_SESION_NO_AUTORIZADA,
  decodificarToken,
  limpiarSesionAutenticacion,
  obtenerSesionActual,
  refrescarToken,
} from "@/services/auth";

const ESTADO_CONECTADO = "e1";
const ESTADO_DESCONECTADO = "e2";
const INTERVALO_REVISION_MS = 15 * 1000;
const ACTIVIDAD_RECIENTE_MS = 60 * 1000;
const EVENTOS_ACTIVIDAD = ["click", "keydown", "mousemove", "scroll", "touchstart"];

// Obtiene los claims aunque el backend los mande anidados o como respuesta directa.
function obtenerClaims(decoded) {
  if (!decoded || typeof decoded !== "object") return {};

  return decoded.claims || decoded.data?.claims || decoded;
}

// Convierte exp del token a milisegundos para compararlo con Date.now().
function obtenerExpiracionMs(decoded) {
  const claims = obtenerClaims(decoded);
  const exp = Number(claims.exp);

  return Number.isFinite(exp) && exp > 0 ? exp * 1000 : 0;
}

// Lee el umbral de renovacion indicado por el backend; usa 4 minutos como respaldo.
function obtenerUmbralRefreshMs(decoded) {
  const claims = obtenerClaims(decoded);
  const minutos = Number(claims.refresh_threshold_minutes ?? 4);

  return (Number.isFinite(minutos) && minutos > 0 ? minutos : 4) * 60 * 1000;
}

// Supervisa la vigencia de la sesion y renueva solo si el usuario sigue activo.
export default function useSesionActiva() {
  const [estadoConexion, setEstadoConexion] = useState(ESTADO_DESCONECTADO);
  const [decodedSesion, setDecodedSesion] = useState(null);
  const decodedSesionRef = useRef(null);
  const ultimaActividadRef = useRef(Date.now());
  const refrescandoRef = useRef(false);

  const marcarDesconectado = useCallback(() => {
    setEstadoConexion(ESTADO_DESCONECTADO);
  }, []);

  const aplicarDecoded = useCallback(
    (decoded) => {
      const expiracionMs = obtenerExpiracionMs(decoded);
      const estaVigente = expiracionMs > Date.now();

      setDecodedSesion(decoded);
      decodedSesionRef.current = decoded;
      setEstadoConexion(estaVigente ? ESTADO_CONECTADO : ESTADO_DESCONECTADO);

      if (!estaVigente) marcarDesconectado();

      return estaVigente;
    },
    [marcarDesconectado]
  );

  const cargarSesion = useCallback(async () => {
    try {
      const decoded = await obtenerSesionActual();
      if (!decoded) {
        marcarDesconectado();
        return null;
      }

      aplicarDecoded(decoded);
      return decoded;
    } catch (error) {
      if (error?.response?.status === 401) {
        limpiarSesionAutenticacion();
      }

      marcarDesconectado();
      return null;
    }
  }, [aplicarDecoded, marcarDesconectado]);

  const renovarSesion = useCallback(async () => {
    if (refrescandoRef.current) return;

    refrescandoRef.current = true;

    try {
      await refrescarToken();
      const decoded = await decodificarToken();
      aplicarDecoded(decoded);
    } catch {
      limpiarSesionAutenticacion();
      marcarDesconectado();
    } finally {
      refrescandoRef.current = false;
    }
  }, [aplicarDecoded, marcarDesconectado]);

  const revisarSesion = useCallback(async () => {
    const decoded = decodedSesionRef.current || (await cargarSesion());
    if (!decoded) return;

    const expiracionMs = obtenerExpiracionMs(decoded);
    const tiempoRestanteMs = expiracionMs - Date.now();

    if (tiempoRestanteMs <= 0) {
      limpiarSesionAutenticacion();
      marcarDesconectado();
      return;
    }

    const actividadReciente = Date.now() - ultimaActividadRef.current <= ACTIVIDAD_RECIENTE_MS;
    const entroEnUmbral = tiempoRestanteMs <= obtenerUmbralRefreshMs(decoded);

    if (entroEnUmbral && actividadReciente) {
      await renovarSesion();
      return;
    }

    setEstadoConexion(ESTADO_CONECTADO);
  }, [cargarSesion, marcarDesconectado, renovarSesion]);

  useEffect(() => {
    const registrarActividad = () => {
      ultimaActividadRef.current = Date.now();
    };

    EVENTOS_ACTIVIDAD.forEach((evento) => {
      window.addEventListener(evento, registrarActividad, { passive: true });
    });

    return () => {
      EVENTOS_ACTIVIDAD.forEach((evento) => {
        window.removeEventListener(evento, registrarActividad);
      });
    };
  }, []);

  useEffect(() => {
    cargarSesion();

    const intervalo = window.setInterval(revisarSesion, INTERVALO_REVISION_MS);

    return () => window.clearInterval(intervalo);
  }, [cargarSesion, revisarSesion]);

  useEffect(() => {
    window.addEventListener(EVENTO_SESION_NO_AUTORIZADA, marcarDesconectado);

    return () => {
      window.removeEventListener(EVENTO_SESION_NO_AUTORIZADA, marcarDesconectado);
    };
  }, [marcarDesconectado]);

  return {
    estadoConexion,
    decodedSesion,
    refrescarSesion: renovarSesion,
  };
}

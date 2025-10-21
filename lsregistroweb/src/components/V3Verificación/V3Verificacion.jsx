import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { ROUTES } from "@/routes/AppRouter";
import styles from "./v3verificacion.module.css";
import Logo from "@/components/ElementosVista/Logo/Logo";
import BotonA from "@/components/Botones/BotonA";
import TextoPrincipal from "@/components/ElementosVista/TextoPrincipal/TextoPrincipal";
import TextoSecundario from "@/components/ElementosVista/TextoSecundario/TextoSecundario";
import lineas from "../V1Registro/line.svg";
import { motion } from "framer-motion";

// Day.js + plugins
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

const getIdPre = (data, headers) =>
  data?.id_pre ??
  data?.id ??
  data?.result?.id_pre ??
  data?.result?.id ??
  (Number((headers?.location || "").split("/").pop()) || null);

function V3Verificacion() {
  const { state } = useLocation(); // { correo, telefono, metodo, expiresAt(ms)?, ... }
  const navigate = useNavigate();

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setError] = useState("");

  // ========= Expiración: creamos un dayjs a partir de ms (state o sessionStorage) =========
  const initialExpiresMs = useMemo(() => {
    const fromState = Number(state?.expiresAt);
    if (Number.isFinite(fromState) && fromState > 0) return fromState;
    const fromSS = Number(sessionStorage.getItem("ls:code_expires_at"));
    if (Number.isFinite(fromSS) && fromSS > 0) return fromSS;
    // fallback: ahora + 5 min
    return Date.now() + 5 * 60 * 1000;
  }, [state?.expiresAt]);

  const [expiresAt, setExpiresAt] = useState(() => dayjs(initialExpiresMs)); // dayjs local
  const [remaining, setRemaining] = useState(0); // segundos restantes

  // Timer único
  useEffect(() => {
    const tick = () => {
      const diffSec = Math.max(0, expiresAt.diff(dayjs(), "second"));
      setRemaining(diffSec);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  const inputsRef = useRef([]);

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const copy = [...digits];
    copy[idx] = val;
    setDigits(copy);
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
    setError("");
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");

  const verificar = async () => {
    const codigo = digits.join("");
    if (codigo.length !== 6) {
      setError("Ingresa los 6 dígitos.");
      return;
    }
    if (remaining <= 0) {
      setError("El código ha expirado. Reenviar para continuar.");
      return;
    }

    try {
      setLoading(true);

      // 1) Validar código
      await api.post(`/preregistro/preregistro/validar-${state.metodo}/`, {
        identificador: state[state.metodo],
        codigo,
      });

      // 2) Crear preregistro
      const { data, headers } = await api.post(
        "/preregistro/preregistro/registro/",
        state
      );

      const id = getIdPre(data, headers);
      if (!id) throw new Error("No llegó el id del preregistro.");

      sessionStorage.setItem("ls:id_pre", String(id));
      navigate(ROUTES.CONFIRMACION_EXITO, { state: { ...state, id } });
    } catch (err) {
      const d = err?.response?.data?.detail;
      const msg = d
        ? Array.isArray(d)
          ? d.map((e) => e?.msg).join(" · ")
          : String(d)
        : err?.message || "Error en verificación";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const reenviar = async () => {
    try {
      setLoading(true);
      const { data } = await api.post(
        "/preregistro/preregistro/reenviar-codigo/",
        { identificador: state[state.metodo] }
      );

      // Backend manda expira en UTC sin zona → convertir a local
      const newExpiresLocal = dayjs.utc(data?.expira).local(); // o .tz(dayjs.tz.guess())
      setExpiresAt(newExpiresLocal);
      sessionStorage.setItem("ls:code_expires_at", String(newExpiresLocal.valueOf()));

      // Reset inputs
      setDigits(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus?.();
      setError("");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.message ||
        "Error al reenviar el código.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.cntV3Verificacion}>
      <div className={styles.cntBienvenida}>
        <div className={styles.cntSaludo}>
          <div>
            <p>¡Bienvenido a <br /> Liber Salus!</p>
            <p>Afíliate y toma el control de <br /> tu bienestar</p>
            <p>
              Para comenzar a usar nuestra plataforma, necesitas crear un
              usuario y afiliarte.
              <br />
              Este proceso es sencillo y sólo toma 3 pasos:
            </p>
          </div>
        </div>

        <div className={styles.cntPasos}>
          <div className={styles.elementoPaso}>
            <p className={styles.paso}>Crea tu usuario: <br /> Llena tus datos personales.</p>
          </div>
          <div className={styles.elementoPaso}>
            <p className={styles.paso}>Sube tus documentos: <br /> CURP, INE y comprobante de domicilio</p>
          </div>
          <div className={styles.elementoPaso}>
            <p className={styles.paso}>Completa tus cuestionarios de saliud</p>
          </div>
        </div>
      </div>

      <div className={styles.cntFormulario}>
        <div className={styles.logoForm}>
          <Logo />
        </div>

        <div className={styles.Lineas}>
          <img src={lineas} alt="" />
        </div>

        <div className={styles.cntTextos}>
          <TextoPrincipal textoPrincipal="Ingresar el código de verificación" />
          <TextoSecundario textoSecundario="Ingresa el código de 6 dígitos que te enviamos." />
        </div>

        <motion.form
          initial={{ opacity: 0, x: 30 }} // cuando entra
          animate={{ opacity: 1, x: 0 }} // animación activa
          exit={{ opacity: 0, x: -30 }} // cuando sale
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            verificar();
          }}
        >
          <div className={styles.cntInputs}>
            {digits.map((d, idx) => (
              <input
                key={idx}
                ref={(el) => (inputsRef.current[idx] = el)}
                className={styles.inputs}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
              />
            ))}

            

            {errorMsg && <span className={styles.error}>{errorMsg}</span>}
          </div>
          {/* Timer */}
            {remaining > 0 ? (
              <p className={styles.timer}><br/>
                El código expira en <strong>{minutes}:{seconds}</strong>
              </p>
            ) : (
              <p className={styles.timerExp}>
                El código ha expirado.{" "}
                {/* <button type="button" className={styles.reenviar} onClick={reenviar}>
                  Reenviar código
                </button> */}
              </p>
            )}

            {/* Hora local de expiración */}
            {expiresAt && (
              <p className={styles.horaLocal}>
                (Expira a las {expiresAt.format("HH:mm:ss")} hora local)
              </p>
            )}

          <div className={styles.cntBoton}>
            <BotonA
              type="submit"
              disabled={loading || remaining <= 0}
              onClick={verificar}
            >
              {loading ? "Verificando…" : "Verificar y continuar"}
            </BotonA>
          </div>
        </motion.form>

        <p className={styles.reenviarWrap}>¿No recibiste el código? </p>
        <a className={styles.reenviar} onClick={reenviar}>
          Reenviar código
        </a>

        <div className={styles.der}></div>

        <div className={styles.derechosPie}>
          <p className={styles.derechos}>
            © 2025 Liber Salus. Este sitio está protegido por derechos de autor. <br />
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}

export default V3Verificacion;

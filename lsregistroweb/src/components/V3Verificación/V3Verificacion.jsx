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

const getIdPre = (data, headers) =>
  data?.id_pre ??
  data?.id ??
  data?.result?.id_pre ??
  data?.result?.id ??
  (Number((headers?.location || "").split("/").pop()) || null);

function V3Verificacion() {
  const { state } = useLocation(); // { correo, telefono, metodo, expiresAt?, ... }
  const navigate = useNavigate();

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setError] = useState("");

  // ===================== TIMER por fecha real de expiración =====================
  // 1) Obtenemos expiresAt del state o de sessionStorage (en caso de refresh).
  const initialExpires = useMemo(() => {
    const fromState = Number(state?.expiresAt);
    if (Number.isFinite(fromState) && fromState > 0) return fromState;
    const fromSS = Number(sessionStorage.getItem("ls:code_expires_at"));
    return Number.isFinite(fromSS) && fromSS > 0 ? fromSS : Date.now() + 5 * 60 * 1000;
  }, [state?.expiresAt]);

  // 2) Lo guardamos en estado para poder actualizarlo cuando se reenvíe.
  const [expiresAt, setExpiresAt] = useState(initialExpires);
  // 3) Remaining se calcula respecto a expiresAt.
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const tick = () => {
      const sec = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
      setRemaining(sec);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt]);
  // ============================================================================

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
    if (e.key === "Backspace" && !digits[idx] && idx > 0)
      inputsRef.current[idx - 1]?.focus();
  };

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

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
      // Actualizamos el timer con la nueva fecha del backend
      const newExpires = Date.parse(data?.expira) || Date.now() + 5 * 60 * 1000;
      sessionStorage.setItem("ls:code_expires_at", String(newExpires));
      setExpiresAt(newExpires);
      setDigits(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus?.();
      setError("");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "No se pudo reenviar el código.";
      setError(String(msg));
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

        <form
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

            {/* Timer */}
            <div className={styles.timerWrap}>
              {remaining > 0 ? (
                <span className={styles.timer}>
                  El código expira en <strong>{mm}:{ss}</strong>
                </span>
              ) : (
                <span className={styles.timerExpired}>
                  El código expiró.{" "}
                  <button
                    type="button"
                    className={styles.reenviarBtnInline}
                    onClick={reenviar}
                  >
                    Reenviar código
                  </button>
                </span>
              )}
            </div>

            {errorMsg && <span className={styles.error}>{errorMsg}</span>}
          </div>

          <div className={styles.cntBoton}>
            <BotonA
              type="submit"
              disabled={loading || remaining <= 0}
              onClick={verificar}
            >
              {loading ? "Verificando…" : "Verificar y continuar"}
            </BotonA>
          </div>
        </form>

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

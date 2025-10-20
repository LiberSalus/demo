import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { ROUTES } from "@/routes/AppRouter";
import styles from "./v3verificacion.module.css";
import Logo from "@/components/ElementosVista/Logo/Logo";
import BotonA from "@/components/Botones/BotonA";
import TextoPrincipal from "@/components/ElementosVista/TextoPrincipal/TextoPrincipal";
import TextoSecundario from "@/components/ElementosVista/TextoSecundario/TextoSecundario";
import lineas from '../V1Registro/line.svg'

const getIdPre = (data, headers) =>
  data?.id_pre ??
  data?.id ??
  data?.result?.id_pre ??
  data?.result?.id ??
  (Number((headers?.location || "").split("/").pop()) || null);

const V3Verificacion = () => {
  const { state } = useLocation(); // { correo, telefono, metodo, ... }
  const navigate = useNavigate();

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setError] = useState("");
  const inputsRef = useRef([]);

  const handleChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    const copy = [...digits];
    copy[idx] = val;
    setDigits(copy);
    if (val && idx < 5) inputsRef.current[idx + 1].focus();
    setError("");
  };
  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0)
      inputsRef.current[idx - 1].focus();
  };

  const verificar = async () => {
    const codigo = digits.join("");
    if (codigo.length !== 6) {
      setError("Ingresa los 6 dígitos.");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/preregistro/preregistro/validar-${state.metodo}/`, {
        identificador: state[state.metodo],
        codigo,
      });

      const { data, headers } = await api.post(
        "/preregistro/preregistro/registro/",
        state
      );

      // ⬇️ AQUÍ creas el id
      const id = getIdPre(data, headers);
      if (!id) throw new Error("No llegó el id del preregistro.");

      // respaldo y navegación usando ese id
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

  const reenviar = () =>
    api.post("/preregistro/preregistro/reenviar-codigo/", {
      identificador: state[state.metodo],
    });

  return (
    <div className={styles.cntV3Verificacion}>
      <div className={styles.cntBienvenida}>
        {/* <div className={styles.fondo}>
                      <LiberSalusPoly
                        autoMorph={true}        // morph automático
                        morphEveryMs={30}     // intervalo de morph
                        spray={false}            // triángulos sueltos
                        curveAlpha={0}        // opacidad ola superior
                        dirGlow={0.006}          // vignette/glow
                        className="w-full h-full"
                      />
                    </div> */}
        <div className={styles.cntSaludo}>
          <div>
            <p>
              ¡Bienvenido a <br /> Liber Salus!
            </p>
            <p>
              Afíliate y toma el control de <br /> tu bienestar
            </p>
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
            <p className={styles.paso}>
              Crea tu usuario: <br />
              Llena tus datos personales.
            </p>
          </div>
          <div className={styles.elementoPaso}>
            <p className={styles.paso}>
              Sube tus documentos: <br />
              CURP, INE y comprobante de domicilio
            </p>
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
          <img src={lineas}></img>
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
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
              />
            ))}
            {errorMsg && <span className={styles.error}>{errorMsg}</span>}
          </div>


          <div className={styles.cntBoton}>
            <BotonA type="submit" disabled={loading} onClick={verificar}>
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
            © 2025 Liber Salus. Este sitio está protegido por derechos de autor.{" "}
            <br />
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};
export default V3Verificacion;

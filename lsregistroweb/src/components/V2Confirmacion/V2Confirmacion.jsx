import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/services/api";
import { ROUTES } from "@/routes/AppRouter";
import styles from "./v2confirmacion.module.css";
import Logo from "@/components/ElementosVista/Logo/Logo";
import BotonA from "@/components/Botones/BotonA";
import TextoPrincipal from "@/components/ElementosVista/TextoPrincipal/TextoPrincipal";
import TextoSecundario from "@/components/ElementosVista/TextoSecundario/TextoSecundario";
import lineas from "../V1Registro/line.svg";
import Derechos from "../V1Registro/Derechos";
const V2Confirmacion = () => {
  const { state } = useLocation(); // { correo, telefono, ... }
  const navigate = useNavigate();
  const [metodo, setMetodo] = useState(""); // 'correo' | 'telefono'
  const [loading, setLoading] = useState(false);

  const maskPhone = (tel = "") =>
    tel ? ` •••• ••• • ${String(tel).slice(-4)}` : "";
  const maskMail = (mail = "") => {
    if (!mail.includes("@")) return "";
    const [u, d] = mail.split("@");
    return ` ${u?.[0] || ""}••••@${d}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!metodo) return;
    try {
      setLoading(true);
      const { data } = await api.post(
        `/preregistro/preregistro/enviar-codigo-${metodo}/`,
        { identificador: state?.[metodo] }
      );
      // Normalizamos a timestamp (ms). Si por algo no viniera, usamos +5 min como fallback.
      const expiresAt = Date.parse(data?.expira) || Date.now() + 5 * 60 * 1000;
      sessionStorage.setItem("ls:code_expires_at", String(expiresAt));
      navigate(ROUTES.VERIFICACION, { state: { ...state, metodo, expiresAt } });
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "No se pudo enviar el código.";
      alert(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.cntV2Confirmacion}>
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
        <div className={styles.cntLineas}>
          <img src={lineas}></img>
        </div>

        <div className={styles.logoForm}>
          <Logo />
        </div>

        <div className={styles.cntTextos}>
          <TextoPrincipal textoPrincipal="Confirma tu información de contacto" />
          <TextoSecundario
            textoSecundario={[
              "Antes de continuar, elige a dónde deseas que te enviemos tu código de confirmación.",
              <br key="1" />,
              "Esto nos permite asegurar que tus datos sean correctos y proteger tu cuenta.",
            ]}
          />
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <fieldset className={styles.fieldset}>
            <div className={styles.input}>
              <input
                className={styles.input}
                type="radio"
                id="correo"
                name="metodo"
                value="correo"
                checked={metodo === "correo"}
                onChange={() => setMetodo("correo")}
              />
              <label htmlFor="correo">
                Enviar código por correo electrónico a:
                <span className={styles.datos}>{maskMail(state?.correo)}</span>
              </label>
            </div>

            <div className={styles.input}>
              <input
                className={styles.input}
                type="radio"
                id="telefono"
                name="metodo"
                value="telefono"
                checked={metodo === "telefono"}
                onChange={() => setMetodo("telefono")}
              />
              <label htmlFor="telefono">
                Enviar código por mensaje de texto a:
                <span className={styles.datos}>
                  {maskPhone(state?.telefono)}
                </span>
              </label>
            </div>

            <div>
              <BotonA type="submit" disabled={!metodo || loading}>
                {loading ? "Enviando…" : "Enviar código"}
              </BotonA>
            </div>
          </fieldset>

          {/* <p>¿Tu información no es correcta? </p>
          <a onClick={() => navigate(-1)} className={styles.volver}>
            Volver a registro
          </a> */}
        </form>
        <Derechos />
      </div>
    </div>
  );
};
export default V2Confirmacion;

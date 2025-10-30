// src/components/V1Registro/V1Registro.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/routes/AppRouter";

import styles from "./v1registro.module.css";
import srcAbierto from "./eye-password-see-view-svgrepo-com.svg";
import srcCerrado from "./eye-key-look-password-security-see-svgrepo-com.svg";
import Logo from "@/components/ElementosVista/Logo/Logo";
import BotonA from "@/components/Botones/BotonA";
import Switch from "@/components/Seleccion/Switch";
import Derechos from "./Derechos";
import { motion } from "framer-motion";




/* ---------- Modal Términos ---------- */

const ModalTerminos = () => {
  return (
    <div className={styles.cntModalTerminos}>
      <h2>Aviso de Privacidad Integral </h2>
      <p><span>Última actualización:</span> 04 - Julio - 2025</p>

      <hr/>
      <div className={styles.termios}>
        <h3> Identidad y domicilio del responsable</h3>
        <p>Liber SAlus S.A de C.V (Liber Salus) con domicilio en Fernando Lizardi 42, Colonia Iztapalapa, Alcaldía Iztapalapa, C.P. 09270, Ciudad de México, CDMX, es responsable del tratamiento, uso, almacenamiento y protección de los datos personales que nos proporciones el usuario, incluidos  datos personales sensibles, en el cumplimiento con la <b>Ley Federal de Protección de Datos Personales en Posesión de los Particulares</b> (de ahora en adelante “Ley”) y su Reglamento (de ahora en adelante “Reglamento”). El tratamiento de sus datos personales y datos sensibles también se rige  por la <b>Ley General de Salud, NOM-024-SSA3-2012 y demás disposiciones aplicables en materia de salud, tecnologías de la información y protección de datos.</b>
<br/><br/>
Al acceder y utilizar nuestra plataforma www. libersalus.com, así como al proporcionarnos su información a través de diversos medios, usted acepta y otorga su consentimiento expreso para que “Liber Salus” recabe, procese, almacene y en su caso, transfiera sus datos personales sensibles conforme a los términos establecidos en este <b>aviso de privacidad.</b><br/><br/>

“Liber Salus” se compromete a tratar sy información con la estricta confidencialidad, implementando las medidas de seguridad necesarias para evitar sy perdida, alteración, accesos no autorizado o divulgación indebida. 
</p>
<h3>Uso de tecnologías de seguimiento en nuestra plataforma</h3>
<p>
 Informaremos a nuestros usuarios que esta plataforma emplea cookies, web beacons y tecnologías similares con el propósito de analizar la interacción del usuario con la plataforma y mejorar su experiencia de navegación.<br/><br/>

El uso de estas tecnologías puede ser gestionado o deshabilitado desde la configuración del navegado que utilice.
</p>

<h3>Cambios en el aviso de privacidad</h3>
<p>“Liber Salus” se reserva el derecho de modifica este Aviso de Privacidad en cualquier momento para cumplir cambios legislativos, requisitos internos o mejoras en nuestros servicios.

Las modificaciones estarán disponibles en nuestra plataforma o pueden ser consultadas directamente en la pagina: www.libersalus.com 
</p>

<h3>Consentimiento informado</h3>
<p>
  Al registrarse y utilizar nuestra plataforma esta aceptando este aviso de privacidad. Pude manifestar sy negativa para finalidades secundarias marcando la casillas correspondiente.
</p>

      </div>


    </div>
  )
}

 

/* ---------- Utils ---------- */
const onlyDigits = (v = "") => (v || "").replace(/\D+/g, "");
const toLowerTrim = (v = "") => (v || "").trim().toLowerCase();

/* ---------- Validación ---------- */
const schema = z
  .object({
    correo: z
      .string()
      .transform(toLowerTrim)
      .pipe(z.string().email("Correo no válido")),
    telefono: z
      .string()
      .transform(onlyDigits)
      .refine((v) => /^\d{10}$/.test(v), { message: "Debe tener 10 dígitos" }),
    contrasena: z
      .string()
      .regex(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        "Mínimo 8 caracteres, 1 mayús., 1 minús., 1 número, 1 símbolo"
      ),
    confirmContra: z.string(),
    politicas: z.boolean().refine((v) => v, {
      message: "Lee los terminos y condiciones y activa la casilla",
    }),
  })
  .refine((d) => d.contrasena === d.confirmContra, {
    path: ["confirmContra"],
    message: "Las contraseñas no coinciden",
  });

const Registro = () => {

  /* ---------- abrir modal ---------- */

  const [abrirModal, setAbrirModal] = useState(false);

  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);

  /* ---------- Form RHF ---------- */
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isValid, isSubmitting, isDirty, touchedFields },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  /* Re-validar confirmación al cambiar la contraseña */
  const pwd = watch("contrasena");
  useEffect(() => {
    console.log("ABRIR MODAL",abrirModal)
    if (pwd) trigger("confirmContra");
  }, [pwd, trigger, abrirModal]);

  /* ---------- Submit ---------- */
  const onSubmit = (data) => {
    // data.correo y data.telefono ya vienen normalizados por Zod (.transform)
    const payload = {
      rol: 1,
      correo: data.correo,
      telefono: data.telefono,
      code_telefono: "52",
      contrasena: data.contrasena,
    };
    navigate(ROUTES.CONFIRMACION, { state: payload });
  };

  /* ---------- UI ---------- */
  return (
    <motion.div
      className={styles.cntV1Registro}
      initial={{ opacity: 0, y: 0 }} // cuando entra
      animate={{ opacity: 1, y: 0 }} // animación activa
      exit={{ opacity: 0, y: 0 }} // cuando sale
      transition={{ duration: 0.9, ease: "easeOut" }}
    >
      <div className={styles.cntBienvenida}>
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
        {/* {<div className={styles.cntLineas}>
          <img src={lineas} alt="" />
        </div>} */}

        <div className={styles.logoForm}>
          <Logo />
        </div>

        <div className={styles.formulario}>
          <form
            className={styles.frm}
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <Switch />

            {/* Correo */}
            <div className={styles.cntImput}>
              <label className={styles.label} htmlFor="correo">
                Correo electrónico
              </label>
              <input
                id="correo"
                type="email"
                placeholder="Correo electrónico"
                autoComplete="email"
                {...register("correo")}
                className={errors.correo ? styles.errorInput : ""}
              />
              {errors.correo && (
                <span className={styles.error}>{errors.correo.message}</span>
              )}
            </div>

            {/* Teléfono */}
            <div className={styles.cntImput}>
              <label className={styles.label} htmlFor="telefono">
                Teléfono
              </label>
              <input
                id="telefono"
                type="tel"
                inputMode="numeric"
                placeholder="Teléfono celular"
                maxLength={10}
                autoComplete="tel"
                {...register("telefono")}
                onInput={(e) => {
                  e.currentTarget.value = onlyDigits(
                    e.currentTarget.value
                  ).slice(0, 10);
                }}
                className={errors.telefono ? styles.errorInput : ""}
              />
              {errors.telefono && (
                <span className={styles.error}>{errors.telefono.message}</span>
              )}
            </div>

            {/* Contraseña */}
            <div className={styles.cntImput}>
              <label className={styles.label} htmlFor="contrasena">
                Contraseña
              </label>
              <div className={styles.inputWithBtn}>
                <input
                  id="contrasena"
                  type={showPass ? "text" : "password"}
                  placeholder="Contraseña"
                  autoComplete="new-password"
                  {...register("contrasena")}
                  className={errors.contrasena ? styles.errorInput : ""}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPass((p) => !p)}
                  aria-label={
                    showPass ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  <img
                    src={showPass ? srcCerrado : srcAbierto}
                    className={styles.ojos}
                    alt=""
                  />
                </button>
              </div>
              {errors.contrasena && (
                <span className={styles.error}>
                  {errors.contrasena.message}
                </span>
              )}
            </div>

            {/* Confirmar */}
            <div className={styles.cntImput}>
              <label className={styles.label} htmlFor="confirmContra">
                Confirmar contraseña
              </label>
              <div className={styles.inputWithBtn}>
                <input
                  id="confirmContra"
                  type={showConf ? "text" : "password"}
                  placeholder="Confirmar contraseña"
                  autoComplete="new-password"
                  {...register("confirmContra")}
                  className={errors.confirmContra ? styles.errorInput : ""}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowConf((p) => !p)}
                  aria-label={
                    showConf ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  <img
                    src={showConf ? srcCerrado : srcAbierto}
                    className={styles.ojos}
                    alt=""
                  />
                </button>
              </div>
              {errors.confirmContra && (
                <span className={styles.error}>
                  {errors.confirmContra.message}
                </span>
              )}
            </div>

            {/* Políticas */}
            <div className={styles.cntPoliticas}>
              <input
                id="politicas"
                type="checkbox"
                {...register("politicas")}
                onKeyDown={(e) => {
                  if (e.key === " " || e.key === "Enter") {
                    e.preventDefault();
                    e.currentTarget.click();
                  }
                }}
              />
              <label htmlFor="politicas">
                He leído y acepto los <a href="#">Términos y condiciones</a> y
                las <a href="#" onClick={() => setAbrirModal(true)}>Políticas de Privacidad</a>
              </label>
              {errors.politicas && touchedFields.politicas && (
                <span className={styles.error}>{errors.politicas.message}</span>
              )}
            </div>


            {/* Botón */}
            <BotonA
              type="submit"
              disabled={!isValid || !isDirty || isSubmitting}
              >
              {isSubmitting ? "Creando…" : "Crear cuenta"}
            </BotonA>
          </form>
        </div>
        <Derechos />
      </div>
      {abrirModal ? <ModalTerminos/> : null }
    </motion.div>
  );
};

export default Registro;

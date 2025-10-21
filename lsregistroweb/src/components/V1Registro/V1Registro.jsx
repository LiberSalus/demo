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
import lineas from "./line.svg";

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
    politicas: z
      .boolean()
      .refine((v) => v, {
        message: "Lee los terminos y condiciones y activa la casilla",
      }),
  })
  .refine((d) => d.contrasena === d.confirmContra, {
    path: ["confirmContra"],
    message: "Las contraseñas no coinciden",
  });

const Registro = () => {
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
    if (pwd) trigger("confirmContra");
  }, [pwd, trigger]);

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

    <div className={styles.cntV1Registro}>
      
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
                  e.currentTarget.value = onlyDigits(e.currentTarget.value).slice(0, 10);
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
                  aria-label={showPass ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  <img
                    src={showPass ? srcCerrado : srcAbierto}
                    className={styles.ojos}
                    alt=""
                  />
                </button>
              </div>
              {errors.contrasena && (
                <span className={styles.error}>{errors.contrasena.message}</span>
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
                  aria-label={showConf ? "Ocultar contraseña" : "Mostrar contraseña"}
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
                las <a href="#">Políticas de Privacidad</a>
              </label>
              {errors.politicas && touchedFields.politicas && (
                <span className={styles.error}>{errors.politicas.message}</span>
              )}
            </div>

            {/* Botón */}
            <BotonA type="submit" disabled={!isValid || !isDirty || isSubmitting}>
              {isSubmitting ? "Creando…" : "Crear cuenta"}
            </BotonA>
          </form>
        </div>
        <Derechos />
      </div>
    </div>
  );
};

export default Registro;

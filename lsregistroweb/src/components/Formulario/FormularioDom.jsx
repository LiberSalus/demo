// src/components/Formulario/FormularioDom.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import api from "@/services/api"; // /api -> preregistro
import apiCp from "@/services/apiCp"; // /cp  -> catálogos CP
import styles from "./formulario.module.css";
import BotonA from "@/components/Botones/BotonA";

/**
 * Respuesta EJEMPLO (array de objetos):
 * [
 *   {
 *     "D_CODIGO":"07918","D_ASENTA":"San Juan de Aragón VI Sección","D_TIPO_ASENTA":"Colonia",
 *     "D_MNPIO":"Gustavo A. Madero","D_ESTADO":"Ciudad de México","D_CIUDAD":"Ciudad de México",
 *     "D_CP":7981,"C_ESTADO":"09","C_OFICINA":"07981","C_CP":null,"C_TIPO_ASENTA":"09",
 *     "C_MNPIO":"005","ID_ASENTA_CPCONS":"1200","D_ZONA":"Urbano","C_CVE_CIUDAD":"07"
 *   }
 * ]
 */

function mapCpResponse(items = []) {
  // Normaliza MAYÚSCULAS por si viene alguna clave en otro caso
  const upper = (o = {}) =>
    Object.fromEntries(
      Object.entries(o).map(([k, v]) => [String(k).toUpperCase(), v])
    );

  const rows = items.map(upper);
  const first = rows[0] || {};

  // Colonias únicas y ordenadas
  const colonias = [
    ...new Set(
      rows.map((r) => String(r.D_ASENTA || "").trim()).filter(Boolean)
    ),
  ].sort((a, b) => a.localeCompare(b, "es"));

  return {
    colonias,
    estado: first.D_ESTADO || "",
    municipio: first.D_MNPIO || "",
    ciudad: first.D_CIUDAD || "",
    codigo: first.D_CODIGO || "",
  };
}

const FormularioDom = ({ onSuccess }) => {
  const { state } = useLocation(); // { id }
  const safeId =
    Number(state?.id ?? sessionStorage.getItem("ls:id_pre") ?? 0) || null;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      codigoPostal: "",
      colonia: "",
      estado: "",
      municipio: "",
      ciudad: "",
      calle: "",
      numero_ext: "",
      numero_int: "",
      referencia: "",
    },
  });

  const [colonias, setColonias] = useState([]);
  const [cpLoading, setCpLoading] = useState(false);
  const [cpError, setCpError] = useState("");
  const [sinNumInt, setSinNumInt] = useState(false);

  const codigoPostal = watch("codigoPostal");

  const fetchByCP = async (raw) => {
    const cp = String(raw || "")
      .replace(/\D+/g, "")
      .slice(0, 5);
    setValue("codigoPostal", cp);
    setColonias([]);
    setValue("colonia", "");
    setCpError("");

    if (cp.length !== 5) return;

    try {
      setCpLoading(true);
      const { data } = await apiCp.get("/codigos_postales", {
        params: { codigo_postal: cp },
      });

      const mapped = mapCpResponse(Array.isArray(data) ? data : []);
      setColonias(mapped.colonias);

      setValue("estado", mapped.estado);
      setValue("municipio", mapped.municipio);
      setValue("ciudad", mapped.ciudad);

      if (mapped.colonias.length === 0) {
        setCpError("No se encontraron colonias para este CP.");
      }
    } catch (e) {
      setCpError("No se pudo consultar el código postal.");
    } finally {
      setCpLoading(false);
    }
  };

  const onSubmit = async (form) => {
    setLoading(true);
    try {
      const id = Number(sessionStorage.getItem("ls:id_pre"));
      if (!id) throw new Error("No se encontró el id del preregistro.");

      const payload = {
        id,
        calle: (form.calle || "").trim(),
        numero_int: sinNumInt
          ? "S/N" // 👈 workaround temporal
          : String(form.numero_int || "").trim() || "S/N",
        numero_ext: String(form.numero_ext || "").trim(),
        codigo_postal: String(form.cp || "").trim(),
        delegacion: (form.municipio || "").trim(),
        colonia: (form.colonia || "").trim(),
        estado: (form.estado || "").trim(),
        ciudad: (form.ciudad || "").trim(),
        referencia: (form.referencia || "").trim(),
      };

      // endpoint correcto (sin doble /preregistro y sin slash al final)
      await api.post("/preregistro/guardar-direccion", payload);

      // ➜ ir a Recibidos
      navigate(ROUTES.RECIBIDOS, { state: { id } });
      onSuccess?.();
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "No se pudo guardar la dirección.";
      alert(String(msg));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.Formu}>
      <form
        className={styles.formulario}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        {/* Código Postal */}
        <label className={styles.label}>
          Código postal:
          <input
            {...register("codigoPostal", {
              required: "Requerido",
              validate: (v) =>
                /^\d{5}$/.test(v) ? true : "Debe tener 5 dígitos",
            })}
            className={`${styles.input} ${
              errors.codigoPostal ? styles.inputError : ""
            }`}
            maxLength={5}
            inputMode="numeric"
            onInput={(e) =>
              (e.currentTarget.value = e.currentTarget.value
                .replace(/\D+/g, "")
                .slice(0, 5))
            }
            onBlur={(e) => fetchByCP(e.currentTarget.value)}
            placeholder="Ej. 07918"
          />
        </label>
        {errors.codigoPostal && (
          <span className={styles.errors}>{errors.codigoPostal.message}</span>
        )}
        {cpLoading && <span className={styles.info}>Buscando colonias…</span>}
        {cpError && <span className={styles.errors}>{cpError}</span>}

        {/* Colonia */}
        <label className={styles.label}>
          Colonia:
          <select
            {...register("colonia", { required: "Selecciona una colonia" })}
            className={`${styles.select} ${
              errors.colonia ? styles.selectError : ""
            }`}
            disabled={colonias.length === 0}
            defaultValue=""
          >
            <option value="" disabled>
              — Busca un CP primero —
            </option>
            {colonias.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        {errors.colonia && (
          <span className={styles.errors}>{errors.colonia.message}</span>
        )}

        {/* Estado / Municipio / Ciudad (solo lectura) */}
        <label className={styles.label}>
          Estado:
          <input {...register("estado")} className={styles.input} disabled />
        </label>

        <label className={styles.label}>
          Municipio/Alcaldía:
          <input {...register("municipio")} className={styles.input} disabled />
        </label>

        <label className={styles.label}>
          Ciudad:
          <input {...register("ciudad")} className={styles.input} disabled />
        </label>

        {/* Calle y números */}
        <label className={styles.label}>
          Calle:
          <input
            {...register("calle", { required: "Requerida" })}
            className={`${styles.input} ${
              errors.calle ? styles.inputError : ""
            }`}
            placeholder="Nombre de la calle"
          />
        </label>
        {errors.calle && (
          <span className={styles.errors}>{errors.calle.message}</span>
        )}

        <label className={styles.label}>
          Número exterior:
          <input
            {...register("numero_ext", { required: "Requerido" })}
            className={`${styles.input} ${
              errors.numero_ext ? styles.inputError : ""
            }`}
            placeholder="Ej. 123"
          />
        </label>
        {errors.numero_ext && (
          <span className={styles.errors}>{errors.numero_ext.message}</span>
        )}

        {/* Número interior + toggle “S/N” */}
      <div className={styles.row}>
        <label className={styles.label}>Número interior (opcional):</label>
        <input
          {...register("numero_int")}
          className={styles.input}
          placeholder="Ej. 3B"
          disabled={sinNumInt}
        />
        <label className={styles.checkInline}>
          <input
            type="checkbox"
            checked={sinNumInt}
            onChange={(e) => setSinNumInt(e.target.checked)}
          />
          No tengo número interior
        </label>
      </div>

        <label className={styles.label}>
          Referencia (opcional):
          <input
            {...register("referencia")}
            className={styles.input}
            placeholder="Entre calles, punto de referencia…"
          />
        </label>

        <div className={styles.cntBoton}>
          <BotonA variant="secondary" type="button" onClick={() => reset()}>
            Limpiar
          </BotonA>
          <BotonA
            type="submit"
            disabled={isSubmitting || !codigoPostal || colonias.length === 0}
          >
            Continuar
          </BotonA>
        </div>
      </form>
    </div>
  );
};

export default FormularioDom;

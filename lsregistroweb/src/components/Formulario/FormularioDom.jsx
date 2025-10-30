// src/components/Formulario/FormularioDom.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import api from "@/services/api";   // /api -> preregistro
import apiCp from "@/services/apiCp"; // /cp  -> catálogos CP
import apiSesion from "@/services/apiSesion"; 
import styles from "./formulario.module.css";
import BotonA from "@/components/Botones/BotonA";
import { ROUTES } from "@/routes/AppRouter";


/** Normalizador simple del catálogo CP */
function mapCpResponse(items = []) {
  const upper = (o = {}) =>
    Object.fromEntries(Object.entries(o).map(([k, v]) => [String(k).toUpperCase(), v]));
  const rows = items.map(upper);
  const first = rows[0] || {};

  const colonias = [
    ...new Set(rows.map(r => String(r.D_ASENTA || "").trim()).filter(Boolean)),
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
  const { state } = useLocation();                 // { id } opcional
  const navigate = useNavigate();
  const safeId = Number(state?.id ?? sessionStorage.getItem("ls:id_pre") ?? 0) || null;

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
      numero_int: "",     // ahora sí 100% opcional
      referencia: "",
    },
  });

  const [colonias, setColonias]   = useState([]);
  const [cpLoading, setCpLoading] = useState(false);
  const [cpError, setCpError]     = useState("");
  const [saving, setSaving]       = useState(false);

  const codigoPostal = watch("codigoPostal");

  const fetchByCP = async (raw) => {
    const cp = String(raw || "").replace(/\D+/g, "").slice(0, 5);
    setValue("codigoPostal", cp);
    setColonias([]);
    setValue("colonia", "");
    setCpError("");
    if (cp.length !== 5) return;

    try {
      setCpLoading(true);
      const { data } = await apiCp.get("/codigos_postales", { params: { codigo_postal: cp } });
      const mapped = mapCpResponse(Array.isArray(data) ? data : []);
      setColonias(mapped.colonias);
      setValue("estado", mapped.estado);
      setValue("municipio", mapped.municipio);
      setValue("ciudad", mapped.ciudad);
      if (mapped.colonias.length === 0) setCpError("No se encontraron colonias para este CP.");
    } catch {
      setCpError("No se pudo consultar el código postal.");
    } finally {
      setCpLoading(false);
    }
  };

  const onSubmit = async (form) => {
  try {
    setSaving(true);

    // helper para NO mandar strings vacíos
    const compact = (obj) =>
      Object.fromEntries(
        Object.entries(obj).filter(([_, v]) =>
          v !== undefined && v !== null && String(v).trim() !== ""
        )
      );

    const payload = compact({
      calle: (form.calle || "").trim(),
      numero_int: (form.numero_int || "").trim(),        // opcional -> si queda "", se omite
      numero_ext: (form.numero_ext || "").trim(),
      codigo_postal: String(form.codigoPostal || "").trim(), // "07918"
      delegacion: (form.municipio || "").trim(),
      colonia: (form.colonia || "").trim(),
      estado: (form.estado || "").trim(),
      ciudad: (form.ciudad || "").trim(),
      referencia: (form.referencia || "").trim(),        // opcional
    });

    // ✅ NUEVA ruta en servicio de sesión
    await apiSesion.post("/preregistro/direccion/guardar", payload);

    navigate(ROUTES.RECIBIDOS, { replace: true });
    onSuccess?.();
  } catch (err) {
    const msg =
      err?.response?.data?.detail ||
      err?.response?.data?.message ||
      err?.message ||
      "No se pudo guardar la dirección.";
    alert(String(msg));
  } finally {
    setSaving(false);
  }
};

  return (
    <div className={styles.Formu}>
      <form className={styles.formulario} onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* Código Postal */}
        <label className={styles.label}>
          Código postal:
          <input
            {...register("codigoPostal", {
              required: "Requerido",
              validate: (v) => (/^\d{5}$/.test(v) ? true : "Debe tener 5 dígitos"),
            })}
            className={`${styles.input} ${errors.codigoPostal ? styles.inputError : ""}`}
            maxLength={5}
            inputMode="numeric"
            onInput={(e) =>
              (e.currentTarget.value = e.currentTarget.value.replace(/\D+/g, "").slice(0, 5))
            }
            onBlur={(e) => fetchByCP(e.currentTarget.value)}
            placeholder="Ej. 07918"
          />
        </label>
        {errors.codigoPostal && <span className={styles.errors}>{errors.codigoPostal.message}</span>}
        {cpLoading && <span className={styles.info}>Buscando colonias…</span>}
        {cpError && <span className={styles.errors}>{cpError}</span>}

        {/* Colonia */}
        <label className={styles.label}>
          Colonia:
          <select
            {...register("colonia", { required: "Selecciona una colonia" })}
            className={`${styles.select} ${errors.colonia ? styles.selectError : ""}`}
            disabled={colonias.length === 0}
            defaultValue=""
          >
            <option value="" disabled>— Busca un CP primero —</option>
            {colonias.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
        {errors.colonia && <span className={styles.errors}>{errors.colonia.message}</span>}

        {/* Estado / Municipio / Ciudad */}
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
            className={`${styles.input} ${errors.calle ? styles.inputError : ""}`}
            placeholder="Nombre de la calle"
          />
        </label>
        {errors.calle && <span className={styles.errors}>{errors.calle.message}</span>}

        <label className={styles.label}>
          Número exterior:
          <input
            {...register("numero_ext", { required: "Requerido" })}
            className={`${styles.input} ${errors.numero_ext ? styles.inputError : ""}`}
            placeholder="Ej. 123"
          />
        </label>
        {errors.numero_ext && <span className={styles.errors}>{errors.numero_ext.message}</span>}

        <label className={styles.label}>
          Número interior (opcional):
          <input
            {...register("numero_int")}
            className={styles.input}
            placeholder="Ej. 3B"
          />
        </label>

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
            loading={saving}                     
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

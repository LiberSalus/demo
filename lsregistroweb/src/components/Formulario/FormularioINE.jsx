// src/components/Formulario/FormularioINE.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "@/services/api";        // 8040 (/api)
import apiIne from "@/services/apiIne";  // 8060 (/ine)

import styles from "./formulario.module.css";
import BotonA from "../Botones/BotonA";
import { ROUTES } from "@/routes/AppRouter";

/* ----------------- Validación ----------------- */
const schema = z.object({
  curp: z.string().regex(/^[A-Z]{4}\d{6}[HMX][A-Z]{5}[A-Z\d]\d$/, "CURP inválida"),
  nombre: z.string().min(1, "Nombre requerido"),
  apellido1: z.string().min(1, "Primer apellido requerido"),
  apellido2: z.string().optional(),
  fechaNac: z.string().min(1, "Fecha requerida"),
  sexo: z.enum(["H", "M", "X"], { message: "Selecciona un sexo" }),
});

/* ----------------- Helpers ----------------- */
const toISO = (v = "") => {
  if (!v) return "";
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
    const [d, m, y] = v.split("/");
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  return v;
};

const toDMY = (v = "") => {
  if (!v) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const [y, m, d] = v.split("-");
    return `${d}/${m}/${y}`;
  }
  return v;
};

const normSexo = (v = "") => {
  const up = String(v).trim().toUpperCase();
  if (["H", "M", "X"].includes(up)) return up;
  if (up.startsWith("HOM")) return "H";
  if (up.startsWith("MUJ")) return "M";
  return "X";
};

const prettyApiError = (err) => {
  const detail = err?.response?.data?.detail ?? err?.response?.data ?? err?.message;
  if (Array.isArray(detail)) {
    return detail
      .map((d) => {
        const loc = Array.isArray(d?.loc) ? d.loc.join(".") : "";
        return `${loc ? `[${loc}] ` : ""}${d?.msg || JSON.stringify(d)}`;
      })
      .join("\n");
  }
  if (typeof detail === "object") return JSON.stringify(detail, null, 2);
  return String(detail || "Error");
};

// Mapa simple de entidad
const ENT_MAP = {
  "DISTRITO FEDERAL": { abr: "CMX", ent: "CIUDAD DE MEXICO" },
  "CIUDAD DE MEXICO": { abr: "CMX", ent: "CIUDAD DE MEXICO" },
};

/* ----------------- Componente ----------------- */
const FormularioINE = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { state: state_react } = useLocation();
  const safeId = state_react?.id ?? sessionStorage.getItem("ls:id_pre");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      curp: "",
      nombre: "",
      apellido1: "",
      apellido2: "",
      fechaNac: "",
      sexo: "",
    },
  });

  const [loadingCurp, setLoadingCurp] = useState(false);
  const [curpOk, setCurpOk] = useState(false);
  const [resCurp, setResCurp] = useState({});

  const curpValue = (watch("curp") || "").toUpperCase();
  const curpFormatoOK = schema.shape.curp.safeParse(curpValue).success;

  const validarCurp = async () => {
    if (!curpFormatoOK) return;
    try {
      setLoadingCurp(true);
      const url = `/preregistro/curp/extraer/${encodeURIComponent(curpValue)}`;
      const res = await apiIne.get(url);
      const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;

      setResCurp(data);

      setValue("curp", curpValue, { shouldDirty: true });
      setValue("nombre", data?.nombre ?? "", { shouldDirty: true });
      setValue("apellido1", data?.primer_apellido ?? data?.apellido_paterno ?? "", { shouldDirty: true });
      setValue("apellido2", data?.segundo_apellido ?? data?.apellido_materno ?? "", { shouldDirty: true });

      const fechaRaw = data?.fecha_nacimiento ?? data?.fecha_nacimiento_ine ?? "";
      setValue("fechaNac", toISO(fechaRaw), { shouldDirty: true });

      setValue("sexo", normSexo(data?.sexo), { shouldDirty: true });
      setCurpOk(true);
    } catch (err) {
      setCurpOk(false);
      const detail =
        err?.response?.data?.detail ??
        err?.response?.data?.message ??
        err?.message;
      const msg = Array.isArray(detail)
        ? detail.map((d) => d?.msg || JSON.stringify(d)).join(" · ")
        : detail || "Error al validar CURP";
      setError("curp", { message: String(msg) });
    } finally {
      setLoadingCurp(false);
    }
  };

  const onSubmit = async (formData) => {
    try {
      if (!safeId) {
        alert("No se pudo recuperar el ID. Regresa al paso anterior.");
        return;
      }

      const entTxt = (resCurp?.entidad_nacimiento || "").toUpperCase().trim();
      const entInfo = ENT_MAP[entTxt] || { abr: "CMX", ent: "CIUDAD DE MEXICO" };

      const payload = {
        id: Number(safeId),
        curp: formData.curp,
        first_name: formData.nombre,
        last_name: formData.apellido1,
        second_last_name: formData.apellido2 || "",
        sex_curp: formData.sexo,
        birthdate: toDMY(formData.fechaNac), // dd/mm/yyyy
        nacionalidad: resCurp?.nacionalidad || "MEXICO",
        state: entInfo.ent,
        abr_entidad: entInfo.abr,
      };

      const endpoint = "/preregistro/preregistro/guardar-curp";
      try {
        await api.post(endpoint, payload);
      } catch (e1) {
        if (e1?.response?.status === 404 && !endpoint.endsWith("/")) {
          await api.post(`${endpoint}/`, payload);
        } else {
          throw e1;
        }
      }

      navigate(ROUTES.COMPLETAR_DOMICILIO, { state: { id: Number(safeId) } });
      onSuccess?.();
    } catch (err) {
      alert(prettyApiError(err));
    }
  };

  return (
    <div className={styles.Formu}>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.formulario} noValidate>
        {/* CURP */}
        <div className={styles.cntValCurp}>
          <label className={styles.label}>
            CURP:
            <input
              {...register("curp")}
  className={`${styles.input} ${errors.curp ? styles.inputError : ""}`}
  placeholder="Ingresa tu CURP"
  maxLength={18}
  onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
            />
          </label>

          <BotonA
            className={styles.BotonA}
            type="button"
            loading={loadingCurp}
            loading={loadingCurp} 
            variant="secondary"
            onClick={validarCurp}
            disabled={loadingCurp || !curpFormatoOK}
          >
            {loadingCurp ? "Validando..." : curpOk ? "Validada" : "Validar"}
          </BotonA>
        </div>
        {errors.curp && <span className={styles.errors}>{errors.curp.message}</span>}

        {/* Campos */}
        <label className={styles.label}>
          Nombre(s):
          <input
  {...register("nombre")}
  className={`${styles.input} ${errors.nombre ? styles.inputError : ""}`}
/>
{errors.nombre && <span className={styles.errors}>{errors.nombre.message}</span>}
        </label>

        <label className={styles.label}>
          Primer Apellido:
          <input
  {...register("apellido1")}
  className={`${styles.input} ${errors.apellido1 ? styles.inputError : ""}`}
/>
{errors.apellido1 && <span className={styles.errors}>{errors.apellido1.message}</span>}
        </label>

        <label className={styles.label}>
          Segundo Apellido:
          <input {...register("apellido2")} className={styles.input} />
        </label>

        <label className={styles.label}>
          Fecha de nacimiento:
          <input
  type="date"
  {...register("fechaNac")}
  className={`${styles.input} ${errors.fechaNac ? styles.inputError : ""}`}
/>
{errors.fechaNac && <span className={styles.errors}>{errors.fechaNac.message}</span>}
        </label>

        <label className={styles.label}>
          Sexo:
          <select
  {...register("sexo")}
  className={`${styles.select} ${errors.sexo ? styles.selectError : ""}`}
>
  <option value="" disabled>Selecciona tu sexo</option>
  <option value="H">HOMBRE</option>
  <option value="M">MUJER</option>
  <option value="X">NO BINARIO</option>
</select>
{errors.sexo && <span className={styles.errors}>{errors.sexo.message}</span>}
        </label>

        <div className={styles.cntBoton}>
          <BotonA variant="secondary" onClick={() => reset()}>Limpiar</BotonA>
          <BotonA type="submit" disabled={isSubmitting || !curpOk}>Continuar</BotonA>
        </div>
          <a className={styles.volver} onClick={() => navigate(-1)}>Volver</a>
      </form>
    </div>
  );
};

export default FormularioINE;

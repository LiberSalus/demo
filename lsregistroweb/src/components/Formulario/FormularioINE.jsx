// src/components/Formulario/FormularioINE.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "@/services/api";        // 8040 (preregistro) -> /api
import apiIne from "@/services/apiIne";  // 8060 (sesión/INE) -> /ine

import styles from "./formulario.module.css";
import BotonA from "../Botones/BotonA";
import { ROUTES } from "@/routes/AppRouter";

const schema = z.object({
  curp: z.string().regex(/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z\d]\d$/, "CURP inválida"),
  nombre: z.string().min(1, "Nombre requerido"),
  apellido1: z.string().min(1, "Primer apellido requerido"),
  apellido2: z.string().optional(),
  fechaNac: z.string().min(1, "Fecha requerida"),
  sexo: z.enum(["H", "M", "X"], { message: "Selecciona un sexo" }),
});

//const toInputDate = (s = "") => {
//  // admite dd/mm/yyyy o yyyy-mm-dd
//  if (!s) return "";
//  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
//  const [d, m, y] = s.split("/");
//  return y && m && d ? `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}` : "";
//};
const toDMY = (v = "") => {
  // acepta "yyyy-mm-dd" o "dd/mm/yyyy" y devuelve "dd/mm/yyyy"
  if (!v) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const [y, m, d] = v.split("-");
    return `${d}/${m}/${y}`;
  }
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) return v;
  return "";
};



const normSexo = (v = "") => {
  const up = String(v).trim().toUpperCase();
  if (["H", "M", "X"].includes(up)) return up;
  if (up.startsWith("HOM")) return "H";
  if (up.startsWith("MUJ")) return "M";
  return "X";
};

const FormularioINE = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { state: state_react } = useLocation();

  console.log("formINE", state_react);

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

  const validarCurp = async () => {
    const curp = (watch("curp") || "").toUpperCase();
    const ok = schema.shape.curp.safeParse(curp).success;
    if (!ok) return;

    try {
      setLoadingCurp(true);
      // 8060 (sesión): GET /preregistro/curp/extraer/:curp
      const url = `/preregistro/curp/extraer/${encodeURIComponent(curp)}`;
      const res = await apiIne.get(url);
      const data = typeof res.data === "string" ? JSON.parse(res.data) : res.data;

      setResCurp(data);

      setValue("curp", curp, { shouldDirty: true });
      setValue("nombre", data?.nombre ?? "", { shouldDirty: true });
      setValue("apellido1", data?.primer_apellido ?? data?.apellido_paterno ?? "", { shouldDirty: true });
      setValue("apellido2", data?.segundo_apellido ?? data?.apellido_materno ?? "", { shouldDirty: true });

      
      //limpia fecha
      setValue("fechaNac", ""); // limpia
      setTimeout(() => {
        setValue("fechaNac", fecha, { shouldDirty: true });
      }, 0);

      setValue("fechaNac", data?.fecha_nacimiento ?? data?.fecha_nacimiento_ine ?? "", { shouldDirty: true });
      
      //imprime
      const fecha = data?.fecha_nacimiento ?? data?.fecha_nacimiento_ine ?? "";
      console.log("📅 Fecha recibida:", fecha);
      setValue("fechaNac", fecha, { shouldDirty: true });
      
      
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

  // === Reemplaza tu onSubmit por este ===
  const onSubmit = async (formData) => {
    try {
      // Normaliza campos a lo que espera el backend
      const entTxt = (resCurp?.entidad_nacimiento || "").toUpperCase().trim();
      const entInfo = ENT_MAP[entTxt] || { abr: "CMX", ent: "CIUDAD DE MEXICO" };

      const payload = {
        id: state_react.id,
        curp: formData.curp,                         // ABCD820101H...
        first_name: formData.nombre,                     // Nombres
        last_name: formData.apellido1,         // Paterno
        second_last_name: formData.apellido2 || "",  // Materno
        sex_curp: formData.sexo,                         // H|M|X
        birthdate: formData.fechaNac,         // yyyy-mm-dd (del input)
        nacionalidad: resCurp?.nacionalidad || "MEXICO",
        state: entInfo.ent,             // "CIUDAD DE MEXICO"
        abr_entidad: entInfo.abr,                    // "CMX"
        municipio_registro: resCurp?.municipio_registro || "017 VENUSTIANO CARRANZA",
        // Si el backend requiere id_user, descomenta:
        // id_user: state?.id_user ?? state?.idUser ?? undefined,
      };

      // Log para depurar (puedes borrarlo)
      console.log("➡️ guardar-curp payload:", payload);

      const endpoint = "/preregistro/preregistro/guardar-curp";

      try {
        await api.post(endpoint, payload);           // 8040 via /api proxy
      } catch (e1) {
        // Algunos endpoints exigen "/" al final
        if (e1?.response?.status === 404 && !endpoint.endsWith("/")) {
          await api.post(`${endpoint}/`, payload);
        } else {
          throw e1;
        }
      }

      // Continua al formulario de domicilio
      navigate(ROUTES.COMPLETAR_DOMICILIO, { state: state_react });
      onSuccess?.();
    } catch (err) {
      alert(prettyApiError(err)); // muestra los campos exactos que fallaron
    }
  };


  // helpers arriba del componente (o dentro, como prefieras)
  const prettyApiError = (err) => {
    const detail = err?.response?.data?.detail ?? err?.response?.data ?? err?.message;
    if (Array.isArray(detail)) {
      // FastAPI suele mandar: [{loc:[...], msg:"...", type:"..."}]
      return detail.map(d => {
        const loc = Array.isArray(d?.loc) ? d.loc.join(".") : "";
        return `${loc ? `[${loc}] ` : ""}${d?.msg || JSON.stringify(d)}`;
      }).join("\n");
    }
    if (typeof detail === "object") return JSON.stringify(detail, null, 2);
    return String(detail || "Error");
  };

  // mapa mínimo para la entidad (ajusta con tus catálogos si quieres)
  const ENT_MAP = {
    "DISTRITO FEDERAL": { abr: "CMX", ent: "CIUDAD DE MEXICO" },
    "CIUDAD DE MEXICO": { abr: "CMX", ent: "CIUDAD DE MEXICO" },
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
              className={styles.input}
              placeholder="Ingresa tu CURP"
              maxLength={18}
              onInput={(e) => (e.target.value = e.target.value.toUpperCase())}
            />
          </label>

          <BotonA
            className={styles.BotonA}
            type="button"
            loading={loadingCurp}
            variant="secondary"
            onClick={validarCurp}
            disabled={loadingCurp}
          >
            {loadingCurp ? "Validando..." : curpOk ? "Validada" : "Validar"}
          </BotonA>
        </div>
        {errors.curp && <span className={styles.errors}>{errors.curp.message}</span>}

        {/* Campos */}
        <label className={styles.label}>
          Nombre(s):
          <input {...register("nombre")} className={styles.input} />
          {errors.nombre && <span className={styles.errors}>{errors.nombre.message}</span>}
        </label>

        <label className={styles.label}>
          Primer Apellido:
          <input {...register("apellido1")} className={styles.input} />
          {errors.apellido1 && <span className={styles.errors}>{errors.apellido1.message}</span>}
        </label>

        <label className={styles.label}>
          Segundo Apellido:
          <input {...register("apellido2")} className={styles.input} />
        </label>

        <label className={styles.label}>
          Fecha de nacimiento:
          <input type="date" {...register("fechaNac")} className={styles.input} />
          {errors.fechaNac && <span className={styles.errors}>{errors.fechaNac.message}</span>}
        </label>

        <label className={styles.label}>
          Sexo:
          <select {...register("sexo")} className={styles.select}>
            <option value="" disabled>Selecciona tu sexo</option>
            <option value="H">HOMBRE</option>
            <option value="M">MUJER</option>
            <option value="X">NO BINARIO</option>
          </select>
          {errors.sexo && <span className={styles.errors}>{errors.sexo.message}</span>}
        </label>

        <div className={styles.cntBoton}>
          <a className={styles.volver} onClick={() => navigate(-1)}>Volver</a>
          <BotonA variant="secondary" onClick={() => reset()}>Limpiar</BotonA>
          <BotonA type="submit" disabled={isSubmitting || !curpOk}>Continuar</BotonA>
        </div>
      </form>
    </div>
  );
};

export default FormularioINE;

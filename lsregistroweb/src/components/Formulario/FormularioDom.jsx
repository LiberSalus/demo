import React, { useState, useEffect } from "react";
import styles from "./formulario.module.css";
import BotonA from "../Botones/BotonA";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import api from "@/services/api";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/routes/AppRouter"; // <-- usa "@/" alias

const schema = z.object({
  calle: z.string().min(1, "Calle requerida"),
  numeroExt: z.string().min(1, "Número exterior requerido"),
  numeroInt: z.string().optional(),
  colonia: z.string().min(1, "Colonia requerida"),
  alcaldiaMunicipio: z.string().min(1, "Alcaldía/Municipio requerido"),
  codigoPostal: z
    .string()
    .length(5, "El C.P. debe tener 5 dígitos")
    .regex(/^\d{5}$/, "Código Postal inválido"),
  estado: z.string().min(1, "Estado requerido"),
  referencia: z.string().optional(),
});

const CP_API = "/cp/codigos_postales?codigo_postal=";

const FormularioDom = () => {
  const navigate = useNavigate();               // <-- declara ANTES de usar
  const { state } = useLocation(); // puede venir { id } o { id_pre }
  const [ciudad, setCiudad] = useState("");     // <-- declara ANTES de usar

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      calle: "",
      numeroExt: "",
      numeroInt: "",
      colonia: "",
      alcaldiaMunicipio: "",
      codigoPostal: "",
      estado: "",
      referencia: "",
    },
  });

  const cp = watch("codigoPostal") || "";

  // Modal
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);

  // Datos traídos por C.P.
  const [cpLoading, setCpLoading] = useState(false);
  const [cpError, setCpError] = useState("");
  const [colonias, setColonias] = useState([]); // strings
  const [seleccion, setSeleccion] = useState(""); // colonia elegida

  useEffect(() => {
    if (isOpen) setShow(true);
    else setTimeout(() => setShow(false), 300);
  }, [isOpen]);

  useEffect(() => {
  const candidates = [
    state?.id_pre,
    state?.id,
    Number(sessionStorage.getItem("id_pre")),
    Number(localStorage.getItem("id_pre")),
    Number((sessionStorage.getItem("location") || "").split("/").pop()),
  ].filter((n) => Number.isFinite(n) && n > 0);

  if (candidates.length) {
    sessionStorage.setItem("id_pre", String(candidates[0]));
  }
}, [state]);



  // Llamada al servicio externo de C.P.
  const obtenerCP = async () => {
    const codigo = (cp || "").trim();
    setCpError("");
    setColonias([]);
    setSeleccion("");

    if (!/^\d{5}$/.test(codigo)) {
      setError("codigoPostal", { message: "Ingresa 5 dígitos" });
      return;
    }

    try {
      setCpLoading(true);

      const res = await fetch(`${CP_API}${encodeURIComponent(codigo)}`);
      if (!res.ok) throw new Error("No se pudo consultar el código postal");

      const data = await res.json(); // array de asentamientos
      if (!Array.isArray(data) || data.length === 0) {
        setCpError("No se encontraron resultados para ese C.P.");
        return;
      }

      // Estado / Alcaldía/Municipio (tomo de la primera fila)
      const primero = data[0];
      const estado = primero?.D_ESTADO || "";
      const alcaldia = primero?.D_MNPIO || "";
      const city = primero?.D_CIUDAD || "";

      setValue("estado", estado, { shouldDirty: true, shouldValidate: true });
      setValue("alcaldiaMunicipio", alcaldia, {
        shouldDirty: true,
        shouldValidate: true,
      });
      setCiudad(city); // <-- ahora sí existe

      // Colonias únicas (D_ASENTA)
      const uniq = Array.from(
        new Set(data.map((r) => (r?.D_ASENTA || "").trim()).filter(Boolean))
      );

      if (uniq.length === 1) {
        // una sola → la seteo directo y listo
        setValue("colonia", uniq[0], {
          shouldDirty: true,
          shouldValidate: true,
        });
      } else {
        // varias → abro modal para elegir
        setColonias(uniq);
        setIsOpen(true);
      }
    } catch (e) {
      setCpError(e?.message || "Ocurrió un error al consultar el código postal");
    } finally {
      setCpLoading(false);
    }
  };

  const confirmarColonia = () => {
    if (!seleccion) {
      setCpError("Selecciona una colonia");
      return;
    }
    setValue("colonia", seleccion, { shouldDirty: true, shouldValidate: true });
    setIsOpen(false);
  };

  const getIdPre = () => {
  const raw = sessionStorage.getItem("id_pre");
  const n = raw ? Number(raw) : null;
  return Number.isFinite(n) ? n : null;
};

  const onSubmit = async (form) => {

    

  try {
    const id = getIdPre();
    if (!id) {
      alert("Falta el identificador del preregistro. Vuelve a iniciar el flujo.");
      return;
    }

    const payload = {
      id,
      calle: form.calle,
      numero_int: form.numeroInt || "",
      numero_ext: form.numeroExt,
      codigo_postal: form.codigoPostal,
      delegacion: form.alcaldiaMunicipio,
      colonia: form.colonia,
      estado: form.estado,
      ciudad: ciudad || "",       // <- viene de la consulta de CP
      referencia: form.referencia || ""
    };

    await api.post("/preregistro/guardar-direccion", payload);
    navigate(ROUTES.RECIBIDOS);
  } catch (err) {
    const d = err?.response?.data?.detail ?? err?.response?.data?.message ?? err?.message;
    const msg = Array.isArray(d)
      ? d.map((x) => x.msg || JSON.stringify(x)).join(" · ")
      : d;
    if (err?.response?.status === 401) {
      alert("Sesión no válida. Inicia sesión de nuevo.");
      return;
    }
    alert(msg || "Error al guardar dirección");
  }
};


  return (
    <div className={styles.cntFormulario}>
      {/* Modal elección de colonia */}
      {show && (
        <div
          className={`${styles.capaModal} ${isOpen ? styles.capaModalVisible : ""
            }`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="titulo-modal-colonia"
        >
          <div className={`${styles.modal} ${isOpen ? styles.modalVisible : ""}`}>
            <p id="titulo-modal-colonia" className={styles.modalTitulo}>
              Confirma tu colonia
            </p>

            <div className={styles.listaColonias}>
              {colonias.map((c) => (
                <label key={c} className={styles.itemColonia}>
                  <input
                    type="radio"
                    name="colonia"
                    value={c}
                    checked={seleccion === c}
                    onChange={() => setSeleccion(c)}
                    className={styles.radioColonia}
                  />
                  <span className={styles.nomColonia}>{c}</span>
                </label>
              ))}
            </div>

            {cpError && <div className={styles.errors}>{cpError}</div>}

            <div className={styles.modalAcciones}>
              <BotonA variant="secondary" onClick={() => setIsOpen(false)}>
                Cancelar
              </BotonA>
              <BotonA onClick={confirmarColonia}>Confirmar</BotonA>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.formulario} noValidate>
        {/* solicitud codigo postal */}
        <div className={styles.cntSolCodigo}>
          <div className={styles.cntInput}>
            <label className={styles.label} htmlFor="codigoPostal">
              Código Postal:
            </label>
            <input
              id="codigoPostal"
              className={styles.input}
              {...register("codigoPostal")}
              maxLength={5}
              inputMode="numeric"
              placeholder="Ingresa código postal"
              onInput={(e) => {
                e.target.value = e.target.value.replace(/\D/g, "").slice(0, 5);
              }}
            />
            {errors.codigoPostal && (
              <span className={styles.errors}>{errors.codigoPostal.message}</span>
            )}
            {cpError && !isOpen && <div className={styles.errors}>{cpError}</div>}
          </div>

          <BotonA
            variant="primary"
            type="button"
            onClick={obtenerCP}
            disabled={cpLoading || !/^\d{5}$/.test(cp)}
          >
            {cpLoading ? "Buscando…" : "Buscar"}
          </BotonA>
        </div>

        {/* Estado */}
        <label className={styles.label} htmlFor="estado">
          Estado:
        </label>
        <input
          id="estado"
          className={styles.input}
          {...register("estado")}
          placeholder="Estado"
        />
        {errors.estado && <span className={styles.errors}>{errors.estado.message}</span>}

        {/* Alcaldia o Municipio */}
        <label className={styles.label} htmlFor="alcaldiaMunicipio">
          Alcaldía o Municipio:
        </label>
        <input
          id="alcaldiaMunicipio"
          className={styles.input}
          {...register("alcaldiaMunicipio")}
          placeholder="Ingresa Alcaldía o Municipio"
        />
        {errors.alcaldiaMunicipio && (
          <span className={styles.errors}>{errors.alcaldiaMunicipio.message}</span>
        )}

        {/* Colonia */}
        <label className={styles.label} htmlFor="colonia">
          Colonia:
        </label>
        <input
          id="colonia"
          className={styles.input}
          {...register("colonia")}
          placeholder="Ingresa colonia"
        />
        {errors.colonia && <span className={styles.errors}>{errors.colonia.message}</span>}

        <div className={styles.instruccion}>
          <p>Detalla tu ubicación según corresponda</p>
          <p>(comunidad, fraccionamiento, ejido, etc.)</p>
        </div>

        {/* Calle */}
        <label className={styles.label} htmlFor="calle">
          Calle:
        </label>
        <input id="calle" className={styles.input} {...register("calle")} placeholder="Ingresa calle" />
        {errors.calle && <span className={styles.errors}>{errors.calle.message}</span>}

        <div className={styles.cntNumeros}>
          <div className={styles.cntInputsNum}>
            {/* Número Exterior */}
            <label className={styles.label} htmlFor="numeroExt">
              Número Exterior:
            </label>
            <input
              id="numeroExt"
              className={styles.input}
              {...register("numeroExt")}
              placeholder="Ingresa número exterior"
            />
            {errors.numeroExt && <span className={styles.errors}>{errors.numeroExt.message}</span>}
          </div>

          <div className={styles.cntInputsNum}>
            {/* Número interior */}
            <label className={styles.label} htmlFor="numeroInt">
              Número Interior:
            </label>
            <input
              id="numeroInt"
              className={styles.input}
              {...register("numeroInt")}
              placeholder="Ingresa número interior"
            />
            {errors.numeroInt && <span className={styles.errors}>{errors.numeroInt.message}</span>}
          </div>
        </div>

        {/* Referencia */}
        <label className={styles.label} htmlFor="referencia">
          Referencia:
        </label>
        <textarea
          id="referencia"
          className={styles.input}
          placeholder="Descripción de tu residencia"
          {...register("referencia")}
        />

        <div className={styles.cntBoton}>
          <BotonA
            className={styles.btnLimpiar}
            variant="secondary"
            type="button"
            onClick={() => {
              reset();
              setCpError("");
              setColonias([]);
              setSeleccion("");
            }}
          >
            Limpiar
          </BotonA>

          <BotonA variant="primary" type="submit" disabled={isSubmitting}>
            Enviar
          </BotonA>
        </div>
      </form>
    </div>
  );
};

export default FormularioDom;

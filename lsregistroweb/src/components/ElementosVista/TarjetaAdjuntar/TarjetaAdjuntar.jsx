// src/components/ElementosVista/TarjetaAdjuntar/TarjetaAdjuntar.jsx
import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import styles from './tarjetaAdjuntar.module.css';

import srcImg      from './bs-cloud-upload.svg';
import srcArchivo  from './fi-file.svg';
import srcExito    from './Group.svg';
import srcEliminar from './delete.svg';
import BotonA      from '../../Botones/BotonA';

const TarjetaAdjuntar = forwardRef(function TarjetaAdjuntar(
  {
    accion,
    descripcion,
    requiredCount = 2,
    accept = "image/*",                     // por defecto imágenes
    endpoint,                               // ej: "/api/ine/preregistro/ine/subir/imagenes"
    fieldName = "files",                    // ine-imágenes: "files"; pdf: "file"
    onUploaded,                             // callback({ ok, data, error })
  },
  ref
) {
  const inputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const addFiles = (fileList) => {
    const filesArray = Array.from(fileList);
    // limitamos al número requerido
    setSelectedFiles((prev) => [...prev, ...filesArray].slice(0, requiredCount));
  };

  const handleChange = (e) => {
    addFiles(e.target.files);
    inputRef.current.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    addFiles(e.dataTransfer.files);
  };

  const removeFile = (idx) =>
    setSelectedFiles((files) => files.filter((_, i) => i !== idx));

  // ---- subir() expuesto al padre ----
  const upload = async () => {
    if (!endpoint) return { ok: true, skipped: true }; // no hace nada si no hay endpoint

    // Validaciones mínimas
    if (selectedFiles.length !== requiredCount) {
      const msg = `Debes adjuntar exactamente ${requiredCount} archivo(s) para ${accion}.`;
      onUploaded?.({ ok: false, error: msg });
      return { ok: false, error: msg };
    }

    const fd = new FormData();

    // IMPORTANTE: para el endpoint de INE-imágenes, repetir el MISMO campo "files" 2 veces
    for (const f of selectedFiles) {
      fd.append(fieldName, f, f.name);
    }

    setLoading(true);
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: fd,
        // Para que viaje la cookie access_token=... del dominio 8060
        credentials: 'include',
        headers: { 'Accept': 'application/json' },
      });

      const data = await res.json().catch(() => ({}));
      const ok = res.ok;

      onUploaded?.({ ok, data, status: res.status });
      return { ok, data, status: res.status };
    } catch (err) {
      onUploaded?.({ ok: false, error: err?.message || 'Error de red' });
      return { ok: false, error: err?.message || 'Error de red' };
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({ upload, getFiles: () => selectedFiles }));

  return (
    <div className={styles.cntTarjetaAdjuntar}>
      <div className={styles.cntTexto}>
        <p className={styles.titulo}>{accion}</p>
        <p className={styles.subtitulo}>{descripcion}</p>
      </div>

      <div
        className={styles.inputArea}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className={styles.cntInstruccion}>
          <img src={srcImg} className={styles.imgIcon} alt="" />
          <p>Arrastra aquí tus documentos</p>

          <div className={styles.cntBoton}>
            <BotonA type="button" onClick={() => inputRef.current?.click()}>
              {loading ? 'Subiendo...' : 'Cargar archivos del ordenador'}
            </BotonA>
          </div>
        </div>

        <input
          ref={inputRef}
          className={styles.input}
          type="file"
          accept={accept}
          multiple={requiredCount > 1}
          onChange={handleChange}
        />
      </div>

      <div className={styles.cntArchivosSeleccionados}>
        {selectedFiles.length === 0 && <span className={styles.placeholder} />}
        {selectedFiles.map((file, idx) => (
          <div key={`${file.name}-${file.lastModified}`} className={styles.cntArchivoSeleccionado}>
            <div className={styles.archivoDate}>
              <img src={srcArchivo} className={styles.orejaP} alt="" />
              <p className={styles.nombreArchivo}>{file.name}</p>
              <img src={srcExito} className={styles.paloma} alt="" />
            </div>
            <div className={styles.cntEliminar} onClick={() => removeFile(idx)}>
              <img src={srcEliminar} className={styles.eliminar} alt="Eliminar" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default TarjetaAdjuntar;

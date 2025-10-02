// src/components/V6Adjuntar/V6Adjuntar.jsx
import React, { useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/routes/AppRouter';

import styles from './v6adjuntar.module.css';
import Logo             from '@/components/ElementosVista/Logo/Logo';
import TextoPrincipal   from '@/components/ElementosVista/TextoPrincipal/TextoPrincipal';
import TarjetaAdjuntar  from '@/components/ElementosVista/TarjetaAdjuntar/TarjetaAdjuntar';
import BotonA           from '@/components/Botones/BotonA';

const V6Adjuntar = () => {
  const navigate  = useNavigate();
  const { state } = useLocation();

  const ineRef = useRef(null);
  const compRef = useRef(null);

  const [hint, setHint] = useState('');

  const onUploadedIne = ({ ok, data, error, status }) => {
    if (!ok) {
      setHint(error || `Error INE (${status || ''})`);
    } else {
      // Ejemplo: mostrar el PDF generado
      setHint(`INE OK ➜ ${data?.filename || ''}`);
    }
  };

  const onUploadedComp = ({ ok, data, error, status }) => {
    if (!ok) {
      setHint(error || `Error Comprobante (${status || ''})`);
    } else {
      setHint(`Comprobante OK`);
    }
  };

  const continuar = async () => {
    setHint('');

    // 1) Subir INE
    const ine = await ineRef.current?.upload();
    if (!ine?.ok) return; // si falla, no continúes

    // 2) Subir Comprobante (si la card está configurada con endpoint)
    const comp = await compRef.current?.upload();
    if (comp && comp.ok === false) return;

    // 3) Avanzar
    navigate(ROUTES.RECIBIDOS, { state });
  };

  return (
    <div className={styles.cntV6Adjutar}>
      <div className={styles.cntLogo}><Logo /></div>

      <div className={styles.cntTexto}>
        <TextoPrincipal textoPrincipal="Adjunta los archivos necesarios para verificar tu información" />
      </div>

      <div className={styles.cntTarjetas}>
        <TarjetaAdjuntar
          ref={ineRef}
          accion="INE"
          descripcion="Asegúrate de incluir imagen de frente y reverso"
          requiredCount={2}
          accept="image/*"
          endpoint="/api/ine/preregistro/ine/subir/imagenes"
          fieldName="files"
          onUploaded={onUploadedIne}
        />

        <TarjetaAdjuntar
          ref={compRef}
          accion="Comprobante de domicilio"
          descripcion="Asegúrate de que sea legible y con fecha menor a 3 meses"
          requiredCount={1}
          accept="application/pdf,image/*"
          endpoint="/api/ine/preregistro/ine/subir-pdf"  // AJUSTA si tu backend usa otra ruta
          fieldName="file"
          onUploaded={onUploadedComp}
        />
      </div>

      <div className={styles.opciones}>
        <p>Adjunta tus archivos para continuar</p>
        {hint && <small style={{opacity:.8}}>{hint}</small>}
        <BotonA onClick={continuar}>Continuar</BotonA>
        <a className={styles.volver} onClick={() => navigate(-1)}>Volver</a>
      </div>
    </div>
  );
};

export default V6Adjuntar;

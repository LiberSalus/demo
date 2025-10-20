// src/components/V5ComprIdentidad/V5ComprIdentidad.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/AppRouter';

import escanear from '../V5ComprIdentidad/Escanear.svg'
import anadir from '../V5ComprIdentidad/Añadir.svg'

import styles from './v5comprIdentidad.module.css';
import Logo from '@/components/ElementosVista/Logo/Logo';
import TextoPrincipal from '@/components/ElementosVista/TextoPrincipal/TextoPrincipal';
import TextoSecundario from '@/components/ElementosVista/TextoSecundario/TextoSecundario';
import TarjetaBase from '@/components/ElementosVista/TarjetaBase/TarjetaBase';

const V5ComprIdentidad = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.cntV5ComprIdentidad}>

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
        <div className={styles.logoForm}>
          <Logo />
        </div>

      {/* Título y descripción */}
      <div className={styles.cntTexto}>
        <TextoPrincipal textoPrincipal="Completa tu perfil" />
        
        <p>Llena tus datos o sube tus documentos</p>
        <p>identificación oficial y comprobante de domicilio</p>
        <p>Así podremos confirmar tu identidad y ofrecerte una experiencia segura y personalizada.</p>
      </div>

      {/* Tarjetas de acción */}
      <div className={styles.cntTarjeta}>
        <TarjetaBase
          srcIcon={escanear}
          accion="Llena tus datos"
          descripcion="Completa los formularios de forma manual con tus datos para continuar."
          textoBoton="Escanear documentos"
          onClick={() => navigate(ROUTES.CAPTURAR_DOCUMENTOS)}
        />

        <TarjetaBase
          srcIcon={anadir}
          accion="Adjuntar archivos"
          descripcion="Adjunta una imagen o PDF.  
Asegúrate que sea legible y esté completo."
          textoBoton="Subir archivos"
          onClick={() => navigate(ROUTES.ADJUNTAR_DOCUMENTOS)}
        />
      </div>
      <div className={styles.opciones}>
        <a
          className={styles.enlace}
          onClick={() => navigate(ROUTES.COMPLETAR_INE)}>
          Llenar datos manualmente
        </a>

        <a
          className={styles.enlace}
          onClick={() => navigate(ROUTES.OPCIONES)}>
          Subir más tarde desde tu perfil
        </a>
      </div>
      </div>


    </div>
  );
};

export default V5ComprIdentidad;


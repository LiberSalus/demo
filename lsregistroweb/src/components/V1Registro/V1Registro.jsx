// src/components/V1Registro/V1Registro.jsx
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/routes/AppRouter';


import styles from './v1registro.module.css';
import srcAbierto from './eye-password-see-view-svgrepo-com.svg';
import srcCerrado from './eye-key-look-password-security-see-svgrepo-com.svg';
import Logo from '@/components/ElementosVista/Logo/Logo';
import BotonA from '@/components/Botones/BotonA';
import Switch from '@/components/Seleccion/Switch';
import Derechos from './Derechos';
import LiberSalusPoly from './LiberSalusLowPoly/LiberSalusPoly'

/* ---------- Validación ---------- */
const schema = z.object({
  correo: z.string().email('Correo no válido'),
  telefono: z.string().regex(/^\d{10}$/, 'Debe tener 10 dígitos'),
  contrasena: z.string().regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, '8+, 1 mayús., 1 minús., 1 número, 1 símbolo'),
  confirmContra: z.string(),
  politicas: z.literal(true, 'Lee los terminos y condiciones y activa la casilla'),
}).refine((d) => d.contrasena === d.confirmContra, {
  path: ['confirmContra'],
  message: 'Las contraseñas no coinciden',
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
    mode: 'onChange',
  });

  /* Re-validar confirmación al cambiar la contraseña */
  const pwd = watch('contrasena');
  useEffect(() => {
    if (pwd) trigger('confirmContra');
  }, [pwd, trigger]);

  /* ---------- Submit ---------- */
  const onSubmit = (data) => {
    const payload = {
      rol: 1,
      correo: data.correo,
      telefono: data.telefono,
      code_telefono: '52',
      contrasena: data.contrasena,
    };
    navigate(ROUTES.CONFIRMACION, { state: payload });
  };
  console.log(errors)
  /* ---------- UI ---------- */
  return (
    <div className={styles.cntV1Registro}>
      <div className={styles.cntBienvenida}>
        <div className={styles.fondo}>
          <LiberSalusPoly
            autoMorph={true}        // morph automático
            morphEveryMs={3000}     // intervalo de morph
            spray={false}            // triángulos sueltos
            curveAlpha={1}        // opacidad ola superior
            dirGlow={0.16}          // vignette/glow
            className="w-full h-full"
          />
        </div>
        <div className={styles.cntSaludo}>
          <div>
            <p>¡Bienvenido a Liber Salus!</p>
            <p >Afíliate y toma el control de tu bienestar</p>
          </div>
          <div className={styles.cntLogo}>
            <Logo />
          </div>
        </div>
        <p>Para comenzar a usar nuestra plataforma, necesitas crear un usuario y afiliarte.<br />
          Este proceso es sencillo y sólo toma tres pasos:</p>
        <div className={styles.cntPasos}>
          <div className={styles.elementoPaso}>
            <p className={styles.paso}>Crea tu usuario: <br />
              Llena tus datos personales.</p>
          </div>
          <div className={styles.elementoPaso}>
            <p className={styles.paso}>Sube tus documentos: <br />
              CURP, INE y comprobante de domicilio</p>
          </div>
          <div className={styles.elementoPaso}>
            <p className={styles.paso}>Completa tus cuestionarios de saliud</p>
          </div>


        </div>

        <div className={styles.cntDerechosInfo}>
          <Derechos />
        </div>
      </div>

      <div className={styles.cntFormulario}>
        <div className={styles.formulario}>
          <div className={styles.logoForm}><Logo /></div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Switch />

            {/* Correo */}
            <div className={styles.cntImput}>
              <label className={styles.label}>Correo electrónico</label>
              <input
                type="email"
                placeholder="Correo electrónico"
                {...register('correo')}
                className={errors.correo ? styles.errorInput : ''}
              />
              {errors.correo && <span className={styles.error}>{errors.correo.message}</span>}
            </div>

            {/* Teléfono */}
            <div className={styles.cntImput}>
              <label className={styles.label}>Teléfono</label>
              <input
                type="text"
                placeholder="Teléfono celular"
                maxLength={10}
                {...register('telefono')}
                className={errors.telefono ? styles.errorInput : ''}
              />
              {errors.telefono && <span className={styles.error}>{errors.telefono.message}</span>}
            </div>

            {/* Contraseña */}
            <div className={styles.cntImput}>
              <label className={styles.label}>Contraseña</label>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Contraseña"
                {...register('contrasena')}
                className={errors.contrasena ? styles.errorInput : ''}
              />
              <span
                className={styles.passwordToggle}
                onClick={() => setShowPass(!showPass)}
                role="button"
                tabIndex={0}
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();          // evita que el espacio haga scroll
                    setShowPass((p) => !p);
                  }
                }}
              >
                <img src={showPass ? srcCerrado : srcAbierto} className={styles.ojos} alt="" />
              </span>
              {errors.contrasena && <span className={styles.error}>{errors.contrasena.message}</span>}
            </div>

            {/* Confirmar */}
            <div className={styles.cntImput}>
              <label className={styles.label}>Confirmar contraseña</label>
              <input
                type={showConf ? 'text' : 'password'}
                placeholder="Confirmar contraseña"
                {...register('confirmContra')}
                className={errors.confirmContra ? styles.errorInput : ''}
              />
              <span
                className={styles.passwordToggle}
                onClick={() => setShowConf(!showConf)}
                role="button"
                tabIndex={0}
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();          // evita que el espacio haga scroll
                    setShowConf((p) => !p);
                  }
                }}
              >
                <img src={showConf ? srcCerrado : srcAbierto} className={styles.ojos} alt="" />
              </span>
              {errors.confirmContra && <span className={styles.error}>{errors.confirmContra.message}</span>}
            </div>

            {/* Políticas */}
            <div className={styles.cntPoliticas}>
              <input id="politicas" type="checkbox" {...register('politicas')}
                onKeyDown={(e) => {
                  if (e.key === ' ' || e.key === 'Enter') {
                    e.preventDefault();              // evita scroll o submit
                    e.currentTarget.click();         // dispara toggle de forma nativa
                  }
                }}
              />
              <label htmlFor="politicas">
                He leído y acepto <a href="#">Términos</a> y <a href="#">Privacidad</a>
              </label>
              {errors.politicas && touchedFields.politicas && <span className={styles.error}>{errors.politicas.message}</span>}
            </div>

            {/* Botón */}
            <BotonA type="submit" disabled={!isValid || !isDirty || isSubmitting}>
              {isSubmitting ? 'Creando…' : 'Crear cuenta'}
            </BotonA>
          </form>
        </div>
        <div className={styles.cntDerechosForm}><Derechos /></div>
      </div>
    </div>
  );
};

export default Registro;

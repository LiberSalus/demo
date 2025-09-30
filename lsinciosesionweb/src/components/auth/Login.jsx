import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/config/routes";
// ...

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || ROUTES.INICIO; // 👈 default a INICIO

  // ... (state, onChange, validate)

  const onSubmit = async (e) => {
    e.preventDefault();
    // ...validaciones

    try {
      setLoading(true);
      const data = await login({
        username: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      localStorage.setItem("auth_ready", "1");
      localStorage.setItem(
        "perfil_min",
        JSON.stringify({
          nombre:
            (data?.user?.first_name && data?.user?.last_name) ||
            data?.user?.nombre ||
            "Usuario",
        })
      );

      navigate(from, { replace: true }); // 👈 va a /inicio (o al from)
    } catch (err) {
      // ...
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("auth_ready")) {
      navigate(from, { replace: true }); // 👈 si ya logueado, ve a /inicio
    }
  }, [from, navigate]);

  // ... JSX igual


  return (
    <div className={styles.cntTarjeta}>
      <div className={styles.cntLogo}>
        <img className={styles.logo} src={logo} alt="Liber Salus Logo" />
      </div>

      <h2 className={styles.h2}>
        Bienvenido a <br /> Liber Salus
      </h2>

      <form className={styles.formulario} onSubmit={onSubmit} noValidate>
        {/* Switch Paciente/Médico */}
        <div
          className={
            form.role === "medico"
              ? `${styles.cntSwitch} ${styles.switchActivo}`
              : styles.cntSwitch
          }
        >
          <input
            type="checkbox"
            name="switch"
            id="switch"
            checked={form.role === "medico"}
            onChange={onChange}
            aria-label="Cambiar a perfil Médico"
          />
          <div className={styles.cntSwitch}>
            <div
              className={
                form.role === "medico"
                  ? `${styles.switchBg} ${styles.switchBgRight}`
                  : styles.switchBg
              }
            />
            <div className={styles.perfil}>
              <span
                className={`${styles.span} ${
                  form.role === "paciente" ? styles.activo : styles.inactivo
                }`}
                onClick={() => setForm((f) => ({ ...f, role: "paciente" }))}
                style={{ cursor: "pointer" }}
              >
                Paciente
              </span>
              <span
                className={`${styles.span} ${
                  form.role === "medico" ? styles.activo : styles.inactivo
                }`}
                onClick={() => setForm((f) => ({ ...f, role: "medico" }))}
                style={{ cursor: "pointer" }}
              >
                Médico
              </span>
            </div>
          </div>
        </div>

        {/* Email */}
        <div className={styles.cntInput}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="ejemplo@mail.com"
            value={form.email}
            onChange={onChange}
            autoComplete="username"
            required
          />
        </div>

        {/* Password */}
        <div className={styles.cntInput}>
          <label htmlFor="password">Contraseña</label>
          <div className={styles.cntInpContra}>
            <button
              type="button"
              className={styles.imgOjo}
              onClick={() => setShowPwd((s) => !s)}
              aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
            >
              <img
                className={styles.imgOjo}
                src={eyeIcon}
                alt={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
              />
            </button>

            <input
              className={styles.input}
              id="password"
              name="password"
              type={showPwd ? "text" : "password"}
              placeholder="Contraseña"
              value={form.password}
              onChange={onChange}
              autoComplete="current-password"
              required
              minLength={6}
            />
          </div>
        </div>

        {errorMsg && (
          <div
            className={styles.mensajeError}
            role="alert"
            aria-live="assertive"
          >
            {errorMsg}
          </div>
        )}

        <a className={styles.olvida} href="/recuperar">
          ¿Olvidaste tu contraseña?
        </a>

        <input
          className={styles.btn}
          type="submit"
          value={loading ? "Iniciando..." : "Iniciar Sesión"}
          disabled={loading}
        />
      </form>

      <div className={styles.cntRegistro}>
        <p>
          ¿Aún no tienes cuenta? <a href="/registro">Registrarme</a>
        </p>
      </div>
      <Derechos />
    </div>
  );
};

export default Login;

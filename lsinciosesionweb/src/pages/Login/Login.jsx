// src/pages/Login/Login.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/config/routes";
import styles from "./login.module.css";
import logo from "./Logo.svg";
import google from './google.svg'
import eyeIcon from "@/images/Icons _ eye-empty.png";
import Derechos from "@/components/Derechos/Derechos";
import { login } from "@/services/auth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || ROUTES.INICIO;

  const [form, setForm] = useState({ email: "", password: "", role: "paciente" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "switch" && type === "checkbox") {
      setForm((f) => ({ ...f, role: checked ? "medico" : "paciente" }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const validate = () => {
    if (!form.email.trim()) return "El correo es obligatorio.";
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!emailOk) return "Formato de correo inválido.";
    if (!form.password) return "La contraseña es obligatoria.";
    if (form.password.length < 6) return "Mínimo 6 caracteres en contraseña.";
    return null;
    };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    const v = validate();
    if (v) return setErrorMsg(v);

    try {
      setLoading(true);
      const data = await login({
        username: form.email.trim(),
        password: form.password,
        role: form.role,
      });

      const user = data?.user || {};
      const fullName =
        (user.first_name && user.last_name && `${user.first_name} ${user.last_name}`) ||
        user.nombre ||
        "Usuario";

      localStorage.setItem("auth_ready", "1");
      localStorage.setItem(
        "perfil_min",
        JSON.stringify({
          nombre: fullName,
          email: user.email || "",
          // avatarUrl: user.avatar || null, // cuando exista
        })
      );

      // Notifica a la TarjetaUsuario para que se refresque
      window.dispatchEvent(new CustomEvent("perfil:update"));

      navigate(from, { replace: true });
    } catch (err) {
      console.error(err);
      const apiMsg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message;
      setErrorMsg(apiMsg || "No fue posible iniciar sesión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("auth_ready")) {
      navigate(from, { replace: true });
    }
  }, [from, navigate]);

  return (
    <div className={styles.cntTarjeta}>
      <div className={styles.cntLogo}>
        <img className={styles.logo} src={logo} alt="Liber Salus Logo" />
      </div>

      <button className={styles.google}><img className={styles.icngle} src={google}></img>Iniciar sesión con Google</button>

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
          {<div className={styles.cntSwitch}>
            <div
              className={
                form.role === "medico"
                  ? `${styles.switchBg} ${styles.switchBgRight}`
                  : styles.switchBg
              }
            />
            <div className={styles.perfil}>
              <span
                className={`${styles.span} ${form.role === "paciente" ? styles.activo : styles.inactivo}`}
                onClick={() => setForm((f) => ({ ...f, role: "paciente" }))}
                style={{ cursor: "pointer" }}
              >
                Paciente
              </span>
              <span
                className={`${styles.span} ${form.role === "medico" ? styles.activo : styles.inactivo}`}
                onClick={() => setForm((f) => ({ ...f, role: "medico" }))}
                style={{ cursor: "pointer" }}
              >
                Médico
              </span>
            </div>
          </div>}
        </div>
        <div className={styles.cntHr}>
          <hr/>
          <p>o</p>
          <hr/>
        </div>
        {/* Email */}
        <div className={styles.cntInput}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Tu correo electrónico"
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
              <img className={styles.imgOjo} src={eyeIcon} alt="Mostrar/Ocultar contraseña" />
            </button>

            <input
              className={styles.input}
              id="password"
              name="password"
              type={showPwd ? "text" : "password"}
              placeholder="Tu contraseña"
              value={form.password}
              onChange={onChange}
              autoComplete="current-password"
              required
              minLength={6}
            />
          </div>
        </div>

        {errorMsg && (
          <div className={styles.mensajeError} role="alert" aria-live="assertive">
            {errorMsg}
          </div>
        )}

        <button className={styles.btn} type="submit" disabled={loading}>
  {loading ? (
    <>
      <span className={styles.spinner}></span> Iniciando...
    </>
  ) : (
    "Iniciar sesión"
  )}
</button>

        <a className={styles.olvida} href="/recuperar">Olvide mi contraseña</a>

      </form>

      <div className={styles.cntRegistro}>
        <p>Aún no tienes cuenta <a href="/registro">Registrarme</a></p>
      </div>
      <Derechos />
    </div>
  );
};

export default Login;

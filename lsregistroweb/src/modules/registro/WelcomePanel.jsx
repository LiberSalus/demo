// src/modules/registro/WelcomePanel.jsx
import { usePanel } from "./PanelContext.jsx";
import s from "./welcomePanel.module.css";
import Logo from "@/components/ElementosVista/Logo/Logo"; // ajusta si tu ruta difiere

export default function WelcomePanel() {
  const { panel } = usePanel();
  const { badge, title, subtitle, bullets, illustration } = panel;

  return (
    <div className={s.wrap}>
      <header className={s.header}>
        <Logo />
      </header>

      <section className={s.hero}>
        {badge && <span className={s.badge}>{badge}</span>}
        <h1 className={s.title}>{title}</h1>
        {subtitle && <p className={s.subtitle}>{subtitle}</p>}
      </section>

      {illustration && (
        <div className={s.illust}>
          <img src={illustration} alt="" />
        </div>
      )}

      {Array.isArray(bullets) && bullets.length > 0 && (
        <ul className={s.bullets}>
          {bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      )}

      <footer className={s.footer}>
        <small>© {new Date().getFullYear()} Liber Salus</small>
      </footer>
    </div>
  );
}

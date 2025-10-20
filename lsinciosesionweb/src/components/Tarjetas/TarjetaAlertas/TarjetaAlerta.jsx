import TarjetaSugerencia from "./TarjetaSugerencia";
import { AREAS } from "./areas.config";
import styles from "./tarjetaAlerta.module.css";

export default function TarjetaAlertas({ areas = ["a1", "a2",  "a3", "a4", "a5"] }) {
  // Quitamos duplicados y descartamos códigos desconocidos
  const unicas  = Array.from(new Set(areas)).filter((a) => AREAS[a]);

  return (
    <div className={styles.cntTarjetaAlerta}>
      <h3>Alertas y sugerencias</h3>
      {unicas.map((code) => {
        const cfg = AREAS[code];
        return (

          
          <TarjetaSugerencia
            key={code}
            icon={cfg.icon}         // ruta al svg
            titulo={cfg.label}
            theme={cfg.theme}       // { "--bg":..., "--btn":..., "--btn-hover":... }
            texto={cfg.texto ?? "Hay áreas en las que puedes fortalecer tu bienestar."}
            cta={cfg.cta ?? "Explorar herramientas"}
            onClick={() => console.log("Abrir", code)}
          />
        );
      })}
    </div>
  );
}

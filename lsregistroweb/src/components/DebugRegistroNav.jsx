import { useNavigate } from "react-router-dom";

export default function DebugRegistroNav() {
  const navigate = useNavigate();

  const links = [
    { to: "/registro", label: "Paso 1: Cuenta" },
    { to: "/registro/confirmacion", label: "Paso 2: Confirmación" },
    { to: "/registro/verificacion", label: "Paso 3: Verificación" },
    { to: "/registro/capturar", label: "Paso 4: Capturar" },
    { to: "/registro/identidad", label: "Paso 5: Identidad" },
    { to: "/registro/subir", label: "Paso extra: Subir" },
  ];

  return (
    <nav style={{
      padding: "1rem",
      marginTop: "2rem",
      border: "1px dashed #aaa",
      borderRadius: "8px",
      background: "#fafafa"
    }}>
      <h4>Debug navegación registro</h4>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {links.map((l) => (
          <li key={l.to} style={{ margin: "6px 0" }}>
            <button
              onClick={() => navigate(l.to)}
              style={{
                padding: "6px 12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                background: "#f0f0f0",
                cursor: "pointer",
              }}
            >
              {l.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

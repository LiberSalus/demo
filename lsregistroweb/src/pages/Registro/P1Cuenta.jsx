import { useEffect } from "react";
import { usePanel } from "@/modules/registro/PanelContext";
import V1Registro from "@/components/V1Registro/V1Registro";
import DebugRegistroNav from "../../components/DebugRegistroNav";

export default function P1Cuenta() {
  const { setPanel } = usePanel();

  useEffect(() => {
    setPanel({
      badge: "¡Bienvenido a",
      title: "Libersalus!",
      subtitle: "Afíliate y toma control de tu bienestar.",
      bullets: [
        "Crea tu cuenta.",
        "Usa datos personales válidos.",
        "Confirma tu información de contacto."
      ],
      illustration: null
    });
  }, [setPanel]);

  return (
    <div>
      <V1Registro />
      <DebugRegistroNav/>
    </div>
  );
}

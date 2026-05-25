import { useSearchParams } from "react-router-dom";

import { VistaDetalleRegistro } from "@/features/metricas/registros/VistaRegistros";

// Lee parametros de URL y monta el detalle de un registro especifico.
function RegistroDetallePage() {
  const [searchParams] = useSearchParams();

  const metrica = searchParams.get("metrica") ?? "FrecuenciaCardiaca";
  const filtro = searchParams.get("filtro") ?? "Dia";
  const registroId = searchParams.get("registro") ?? "";
  const modo = searchParams.get("modo") ?? undefined;
  const periodo = searchParams.get("periodo") ?? undefined;
  const periodoPadre = searchParams.get("periodoPadre") ?? undefined;
  const registroDia = searchParams.get("registroDia") ?? undefined;

  return (
    <VistaDetalleRegistro
      metrica={metrica}
      filtro={filtro}
      registroId={registroId}
      modo={modo}
      periodo={periodo}
      periodoPadre={periodoPadre}
      registroDia={registroDia}
    />
  );
}

export default RegistroDetallePage;

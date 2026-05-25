import { useSearchParams } from "react-router-dom";

import { VistaRegistros } from "@/features/metricas/registros/VistaRegistros";

// Lee parametros de URL y monta la vista general de registros de una metrica.
function RegistrosPage() {
  const [searchParams] = useSearchParams();
  const metrica = searchParams.get("metrica") ?? "FrecuenciaCardiaca";
  const filtro = searchParams.get("filtro") ?? undefined;
  const modo = searchParams.get("modo") ?? undefined;
  const periodo = searchParams.get("periodo") ?? undefined;
  const periodoPadre = searchParams.get("periodoPadre") ?? undefined;
  const registroDia = searchParams.get("registroDia") ?? undefined;

  return (
    <VistaRegistros
      metrica={metrica}
      filtroInicial={filtro}
      modoInicial={modo}
      periodoInicial={periodo}
      periodoPadreInicial={periodoPadre}
      registroDiaInicial={registroDia}
    />
  );
}

export default RegistrosPage;

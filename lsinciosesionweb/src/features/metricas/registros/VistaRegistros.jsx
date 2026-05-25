import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./VistaRegistros.module.css";
import {
  construirDetalleRegistro,
  construirItemsLista,
  construirRegistrosDelDia,
  obtenerConfigRegistros,
} from "./registrosConfig";

import icoCaleDia from "./icoCaleDia.svg";
import icoCaleSem from "./icoCaleSem.svg";
import icoCaleMes from "./icoCaleMes.svg";
import icoCaleAno from "./icoCaleAno.svg";
import icoFiltro from "./icoFiltro.svg";
import icoPDF from "./icoPDF.svg";
import chebron from "./icoChevron.svg";

const ICONOS_FILTRO = {
  Dia: icoCaleDia,
  Semana: icoCaleSem,
  Mes: icoCaleMes,
  Anio: icoCaleAno,
};

const METRICAS_DASHBOARD = {
  FrecuenciaCardiaca: "frecuencia_cardiaca",
  PresionArterial: "presion_arterial",
  Oxigenacion: "spo2",
  Glucosa: "glucosa",
};

const normalizarFiltro = (config, filtro) =>
  config.filtros.includes(filtro) ? filtro : config.vistaPeriodoDefecto;

// Regresa al dashboard de salud fisica con la metrica equivalente seleccionada.
const irADashboardMetrica = (navigate, metrica) => {
  const metricaDashboard = METRICAS_DASHBOARD[metrica] ?? "frecuencia_cardiaca";
  navigate(`/salud-fisica?metric=${metricaDashboard}`);
};

// pinta resumen Frecuencia Cardiaca
const ResumenFrecuenciaCardiaca = () => {
  return (
    <div className={styles.tarjetaResumen}>
      <div className={styles.izquierdaFC}>
        <div className={styles.arriba}>
          <p>Rangos ppm P10</p>
          <p>Número de mediciones:</p>
          <p>• 12 mediciones</p>
          <p>• &lt; 60 ppm</p>
        </div>

        <div className={styles.abajo}>
          <p>Rangos ppm P90</p>
          <p>Número de mediciones:</p>
          <p>• 20 mediciones</p>
          <p>• &gt; 60 ppm</p>
        </div>
      </div>

      <div className={styles.derechaFC}>
        <div className={styles.arriba}>
          <p>
            Rangos ppm <br /> Actividad
          </p>
          <p className={styles.cir}>
            Max <strong>120 ppm</strong>
          </p>
          <p className={styles.cir}>
            Min <strong>100 ppm</strong>
          </p>
        </div>
        <div className={styles.abajo}>
          <p>
            Rangos ppm <br /> Reposo
          </p>
          <p className={styles.cir}>
            Max <strong>89 ppm</strong>
          </p>
          <p className={styles.cir}>
            Min <strong>68 ppm</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
// pinta resumen Presión Arterial
const ResumenPresionArterial = () => {
  return (
    <div className={styles.tarjetaResumen}>
      <div className={styles.izquierdaFC}>
        <div className={styles.arriba}>
          <p>Rangos mmHg P10</p>
          <p>Número de mediciones:</p>
          <p>• 12 mediciones</p>
          <p>• &lt; 90 / &lt; 60 mmHg </p>
        </div>
      </div>
      <div className={styles.derechaFC}>
        <div className={styles.arriba}>
          <p>Rangos mmHg P90</p>
          <p>Número de mediciones:</p>
          <p>• 20 mediciones</p>
          <p>• &gt; 60 mmHg</p>
        </div>
      </div>
    </div>
  );
};

// pinta resumen Oxigenacion
const ResumenOxigenacion = () => {
  return (
    <div className={styles.tarjetaResumen}>
      <div className={styles.izquierdaFC}>
        <div className={`${styles.arriba} ${styles.arribaOx}`}>
          <p>Mediciones totales</p>
          <p>• 12 mediciones</p>
          <p>Rangos P10</p>
          <p>Número de mediciones</p>
          <p>• 12 mediciones</p>
          <p>• 92%</p>
          <p>Rangos P90</p>
          <p>Número de mediciones</p>
          <p>• 20 mediciones</p>
          <p>• 96%</p>
        </div>
        <div className={styles.abajo}></div>
      </div>
      <div className={styles.derechaFC}>
        <div className={styles.arriba}>
          <p>Porcentaje de Oxigenación</p>
          <div className={styles.tabla}>
            <div className={styles.item}>
              <p>P10</p>
              <p>1%</p>
            </div>
            <div className={styles.item}>
              <p>Normal</p>
              <p>98%</p>
            </div>
            <div className={styles.item}>
              <p>P90</p>
              <p>1%</p>
            </div>
          </div>
        </div>
        <div className={styles.abajo}>
          <p></p>
          <p className={styles.recomendacion}>
            Tus niveles de oxigenación han estado ligeramente debajo de las
            mediciones normales. <br />
            <br />
            De seguir a si consulta a tu medico.
          </p>
        </div>
      </div>
    </div>
  );
};

// pinta resumen Glucosa
const ResumenGlucosa = () => {
  return (
    <div className={styles.tarjetaResumen}>
      <div className={styles.izquierdaFC}>
        <div className={`${styles.arriba} ${styles.arribaOx}`}>
          <p>Mediciones totales</p>
          <p>• 12 mediciones</p>
          <p>Rangos P10</p>
          <p>Número de mediciones</p>
          <p>• 12 mediciones</p>
          <p>• 68 mg/dL</p>
          <p>Rangos P90</p>
          <p>Número de mediciones</p>
          <p>• 20 mediciones</p>
          <p>• 130 mg/dL</p>
        </div>
        <div className={styles.abajo}></div>
      </div>
      <div className={styles.derechaFC}>
        <div className={styles.arriba}>
          <p>Porcentaje de Glucosa</p>
          <div className={styles.tabla}>
            <div className={styles.item}>
              <p>P10</p>
              <p>1%</p>
            </div>
            <div className={styles.item}>
              <p>Normal</p>
              <p>98%</p>
            </div>
            <div className={styles.item}>
              <p>P90</p>
              <p>1%</p>
            </div>
          </div>
        </div>
        <div className={styles.abajo}>
          <p></p>
          <p className={styles.recomendacion}>
            Tus niveles de glucosa se han mantenido normales en más del 90% de las mediciones.
            <br />
            <br />
            ¡Excelente! Sigue así y cuida tu salud.
          </p>
        </div>
      </div>
    </div>
  );
};

const construirRutaRegistros = ({
  metrica,
  filtro,
  modo,
  periodo,
  periodoPadre,
  registroDia,
}) => {
  const searchParams = new URLSearchParams({ metrica, filtro });

  if (modo) searchParams.set("modo", modo);
  if (periodo) searchParams.set("periodo", periodo);
  if (periodoPadre) searchParams.set("periodoPadre", periodoPadre);
  if (registroDia) searchParams.set("registroDia", registroDia);

  return `/inicio/registros?${searchParams.toString()}`;
};

const construirRutaDetalle = ({
  metrica,
  filtro,
  registro,
  modo,
  periodo,
  periodoPadre,
  registroDia,
}) => {
  const searchParams = new URLSearchParams({ metrica, filtro, registro });

  if (modo) searchParams.set("modo", modo);
  if (periodo) searchParams.set("periodo", periodo);
  if (periodoPadre) searchParams.set("periodoPadre", periodoPadre);
  if (registroDia) searchParams.set("registroDia", registroDia);

  return `/inicio/registros/detalle?${searchParams.toString()}`;
};

const resolverVistaListado = ({
  config,
  filtroActivo,
  modoActivo,
  periodoActivo,
  registroDiaActivo,
}) => {
  if (modoActivo === "registrosDia") {
    const registrosDelDia = construirRegistrosDelDia(config, registroDiaActivo);

    return {
      items: registrosDelDia.items,
      tipo: "registrosDia",
      titulo: registrosDelDia.titulo,
    };
  }

  if (modoActivo === "anio") {
    return {
      items: construirItemsLista(config, "Mes"),
      tipo: "periodos",
      titulo: "",
    };
  }

  if (
    modoActivo === "mes" ||
    modoActivo === "semana" ||
    filtroActivo === "Dia"
  ) {
    return {
      items: construirItemsLista(config, "Dia"),
      tipo: "diasAgrupados",
      titulo: "",
    };
  }

  return {
    items: construirItemsLista(config, filtroActivo),
    tipo: "periodos",
    titulo: periodoActivo ?? "",
  };
};

const renderTarjetaResumen = (config) => (
  <div className={styles.tarjetaResumen}>
    {config.resumen.map((bloque) => (
      <div key={bloque.titulo} className={styles.bloqueResumen}>
        <p className={styles.tituloResumen}>{bloque.titulo}</p>
        {bloque.lineas.map((linea) => (
          <p key={linea} className={styles.lineaResumen}>
            {linea}
          </p>
        ))}
      </div>
    ))}
  </div>
);

const renderTarjetaValores = (config) => {
  if (config.valoresGrupos?.length) {
    return (
      <div className={styles.tarjetaValores}>
        <p className={styles.tituloTarjeta}>{config.valoresTitulo}</p>
        {config.valoresGrupos.map((grupo, index) => (
          <div key={grupo.titulo || index} className={styles.grupoValores}>
            {grupo.titulo ? (
              <p className={styles.subtituloGrupoValores}>{grupo.titulo}</p>
            ) : null}
            {grupo.items.map((item) => (
              <div
                key={`${grupo.titulo}-${item.nombre}-${item.valor}`}
                className={styles.filaValor}
              >
                <div className={styles.valorIzquierda}>
                  <span
                    className={styles.colorValor}
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.nombre}</span>
                </div>
                <span className={styles.valorDerecha}>{item.valor}</span>
              </div>
            ))}
            {index < config.valoresGrupos.length - 1 ? (
              <div className={styles.divisorGrupoValores} />
            ) : null}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.tarjetaValores}>
      <p className={styles.tituloTarjeta}>{config.valoresTitulo}</p>
      {config.valoresReferencia.map((item) => (
        <div key={`${item.nombre}-${item.valor}`} className={styles.filaValor}>
          <div className={styles.valorIzquierda}>
            <span
              className={styles.colorValor}
              style={{ backgroundColor: item.color }}
            />
            <span>{item.nombre}</span>
          </div>
          <span className={styles.valorDerecha}>{item.valor}</span>
        </div>
      ))}
    </div>
  );
};

const renderBloquesLaterales = (config, modo = "lista") => {
  const orden =
    modo === "detalle"
      ? (config.detalleOrdenLateral ?? ["resumen", "valores"])
      : (config.listaOrdenLateral ?? ["resumen", "valores"]);

  return orden.map((bloque) => {
    if (bloque === "resumen") {
      return <div key={`${modo}-resumen`}>{renderTarjetaResumen(config)}</div>;
    }

    if (bloque === "valores") {
      return <div key={`${modo}-valores`}>{renderTarjetaValores(config)}</div>;
    }

    return null;
  });
};

export const VistaRegistros = ({
  metrica,
  filtroInicial,
  modoInicial,
  periodoInicial,
  periodoPadreInicial,
  registroDiaInicial,
}) => {
  const navigate = useNavigate();
  const config = useMemo(() => obtenerConfigRegistros(metrica), [metrica]);
  const [filtroActivo, setFiltroActivo] = useState(() =>
    normalizarFiltro(config, filtroInicial),
  );

  useEffect(() => {
    setFiltroActivo(normalizarFiltro(config, filtroInicial));
  }, [config, filtroInicial]);

  const vistaListado = useMemo(
    () =>
      resolverVistaListado({
        config,
        filtroActivo,
        modoActivo: modoInicial,
        periodoActivo: periodoInicial,
        registroDiaActivo: registroDiaInicial,
      }),
    [config, filtroActivo, modoInicial, periodoInicial, registroDiaInicial],
  );
  const { items, tipo: tipoListado, titulo: tituloListado } = vistaListado;

  const abrirDetalle = (registroId) => {
    const detalle = construirDetalleRegistro(
      config,
      filtroActivo,
      registroId,
      registroDiaInicial,
    );
    navigate(
      construirRutaDetalle({
        metrica: config.key,
        filtro: filtroActivo,
        registro: registroId,
        modo: modoInicial,
        periodo: periodoInicial,
        periodoPadre: periodoPadreInicial,
        registroDia: registroDiaInicial,
      }),
      {
        state: {
          metricaNombre: config.nombre,
          detalle,
        },
      },
    );
  };

  const cambiarFiltro = (filtro) => {
    setFiltroActivo(filtro);
    navigate(
      construirRutaRegistros({
        metrica: config.key,
        filtro,
      }),
    );
  };

  const abrirItem = (item) => {
    if (tipoListado === "registrosDia") {
      abrirDetalle(item.id);
      return;
    }

    if (tipoListado === "diasAgrupados") {
      navigate(
        construirRutaRegistros({
          metrica: config.key,
          filtro: filtroActivo,
          modo: "registrosDia",
          periodo: item.fecha ?? item.periodo ?? item.principal,
          registroDia: item.id,
        }),
      );
      return;
    }

    if (modoInicial === "anio") {
      navigate(
        construirRutaRegistros({
          metrica: config.key,
          filtro: filtroActivo,
          modo: "mes",
          periodo: item.periodo ?? item.principal,
          periodoPadre: periodoInicial,
        }),
      );
      return;
    }

    if (filtroActivo === "Anio") {
      navigate(
        construirRutaRegistros({
          metrica: config.key,
          filtro: filtroActivo,
          modo: "anio",
          periodo: item.periodo ?? item.principal,
        }),
      );
      return;
    }

    if (filtroActivo === "Mes") {
      navigate(
        construirRutaRegistros({
          metrica: config.key,
          filtro: filtroActivo,
          modo: "mes",
          periodo: item.periodo ?? item.principal,
        }),
      );
      return;
    }

    navigate(
      construirRutaRegistros({
        metrica: config.key,
        filtro: filtroActivo,
        modo: "semana",
        periodo: item.periodo ?? item.principal,
      }),
    );
  };

  return (
    <div className={styles.pagina}>
      <h2 className={styles.tituloPagina}>Salud Física</h2>

      <section className={styles.panel}>
        <div className={styles.barraSuperior}>
          <div className={styles.breadcrumb}>
            <button
              type="button"
              className={styles.breadcrumbBoton}
              onClick={() => irADashboardMetrica(navigate, config.key)}
            >
              {config.nombre}
            </button>
            <span className={styles.breadcrumbSeparador}>
              <img src={chebron} alt="" aria-hidden="true" />
            </span>
            <button
              type="button"
              className={`${styles.breadcrumbBoton} ${styles.breadcrumbActivo}`}
              onClick={() =>
                navigate(
                  construirRutaRegistros({
                    metrica: config.key,
                    filtro: filtroActivo,
                  }),
                )
              }
            >
              Registros
            </button>
            {modoInicial === "registrosDia" ? (
              <>
                <span className={styles.breadcrumbSeparador}>
                  <img src={chebron} alt="" aria-hidden="true" />
                </span>
                <span className={styles.breadcrumbActivo}>
                  Registros del día
                </span>
              </>
            ) : null}
          </div>

          <button type="button" className={styles.botonDescargar}>
            <span>Descargar PDF</span>
            <img src={icoPDF} className={styles.botonPdf}></img>
          </button>
        </div>

        <div className={styles.contenido}>
          <aside className={styles.columnaLateral}>
            <ResumenGlucosa />
            <ResumenOxigenacion />
            <ResumenPresionArterial />
            <ResumenFrecuenciaCardiaca />
            {renderBloquesLaterales(config, "lista")}

            <div className={styles.tarjetaFiltros}>
              <div className={styles.filtrosHeader}>
                <img
                  src={icoFiltro}
                  className={styles.filtrosIcono}
                  alt=""
                  aria-hidden="true"
                />
                <span>Filtrar por:</span>
              </div>

              {config.filtros.map((filtro) => (
                <button
                  key={filtro}
                  type="button"
                  className={styles.filtroBoton}
                  onClick={() => cambiarFiltro(filtro)}
                >
                  <span className={styles.filtroIzquierda}>
                    <img
                      src={ICONOS_FILTRO[filtro]}
                      className={styles.filtroEmoji}
                      alt=""
                      aria-hidden="true"
                    />
                    <span>{filtro === "Anio" ? "Año" : filtro}</span>
                  </span>
                  <span
                    className={`${styles.radio} ${
                      filtroActivo === filtro ? styles.radioActivo : ""
                    }`}
                  />
                </button>
              ))}
            </div>
          </aside>

          <div className={styles.columnaPrincipal}>
            {tituloListado ? (
              <h3 className={styles.tituloPeriodo}>{tituloListado}</h3>
            ) : null}

            <div className={styles.listaRegistros}>
              {items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={styles.itemRegistro}
                  onClick={() => abrirItem(item)}
                >
                  {tipoListado === "periodos" ? (
                    <>
                      <div className={styles.itemPeriodo}>
                        <span className={styles.periodoTexto}>
                          {item.periodo ?? item.principal}
                        </span>
                      </div>

                      <div className={styles.itemDerecha}>
                        <span className={styles.flecha}>›</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className={styles.itemIzquierda}>
                        {tipoListado === "registrosDia" && item.acento ? (
                          <span
                            className={styles.acentoItem}
                            style={{ backgroundColor: item.acento }}
                          />
                        ) : null}
                        <div className={styles.textoItem}>
                          <span className={styles.principal}>
                            {item.principal}
                          </span>
                          {item.secundaria ? (
                            <span className={styles.secundaria}>
                              {item.secundaria}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className={styles.itemDerecha}>
                        <span>
                          {tipoListado === "registrosDia"
                            ? (item.hora ?? item.fecha ?? item.secundaria)
                            : (item.fecha ?? item.secundaria)}
                        </span>
                        <span className={styles.flecha}>›</span>
                      </div>
                    </>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const VistaDetalleRegistro = ({
  metrica,
  filtro,
  registroId,
  modo,
  periodo,
  periodoPadre,
  registroDia,
}) => {
  const navigate = useNavigate();
  const config = useMemo(() => obtenerConfigRegistros(metrica), [metrica]);
  const detalle = useMemo(
    () => construirDetalleRegistro(config, filtro, registroId, registroDia),
    [config, filtro, registroId, registroDia],
  );

  return (
    <div className={styles.pagina}>
      <h2 className={styles.tituloPagina}>Salud Física</h2>

      <section className={styles.panel}>
        <div className={styles.barraSuperior}>
          <div className={styles.breadcrumb}>
            <button
              type="button"
              className={styles.breadcrumbBoton}
              onClick={() => irADashboardMetrica(navigate, config.key)}
            >
              {config.nombre}
            </button>
            <span className={styles.breadcrumbSeparador}>
              <img src={chebron} alt="" aria-hidden="true" />
            </span>
            <button
              type="button"
              className={styles.breadcrumbBoton}
              onClick={() =>
                navigate(
                  construirRutaRegistros({
                    metrica: config.key,
                    filtro,
                  }),
                )
              }
            >
              Registros
            </button>
            <span className={styles.breadcrumbSeparador}>
              <img src={chebron} alt="" aria-hidden="true" />
            </span>
            <button
              type="button"
              className={styles.breadcrumbBoton}
              onClick={() =>
                navigate(
                  construirRutaRegistros({
                    metrica: config.key,
                    filtro,
                    modo: "registrosDia",
                    periodo,
                    periodoPadre,
                    registroDia,
                  }),
                )
              }
            >
              Registros del día
            </button>
            <span className={styles.breadcrumbSeparador}>
              <img src={chebron} alt="" aria-hidden="true" />
            </span>
            <span className={styles.breadcrumbActivo}>
              Detalles de registro
            </span>
          </div>

          <button type="button" className={styles.botonDescargar}>
            <span>Descargar PDF</span>
            <img src={icoPDF} className={styles.botonPdf}></img>
          </button>
        </div>

        <div className={styles.contenido}>
          <aside className={styles.columnaLateral}>
            {renderBloquesLaterales(config, "detalle")}
          </aside>

          <div className={styles.columnaPrincipal}>
            <div className={styles.tarjetaDetalle}>
              {detalle.campos.map((campo, index) =>
                campo.tipo === "texto" ? (
                  <div
                    key={`separador-${index}`}
                    className={styles.detalleFila}
                  />
                ) : (
                  <div
                    key={`${campo.etiqueta}-${index}`}
                    className={styles.detalleFila}
                  >
                    <p className={styles.detalleEtiqueta}>{campo.etiqueta}</p>
                    <div className={styles.detalleValorWrap}>
                      {campo.color ? (
                        <span
                          className={styles.detalleAcento}
                          style={{ backgroundColor: campo.color }}
                        />
                      ) : null}
                      <p className={styles.detalleValor}>{campo.valor}</p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

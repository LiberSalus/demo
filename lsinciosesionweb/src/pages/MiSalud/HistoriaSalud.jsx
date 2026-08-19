import React, { useState } from "react";
import styles from "./historiaSalud.module.css";

// Iconos SVG personalizados
const BASE = `${import.meta.env.BASE_URL}icons`;
const iconoHistoria = `${BASE}/iconoHistoriaClinica.svg`;
const iconoFamilia = `${BASE}/iconoFamilia.svg`;
const iconoPatologico = `${BASE}/iconoPatologico.svg`;
const iconoActual = `${BASE}/iconoActual.svg`;
const iconoPersona = `${BASE}/iconoPersona.svg`;
const iconoEnfermedad = `${BASE}/iconoEnfermedad.svg`;
const iconoPadecimiento = `${BASE}/iconoPadecimiento.svg`;
const iconoAgregar = `${BASE}/iconoAgregar.svg`;
const iconoEditar = `${BASE}/iconoEditar.svg`;
const iconoEliminar = `${BASE}/iconoEliminar.svg`;
const iconoGuardar = `${BASE}/iconoGuardar.svg`;

// Datos de ejemplo
const datosFamilia = [
  { id: 1, parentesco: "Padre", nombre: "Carlos", edad: 65, estado: "Vivo", enfermedades: "Hipertensión, Diabetes tipo 2" },
  { id: 2, parentesco: "Madre", nombre: "María", edad: 62, estado: "Viva", enfermedades: "Ninguna conocida" },
  { id: 3, parentesco: "Hermano", nombre: "Luis", edad: 28, estado: "Vivo", enfermedades: "Ninguna" },
];

const datosPatologicos = [
  { id: 1, enfermedad: "Diabetes tipo 2", desde: "2018", tratamiento: "Metformina 500mg", estado: "Controlada" },
  { id: 2, enfermedad: "Hipertensión arterial", desde: "2020", tratamiento: "Losartán 50mg", estado: "Controlada" },
  { id: 3, enfermedad: "Asma", desde: "2010", tratamiento: "Salbutamol spray", estado: "Estable" },
];

const datosActuales = [
  { id: 1, padecimiento: "Dolor de espalda baja", desde: "2 semanas", intensidad: 8, descripcion: "Dolor al levantar peso" },
  { id: 2, padecimiento: "Tos persistente", desde: "3 días", intensidad: 5, descripcion: "Tos seca, empeora por la noche" },
];

// ============ PROPUESTA 1: CARDS EXPANDIBLES ============
function Propuesta1Cards() {
  const [seccionAbierta, setSeccionAbierta] = useState("familia");
  const toggle = (s) => setSeccionAbierta(seccionAbierta === s ? null : s);

  return (
    <div className={styles.propuesta}>
      <div className={styles.metricas}>
        <div className={`${styles.metrica} ${styles.metricaFamilia}`}>
          <img src={iconoFamilia} alt="" className={styles.metricaIcono} />
          <span className={styles.metricaValor}>{datosFamilia.length}</span>
          <span className={styles.metricaLabel}>Familia</span>
        </div>
        <div className={`${styles.metrica} ${styles.metricaPatologico}`}>
          <img src={iconoPatologico} alt="" className={styles.metricaIcono} />
          <span className={styles.metricaValor}>{datosPatologicos.length}</span>
          <span className={styles.metricaLabel}>Patológicos</span>
        </div>
        <div className={`${styles.metrica} ${styles.metricaActual}`}>
          <img src={iconoActual} alt="" className={styles.metricaIcono} />
          <span className={styles.metricaValor}>{datosActuales.length}</span>
          <span className={styles.metricaLabel}>Actuales</span>
        </div>
      </div>

      {/* Familia */}
      <div className={`${styles.seccion} ${styles.seccionFamilia}`}>
        <button className={`${styles.seccionHeader} ${seccionAbierta === "familia" ? styles.seccionAbierta : ""}`} onClick={() => toggle("familia")}>
          <div className={styles.seccionHeaderLeft}>
            <img src={iconoFamilia} alt="" className={styles.seccionIcono} />
            <div>
              <h3 className={styles.seccionTitulo}>Antecedentes Heredofamiliares</h3>
              <p className={styles.seccionSubtitulo}>{datosFamilia.length} familiares registrados</p>
            </div>
          </div>
          <span className={`${styles.flecha} ${seccionAbierta === "familia" ? styles.flechaAbierta : ""}`}>▶</span>
        </button>
        {seccionAbierta === "familia" && (
          <div className={styles.seccionContenido}>
            <button className={styles.btnAgregar}>
              <img src={iconoAgregar} alt="" className={styles.btnAgregarIconoImg} />
              Agregar familiar
            </button>
            {datosFamilia.map((f) => (
              <div key={f.id} className={`${styles.cardItem} ${styles.cardFamilia}`}>
                <div className={styles.cardItemHeader}>
                  <div className={styles.cardItemInfo}>
                    <div className={styles.cardItemTitle}>
                      <img src={iconoPersona} alt="" className={styles.cardItemIcono} />
                      <span className={styles.cardItemParentesco}>{f.parentesco}</span>
                      <span className={styles.cardItemNombre}>{f.nombre}</span>
                    </div>
                  </div>
                  <div className={styles.cardItemBadges}>
                    <span className={styles.badge}>{f.edad} años</span>
                    <span className={`${styles.badge} ${f.estado === "Vivo" || f.estado === "Viva" ? styles.badgeVivo : styles.badgeFallecido}`}>{f.estado}</span>
                  </div>
                </div>
                <p className={styles.cardItemDetalle}>Enfermedades: {f.enfermedades}</p>
                <div className={styles.cardItemAcciones}>
                  <button className={styles.btnAccion}><img src={iconoEditar} alt="" className={styles.btnAccionIcono} /> Editar</button>
                  <button className={`${styles.btnAccion} ${styles.btnEliminar}`}><img src={iconoEliminar} alt="" className={styles.btnAccionIcono} /> Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Patológicos */}
      <div className={`${styles.seccion} ${styles.seccionPatologico}`}>
        <button className={`${styles.seccionHeader} ${seccionAbierta === "patologicos" ? styles.seccionAbierta : ""}`} onClick={() => toggle("patologicos")}>
          <div className={styles.seccionHeaderLeft}>
            <img src={iconoPatologico} alt="" className={styles.seccionIcono} />
            <div>
              <h3 className={styles.seccionTitulo}>Antecedentes Patológicos</h3>
              <p className={styles.seccionSubtitulo}>{datosPatologicos.length} antecedentes registrados</p>
            </div>
          </div>
          <span className={`${styles.flecha} ${seccionAbierta === "patologicos" ? styles.flechaAbierta : ""}`}>▶</span>
        </button>
        {seccionAbierta === "patologicos" && (
          <div className={styles.seccionContenido}>
            <button className={styles.btnAgregar}>
              <img src={iconoAgregar} alt="" className={styles.btnAgregarIconoImg} />
              Agregar antecedente
            </button>
            {datosPatologicos.map((p) => (
              <div key={p.id} className={`${styles.cardItem} ${styles.cardPatologico}`}>
                <div className={styles.cardItemHeader}>
                  <div className={styles.cardItemInfo}>
                    <div className={styles.cardItemTitle}>
                      <img src={iconoEnfermedad} alt="" className={styles.cardItemIcono} />
                      <span className={styles.cardItemParentesco}>{p.enfermedad}</span>
                    </div>
                    <span className={styles.cardItemDesde}>Desde: {p.desde}</span>
                  </div>
                  <span className={`${styles.badge} ${styles.badgeEstado}`}>{p.estado}</span>
                </div>
                <p className={styles.cardItemDetalle}>Tratamiento: {p.tratamiento}</p>
                <div className={styles.cardItemAcciones}>
                  <button className={styles.btnAccion}><img src={iconoEditar} alt="" className={styles.btnAccionIcono} /> Editar</button>
                  <button className={`${styles.btnAccion} ${styles.btnEliminar}`}><img src={iconoEliminar} alt="" className={styles.btnAccionIcono} /> Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actual */}
      <div className={`${styles.seccion} ${styles.seccionActual}`}>
        <button className={`${styles.seccionHeader} ${seccionAbierta === "actual" ? styles.seccionAbierta : ""}`} onClick={() => toggle("actual")}>
          <div className={styles.seccionHeaderLeft}>
            <img src={iconoActual} alt="" className={styles.seccionIcono} />
            <div>
              <h3 className={styles.seccionTitulo}>Padecimientos Actuales</h3>
              <p className={styles.seccionSubtitulo}>{datosActuales.length} padecimientos activos</p>
            </div>
          </div>
          <span className={`${styles.flecha} ${seccionAbierta === "actual" ? styles.flechaAbierta : ""}`}>▶</span>
        </button>
        {seccionAbierta === "actual" && (
          <div className={styles.seccionContenido}>
            <button className={styles.btnAgregar}>
              <img src={iconoAgregar} alt="" className={styles.btnAgregarIconoImg} />
              Agregar padecimiento
            </button>
            {datosActuales.map((a) => (
              <div key={a.id} className={`${styles.cardItem} ${styles.cardActual}`}>
                <div className={styles.cardItemHeader}>
                  <div className={styles.cardItemInfo}>
                    <div className={styles.cardItemTitle}>
                      <img src={iconoPadecimiento} alt="" className={styles.cardItemIcono} />
                      <span className={styles.cardItemParentesco}>{a.padecimiento}</span>
                    </div>
                    <span className={styles.cardItemDesde}>Desde: {a.desde}</span>
                  </div>
                </div>
                <div className={styles.intensidad}>
                  <span className={styles.intensidadLabel}>Intensidad:</span>
                  <div className={styles.intensidadBarra}>
                    <div className={styles.intensidadFill} style={{ width: `${a.intensidad * 10}%` }}></div>
                  </div>
                  <span className={styles.intensidadValor}>{a.intensidad}/10</span>
                </div>
                <p className={styles.cardItemDetalle}>{a.descripcion}</p>
                <div className={styles.cardItemAcciones}>
                  <button className={styles.btnAccion}><img src={iconoEditar} alt="" className={styles.btnAccionIcono} /> Editar</button>
                  <button className={`${styles.btnAccion} ${styles.btnEliminar}`}><img src={iconoEliminar} alt="" className={styles.btnAccionIcono} /> Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button className={styles.btnGuardar}><img src={iconoGuardar} alt="" className={styles.btnGuardarIcono} /> Guardar historia</button>
    </div>
  );
}

// ============ PROPUESTA 2: TABS HORIZONTALES ============
function Propuesta2Tabs() {
  const [tabActiva, setTabActiva] = useState("familia");

  return (
    <div className={styles.propuesta}>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tabActiva === "familia" ? styles.tabActiva : ""}`} onClick={() => setTabActiva("familia")}>
          <img src={iconoFamilia} alt="" className={styles.tabIcono} /> Familia ({datosFamilia.length})
        </button>
        <button className={`${styles.tab} ${tabActiva === "patologicos" ? styles.tabActiva : ""}`} onClick={() => setTabActiva("patologicos")}>
          <img src={iconoPatologico} alt="" className={styles.tabIcono} /> Patológicos ({datosPatologicos.length})
        </button>
        <button className={`${styles.tab} ${tabActiva === "actual" ? styles.tabActiva : ""}`} onClick={() => setTabActiva("actual")}>
          <img src={iconoActual} alt="" className={styles.tabIcono} /> Actuales ({datosActuales.length})
        </button>
      </div>

      <div className={styles.tabContenido}>
        {tabActiva === "familia" && (
          <div className={styles.tabPanel}>
            <button className={styles.btnAgregar}><img src={iconoAgregar} alt="" className={styles.btnAgregarIconoImg} /> Agregar familiar</button>
            <div className={styles.gridCards}>
              {datosFamilia.map((f) => (
                <div key={f.id} className={styles.cardTab}>
                  <img src={iconoPersona} alt="" className={styles.cardTabAvatar} />
                  <h4 className={styles.cardTabNombre}>{f.nombre}</h4>
                  <span className={styles.cardTabParentesco}>{f.parentesco}</span>
                  <div className={styles.cardTabInfo}>
                    <span>{f.edad} años</span>
                    <span className={`${f.estado === "Vivo" || f.estado === "Viva" ? styles.badgeVivo : styles.badgeFallecido}`}>{f.estado}</span>
                  </div>
                  <div className={styles.cardTabDivider}></div>
                  <p className={styles.cardTabEnfermedades}>{f.enfermedades}</p>
                  <div className={styles.cardItemAcciones}>
                    <button className={styles.btnAccion}><img src={iconoEditar} alt="" className={styles.btnAccionIcono} /></button>
                    <button className={`${styles.btnAccion} ${styles.btnEliminar}`}><img src={iconoEliminar} alt="" className={styles.btnAccionIcono} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tabActiva === "patologicos" && (
          <div className={styles.tabPanel}>
            <button className={styles.btnAgregar}><img src={iconoAgregar} alt="" className={styles.btnAgregarIconoImg} /> Agregar antecedente</button>
            <div className={styles.gridCards}>
              {datosPatologicos.map((p) => (
                <div key={p.id} className={styles.cardTab}>
                  <img src={iconoEnfermedad} alt="" className={styles.cardTabAvatar} />
                  <h4 className={styles.cardTabNombre}>{p.enfermedad}</h4>
                  <span className={styles.cardTabDesde}>Desde: {p.desde}</span>
                  <div className={styles.cardTabInfo}>
                    <span className={`${styles.badge} ${styles.badgeEstado}`}>{p.estado}</span>
                  </div>
                  <div className={styles.cardTabDivider}></div>
                  <p className={styles.cardTabEnfermedades}>{p.tratamiento}</p>
                  <div className={styles.cardItemAcciones}>
                    <button className={styles.btnAccion}><img src={iconoEditar} alt="" className={styles.btnAccionIcono} /></button>
                    <button className={`${styles.btnAccion} ${styles.btnEliminar}`}><img src={iconoEliminar} alt="" className={styles.btnAccionIcono} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tabActiva === "actual" && (
          <div className={styles.tabPanel}>
            <button className={styles.btnAgregar}><img src={iconoAgregar} alt="" className={styles.btnAgregarIconoImg} /> Agregar padecimiento</button>
            <div className={styles.gridCards}>
              {datosActuales.map((a) => (
                <div key={a.id} className={styles.cardTab}>
                  <img src={iconoPadecimiento} alt="" className={styles.cardTabAvatar} />
                  <h4 className={styles.cardTabNombre}>{a.padecimiento}</h4>
                  <span className={styles.cardTabDesde}>Desde: {a.desde}</span>
                  <div className={styles.intensidad}>
                    <div className={styles.intensidadBarra}>
                      <div className={styles.intensidadFill} style={{ width: `${a.intensidad * 10}%` }}></div>
                    </div>
                    <span className={styles.intensidadValor}>{a.intensidad}/10</span>
                  </div>
                  <div className={styles.cardTabDivider}></div>
                  <p className={styles.cardTabEnfermedades}>{a.descripcion}</p>
                  <div className={styles.cardItemAcciones}>
                    <button className={styles.btnAccion}><img src={iconoEditar} alt="" className={styles.btnAccionIcono} /></button>
                    <button className={`${styles.btnAccion} ${styles.btnEliminar}`}><img src={iconoEliminar} alt="" className={styles.btnAccionIcono} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button className={styles.btnGuardar}><img src={iconoGuardar} alt="" className={styles.btnGuardarIcono} /> Guardar historia</button>
    </div>
  );
}

// ============ PROPUESTA 3: TIMELINE VERTICAL ============
function Propuesta3Timeline() {
  return (
    <div className={styles.propuesta}>
      <div className={styles.timeline}>
        {/* Familia */}
        <div className={styles.timelineNodo}>
          <div className={`${styles.timelineDot} ${styles.dotFamilia}`}></div>
          <div className={styles.timelineLinea}></div>
          <div className={styles.timelineContenido}>
            <div className={styles.timelineHeader}>
              <img src={iconoFamilia} alt="" className={styles.timelineIcono} />
              <div>
                <h3 className={styles.timelineTitulo}>Antecedentes Heredofamiliares</h3>
                <p className={styles.timelineSubtitulo}>{datosFamilia.length} familiares</p>
              </div>
            </div>
            <button className={styles.btnAgregarSmall}><img src={iconoAgregar} alt="" className={styles.btnAgregarSmallIcono} /> Agregar</button>
            {datosFamilia.map((f) => (
              <div key={f.id} className={`${styles.cardTimeline} ${styles.cardFamilia}`}>
                <div className={styles.cardItemHeader}>
                  <div className={styles.cardItemInfo}>
                    <div className={styles.cardItemTitle}>
                      <img src={iconoPersona} alt="" className={styles.cardItemIcono} />
                      <span className={styles.cardItemParentesco}>{f.nombre}</span>
                    </div>
                    <span className={styles.cardItemDesde}>{f.parentesco} • {f.edad} años</span>
                  </div>
                  <span className={`${f.estado === "Vivo" || f.estado === "Viva" ? styles.badgeVivo : styles.badgeFallecido}`}>{f.estado}</span>
                </div>
                <p className={styles.cardItemDetalle}>{f.enfermedades}</p>
                <div className={styles.cardItemAcciones}>
                  <button className={styles.btnAccion}><img src={iconoEditar} alt="" className={styles.btnAccionIcono} /> Editar</button>
                  <button className={`${styles.btnAccion} ${styles.btnEliminar}`}><img src={iconoEliminar} alt="" className={styles.btnAccionIcono} /> Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patológicos */}
        <div className={styles.timelineNodo}>
          <div className={`${styles.timelineDot} ${styles.dotPatologico}`}></div>
          <div className={styles.timelineLinea}></div>
          <div className={styles.timelineContenido}>
            <div className={styles.timelineHeader}>
              <img src={iconoPatologico} alt="" className={styles.timelineIcono} />
              <div>
                <h3 className={styles.timelineTitulo}>Antecedentes Patológicos</h3>
                <p className={styles.timelineSubtitulo}>{datosPatologicos.length} antecedentes</p>
              </div>
            </div>
            <button className={styles.btnAgregarSmall}><img src={iconoAgregar} alt="" className={styles.btnAgregarSmallIcono} /> Agregar</button>
            {datosPatologicos.map((p) => (
              <div key={p.id} className={`${styles.cardTimeline} ${styles.cardPatologico}`}>
                <div className={styles.cardItemHeader}>
                  <div className={styles.cardItemInfo}>
                    <div className={styles.cardItemTitle}>
                      <img src={iconoEnfermedad} alt="" className={styles.cardItemIcono} />
                      <span className={styles.cardItemParentesco}>{p.enfermedad}</span>
                    </div>
                    <span className={styles.cardItemDesde}>Desde: {p.desde}</span>
                  </div>
                  <span className={`${styles.badge} ${styles.badgeEstado}`}>{p.estado}</span>
                </div>
                <p className={styles.cardItemDetalle}>{p.tratamiento}</p>
                <div className={styles.cardItemAcciones}>
                  <button className={styles.btnAccion}><img src={iconoEditar} alt="" className={styles.btnAccionIcono} /> Editar</button>
                  <button className={`${styles.btnAccion} ${styles.btnEliminar}`}><img src={iconoEliminar} alt="" className={styles.btnAccionIcono} /> Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actual */}
        <div className={styles.timelineNodo}>
          <div className={`${styles.timelineDot} ${styles.dotActual}`}></div>
          <div className={styles.timelineContenido}>
            <div className={styles.timelineHeader}>
              <img src={iconoActual} alt="" className={styles.timelineIcono} />
              <div>
                <h3 className={styles.timelineTitulo}>Padecimientos Actuales</h3>
                <p className={styles.timelineSubtitulo}>{datosActuales.length} activos</p>
              </div>
            </div>
            <button className={styles.btnAgregarSmall}><img src={iconoAgregar} alt="" className={styles.btnAgregarSmallIcono} /> Agregar</button>
            {datosActuales.map((a) => (
              <div key={a.id} className={`${styles.cardTimeline} ${styles.cardActual}`}>
                <div className={styles.cardItemHeader}>
                  <div className={styles.cardItemInfo}>
                    <div className={styles.cardItemTitle}>
                      <img src={iconoPadecimiento} alt="" className={styles.cardItemIcono} />
                      <span className={styles.cardItemParentesco}>{a.padecimiento}</span>
                    </div>
                    <span className={styles.cardItemDesde}>Desde: {a.desde}</span>
                  </div>
                </div>
                <div className={styles.intensidad}>
                  <div className={styles.intensidadBarra}>
                    <div className={styles.intensidadFill} style={{ width: `${a.intensidad * 10}%` }}></div>
                  </div>
                  <span className={styles.intensidadValor}>{a.intensidad}/10</span>
                </div>
                <p className={styles.cardItemDetalle}>{a.descripcion}</p>
                <div className={styles.cardItemAcciones}>
                  <button className={styles.btnAccion}><img src={iconoEditar} alt="" className={styles.btnAccionIcono} /> Editar</button>
                  <button className={`${styles.btnAccion} ${styles.btnEliminar}`}><img src={iconoEliminar} alt="" className={styles.btnAccionIcono} /> Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button className={styles.btnGuardar}><img src={iconoGuardar} alt="" className={styles.btnGuardarIcono} /> Guardar historia</button>
    </div>
  );
}

// ============ COMPONENTE PRINCIPAL ============
export default function HistoriaSalud() {
  const [propuestaActiva, setPropuestaActiva] = useState(1);

  return (
    <div className={styles.wrap}>
      <div className={styles.selectorFlotante}>
        <span className={styles.selectorLabel}>Ver propuesta:</span>
        <div className={styles.selectorBotones}>
          <button className={`${styles.selectorBtn} ${propuestaActiva === 1 ? styles.selectorBtnActivo : ""}`} onClick={() => setPropuestaActiva(1)}>1. Cards</button>
          <button className={`${styles.selectorBtn} ${propuestaActiva === 2 ? styles.selectorBtnActivo : ""}`} onClick={() => setPropuestaActiva(2)}>2. Tabs</button>
          <button className={`${styles.selectorBtn} ${propuestaActiva === 3 ? styles.selectorBtnActivo : ""}`} onClick={() => setPropuestaActiva(3)}>3. Timeline</button>
        </div>
      </div>

      <header className={styles.hero}>
        <img src={iconoHistoria} alt="" className={styles.heroIcono} />
        <div className={styles.heroInfo}>
          <h1 className={styles.heroTitulo}>Mi Historia Clínica</h1>
          <p className={styles.heroDescripcion}>Tu historia nos ayuda a brindarte mejor atención</p>
        </div>
      </header>

      {propuestaActiva === 1 && <Propuesta1Cards />}
      {propuestaActiva === 2 && <Propuesta2Tabs />}
      {propuestaActiva === 3 && <Propuesta3Timeline />}
    </div>
  );
}

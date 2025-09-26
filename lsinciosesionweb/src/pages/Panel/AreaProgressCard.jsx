import React from "react";
import styles from "./AreaProgressCard.module.css";
import { Link } from "react-router-dom";

export default function AreaProgressCard({ areaId, title, percent }) {
  return (
    <div className={styles.card}>
      <div>
        <h4 className={styles.title}>{title}</h4>
        <div className={styles.bar}><div className={styles.fill} style={{width:`${percent}%`}}/></div>
        <p className={styles.meta}>{percent}% completado</p>
      </div>
      <Link to={`/cuestionarios/${areaId}`} className={styles.cta}>Ver área</Link>
    </div>
  );
}

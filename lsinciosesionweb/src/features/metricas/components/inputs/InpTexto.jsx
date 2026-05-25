// InpTexto.jsx
import React from "react";
import styles from "./inputs.module.css";

const InpTexto = ({ placeholder = "Entrada de texto", className, ...props }) => (
  <input
    type="text"
    placeholder={placeholder}
    className={`${styles.InTexto} ${className || ""}`}
    {...props}
  />
);

export default InpTexto;

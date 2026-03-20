import React from "react";
import styles from "./Footer.module.css";
import logoHero from "./LogoHero.svg";

import icoInstagram from "./icoInstagram.svg";
import icoFacebook from "./icoFacebook.svg";
import icoLinkedIn from "./icoLinkedIn.svg";

const Footer = () => {
  return (
    <div className={styles.Footer}>
      <div className={styles.cntContacto}>
        <img src={logoHero} alt="Liber Salus" />
        <div className={styles.contacto}>
          <p>Contacto</p>
          <p>55-2345-6789</p>
          <p>info@libersalus.com</p>
        </div>
      </div>
      <div className={styles.cntEnlaces}>
        <div className={styles.enlacesItem}>
          <a className={styles.enlaceitem}>Concentimiento informado</a>
          <a className={styles.enlaceitem}>
            Descargo de responsabilidad médica
          </a>
          <a className={styles.enlaceitem}>Términos comerciales</a>
          <a className={styles.enlaceitem}>
            Cumplimiento normativo y certificaciones
          </a>
        </div>
        <div className={styles.redes}>
          <a target="_blank" rel="noreferrer" href="https://instagram.libersalus.com" className={styles.redesItem}>
            <img src={icoInstagram} alt="Instagram" />
          </a>
          <a target="_blank" rel="noreferrer" href="https://linkedin.libersalus.com/" className={styles.redesItem}>
            <img src={icoLinkedIn} alt="LinkedIn" />
          </a>
          <a target="_blank" rel="noreferrer" href="https://facebook.com/share/19zobzQLZK" className={styles.redesItem}>
            <img src={icoFacebook} alt="Facebook" />
          </a>
        </div>
      </div>
      <div className={styles.pie}>
        <p>
          © 2025 Liber Salus. Este sitio está protegido por derechos de autor.
        </p>
        <p>Todos los derechos reservados.</p>
        <p>
          Consulta las <a>Políticas de Privacidad</a> y{" "}
          <a>Condiciones de Uso</a>.
        </p>
      </div>
    </div>
  );
};

export default Footer;

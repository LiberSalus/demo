import React, { useEffect, useRef, useState } from 'react'
import styles from './Header.module.css'
import logoHero from './LogoHero.svg'
import menu from './icoMenu.svg'
import ayuda from './icoAyuda.svg'
import campana from './campana.svg'
import usuario from './Usuario.png'
import TarjetaLataral from './TarjetaLateral/TarjetaLateral'
import Menu from './menu/Menu'

const Header = ({ estados = ["e1"] }) => {
  const TRANSITION_MS = 280
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [fotoPerfil, setFotoPerfil] = useState(usuario)
  const triggerButtonRef = useRef(null)
  const panelRef = useRef(null)

  const openPanel = () => {
    setIsMounted(true)
    requestAnimationFrame(() => setIsOpen(true))
  }

  const closePanel = () => {
    setIsOpen(false)
  }

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  useEffect(() => {
    if (isOpen || !isMounted) return
    const timer = setTimeout(() => setIsMounted(false), TRANSITION_MS)
    return () => clearTimeout(timer)
  }, [isOpen, isMounted])

  useEffect(() => {
    if (!isMounted) return

    const previousOverflow = document.body.style.overflow
    const previousPaddingRight = document.body.style.paddingRight
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }

    const onKeyDown = (event) => {
      if (event.defaultPrevented) return

      if (event.key === 'Escape') {
        closePanel()
        return
      }

      if (!isOpen || event.key !== 'Tab') return

      const panelElement = panelRef.current
      if (!panelElement) return

      const focusableElements = panelElement.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )

      if (focusableElements.length === 0) {
        event.preventDefault()
        panelElement.focus()
        return
      }

      const firstFocusable = focusableElements[0]
      const lastFocusable = focusableElements[focusableElements.length - 1]
      const activeElement = document.activeElement

      if (event.shiftKey && activeElement === firstFocusable) {
        event.preventDefault()
        lastFocusable.focus()
      } else if (!event.shiftKey && activeElement === lastFocusable) {
        event.preventDefault()
        firstFocusable.focus()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      document.body.style.paddingRight = previousPaddingRight
    }
  }, [isMounted, isOpen])

  useEffect(() => {
    if (!isMounted) return

    if (isOpen) {
      panelRef.current?.focus()
      return
    }

    triggerButtonRef.current?.focus()
  }, [isOpen, isMounted])

  return (
    <div className={styles.Header}>
      <Menu isOpen={isMenuOpen} onClose={closeMenu} mobileOnly />
      <img className={styles.logoLiber} src={logoHero} alt="Liber Salus" />
      <button type="button" className={styles.botonMenu} onClick={toggleMenu} aria-label="Abrir menú principal">
        <img className={styles.icoMenu} src={menu} alt="Menú" />
      </button>
      <div className={styles.cntBotonPerfil}>
        <button className={styles.boton}><img src={ayuda} alt="Ayuda" /></button>
        <button type="button" className={styles.boton}>
          <span className={styles.alerta}></span>
          <img src={campana} alt="Alertas" />
        </button>
        <button
          ref={triggerButtonRef}
          type="button"
          className={styles.boton}
          onClick={openPanel}
          aria-label="Abrir perfil"
        >
          <img src={fotoPerfil} alt="Foto de usuario" />
        </button>
      </div>
      {isMounted && (
        <div
          className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
          onClick={closePanel}
        >
          <div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Panel de perfil"
            className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <TarjetaLataral 
            estados={estados}
            onClose={closePanel}
            fotoPerfil={fotoPerfil}
            onGuardarFoto={setFotoPerfil}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Header

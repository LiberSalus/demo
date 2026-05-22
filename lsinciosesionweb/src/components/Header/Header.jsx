import React, { useCallback, useEffect, useRef, useState } from 'react'
import styles from './Header.module.css'
import logoHero from './LogoHero.svg'
import menu from './icoMenu.svg'
import ayuda from './icoAyuda.svg'
import campana from './campana.svg'
import usuario from '@/shared/assets/images/perfil/usuario-default.png'
import TarjetaLataral from './TarjetaLateral/TarjetaLateral'
import Menu from './menu/Menu'
import icoMedicamento from '@/pages/Inicio/Calendario/icoMedicamento.svg'
import icoMedico from '@/pages/Inicio/Calendario/icoMedico.svg'
import icoEnLinea from '@/pages/Inicio/Calendario/icoEnLinea.svg'
import { cerrarSesion } from '@/services/auth'
import { getLoginUrl } from '@/services/env'
import { obtenerFotoPerfil, subirFotoPerfil } from '@/services/perfil'

const Header = ({ estados = ["e2"], sesion = null }) => {
  const TRANSITION_MS = 280
  const BELL_SHAKE_MS = 1800
  const BELL_REPEAT_MS = 30000
  const BELL_SECOND_SHAKE_DELAY_MS = 2000
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [fotoPerfil, setFotoPerfil] = useState(usuario)
  const [hasPendingAlert, setHasPendingAlert] = useState(false)
  const [isBellShaking, setIsBellShaking] = useState(false)
  const [bellAnimationTick, setBellAnimationTick] = useState(0)
  const [isAlertsOpen, setIsAlertsOpen] = useState(false)
  const [alertItems, setAlertItems] = useState([])
  const triggerButtonRef = useRef(null)
  const panelRef = useRef(null)
  const bellButtonRef = useRef(null)
  const alertsPopoverRef = useRef(null)
  const bellTimerRef = useRef(null)
  const bellRepeatIntervalRef = useRef(null)
  const bellSecondShakeTimerRef = useRef(null)
  const fotoPerfilObjectUrlRef = useRef(null)

  const resolveAlertIcon = (item) => {
    if (item.type === "medicamento") return icoMedicamento
    if (item.citaTipo === "en_linea") return icoEnLinea
    return icoMedico
  }

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

  const handleLogout = async () => {
    try { await cerrarSesion() } catch {
      // El cierre local/redireccion debe continuar aunque el endpoint falle.
    }
    finally {
      window.location.assign(getLoginUrl())
    }
  }

  const actualizarFotoPerfil = useCallback((foto) => {
    if (!foto) return

    if (fotoPerfilObjectUrlRef.current) {
      URL.revokeObjectURL(fotoPerfilObjectUrlRef.current)
      fotoPerfilObjectUrlRef.current = null
    }

    if (foto instanceof Blob) {
      const objectUrl = URL.createObjectURL(foto)
      fotoPerfilObjectUrlRef.current = objectUrl
      setFotoPerfil(objectUrl)
      return
    }

    if (typeof foto === "string") {
      setFotoPerfil(foto)
      return
    }

    const url = foto.url || foto.foto_url || foto.photo_url || foto.path || foto.data
    if (typeof url === "string" && url) setFotoPerfil(url)
  }, [])

  const handleGuardarFotoPerfil = useCallback(async (fotoRecortada) => {
    await subirFotoPerfil(fotoRecortada)
    actualizarFotoPerfil(fotoRecortada)
  }, [actualizarFotoPerfil])

  const stopBellFeedback = () => {
    setHasPendingAlert(false)
    setIsBellShaking(false)

    if (bellTimerRef.current) {
      clearTimeout(bellTimerRef.current)
      bellTimerRef.current = null
    }

    if (bellSecondShakeTimerRef.current) {
      clearTimeout(bellSecondShakeTimerRef.current)
      bellSecondShakeTimerRef.current = null
    }

    if (bellRepeatIntervalRef.current) {
      clearInterval(bellRepeatIntervalRef.current)
      bellRepeatIntervalRef.current = null
    }
  }

  const toggleAlerts = () => {
    setIsAlertsOpen((prev) => {
      const next = !prev
      if (next) {
        stopBellFeedback()
      }
      return next
    })
  }

  const triggerBellShake = () => {
    setBellAnimationTick((prev) => prev + 1)
    setIsBellShaking(true)

    if (bellTimerRef.current) {
      clearTimeout(bellTimerRef.current)
    }

    bellTimerRef.current = setTimeout(() => {
      setIsBellShaking(false)
      bellTimerRef.current = null
    }, BELL_SHAKE_MS)
  }

  const startBellAlertCycle = () => {
    if (bellSecondShakeTimerRef.current) {
      clearTimeout(bellSecondShakeTimerRef.current)
      bellSecondShakeTimerRef.current = null
    }

    if (bellRepeatIntervalRef.current) {
      clearInterval(bellRepeatIntervalRef.current)
      bellRepeatIntervalRef.current = null
    }

    const runCycle = () => {
      triggerBellShake()

      bellSecondShakeTimerRef.current = setTimeout(() => {
        triggerBellShake()
        bellSecondShakeTimerRef.current = null
      }, BELL_SECOND_SHAKE_DELAY_MS)
    }

    runCycle()
    bellRepeatIntervalRef.current = setInterval(runCycle, BELL_REPEAT_MS)
  }

  useEffect(() => {
    if (isOpen || !isMounted) return
    const timer = setTimeout(() => setIsMounted(false), TRANSITION_MS)
    return () => clearTimeout(timer)
  }, [isOpen, isMounted])

  useEffect(() => {
    return () => {
      if (bellTimerRef.current) {
        clearTimeout(bellTimerRef.current)
      }
      if (bellSecondShakeTimerRef.current) {
        clearTimeout(bellSecondShakeTimerRef.current)
      }
      if (bellRepeatIntervalRef.current) {
        clearInterval(bellRepeatIntervalRef.current)
      }
      if (fotoPerfilObjectUrlRef.current) {
        URL.revokeObjectURL(fotoPerfilObjectUrlRef.current)
      }
    }
  }, [])

  useEffect(() => {
    let cancelado = false

    obtenerFotoPerfil("original")
      .then((foto) => {
        if (!cancelado) actualizarFotoPerfil(foto)
      })
      .catch(() => {
        // Si el usuario aun no tiene foto, conservamos la imagen por defecto.
      })

    return () => {
      cancelado = true
    }
  }, [actualizarFotoPerfil])

  useEffect(() => {
    const onCalendarAlert = () => {
      setHasPendingAlert(true)
      startBellAlertCycle()
    }

    const onCalendarAlertDetailed = (event) => {
      const detail = event?.detail || {}
      const item = {
        id: `${detail.type ?? "alerta"}-${detail.at ?? Date.now()}`,
        type: detail.type ?? "alerta",
        citaTipo: detail.citaTipo ?? "presencial",
        title: detail.title ?? "Alerta",
        timeLabel: detail.timeLabel ?? "",
      }

      setAlertItems((prev) => [item, ...prev].slice(0, 6))
      onCalendarAlert()
    }

    window.addEventListener("calendar_alert_triggered", onCalendarAlertDetailed)
    const onPointerDown = (event) => {
      if (!isAlertsOpen) return

      const bellElement = bellButtonRef.current
      const popoverElement = alertsPopoverRef.current
      const target = event.target

      if (bellElement?.contains(target) || popoverElement?.contains(target)) return
      setIsAlertsOpen(false)
    }

    window.addEventListener("pointerdown", onPointerDown)

    return () => {
      window.removeEventListener("calendar_alert_triggered", onCalendarAlertDetailed)
      window.removeEventListener("pointerdown", onPointerDown)
    }
  }, [isAlertsOpen])

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
        <button
          ref={bellButtonRef}
          type="button"
          className={`${styles.boton} ${isBellShaking ? styles.botonCampanaActiva : ""}`}
          onClick={toggleAlerts}
          aria-label={hasPendingAlert ? "Tienes alertas pendientes" : "Alertas"}
          aria-expanded={isAlertsOpen}
          aria-haspopup="dialog"
        >
          {hasPendingAlert && <span className={styles.alerta}></span>}
                      <img key={bellAnimationTick} src={campana} alt="Alertas" />
        </button>
        {isAlertsOpen && (
          <div
            ref={alertsPopoverRef}
            className={styles.alertsPopover}
            role="dialog"
            aria-label="Alertas recientes"
          >
            {alertItems.length === 0 ? (
              <p className={styles.alertsEmpty}>No hay alertas recientes.</p>
            ) : (
              alertItems.map((item) => (
                <div key={item.id} className={styles.alertItem}>
                  <div className={styles.alertItemHeader}>
                    <span className={styles.alertTime}>{item.timeLabel}</span>
                    <span className={styles.alertIcon} aria-hidden="true">
                      <img src={resolveAlertIcon(item)} alt="" />
                    </span>
                  </div>
                  <p className={styles.alertTitle}>{item.title}</p>
                </div>
              ))
            )}
          </div>
        )}
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
            sesion={sesion}
            onClose={closePanel}
            fotoPerfil={fotoPerfil}
            onGuardarFoto={handleGuardarFotoPerfil}
            onLogout={handleLogout}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default Header

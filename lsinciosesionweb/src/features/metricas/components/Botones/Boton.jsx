import React from 'react'
import styles from './Boton.module.css'
import Loader from './Loader'


const Boton = ({
  children,
  variant = 'primario',
  icono: Icon,
  isLoading = false,
  forma = 'redondo',
  className = '',
  ...props
}) => {

  const classNames = [
    styles.btn,
    styles[variant],
    styles[forma],
    isLoading ? styles.loading : '',
    className,
  ].filter(Boolean).join(' ');


  return (
    <button 	
    	className={classNames}
      disabled={isLoading}
      {...props}
      >
      {isLoading ? (
        <>
        {<Loader />}
        {children}
        </>
      ) : (
        <>
          {/* Si Icon es un string (ruta), usamos <img>. Si es componente, <Icon /> */}
          {Icon && (
            typeof Icon === 'string' 
              ? <img src={Icon} className={styles.icon} alt="" />
              : <Icon className={styles.icon} />
          )}
          <span>{children}</span>
        </>
      )}
    </button>
  )
}

export default Boton

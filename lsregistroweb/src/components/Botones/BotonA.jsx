// src/components/Botones/BotonA.jsx
import React, { forwardRef } from 'react';
import clsx from 'clsx';
import styles from './botonA.module.css';

const BotonA = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled: propDisabled = false,
      className,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const disabled = loading || propDisabled;

    return (
      <button
        ref={ref}
        type={type}
        className={clsx(
          styles.boton,
          styles[variant],
          styles[size],
          disabled && styles.disabled,
          loading && styles.loading,   // 👈 activa el spinner
          className
        )}
        disabled={disabled}
        aria-disabled={disabled || undefined}
        aria-busy={loading || undefined}
        {...rest}
      >
        {children}
      </button>
    );
  }
);

BotonA.displayName = 'BotonA';
export default BotonA;

// Select visual reutilizable con apertura arriba/abajo y animación suave.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Box, ClickAwayListener, Typography } from "@mui/material";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

const TRIGGER_HEIGHT = "2.35rem";

const baseTriggerSx = {
  minHeight: TRIGGER_HEIGHT,
  border: "1px solid #ACCCEB",
  borderRadius: "999px",
  backgroundColor: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 1,
  px: 1.1,
  position: "relative",
  zIndex: 2,
  cursor: "pointer",
  userSelect: "none",
  outline: "none",
  transition: "border-color 160ms ease, box-shadow 160ms ease",
};

const basePanelSx = {
  position: "absolute",
  marginTop: "1rem",
  marginBottom:"1rem",
  left: 0,
  right: 0,
  border: "1px solid #ACCCEB",
  backgroundColor: "#fff",
  boxShadow: "0px 10px 26px rgba(15, 23, 42, 0.08)",
  overflow: "hidden",
  zIndex: 1,
  animationDuration: "180ms",
  animationTimingFunction: "ease",
  animationFillMode: "forwards",
};

const listSx = {
  maxHeight: "15rem",
  overflowY: "auto",
  overflowX: "hidden",
  
};

const optionSx = {
  px: 1.1,
  py: 1.1,
  color: "#334155",
  fontSize: "0.95rem",
  lineHeight: 1.2,
  cursor: "pointer",
  backgroundColor: "#fff",
  "&:hover": {
    backgroundColor: "#EFF6FF",
  },
};

function normalizeOption(option) {
  if (typeof option === "string") {
    return { value: option, label: option };
  }
  return option;
}

const AdaptiveSelect = ({
  value,
  placeholder,
  options,
  onChange,
  isMobile = false,
  openDirection: forcedDirection,
  className,
}) => {
  const rootRef = useRef(null);
  const optionRefs = useRef({});
  const [open, setOpen] = useState(false);
  const [direction, setDirection] = useState("down");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const normalizedOptions = useMemo(
    () => options.map((option) => normalizeOption(option)),
    [options],
  );
  const listboxId = useMemo(
    () => `adaptive-select-${Math.random().toString(36).slice(2)}`,
    [],
  );

  const displayLabel =
    normalizedOptions.find((option) => option.value === value)?.label || "";

  const getFirstEnabledIndex = () =>
    normalizedOptions.findIndex((option) => !option.disabled);

  const getSelectedEnabledIndex = () =>
    normalizedOptions.findIndex(
      (option) => option.value === value && !option.disabled,
    );

  const getNextEnabledIndex = (currentIndex, step) => {
    if (!normalizedOptions.length) return -1;
    let nextIndex = currentIndex;
    for (let i = 0; i < normalizedOptions.length; i += 1) {
      nextIndex = (nextIndex + step + normalizedOptions.length) % normalizedOptions.length;
      if (!normalizedOptions[nextIndex]?.disabled) {
        return nextIndex;
      }
    }
    return -1;
  };

  const resolveDirection = () => {
    if (forcedDirection) return forcedDirection;
    if (!isMobile || !rootRef.current || typeof window === "undefined") return "down";
    const rect = rootRef.current.getBoundingClientRect();
    return rect.top + rect.height / 2 > window.innerHeight * 0.5 ? "up" : "down";
  };

  const handleToggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    setDirection(resolveDirection());
    setHighlightedIndex(
      getSelectedEnabledIndex() >= 0 ? getSelectedEnabledIndex() : getFirstEnabledIndex(),
    );
    setOpen(true);
  };

  const handleSelect = (nextValue) => {
    onChange(nextValue);
    setOpen(false);
  };

  const handleTriggerKeyDown = (event) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) {
          setDirection(resolveDirection());
          setHighlightedIndex(
            getSelectedEnabledIndex() >= 0 ? getSelectedEnabledIndex() : getFirstEnabledIndex(),
          );
          setOpen(true);
          return;
        }
        setHighlightedIndex((current) =>
          getNextEnabledIndex(current >= 0 ? current : getFirstEnabledIndex(), 1),
        );
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) {
          setDirection(resolveDirection());
          setHighlightedIndex(
            getSelectedEnabledIndex() >= 0 ? getSelectedEnabledIndex() : getFirstEnabledIndex(),
          );
          setOpen(true);
          return;
        }
        setHighlightedIndex((current) =>
          getNextEnabledIndex(current >= 0 ? current : getFirstEnabledIndex(), -1),
        );
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (!open) {
          handleToggle();
          return;
        }
        if (highlightedIndex >= 0 && !normalizedOptions[highlightedIndex]?.disabled) {
          handleSelect(normalizedOptions[highlightedIndex].value);
        }
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (!open || highlightedIndex < 0) return;
    optionRefs.current[highlightedIndex]?.scrollIntoView({
      block: "nearest",
    });
  }, [highlightedIndex, open]);

  const openUp = direction === "up";

  return (
    <ClickAwayListener
      onClickAway={() => {
        setOpen(false);
        setHighlightedIndex(-1);
      }}
    >
      <Box ref={rootRef} sx={{ position: "relative", width: "100%", zIndex: open ? 20 : 3 }}>
        {open && (
          <Box
            id={listboxId}
            role="listbox"
            sx={{
              ...basePanelSx,
              top: openUp ? "auto" : 0,
              bottom: openUp ? 0 : "auto",
              pt: openUp ? 0 : TRIGGER_HEIGHT,
              pb: openUp ? TRIGGER_HEIGHT : 0,
              borderTop: openUp ? "2px solid #ACCCEB" : "none",
              borderBottom: openUp ? "none" : "2px solid #ACCCEB",
              borderRadius: openUp ? "1rem 1rem 0 0" : "0 0 1rem 1rem",
              borderTopLeftRadius: openUp ? "1rem" : 0,
              borderTopRightRadius: openUp ? "1rem" : 0,
              borderBottomLeftRadius: openUp ? 0 : "1rem",
              borderBottomRightRadius: openUp ? 0 : "1rem",
              transformOrigin: openUp ? "bottom center" : "top center",
              animation: openUp
                ? "adaptiveSelectUp 180ms ease forwards"
                : "adaptiveSelectDown 180ms ease forwards",
              "@keyframes adaptiveSelectDown": {
                from: {
                  opacity: 0,
                  transform: "translateY(-10px) scaleY(0.96)",
                },
                to: {
                  opacity: 1,
                  transform: "translateY(0) scaleY(1)",
                },
              },
              "@keyframes adaptiveSelectUp": {
                from: {
                  opacity: 0,
                  transform: "translateY(10px) scaleY(0.96)",
                },
                to: {
                  opacity: 1,
                  transform: "translateY(0) scaleY(1)",
                },
              },
            }}
          >
            <Box sx={listSx}>
              <Box sx={{ ...optionSx, color: "#A7A8A9", backgroundColor: "#EFF6FF" }}>
                {placeholder}
              </Box>
              {normalizedOptions.map((option) => (
                <Box
                  key={option.value}
                  ref={(node) => {
                    optionRefs.current[normalizedOptions.findIndex((item) => item.value === option.value)] = node;
                  }}
                  className={className}
                  role="option"
                  aria-selected={option.value === value}
                  aria-disabled={option.disabled ? "true" : "false"}
                  sx={{
                    ...optionSx,
                    backgroundColor:
                      highlightedIndex === normalizedOptions.findIndex((item) => item.value === option.value)
                        ? "#EFF6FF"
                        : "#fff",
                    opacity: option.disabled ? 0.65 : 1,
                    cursor: option.disabled ? "not-allowed" : "pointer",
                  }}
                  onClick={() => {
                    if (option.disabled) return;
                    handleSelect(option.value);
                  }}
                >
                  {option.description ? (
                    <Box sx={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
                      <Typography sx={{ fontSize: "inherit", color: option.disabled ? "#9CA3AF" : "#334155", m: 0, p: 0 }}>
                        {option.label}
                      </Typography>
                      <Typography sx={{ fontSize: "0.82rem", color: "#9CA3AF", m: 0, p: 0 }}>
                        {option.description}
                      </Typography>
                    </Box>
                  ) : (
                    option.label
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        )}

        <Box
          sx={{
            ...baseTriggerSx,
            ...(open && {
              borderColor: "#007CBA",
              boxShadow: "0 0 0 3px rgba(0, 124, 186, 0.16)",
            }),
            "&:focus-visible": {
              borderColor: "#007CBA",
              boxShadow: "0 0 0 3px rgba(0, 124, 186, 0.16)",
            },
          }}
          onClick={handleToggle}
          onKeyDown={handleTriggerKeyDown}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          tabIndex={0}
        >
          <Typography
            sx={{
              color: displayLabel ? "#334155" : "#A7A8A9",
              fontSize: "13.5px",
              pl: 0.25,
              lineHeight: 1,
            }}
          >
            {displayLabel || placeholder}
          </Typography>
          <KeyboardArrowDownRoundedIcon
            sx={{
              color: "#505151",
              fontSize: "2rem",
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 180ms ease",
            }}
          />
        </Box>
      </Box>
    </ClickAwayListener>
  );
};

export default AdaptiveSelect;

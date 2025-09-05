import { useState, useEffect, useRef } from "react";
import styles from "./Header.module.css";

type Props = {
  title?: string;
};

const MENU_ITEMS = [
  "SCIENCE",
  "GENERAL",
  "ENTERTAINMENT",
  "TECHNOLOGY",
  "BUSINESS",
  "HEALTH",
  "SPORTS",
];

export default function Header({ title = "BESIDER" }: Props) {
  const [open, setOpen] = useState(false);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => closeBtnRef.current?.focus(), 0);
    }
  }, [open]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.left}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Открыть меню"
            onClick={() => setOpen(true)}
          >
            <span className={styles.burger} aria-hidden="true">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="6"
                  width="18"
                  height="2"
                  rx="1"
                  fill="currentColor"
                />
                <rect
                  x="3"
                  y="11"
                  width="18"
                  height="2"
                  rx="1"
                  fill="currentColor"
                />
                <rect
                  x="3"
                  y="16"
                  width="18"
                  height="2"
                  rx="1"
                  fill="currentColor"
                />
              </svg>
            </span>
          </button>
        </div>

        <div className={styles.center}>
          <div className={styles.brand}>{title}</div>
        </div>

        <div className={styles.right} />
      </header>

      {open && (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label="Навигационное меню"
          onClick={() => setOpen(false)}
        >
          <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <button
              ref={closeBtnRef}
              type="button"
              className={styles.closeButton}
              aria-label="Закрыть меню"
              onClick={() => setOpen(false)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className={styles.sheetContent}>
              <nav>
                <ul className={styles.menuList}>
                  {MENU_ITEMS.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        className={styles.menuItem}
                        onClick={() => setOpen(false)}
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

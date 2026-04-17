/* eslint-disable react-refresh/only-export-components -- toast context */
import React from "react"

export type ToastInput = {
  title: string
  body?: string
  variant?: "default" | "success" | "warning"
}

type ToasterContextValue = {
  push: (t: ToastInput) => void
}

const ToasterContext = React.createContext<ToasterContextValue | null>(null)

export function useToaster(): ToasterContextValue {
  const v = React.useContext(ToasterContext)
  if (!v) {
    return { push: () => {} }
  }
  return v
}

type Toast = ToastInput & { id: string }

export function ToasterProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const push = React.useCallback((t: ToastInput) => {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `toast-${Date.now()}`
    setToasts((prev) => [...prev, { ...t, id }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id))
    }, 5200)
  }, [])

  const value = React.useMemo(() => ({ push }), [push])

  return (
    <ToasterContext.Provider value={value}>
      {children}
      <div
        role="region"
        aria-label="Notifications"
        style={{
          position: "fixed",
          bottom: 16,
          right: 16,
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          maxWidth: 360,
          pointerEvents: "none",
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              pointerEvents: "auto",
              background:
                t.variant === "warning"
                  ? "rgba(254, 243, 199, 0.98)"
                  : t.variant === "success"
                    ? "rgba(220, 252, 231, 0.98)"
                    : "rgba(255, 255, 255, 0.96)",
              border:
                t.variant === "warning"
                  ? "1px solid rgba(251, 191, 36, 0.5)"
                  : t.variant === "success"
                    ? "1px solid rgba(34, 197, 94, 0.4)"
                    : "1px solid rgba(15, 23, 42, 0.12)",
              borderRadius: 10,
              padding: "10px 12px",
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
              fontSize: 13,
              lineHeight: 1.35,
              color: "#0f172a",
            }}
          >
            <div style={{ fontWeight: 600 }}>{t.title}</div>
            {t.body ? <div style={{ marginTop: 4, opacity: 0.85 }}>{t.body}</div> : null}
          </div>
        ))}
      </div>
    </ToasterContext.Provider>
  )
}

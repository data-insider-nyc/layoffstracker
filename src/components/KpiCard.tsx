import React, { useEffect, useState } from "react";

interface Props {
  title: string;
  value: number | string;
  note?: string;
  accent?: "red" | "blue" | "green" | "default";
  delay?: number;
}

function useCountUp(target: number, duration = 900, delay = 0) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const timeout = setTimeout(() => {
      const step = (ts: number) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        setDisplay(Math.round(ease * target));
        if (p < 1) raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, [target, duration, delay]);
  return display;
}

const ACCENT: Record<string, { bar: string; num: string }> = {
  red:     { bar: "var(--accent)",      num: "var(--accent)"      },
  blue:    { bar: "var(--accent-blue)", num: "var(--accent-blue)" },
  green:   { bar: "var(--success)",     num: "var(--success)"     },
  default: { bar: "transparent",        num: "var(--text-primary)" },
};

const KpiCard: React.FC<Props> = ({ title, value, note, accent = "default", delay = 0 }) => {
  const isNum = typeof value === "number";
  const animated = useCountUp(isNum ? value : 0, 900, delay);
  const displayed = isNum ? new Intl.NumberFormat("en-US").format(animated) : value;
  const { bar, num } = ACCENT[accent];

  return (
    <div className="kpi-card animate-fade-up" style={{ animationDelay: `${delay}ms` }}>
      {/* Top accent bar */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: bar, borderRadius: "var(--radius-lg) var(--radius-lg) 0 0" }} />

      <p style={{
        fontFamily: "var(--font-mono)",
        fontSize: 10,
        letterSpacing: ".08em",
        textTransform: "uppercase",
        color: "var(--text-muted)",
        fontWeight: 500,
        marginBottom: 10,
      }}>
        {title}
      </p>

      <p className="animate-count-up" style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(1.5rem, 2.8vw, 2rem)",
        fontWeight: 400,
        color: num,
        lineHeight: 1,
        animationDelay: `${delay + 80}ms`,
      }}>
        {displayed}
      </p>

      {note && (
        <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8, lineHeight: 1.4 }}>
          {note}
        </p>
      )}
    </div>
  );
};

export default KpiCard;

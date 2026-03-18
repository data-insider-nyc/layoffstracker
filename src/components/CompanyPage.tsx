import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ComposedChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LabelList,
} from "recharts";
import { ArrowLeft, Share2, ExternalLink } from "lucide-react";
import SEOHead from "./SEOHead";
import ErrorBoundary from "./ErrorBoundary";
import { LayoffData } from "../hooks/useLayoffData";
import { getLogoUrl } from "../lib/logoUtils";

interface Props { data: LayoffData[]; isDarkMode?: boolean; }

const LayoffTooltip = ({ active, payload, label, isDarkMode }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: isDarkMode ? "#1c1c1a" : "#fff",
      border: `1px solid ${isDarkMode ? "#2a2a26" : "#e2e0da"}`,
      borderRadius: 10, padding: "10px 14px",
      boxShadow: "0 8px 24px rgba(0,0,0,.12)", fontFamily: "var(--font-body)",
    }}>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: isDarkMode ? "#9e9c96" : "#6b6860", marginBottom: 4 }}>{label}</p>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600, color: isDarkMode ? "#f87171" : "#E8340A" }}>
        {Number(payload[0].value).toLocaleString()} laid off
      </p>
    </div>
  );
};

const CompanyPage: React.FC<Props> = ({ data, isDarkMode = false }) => {
  const { slug } = useParams<{ slug: string }>();

  const companyName = useMemo(() => {
    if (!slug) return "";
    const decoded = decodeURIComponent(slug).toLowerCase();
    return data.find((d) => d.company.toLowerCase() === decoded)?.company ?? decoded;
  }, [slug, data]);

  const companyData = useMemo(
    () => data.filter((d) => d.company.toLowerCase() === companyName.toLowerCase()),
    [data, companyName]
  );

  const monthlyData = useMemo(() => {
    const map: Record<string, number> = {};
    companyData.forEach(({ date, laidOff }) => {
      const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`;
      map[key] = (map[key] || 0) + laidOff;
    });
    return Object.entries(map).sort(([a],[b]) => a.localeCompare(b)).map(([month, total]) => ({ month, total }));
  }, [companyData]);

  const yearlyData = useMemo(() => {
    const map: Record<number, number> = {};
    companyData.forEach(({ date, laidOff }) => { const y = date.getFullYear(); map[y] = (map[y]||0) + laidOff; });
    return Object.entries(map).sort(([a],[b]) => +a - +b).map(([year, total]) => ({ year, total }));
  }, [companyData]);

  const totalLaidOff = useMemo(() => companyData.reduce((s, d) => s + d.laidOff, 0), [companyData]);
  const location = companyData[0]?.headquarter ?? "US";

  const handleShare = async () => {
    const url  = window.location.href;
    const text = `${companyName} has laid off ${totalLaidOff.toLocaleString()} employees — see the full timeline 📉`;
    if (navigator.share) {
      await navigator.share({ title: `${companyName} Layoffs`, text, url });
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
    }
  };

  const axis  = { fill: isDarkMode ? "#5a5955" : "#9e9c96", fontSize: 11, fontFamily: "var(--font-mono)" };
  const grid  = isDarkMode ? "#2a2a26" : "#e2e0da";
  const tooltip = {
    background: isDarkMode ? "#1c1c1a" : "#fff",
    border: `1px solid ${isDarkMode ? "#2a2a26" : "#e2e0da"}`,
    borderRadius: 10, padding: "10px 14px",
    boxShadow: "0 8px 24px rgba(0,0,0,.12)", fontSize: 12,
    color: isDarkMode ? "#f0efe9" : "#1a1916",
    fontFamily: "var(--font-body)",
  };
  const chartCard = {
    background: "var(--bg-card)", border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)", padding: 20, boxShadow: "var(--shadow-sm)",
  };

  if (companyData.length === 0) {
    return (
      <div style={{ maxWidth: 640, margin: "64px auto", textAlign: "center", padding: "0 24px" }}>
        <p style={{ fontSize: 48, marginBottom: 12 }}>🔍</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: 24, color: "var(--text-primary)", marginBottom: 8 }}>Company not found</h1>
        <p style={{ color: "var(--text-muted)", marginBottom: 24, fontSize: 14 }}>No data for <strong>{slug}</strong> yet.</p>
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, background: "var(--accent)", color: "#fff", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
          <ArrowLeft size={14} /> Back to all companies
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${companyName} Layoffs — Full Timeline | Layoffs Tracker`}
        description={`${companyName} laid off ${totalLaidOff.toLocaleString()} employees across ${companyData.length} events. Full timeline, monthly breakdown, annual totals.`}
      />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 24px 64px" }}>

        {/* Back */}
        <Link to="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--text-muted)", textDecoration: "none", marginBottom: 24, fontFamily: "var(--font-body)", transition: "color .15s" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent-blue)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}>
          <ArrowLeft size={13} /> All companies
        </Link>

        {/* Company header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
          <img
            src={getLogoUrl(companyName)}
            alt={companyName}
            style={{ width: 52, height: 52, borderRadius: 12, border: "1px solid var(--border)", objectFit: "contain", background: "#fff", padding: 4 }}
            onError={(e) => { e.currentTarget.src = "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg"; }}
          />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 400, color: "var(--text-primary)", lineHeight: 1.1, marginBottom: 4 }}>
              {companyName}
            </h1>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: ".04em", textTransform: "uppercase" }}>
              {location}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleShare}
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: "var(--accent)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)" }}>
              <Share2 size={13} /> Share
            </button>
            <a href={`https://www.google.com/search?q=${encodeURIComponent(`${companyName} layoffs`)}`}
              target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-card)", color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, textDecoration: "none", fontFamily: "var(--font-body)" }}>
              <ExternalLink size={13} /> Google
            </a>
          </div>
        </div>

        {/* KPI strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 28 }}>
          {[
            { label: "Total Laid Off", value: totalLaidOff.toLocaleString(), color: "var(--accent)" },
            { label: "Layoff Events",  value: companyData.length,            color: "var(--accent-blue)" },
            { label: "Years in Data",  value: yearlyData.length,             color: "var(--text-secondary)" },
            { label: "Largest Event",  value: Math.max(...companyData.map(d => d.laidOff)).toLocaleString(), color: "var(--accent)" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ ...chartCard, padding: "16px 18px" }}>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 }}>{label}</p>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", fontWeight: 400, color, lineHeight: 1 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Monthly timeline */}
          <ErrorBoundary>
            <div style={chartCard}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 400, color: "var(--text-primary)", marginBottom: 16 }}>Monthly Layoff Timeline</h2>
              <ResponsiveContainer width="100%" height={260}>
                <ComposedChart data={monthlyData} margin={{ top: 10, right: 12, left: -8, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="2 4" stroke={grid} vertical={false} />
                  <XAxis dataKey="month" tick={{ ...axis, fontSize: 10 }} axisLine={false} tickLine={false} angle={-40} textAnchor="end" height={40} interval="preserveStartEnd" />
                  <YAxis tick={axis} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                  <Tooltip content={<LayoffTooltip isDarkMode={isDarkMode} />} cursor={{ fill: isDarkMode ? "rgba(255,255,255,.02)" : "rgba(0,0,0,.02)" }} />
                  <Bar dataKey="total" fill={isDarkMode ? "#818cf8" : "#0057FF"} radius={[4, 4, 0, 0]} maxBarSize={24}>
                    <LabelList dataKey="total" position="top" formatter={(v: number) => v > 0 ? v.toLocaleString() : ""}
                      style={{ fontSize: 9, fontFamily: "var(--font-mono)", fill: isDarkMode ? "#5a5955" : "#9e9c96" }} />
                  </Bar>
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ErrorBoundary>

          {/* Yearly totals */}
          {yearlyData.length > 1 && (
            <ErrorBoundary>
              <div style={chartCard}>
                <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 400, color: "var(--text-primary)", marginBottom: 16 }}>Annual Totals</h2>
                <ResponsiveContainer width="100%" height={200}>
                  <ComposedChart data={yearlyData} margin={{ top: 10, right: 40, left: -8, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="2 4" stroke={grid} vertical={false} />
                    <XAxis dataKey="year" tick={axis} axisLine={false} tickLine={false} />
                    <YAxis tick={axis} axisLine={false} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}k` : v} />
                    <Tooltip content={<LayoffTooltip isDarkMode={isDarkMode} />} cursor={{ fill: isDarkMode ? "rgba(255,255,255,.02)" : "rgba(0,0,0,.02)" }} />
                    <Bar dataKey="total" fill={isDarkMode ? "#34d399" : "#0D7A45"} radius={[4, 4, 0, 0]} maxBarSize={40}>
                      <LabelList dataKey="total" position="top" formatter={(v: number) => v.toLocaleString()}
                        style={{ fontSize: 10, fontFamily: "var(--font-mono)", fill: isDarkMode ? "#5a5955" : "#9e9c96" }} />
                    </Bar>
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </ErrorBoundary>
          )}

          {/* Event log */}
          <div style={{ ...chartCard, padding: 0, overflow: "hidden" }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 400, color: "var(--text-primary)" }}>All Events</h2>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)", letterSpacing: ".04em" }}>
                {companyData.length} records
              </span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table className="data-table">
                <thead>
                  <tr>
                    {["Date", "Laid Off", "Location", "Source"].map((h) => <th key={h}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {companyData.map((row, i) => (
                    <tr key={i}>
                      <td><span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-secondary)" }}>
                        {new Date(row.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                      </span></td>
                      <td><span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, color: isDarkMode ? "#f87171" : "#E8340A" }}>
                        {row.laidOff.toLocaleString()}
                      </span></td>
                      <td><span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{row.headquarter ?? "US"}</span></td>
                      <td>
                        <a href={`https://www.google.com/search?q=${encodeURIComponent(`${companyName} ${new Date(row.date).getFullYear()} layoffs`)}`}
                          target="_blank" rel="noopener noreferrer"
                          style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: isDarkMode ? "#818cf8" : "#0057FF", textDecoration: "none", fontFamily: "var(--font-mono)" }}>
                          <ExternalLink size={11} /> Search
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyPage;

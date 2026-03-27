import React, { useState, Suspense, useEffect, useMemo } from "react";
import LayoffTable from "./components/LayoffTable";
import { useLayoffData } from "./hooks/useLayoffData";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { TrendingDown, GitBranch } from "lucide-react";
import KpiCard from "./components/KpiCard";
import CompanyPage from "./components/CompanyPage";
import About from "./components/About";
import SEOHead from "./components/SEOHead";
import ErrorBoundary from "./components/ErrorBoundary";

const LayoffTop10Chart = React.lazy(
  () => import("./components/LayoffTop10Chart"),
);
const LayoffMonthlyTimeSeries = React.lazy(
  () => import("./components/LayoffMonthlyTimeSeries"),
);
const LayoffTopLocation = React.lazy(
  () => import("./components/LayoffTopLocation"),
);
const LayoffYoYChart = React.lazy(() => import("./components/LayoffYoYChart"));

function ChartSkeleton({ height = 340 }: { height?: number }) {
  return (
    <div
      style={{
        height,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 24,
      }}
    >
      <div
        className="skeleton"
        style={{ height: 20, width: "40%", borderRadius: 6 }}
      />
      <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 6 }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="skeleton"
            style={{
              flex: 1,
              height: `${30 + Math.sin(i) * 20 + i * 3}%`,
              borderRadius: "4px 4px 0 0",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function App() {
  const data = useLayoffData();
  const [selectedYear, setSelectedYear] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null
      ? JSON.parse(saved)
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const yearFilteredData = useMemo(
    () =>
      selectedYear === "ALL"
        ? data
        : data.filter(
            (d) => new Date(d.date).getFullYear() === parseInt(selectedYear),
          ),
    [data, selectedYear],
  );
  const filteredData = useMemo(
    () =>
      selectedCategory === "ALL"
        ? yearFilteredData
        : yearFilteredData.filter((d) =>
            selectedCategory === "DOGE"
              ? d.company.includes("Department")
              : !d.company.includes("Department"),
          ),
    [yearFilteredData, selectedCategory],
  );
  const categoryFilteredData = useMemo(
    () =>
      selectedCategory === "ALL"
        ? data
        : data.filter((d) =>
            selectedCategory === "DOGE"
              ? d.company.includes("Department")
              : !d.company.includes("Department"),
          ),
    [data, selectedCategory],
  );
  const { totalLayoffs, totalCompanies, avgLayoffs, largestEvent } =
    useMemo(() => {
      const totalLayoffs = filteredData.reduce((s, d) => s + d.laidOff, 0);
      const totalCompanies = filteredData.length;
      const avgLayoffs = totalCompanies
        ? Math.round(totalLayoffs / totalCompanies)
        : 0;
      const largestEvent = filteredData.length
        ? filteredData.reduce((m, d) => (d.laidOff > m.laidOff ? d : m))
        : { company: "—", laidOff: 0, date: new Date() };
      return { totalLayoffs, totalCompanies, avgLayoffs, largestEvent };
    }, [filteredData]);
  const availableYears = useMemo(
    () =>
      Array.from(new Set(data.map((d) => new Date(d.date).getFullYear()))).sort(
        (a, b) => b - a,
      ),
    [data],
  );
  const lastUpdated = useMemo(
    () =>
      data.length
        ? new Date(data[0].date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : null,
    [data],
  );

  if (data.length === 0) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          gap: 16,
        }}
      >
        <TrendingDown
          size={32}
          style={{ color: "var(--accent)", opacity: 0.7 }}
        />
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: 13,
            fontFamily: "var(--font-body)",
          }}
        >
          Loading layoff data…
        </p>
      </div>
    );
  }

  const chartCard = {
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-lg)",
    padding: "20px 16px",
    boxShadow: "var(--shadow-sm)",
  };

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
        {/* Nav */}
        <nav
          className="nav-glass"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            height: 56,
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: "var(--accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TrendingDown size={16} color="#fff" />
            </div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 18,
                color: "var(--text-primary)",
                letterSpacing: "-.01em",
              }}
            >
              Layoffs Tracker
            </span>
            {lastUpdated && (
              <span
                className="badge badge-green"
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                <span className="live-dot" />
                {lastUpdated}
              </span>
            )}
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a
              href="https://github.com/data-insider-nyc/layoffstracker"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 8,
                border: "1.5px solid var(--border)",
                background: "var(--bg-card)",
                color: "var(--text-secondary)",
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "var(--font-body)",
              }}
            >
              <GitBranch size={13} /> GitHub
            </a>
            <Link
              to="/about"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 12px",
                borderRadius: 8,
                border: "1.5px solid var(--border)",
                background: "var(--bg-card)",
                color: "var(--text-secondary)",
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "var(--font-body)",
              }}
            >
              About
            </Link>
            {/* <button onClick={() => setIsDarkMode((v: boolean) => !v)}
              style={{ width: 36, height: 36, borderRadius: 8, border: "1.5px solid var(--border)", background: "var(--bg-card)", color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              aria-label="Toggle dark mode">
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
            </button> */}
          </div>
        </nav>

        <Routes>
          <Route
            path="/company/:slug"
            element={<CompanyPage data={data} isDarkMode={isDarkMode} />}
          />
          <Route path="/about" element={<About />} />
          <Route
            path="/"
            element={
              <>
                <SEOHead
                  title="Layoffs Tracker — US Tech & Corporate Layoffs 2020–Present"
                  description={`Track ${totalLayoffs.toLocaleString()} layoffs across ${totalCompanies} companies. Interactive charts, filters, and company timelines.`}
                />
                <div
                  style={{
                    maxWidth: 1280,
                    margin: "0 auto",
                    padding: "32px 24px 64px",
                  }}
                >
                  {/* Hero */}
                  <header
                    className="animate-fade-up"
                    style={{ marginBottom: 36 }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        letterSpacing: ".12em",
                        textTransform: "uppercase",
                        color: "var(--accent)",
                        marginBottom: 10,
                        fontWeight: 500,
                      }}
                    >
                      Data Dashboard
                    </p>
                    <h1
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "clamp(2rem, 5vw, 3.4rem)",
                        fontWeight: 400,
                        color: "var(--text-primary)",
                        lineHeight: 1.1,
                        marginBottom: 12,
                        letterSpacing: "-.02em",
                      }}
                    >
                      US Layoffs,{" "}
                      <em
                        style={{
                          fontStyle: "italic",
                          color: "var(--text-secondary)",
                        }}
                      >
                        2020 – Present
                      </em>
                    </h1>
                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--text-secondary)",
                        maxWidth: 520,
                        lineHeight: 1.7,
                      }}
                    >
                      Tracking of workforce reductions across tech companies and
                      federal agencies.
                    </p>
                  </header>

                  {/* Filters */}
                  <div
                    className="animate-fade-up delay-1"
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 10,
                      marginBottom: 32,
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontFamily: "var(--font-mono)",
                        color: "var(--text-muted)",
                        letterSpacing: ".06em",
                        textTransform: "uppercase",
                      }}
                    >
                      Filter by
                    </span>
                    <select
                      className="filter-select"
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                    >
                      <option value="ALL">All Years</option>
                      {availableYears.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                    <select
                      className="filter-select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="ALL">All Categories</option>
                      <option value="General">Tech / Corporate</option>
                      <option value="DOGE">Federal (DOGE)</option>
                    </select>
                    {(selectedYear !== "ALL" || selectedCategory !== "ALL") && (
                      <button
                        onClick={() => {
                          setSelectedYear("ALL");
                          setSelectedCategory("ALL");
                        }}
                        style={{
                          padding: "7px 14px",
                          borderRadius: 8,
                          border: "1.5px solid var(--border)",
                          background: "transparent",
                          color: "var(--text-secondary)",
                          fontSize: 12,
                          cursor: "pointer",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        Clear ✕
                      </button>
                    )}
                  </div>

                  {filteredData.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px 24px" }}>
                      <p style={{ fontSize: 48, marginBottom: 12 }}>🔍</p>
                      <p
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 22,
                          color: "var(--text-primary)",
                          marginBottom: 8,
                        }}
                      >
                        No layoffs found
                      </p>
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--text-muted)",
                          marginBottom: 20,
                        }}
                      >
                        Try adjusting your filters.
                      </p>
                      <button
                        onClick={() => {
                          setSelectedYear("ALL");
                          setSelectedCategory("ALL");
                        }}
                        style={{
                          padding: "10px 20px",
                          borderRadius: 8,
                          border: "none",
                          background: "var(--accent)",
                          color: "#fff",
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        Reset filters
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* KPIs */}
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns:
                            "repeat(auto-fit, minmax(190px, 1fr))",
                          gap: 16,
                          marginBottom: 36,
                        }}
                      >
                        <KpiCard
                          title="Total Laid Off"
                          value={totalLayoffs}
                          accent="red"
                          delay={0}
                        />
                        <KpiCard
                          title="Companies Affected"
                          value={totalCompanies}
                          accent="blue"
                          delay={80}
                        />
                        <KpiCard
                          title="Avg per Company"
                          value={avgLayoffs}
                          accent="default"
                          delay={160}
                        />
                        <KpiCard
                          title="Largest Single Event"
                          value={largestEvent.laidOff}
                          note={`${largestEvent.company} · ${new Date(largestEvent.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`}
                          accent="red"
                          delay={240}
                        />
                      </div>

                      {/* Charts */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 20,
                        }}
                      >
                        <div
                          className="animate-fade-up delay-3"
                          style={{ overflowX: "auto" }}
                        >
                          <div style={{ ...chartCard, minWidth: 580 }}>
                            <ErrorBoundary>
                              <Suspense
                                fallback={<ChartSkeleton height={380} />}
                              >
                                <LayoffYoYChart
                                  data={categoryFilteredData}
                                  isDarkMode={isDarkMode}
                                />
                              </Suspense>
                            </ErrorBoundary>
                          </div>
                        </div>
                        <div
                          className="animate-fade-up delay-4"
                          style={{ overflowX: "auto" }}
                        >
                          <div style={{ ...chartCard, minWidth: 480 }}>
                            <ErrorBoundary>
                              <Suspense
                                fallback={<ChartSkeleton height={350} />}
                              >
                                <LayoffMonthlyTimeSeries
                                  data={filteredData}
                                  isDarkMode={isDarkMode}
                                />
                              </Suspense>
                            </ErrorBoundary>
                          </div>
                        </div>
                        <div
                          className="animate-fade-up delay-5"
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(340px, 1fr))",
                            gap: 20,
                          }}
                        >
                          <div style={{ overflowX: "auto" }}>
                            <div style={{ ...chartCard, minWidth: 340 }}>
                              <ErrorBoundary>
                                <Suspense
                                  fallback={<ChartSkeleton height={440} />}
                                >
                                  <LayoffTop10Chart
                                    data={filteredData}
                                    isDarkMode={isDarkMode}
                                  />
                                </Suspense>
                              </ErrorBoundary>
                            </div>
                          </div>
                          <div style={{ overflowX: "auto" }}>
                            <div style={{ ...chartCard, minWidth: 340 }}>
                              <ErrorBoundary>
                                <Suspense
                                  fallback={<ChartSkeleton height={440} />}
                                >
                                  <LayoffTopLocation
                                    data={filteredData}
                                    isDarkMode={isDarkMode}
                                  />
                                </Suspense>
                              </ErrorBoundary>
                            </div>
                          </div>
                        </div>

                        {/* Table card */}
                        <div
                          className="animate-fade-up"
                          style={{
                            ...chartCard,
                            padding: 0,
                            overflow: "hidden",
                          }}
                        >
                          <div
                            style={{
                              padding: "16px 20px 12px",
                              borderBottom: "1px solid var(--border)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                            }}
                          >
                            <h2
                              style={{
                                fontFamily: "var(--font-display)",
                                fontSize: 18,
                                color: "var(--text-primary)",
                                fontWeight: 400,
                              }}
                            >
                              All Layoff Events
                            </h2>
                            <span
                              className="badge badge-blue"
                              style={{ fontFamily: "var(--font-mono)" }}
                            >
                              {filteredData.length.toLocaleString()} rows
                            </span>
                          </div>
                          <ErrorBoundary>
                            <LayoffTable
                              data={filteredData}
                              isDarkMode={isDarkMode}
                            />
                          </ErrorBoundary>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Footer */}
                  <footer
                    style={{
                      marginTop: 64,
                      paddingTop: 24,
                      borderTop: "1px solid var(--border)",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 12,
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "var(--text-muted)",
                        letterSpacing: ".04em",
                      }}
                    >
                      Data sourced from public reports. Updated continuously.
                    </p>
                    <a
                      href="https://github.com/data-insider-nyc/layoffstracker"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "var(--text-muted)",
                        textDecoration: "none",
                        letterSpacing: ".04em",
                      }}
                    >
                      Open source on GitHub →
                    </a>
                  </footer>
                </div>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

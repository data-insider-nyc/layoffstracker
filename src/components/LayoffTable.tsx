import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import { getLogoUrl, getFallbackLogoUrl } from "../lib/logoUtils";
import { LayoffData } from "../hooks/useLayoffData";

interface Props {
  data: LayoffData[];
  isDarkMode?: boolean;
}

const ROWS = 10;

const LayoffTable: React.FC<Props> = ({ data, isDarkMode = false }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const filtered = search.trim()
    ? data.filter(
        (r) =>
          r.company?.toLowerCase().includes(search.toLowerCase()) ||
          r.headquarter?.toLowerCase().includes(search.toLowerCase()),
      )
    : data;

  const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS));
  const paged = filtered.slice((page - 1) * ROWS, page * ROWS);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const headers = [
    "date",
    ...Object.keys(data[0]).filter((k) => k !== "date"),
    "_share",
    "_link",
  ];

  const headerLabel = (h: string) => {
    if (h === "_share" || h === "_link") return "";
    if (h === "headquarter") return "Location";
    if (h === "laidOff") return "Laid Off";
    return h.charAt(0).toUpperCase() + h.slice(1);
  };

  const cell = (h: string, row: LayoffData) => {
    switch (h) {
      case "company":
        return (
          <Link
            to={`/company/${encodeURIComponent(row.company.toLowerCase())}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <img
              src={getLogoUrl(row.company)}
              alt=""
              style={{
                width: 40,
                height: 40,
                borderRadius: 5,
                objectFit: "contain",
                background: "#fff",
                padding: 0,
                border: "1px solid var(--border)",
                flexShrink: 0,
              }}
              onError={(e) => {
                const t = e.currentTarget;
                if (!t.dataset.fb) {
                  t.dataset.fb = "1";
                  t.src = getFallbackLogoUrl(row.company);
                } else
                  t.src =
                    "https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg";
              }}
            />
            <span
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: isDarkMode ? "#818cf8" : "#0057FF",
              }}
            >
              {row.company}
            </span>
          </Link>
        );
      case "date":
        return (
          <span
            style={
              {
                // fontFamily: "var(--font-mono)",
                // fontSize: 12,
                // color: isDarkMode ? "#5a5955" : "#9e9c96",
              }
            }
          >
            {new Date(row.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        );
      case "laidOff":
        return (
          <span
            style={
              {
                // fontFamily: "var(--font-mono)",
                // fontSize: 13,
                // fontWeight: 600,
                // color: isDarkMode ? "#f87171" : "#E8340A",
              }
            }
          >
            {row.laidOff?.toLocaleString() ?? "—"}
          </span>
        );
      case "headquarter":
        return (
          <span
          // style={{ fontSize: 12, color: isDarkMode ? "#9e9c96" : "#6b6860" }}
          >
            {row.headquarter || "US"}
          </span>
        );
      case "_share":
        return;
      case "_link":
        return (
          <a
            href={`https://www.google.com/search?q=${encodeURIComponent(`${row.company} layoffs`)}`}
            target="_blank"
            rel="noopener noreferrer"
            // style={{
            //   color: isDarkMode ? "#3a3a35" : "#c8c5bc",
            //   display: "flex",
            //   alignItems: "center",
            //   padding: 4,
            //   borderRadius: 6,
            //   transition: "color .15s",
            // }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = isDarkMode ? "#9e9c96" : "#6b6860")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = isDarkMode ? "#3a3a35" : "#c8c5bc")
            }
          >
            <ExternalLink size={14} />
          </a>
        );
      default:
        return (
          <span
            style={{ fontSize: 12, color: isDarkMode ? "#9e9c96" : "#6b6860" }}
          >
            {row[h]}
          </span>
        );
    }
  };

  return (
    <div>
      {/* Search */}
      <div
        style={{
          padding: "12px 20px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ position: "relative", maxWidth: 360 }}>
          <svg
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: isDarkMode ? "#3a3a35" : "#c8c5bc",
            }}
            width={14}
            height={14}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx={11} cy={11} r={8} />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search companies or locations…"
            style={{
              width: "100%",
              padding: "8px 32px 8px 36px",
              borderRadius: 8,
              border: `1.5px solid ${isDarkMode ? "#2a2a26" : "#e2e0da"}`,
              background: isDarkMode ? "#1a1a18" : "#f7f6f3",
              color: isDarkMode ? "#f0efe9" : "#1a1916",
              fontSize: 13,
              fontFamily: "var(--font-body)",
              outline: "none",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = isDarkMode ? "#818cf8" : "#0057FF")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = isDarkMode ? "#2a2a26" : "#e2e0da")
            }
          />
          {search && (
            <button
              onClick={() => {
                setSearch("");
                setPage(1);
              }}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: isDarkMode ? "#5a5955" : "#9e9c96",
                fontSize: 12,
                padding: 2,
              }}
            >
              ✕
            </button>
          )}
        </div>
        {search && filtered.length === 0 && (
          <p
            style={{
              fontSize: 12,
              color: isDarkMode ? "#5a5955" : "#9e9c96",
              marginTop: 8,
            }}
          >
            No results for "{search}"
          </p>
        )}
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="data-table" aria-label="Layoffs data table showing company, location, headcount, and date">
          <thead>
            <tr>
              {headers.map((h) => (
                <th
                  key={h}
                  style={{
                    width: h === "_share" || h === "_link" ? 36 : undefined,
                    textAlign:
                      h === "_share" || h === "_link" ? "center" : undefined,
                  }}
                >
                  {headerLabel(h)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, i) => (
              <tr key={i}>
                {headers.map((h) => (
                  <td
                    key={h}
                    style={{
                      textAlign:
                        h === "_share" || h === "_link" ? "center" : undefined,
                    }}
                  >
                    {cell(h, row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 20px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{
            padding: "6px 14px",
            borderRadius: 7,
            fontSize: 12,
            border: `1.5px solid ${isDarkMode ? "#2a2a26" : "#e2e0da"}`,
            background: "transparent",
            color:
              page === 1
                ? isDarkMode
                  ? "#3a3a35"
                  : "#c8c5bc"
                : isDarkMode
                  ? "#9e9c96"
                  : "#6b6860",
            cursor: page === 1 ? "default" : "pointer",
            fontFamily: "var(--font-body)",
            fontWeight: 500,
          }}
        >
          ← Prev
        </button>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: isDarkMode ? "#5a5955" : "#9e9c96",
            letterSpacing: ".04em",
          }}
        >
          {search ? `${filtered.length.toLocaleString()} results · ` : ""}
          {page} / {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          style={{
            padding: "6px 14px",
            borderRadius: 7,
            fontSize: 12,
            border: `1.5px solid ${isDarkMode ? "#2a2a26" : "#e2e0da"}`,
            background: "transparent",
            color:
              page === totalPages
                ? isDarkMode
                  ? "#3a3a35"
                  : "#c8c5bc"
                : isDarkMode
                  ? "#9e9c96"
                  : "#6b6860",
            cursor: page === totalPages ? "default" : "pointer",
            fontFamily: "var(--font-body)",
            fontWeight: 500,
          }}
        >
          Next →
        </button>
      </div>
    </div>
  );
};

export default LayoffTable;

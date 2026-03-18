# Layoffs Tracker — Upgrade Changelog

## New Files

| File | Purpose |
|---|---|
| `src/components/ErrorBoundary.tsx` | Wraps every chart; catches render errors without crashing the whole page. Shows a friendly "retry" message. |
| `src/components/SEOHead.tsx` | Dynamically updates `<title>`, `<meta description>`, Open Graph, and Twitter Card tags on every route. |
| `src/components/CompanyPage.tsx` | Full company permalink page at `/company/:slug` (e.g. `/company/amazon`). Includes monthly timeline, annual totals, event log table, KPI strip, and a Share button. |
| `src/components/SubmitLayoffForm.tsx` | Floating "Submit a Layoff" button + modal. Embeds a Tally.so form for crowdsourced data. Replace `TALLY_FORM_ID` with your real form ID. |
| `src/lib/logoUtils.ts` | Replaces the 80+ line `domainMap` in LayoffTable. Uses `logo.dev` API as the primary logo source with a small manual override map for tricky names. |

---

## Modified Files

### `src/App.tsx`
- **Memoized all filter chains** (`yearFilteredData`, `filteredData`, `categoryFilteredData`, KPIs, `availableYears`) using `useMemo` — no unnecessary recomputation on unrelated re-renders
- **Empty state UI** — when filters return 0 results, shows a friendly message with a "Reset filters" button instead of blank charts
- **Animated loading spinner** replaces the plain "Loading..." text
- **Error boundaries** wrap every chart — one bad data point won't crash the page
- **Skeleton loaders** replace the plain "Loading Chart..." text while lazy chunks load
- **Company route** added: `<Route path="/company/:slug" element={<CompanyPage />} />`
- **SEOHead** injected on the home route with live KPI counts in the description
- **Nav link** updated: "GitHub" now shows "GitHub ⭐" to encourage stars

### `src/components/LayoffTable.tsx`
- **Company names are now links** to `/company/:slug` — huge SEO and UX win
- **Share button** (Twitter/X intent or Web Share API) added per row
- **Logo source** switched from hardcoded `domainMap` to `logoUtils.ts` (logo.dev + unavatar fallback chain)
- **Date format** shortened to `Mar 18, 2026` (was `March 18, 2026`) for tighter columns
- **Laid off count** rendered in red for visual scannability

### `src/components/LayoffTop10Chart.tsx`
- **Bug fix**: title and slice now both say "Top 10" (was "Top 10" in title but `slice(0, 15)`)
- **Colored bars** — each company gets a distinct color from an accessible palette instead of flat purple
- **Company name Y-axis ticks** are now clickable `<Link>` elements pointing to `/company/:slug`
- **Empty state** shown instead of blank chart when no data matches

---

## Setup Steps

### 1. Add logo.dev token (optional but recommended)
Sign up at https://www.logo.dev for a free token, then replace `pk_public` in `logoUtils.ts`:
```ts
return `https://img.logo.dev/${domain}?token=YOUR_TOKEN&size=40&format=png`;
```

### 2. Set up Tally.so form
1. Create a free form at https://tally.so with fields: Company, Date, # Laid Off, Location, Source URL
2. Copy the form ID from the embed URL
3. Replace `YOUR_TALLY_FORM_ID` in `SubmitLayoffForm.tsx`
4. Add `<SubmitLayoffForm isDarkMode={isDarkMode} />` to App.tsx (just before the closing `</div>`)

### 3. Add an OG preview image
Create `public/og-preview.png` (1200×630px) — a simple screenshot of your dashboard works great.

### 4. Add to index.html (one-time)
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="theme-color" content="#3b82f6" />
```

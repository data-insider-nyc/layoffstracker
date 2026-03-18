/**
 * Returns a logo URL for a given company name.
 * Uses logo.dev as the primary source (high quality, auto-updated),
 * with a small manual override map for known tricky names.
 *
 * logo.dev is free for open-source/non-commercial use.
 * Docs: https://www.logo.dev
 */

const DOMAIN_OVERRIDES: Record<string, string> = {
  // Companies whose name doesn't map cleanly to domain
  Meta: "meta.com",
  "Meta Platforms": "meta.com",
  xAI: "x.ai",
  "X (Twitter)": "x.com",
  Twitter: "twitter.com",
  "HP Inc.": "hp.com",
  HP: "hp.com",
  PayPal: "paypal.com",
  Paypal: "paypal.com",
  Booking: "booking.com",
  "Booking Holdings": "booking.com",
  "Washington Post": "washingtonpost.com",
  "Home Depot": "homedepot.com",
  "T-Mobile": "t-mobile.com",
  Block: "block.xyz",
  Wayfair: "wayfair.com",
  "Amazon.com": "amazon.com",
  ScaleAI: "scale.com",
  Canva: "canva.com",
  Notion: "notion.so",
};

const GOV_DOMAINS: Record<string, string> = {
  whitehouse: "whitehouse.gov",
  treasury: "treasury.gov",
  defense: "defense.gov",
  state: "state.gov",
  commerce: "commerce.gov",
  labor: "dol.gov",
  education: "ed.gov",
  interior: "doi.gov",
  agriculture: "usda.gov",
  energy: "energy.gov",
  health: "hhs.gov",
  transportation: "dot.gov",
  veterans: "va.gov",
  homeland: "dhs.gov",
  justice: "justice.gov",
};

function getDomainForCompany(company: string): string {
  if (company.includes("Department")) {
    const lower = company.toLowerCase();
    for (const [keyword, domain] of Object.entries(GOV_DOMAINS)) {
      if (lower.includes(keyword)) return domain;
    }
    return "usa.gov";
  }

  if (DOMAIN_OVERRIDES[company]) return DOMAIN_OVERRIDES[company];

  // Best-effort: lowercase, strip non-alphanumeric, append .com
  const cleaned = company.toLowerCase().replace(/[^a-z0-9]/g, "");
  return `${cleaned}.com`;
}

export function getLogoUrl(company: string): string {
  const domain = getDomainForCompany(company);
  // logo.dev returns high-quality logos for thousands of companies
  return `https://img.logo.dev/${domain}?token=pk_IVyfQe4wSG6NQpBwMRcYNQ&size=40&format=png`;
}

// Fallback chain: logo.dev → unavatar → Wikipedia placeholder
export function getFallbackLogoUrl(company: string): string {
  const domain = getDomainForCompany(company);
  return `https://unavatar.io/${domain}`;
}

import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

/**
 * Dynamically updates <head> meta tags for SEO and Open Graph sharing.
 * Drop-in replacement until you add react-helmet or next/head.
 */
const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  image = "https://data-insider-nyc.github.io/layoffstracker/og-preview.png",
  url = typeof window !== "undefined" ? window.location.href : "",
}) => {
  useEffect(() => {
    // Title
    document.title = title;

    // Helper to upsert a <meta> tag
    const setMeta = (selector: string, attr: string, content: string) => {
      let el = document.querySelector<HTMLMetaElement>(selector);
      if (!el) {
        el = document.createElement("meta");
        const [key, val] = attr.split("=");
        el.setAttribute(key, val.replace(/"/g, ""));
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta('meta[name="description"]', "name=description", description);

    // Open Graph
    setMeta('meta[property="og:title"]', "property=og:title", title);
    setMeta(
      'meta[property="og:description"]',
      "property=og:description",
      description,
    );
    setMeta('meta[property="og:image"]', "property=og:image", image);
    setMeta('meta[property="og:url"]', "property=og:url", url);
    setMeta('meta[property="og:type"]', "property=og:type", "website");

    // Twitter card
    setMeta(
      'meta[name="twitter:card"]',
      "name=twitter:card",
      "summary_large_image",
    );
    setMeta('meta[name="twitter:title"]', "name=twitter:title", title);
    setMeta(
      'meta[name="twitter:description"]',
      "name=twitter:description",
      description,
    );
    setMeta('meta[name="twitter:image"]', "name=twitter:image", image);
  }, [title, description, image, url]);

  return null;
};

export default SEOHead;

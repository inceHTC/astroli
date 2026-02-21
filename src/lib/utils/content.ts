/**
 * Editorial content utilities: sanitize, TOC, word count, read time.
 * Legacy: block JSON → HTML for old articles.
 */

const WORDS_PER_MINUTE = 200;

export type TocItem = { id: string; text: string; level: number };

/** Extract table of contents from HTML (h2, h3). */
export function extractTocFromHtml(html: string): TocItem[] {
  const toc: TocItem[] = [];
  const headingRe = /<h([2-3])[^>]*>([^<]*)<\/h\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = headingRe.exec(html)) !== null) {
    const level = parseInt(m[1], 10);
    const text = m[2].replace(/<[^>]+>/g, "").trim();
    const id = slugifyHeading(text, toc.length);
    toc.push({ id, text, level });
  }
  return toc;
}

/** Inject id attributes into h2/h3 for TOC anchor links. */
export function injectHeadingIds(
  html: string,
  toc: TocItem[]
): string {
  if (toc.length === 0) return html;
  let index = 0;
  return html.replace(/<h([2-3])([^>]*)>/gi, (_, level, rest) => {
    const item = toc[index];
    index += 1;
    if (!item) return `<h${level}${rest}>`;
    const id = item.id ? ` id="${item.id.replace(/"/g, "&quot;")}"` : "";
    return `<h${level}${rest}${id}>`;
  });
}

function slugifyHeading(text: string, index: number): string {
  const base = text
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    || "section";
  return `${base}-${index}`;
}

/** Strip HTML and count words. */
export function wordCount(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text ? text.split(/\s+/).length : 0;
}

/** Reading time in minutes (200 words/min). */
export function readTimeMinutes(wordCountNum: number): number {
  return Math.max(1, Math.ceil(wordCountNum / WORDS_PER_MINUTE));
}

/** Replace @slug mentions with celebrity links. */
export function replaceCelebrityMentions(
  html: string,
  celebrities: { slug: string; name: string; image?: string | null }[]
): string {
  const bySlug = new Map(celebrities.map((c) => [c.slug.toLowerCase(), c]));
  return html.replace(/@([a-z0-9-]+)/gi, (_, slug) => {
    const c = bySlug.get(slug.toLowerCase());
    if (!c) return `@${slug}`;
    const name = escapeHtml(c.name);
    const attrs = ` href="/unluler/${c.slug}" data-celebrity-slug="${escapeHtml(c.slug)}" data-celebrity-name="${name}"`;
    if (c.image) {
      return `<a${attrs} data-celebrity-image="${escapeHtml(c.image)}">${name}</a>`;
    }
    return `<a${attrs}>${name}</a>`;
  });
}

/** Check if content looks like legacy block JSON. */
export function isLegacyBlockJson(content: string): boolean {
  const trimmed = content.trim();
  return (trimmed.startsWith("[") && trimmed.includes('"type"')) || false;
}

/** Convert legacy block array JSON to HTML for backward compatibility. */
export function legacyBlocksToHtml(content: string): string {
  try {
    const blocks = JSON.parse(content) as unknown[];
    if (!Array.isArray(blocks)) return content;
    const parts: string[] = [];
    for (const b of blocks) {
      if (!b || typeof b !== "object" || !("type" in b)) continue;
      const t = (b as { type: string }).type;
      if (t === "paragraph" && "text" in b) {
        parts.push(`<p>${escapeHtml(String((b as { text: unknown }).text))}</p>`);
      } else if (t === "heading" && "text" in b) {
        const level = [2, 3].includes(Number((b as { level?: unknown }).level))
          ? Number((b as { level: unknown }).level)
          : 2;
        parts.push(`<h${level}>${escapeHtml(String((b as { text: unknown }).text))}</h${level}>`);
      } else if (t === "bulletList" && "items" in b) {
        const items = Array.isArray((b as { items: unknown }).items)
          ? (b as { items: string[] }).items
          : [];
        parts.push("<ul>" + items.map((i) => `<li>${escapeHtml(String(i))}</li>`).join("") + "</ul>");
      } else if (t === "orderedList" && "items" in b) {
        const items = Array.isArray((b as { items: unknown }).items)
          ? (b as { items: string[] }).items
          : [];
        parts.push("<ol>" + items.map((i) => `<li>${escapeHtml(String(i))}</li>`).join("") + "</ol>");
      } else if (t === "image" && "src" in b) {
        const src = String((b as { src: unknown }).src);
        const cap = "caption" in b ? String((b as { caption: unknown }).caption) : "";
        parts.push(`<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(cap)}" /><figcaption>${escapeHtml(cap)}</figcaption></figure>`);
      } else if (t === "quote" && "text" in b) {
        parts.push(`<blockquote>${escapeHtml(String((b as { text: unknown }).text))}</blockquote>`);
      } else if (t === "table" && "headers" in b && "rows" in b) {
        const headers = (b as { headers: string[] }).headers;
        const rows = (b as { rows: string[][] }).rows;
        parts.push(
          "<table><thead><tr>" +
            headers.map((h) => `<th>${escapeHtml(String(h))}</th>`).join("") +
            "</tr></thead><tbody>" +
            rows.map((r) => "<tr>" + (Array.isArray(r) ? r : []).map((c) => `<td>${escapeHtml(String(c))}</td>`).join("") + "</tr>").join("") +
            "</tbody></table>"
        );
      } else if (t === "divider") {
        parts.push("<hr />");
      }
    }
    return parts.join("\n") || content;
  } catch {
    return content;
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

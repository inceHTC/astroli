/**
 * Client-safe HTML sanitization for editor (DOMPurify).
 * Use sanitize-html on server for article render.
 */

export type SanitizeFn = (dirty: string) => string;

let domPurify: SanitizeFn | null = null;

/** Lazy-load DOMPurify (client only). */
export function getSanitize(): SanitizeFn {
  if (typeof window === "undefined") {
    return (dirty: string) => dirty;
  }
  if (!domPurify) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const DOMPurify = require("dompurify");
    domPurify = (dirty: string) =>
      DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS: [
          "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li",
          "h1", "h2", "h3", "h4", "blockquote", "pre", "code", "hr",
          "table", "thead", "tbody", "tr", "th", "td",
          "figure", "figcaption", "img",
          "span", "div",
        ],
        ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id", "target", "rel"],
      });
  }
  return domPurify;
}

export function sanitizeForEditor(dirty: string): string {
  return getSanitize()(dirty);
}

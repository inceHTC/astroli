/**
 * Server-side HTML sanitization for article body (sanitize-html).
 * Used when rendering article content on the frontend.
 */

import sanitizeHtml from "sanitize-html";

const allowedTags = [
  "p", "br", "strong", "em", "u", "s", "a", "ul", "ol", "li",
  "h1", "h2", "h3", "h4", "blockquote", "pre", "code", "hr",
  "table", "thead", "tbody", "tr", "th", "td",
  "figure", "figcaption", "img",
  "span", "div",
];

export function sanitizeHtmlForRender(dirty: string): string {
  return sanitizeHtml(dirty, {
    allowedTags,
    allowedAttributes: {
      a: ["href", "title", "target", "rel", "data-celebrity-slug", "data-celebrity-name", "data-celebrity-image"],
      img: ["src", "alt", "title", "width", "height"],
      "*": ["class", "id"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    },
  });
}

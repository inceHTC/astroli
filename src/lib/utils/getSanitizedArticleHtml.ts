/**
 * Server-only: sanitize article HTML for safe render.
 * Use in RSC (article page); do not import in client components.
 */
import { sanitizeHtmlForRender } from "./sanitizeHtmlServer";
import { isLegacyBlockJson, legacyBlocksToHtml } from "./content";

export function getSanitizedArticleHtml(content: string): string {
  let raw = content;
  if (isLegacyBlockJson(raw)) raw = legacyBlocksToHtml(raw);
  return sanitizeHtmlForRender(raw);
}

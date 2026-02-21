"use client";

import { useMemo } from "react";
import { isLegacyBlockJson, legacyBlocksToHtml } from "@/lib/utils/content";

type ArticleRendererProps = {
  /** Raw content (HTML or legacy JSON). */
  content: string;
  /** Pre-sanitized HTML from server. When provided, this is used as-is. */
  sanitized?: string;
};

/** Renders article body inside .editorial. Expects server to pass sanitized HTML for public pages. */
export function ArticleRenderer({ content, sanitized }: ArticleRendererProps) {
  const html = useMemo(() => {
    if (sanitized) return sanitized;
    let raw = content;
    if (isLegacyBlockJson(raw)) raw = legacyBlocksToHtml(raw);
    return raw;
  }, [content, sanitized]);

  return (
    <div
      className="article-content editorial"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

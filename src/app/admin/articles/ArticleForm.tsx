"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils/slugify";
import { RichTextEditor, getEditorHtml } from "@/components/editor/RichTextEditor";
import { sanitizeForEditor } from "@/lib/utils/sanitize";
import {
  extractTocFromHtml,
  wordCount,
  readTimeMinutes,
} from "@/lib/utils/content";
import type { TocItem } from "@/lib/utils/content";

type ArticleFormProps = {
  initial?: {
    id: string;
    title: string;
    slug: string;
    tag: string;
    image: string | null;
    excerpt: string | null;
    content: string;
    readTime: number | null;
    toc: TocItem[] | null;
    published: boolean;
    featured: boolean;
  };
};

export function ArticleForm({ initial }: ArticleFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [tag, setTag] = useState(initial?.tag ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [published, setPublished] = useState(initial?.published ?? false);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initial) return;
    setSlug(slugify(title));
  }, [title, initial]);

  const getPayload = useCallback(() => {
    const sanitized = sanitizeForEditor(content);
    const words = wordCount(sanitized);
    const readTime = readTimeMinutes(words);
    const toc = extractTocFromHtml(sanitized);
    return {
      title,
      slug: slug || slugify(title),
      tag,
      image: image || null,
      excerpt: excerpt || null,
      content: sanitized,
      readTime,
      toc,
      published,
      featured,
    };
  }, [title, slug, tag, image, excerpt, content, published, featured]);

  async function handleSubmit(e: React.FormEvent, asDraft: boolean) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const payload = getPayload();
    if (asDraft) payload.published = false;
    if (!payload.content.trim()) {
      setError("İçerik boş olamaz.");
      setLoading(false);
      return;
    }
    try {
      if (initial) {
        const res = await fetch(`/api/admin/articles/${initial.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError((data.error as string) ?? "Güncellenemedi.");
          return;
        }
        router.push("/admin/articles");
        router.refresh();
      } else {
        const res = await fetch("/api/admin/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError((data.error as string) ?? "Oluşturulamadı.");
          return;
        }
        router.push("/admin/articles");
        router.refresh();
      }
    } catch {
      setError("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-gray-400";

  return (
    <form
      onSubmit={(e) => handleSubmit(e, false)}
      className="space-y-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {initial ? "Makaleyi düzenle" : "Yeni makale"}
        </h2>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showPreview}
            onChange={(e) => setShowPreview(e.target.checked)}
            className="rounded border-gray-300"
          />
          <span className="text-sm text-gray-700">Canlı önizleme</span>
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Başlık</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Slug (URL)</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              title="Sadece küçük harf, rakam ve tire (örn: haftalik-yorum)"
              className={inputClass}
            />
            <p className="mt-1 text-xs text-gray-500">Başlıktan otomatik üretilir.</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Etiket / Kategori</label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              required
              placeholder="Magazin, Haftalık, Liste..."
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Kapak görseli URL</label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="/dergi/kapak.png"
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Özet (excerpt)</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className={inputClass}
            />
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Yayınla</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Öne çıkan (ana sayfa)</span>
            </label>
          </div>
        </div>

        <div className={showPreview ? "space-y-4" : ""}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">İçerik</label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              editable={!showPreview}
            />
          </div>
          {showPreview && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <p className="mb-2 text-xs font-medium uppercase text-gray-500">Önizleme</p>
              <div
                className="editorial article-content prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content || "<p class='text-gray-400'>Önizleme burada görünecek.</p>" }}
              />
            </div>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex flex-wrap gap-3 border-t border-gray-200 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Kaydediliyor…" : published ? "Yayınla" : "Kaydet ve yayınla"}
        </button>
        <button
          type="button"
          onClick={(e) => handleSubmit(e, true)}
          disabled={loading}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Taslak kaydet
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Vazgeç / İptal
        </button>
      </div>
    </form>
  );
}

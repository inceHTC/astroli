"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { slugify } from "@/lib/utils/slugify";

export function TestForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [published, setPublished] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const s = slugify(title);
    if (s) setSlug(s);
  }, [title]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          slug: slug.trim() || slugify(title),
          description: description.trim(),
          duration: duration.trim() || "5–6 dk",
          image: image.trim() || null,
          category: category.trim() || null,
          published,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data.error as string) ?? "Test oluşturulamadı.");
        setLoading(false);
        return;
      }
      router.push("/admin/tests");
      router.refresh();
    } catch {
      setError("Bir hata oluştu.");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-zinc-500 focus:border-[#d4af37]/50 focus:outline-none focus:ring-1 focus:ring-[#d4af37]/50";
  const labelClass = "mb-1 block text-sm font-medium text-zinc-400";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className={labelClass}>
          Başlık *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
          placeholder="Örn: Hangi Element Sensin?"
          required
        />
      </div>

      <div>
        <label htmlFor="slug" className={labelClass}>
          Slug (URL) *
        </label>
        <input
          id="slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className={inputClass}
          placeholder="kisilik-element"
          pattern="^[a-z0-9-]+$"
          title="Sadece küçük harf, rakam ve tire"
          required
        />
        <p className="mt-1 text-xs text-zinc-500">
          Sadece küçük harf, rakam ve tire. Test adresi: /test/{slug || "..."}
        </p>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Açıklama *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClass} min-h-[100px] resize-y`}
          placeholder="Testin kısa açıklaması..."
          required
        />
      </div>

      <div>
        <label htmlFor="duration" className={labelClass}>
          Tahmini süre *
        </label>
        <input
          id="duration"
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className={inputClass}
          placeholder="5–6 dk"
        />
      </div>

      <div>
        <label htmlFor="image" className={labelClass}>
          Görsel URL (isteğe bağlı)
        </label>
        <input
          id="image"
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className={inputClass}
          placeholder="/tests/personality.png"
        />
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          Kategori (isteğe bağlı)
        </label>
        <input
          id="category"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={inputClass}
          placeholder="personality, love, career, ..."
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="published"
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="h-4 w-4 rounded border-white/20 bg-white/5 text-[#d4af37] focus:ring-[#d4af37]"
        />
        <label htmlFor="published" className="text-sm text-zinc-400">
          Yayında (sitede görünsün)
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-[#d4af37] px-6 py-2 text-sm font-medium text-black hover:bg-[#e8c547] disabled:opacity-50"
        >
          {loading ? "Kaydediliyor…" : "Testi oluştur"}
        </button>
        <Link
          href="/admin/tests"
          className="rounded-lg border border-white/10 px-6 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
        >
          Vazgeç
        </Link>
      </div>
    </form>
  );
}

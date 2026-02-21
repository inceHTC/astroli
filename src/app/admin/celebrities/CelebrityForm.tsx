"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils/slugify";
import { ZODIAC_SIGNS } from "@/data/zodiac";

type CelebrityFormProps = {
  initial?: {
    id: string;
    name: string;
    slug: string;
    job: string;
    zodiac: string;
    image: string | null;
    birthDate: Date | null;
    bio: string | null;
    featured: boolean;
  };
};

const inputClass =
  "mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-gray-400";

export function CelebrityForm({ initial }: CelebrityFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [job, setJob] = useState(initial?.job ?? "");
  const [zodiac, setZodiac] = useState(initial?.zodiac ?? "aries");
  const [image, setImage] = useState(initial?.image ?? "");
  const [birthDate, setBirthDate] = useState(
    initial?.birthDate ? new Date(initial.birthDate).toISOString().slice(0, 10) : ""
  );
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initial) return;
    setSlug(slugify(name));
  }, [name, initial]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const payload = {
      name: name.trim(),
      slug: slug.trim(),
      job: job.trim(),
      zodiac,
      image: image.trim() || null,
      birthDate: birthDate || null,
      bio: bio.trim() || null,
      featured,
    };
    try {
      if (initial) {
        const res = await fetch(`/api/admin/celebrities/${initial.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError((data.error as string) ?? "Güncellenemedi.");
          return;
        }
        router.push("/admin/celebrities");
        router.refresh();
      } else {
        const res = await fetch("/api/admin/celebrities", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError((data.error as string) ?? "Oluşturulamadı.");
          return;
        }
        router.push("/admin/celebrities");
        router.refresh();
      }
    } catch {
      setError("Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Ad</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          title="Sadece küçük harf, rakam ve tire"
          className={inputClass}
        />
        <p className="mt-1 text-xs text-gray-500">Başlıktan otomatik üretilir.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Meslek</label>
        <input
          type="text"
          value={job}
          onChange={(e) => setJob(e.target.value)}
          required
          placeholder="Oyuncu, Müzisyen..."
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Burç</label>
        <select
          value={zodiac}
          onChange={(e) => setZodiac(e.target.value)}
          className={inputClass}
        >
          {ZODIAC_SIGNS.map((z) => (
            <option key={z.id} value={z.id}>
              {z.nameTr} ({z.id})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Görsel URL</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="/celebrities/photo.jpg"
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Doğum tarihi</label>
        <input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className={inputClass}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Kısa biyografi</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className={inputClass}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="rounded border-gray-300"
        />
        <label htmlFor="featured" className="text-sm text-gray-700">
          Öne çıkan (anasayfada göster)
        </label>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Kaydediliyor…" : initial ? "Güncelle" : "Oluştur"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          İptal
        </button>
      </div>
    </form>
  );
}

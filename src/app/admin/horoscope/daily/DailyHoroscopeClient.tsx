"use client";

import { useState, useEffect } from "react";
import { ZODIAC_SIGNS } from "@/data/zodiac";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

export function DailyHoroscopeClient() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return format(today, "yyyy-MM-dd");
  });
  const [horoscopes, setHoroscopes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadHoroscopes();
  }, [selectedDate]);

  async function loadHoroscopes() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/horoscope/daily?date=${selectedDate}`);
      if (res.ok) {
        const data = await res.json();
        const map: Record<string, string> = {};
        data.forEach((h: { zodiacId: string; text: string }) => {
          map[h.zodiacId] = h.text;
        });
        setHoroscopes(map);
      }
    } catch (err) {
      console.error("Yorumlar yüklenemedi", err);
    } finally {
      setLoading(false);
    }
  }

  async function saveAll() {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/horoscope/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          horoscopes: Object.entries(horoscopes).map(([zodiacId, text]) => ({
            zodiacId,
            text: text.trim(),
          })),
        }),
      });

      if (res.ok) {
        setMessage("Günlük yorumlar kaydedildi!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        const detail = data?.details ?? data?.error ?? "Kayıt başarısız";
        setMessage("Hata: " + (Array.isArray(detail) ? detail.join("; ") : detail));
      }
    } catch (err) {
      setMessage("Hata: " + String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Tarih:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <span className="text-sm text-gray-500">
          {format(new Date(selectedDate), "d MMMM yyyy", { locale: tr })}
        </span>
      </div>

      {message && (
        <div className={`rounded-lg p-3 text-sm ${message.includes("Hata") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}>
          {message}
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-gray-500">Yükleniyor...</div>
      ) : (
        <>
          <div className="space-y-4">
            {ZODIAC_SIGNS.map((sign) => (
              <div key={sign.id} className="rounded-lg border border-gray-200 p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {sign.nameTr} ({sign.dates})
                </label>
                <textarea
                  value={horoscopes[sign.id] || ""}
                  onChange={(e) =>
                    setHoroscopes((prev) => ({ ...prev, [sign.id]: e.target.value }))
                  }
                  placeholder="Günlük yorum metnini buraya yazın..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm min-h-[80px] resize-y"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={saveAll}
              disabled={saving}
              className="rounded-lg bg-[#5B3FFF] px-6 py-2 text-sm font-medium text-white hover:bg-[#4A2FCC] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Kaydediliyor..." : "Tümünü Kaydet"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

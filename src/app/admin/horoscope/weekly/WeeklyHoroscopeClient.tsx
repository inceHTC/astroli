"use client";

import { useState, useEffect } from "react";
import { ZODIAC_SIGNS } from "@/data/zodiac";
import { getWeekRange } from "@/data/weeklyHoroscope";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className={`text-2xl transition ${i <= value ? "text-amber-400" : "text-gray-200 hover:text-gray-300"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

type WeeklyHoroscopeEntry = {
  health: number;
  love: number;
  money: number;
  work: number;
  summary: string;
  advice: string;
};

export function WeeklyHoroscopeClient() {
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const { start } = getWeekRange(new Date());
    return format(start, "yyyy-MM-dd");
  });
  const [horoscopes, setHoroscopes] = useState<Record<string, WeeklyHoroscopeEntry>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadHoroscopes();
  }, [selectedWeek]);

  async function loadHoroscopes() {
    setLoading(true);
    try {
      const weekStart = new Date(selectedWeek);
      const { end } = getWeekRange(weekStart);
      const res = await fetch(
        `/api/admin/horoscope/weekly?weekStart=${format(weekStart, "yyyy-MM-dd")}&weekEnd=${format(end, "yyyy-MM-dd")}`
      );
      if (res.ok) {
        const data = (await res.json()) as Array<{
          zodiacId: string;
          health?: number;
          love?: number;
          money?: number;
          work?: number;
          summary?: string;
          advice?: string;
        }>;
        const map: Record<string, WeeklyHoroscopeEntry> = {};
        for (const h of Array.isArray(data) ? data : []) {
          map[h.zodiacId] = {
            health: h.health ?? 3,
            love: h.love ?? 3,
            money: h.money ?? 3,
            work: h.work ?? 3,
            summary: h.summary ?? "",
            advice: h.advice ?? "",
          };
        }
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
      const weekStart = new Date(selectedWeek);
      const { end } = getWeekRange(weekStart);
      const res = await fetch("/api/admin/horoscope/weekly", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekStart: format(weekStart, "yyyy-MM-dd"),
          weekEnd: format(end, "yyyy-MM-dd"),
          horoscopes: Object.entries(horoscopes).map(([zodiacId, data]) => ({
            zodiacId,
            ...data,
          })),
        }),
      });

      if (res.ok) {
        setMessage("Haftalık yorumlar kaydedildi!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("Hata: Kayıt başarısız");
      }
    } catch (err) {
      setMessage("Hata: " + String(err));
    } finally {
      setSaving(false);
    }
  }

  const weekStartDate = new Date(selectedWeek);
  const { start, end } = getWeekRange(weekStartDate);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Hafta Başlangıcı (Pazartesi):</label>
        <input
          type="date"
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <span className="text-sm text-gray-500">
          {format(start, "d MMMM", { locale: tr })} – {format(end, "d MMMM yyyy", { locale: tr })}
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
          <div className="space-y-6">
            {ZODIAC_SIGNS.map((sign) => {
              const data = horoscopes[sign.id] || {
                health: 3,
                love: 3,
                money: 3,
                work: 3,
                summary: "",
                advice: "",
              };
              return (
                <div key={sign.id} className="rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {sign.nameTr} ({sign.dates})
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Sağlık</label>
                      <StarInput
                        value={data.health}
                        onChange={(v) =>
                          setHoroscopes((prev) => ({
                            ...prev,
                            [sign.id]: { ...prev[sign.id] || data, health: v },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Aşk</label>
                      <StarInput
                        value={data.love}
                        onChange={(v) =>
                          setHoroscopes((prev) => ({
                            ...prev,
                            [sign.id]: { ...prev[sign.id] || data, love: v },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Para</label>
                      <StarInput
                        value={data.money}
                        onChange={(v) =>
                          setHoroscopes((prev) => ({
                            ...prev,
                            [sign.id]: { ...prev[sign.id] || data, money: v },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">İş</label>
                      <StarInput
                        value={data.work}
                        onChange={(v) =>
                          setHoroscopes((prev) => ({
                            ...prev,
                            [sign.id]: { ...prev[sign.id] || data, work: v },
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Genel Değerlendirme
                      </label>
                      <textarea
                        value={data.summary}
                        onChange={(e) =>
                          setHoroscopes((prev) => ({
                            ...prev,
                            [sign.id]: { ...prev[sign.id] || data, summary: e.target.value },
                          }))
                        }
                        placeholder="Bu hafta için genel değerlendirme..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm min-h-[80px] resize-y"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tavsiye</label>
                      <textarea
                        value={data.advice}
                        onChange={(e) =>
                          setHoroscopes((prev) => ({
                            ...prev,
                            [sign.id]: { ...prev[sign.id] || data, advice: e.target.value },
                          }))
                        }
                        placeholder="Bu hafta için tavsiye..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm min-h-[80px] resize-y"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
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

"use client";

import { useState, useEffect } from "react";
import { getWeekRange } from "@/data/weeklyHoroscope";
import { format } from "date-fns";
import { tr } from "date-fns/locale";

type FormData = {
  generalEnergy: string;
  elementFire: string;
  elementEarth: string;
  elementAir: string;
  elementWater: string;
  planetMercury: string;
  planetVenus: string;
  planetMars: string;
  advice: string;
  overviewFire: string;
  overviewEarth: string;
  overviewAir: string;
  overviewWater: string;
};

const emptyForm: FormData = {
  generalEnergy: "",
  elementFire: "",
  elementEarth: "",
  elementAir: "",
  elementWater: "",
  planetMercury: "",
  planetVenus: "",
  planetMars: "",
  advice: "",
  overviewFire: "",
  overviewEarth: "",
  overviewAir: "",
  overviewWater: "",
};

export function CosmicEnergyClient() {
  const [selectedWeek, setSelectedWeek] = useState(() => {
    const { start } = getWeekRange(new Date());
    return format(start, "yyyy-MM-dd");
  });
  const [availableWeeks, setAvailableWeeks] = useState<string[]>([]);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/cosmic-energy?list=weeks")
      .then((r) => r.ok ? r.json() : [])
      .then((weeks: string[]) => setAvailableWeeks(Array.isArray(weeks) ? weeks : []))
      .catch(() => setAvailableWeeks([]));
  }, []);

  useEffect(() => {
    loadWeek();
  }, [selectedWeek]);

  async function loadWeek() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/cosmic-energy?weekStart=${encodeURIComponent(selectedWeek)}`
      );
      if (res.ok) {
        const data = (await res.json()) as FormData & { weekStart?: string; weekEnd?: string } | null;
        if (data) {
          setForm({
            generalEnergy: data.generalEnergy ?? "",
            elementFire: data.elementFire ?? "",
            elementEarth: data.elementEarth ?? "",
            elementAir: data.elementAir ?? "",
            elementWater: data.elementWater ?? "",
            planetMercury: data.planetMercury ?? "",
            planetVenus: data.planetVenus ?? "",
            planetMars: data.planetMars ?? "",
            advice: data.advice ?? "",
            overviewFire: data.overviewFire ?? "",
            overviewEarth: data.overviewEarth ?? "",
            overviewAir: data.overviewAir ?? "",
            overviewWater: data.overviewWater ?? "",
          });
        } else {
          setForm(emptyForm);
        }
      } else {
        setForm(emptyForm);
      }
    } catch {
      setForm(emptyForm);
    } finally {
      setLoading(false);
    }
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const weekStart = new Date(selectedWeek);
      const { end } = getWeekRange(weekStart);
      const res = await fetch("/api/admin/cosmic-energy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekStart: format(weekStart, "yyyy-MM-dd"),
          weekEnd: format(end, "yyyy-MM-dd"),
          ...form,
        }),
      });
      if (res.ok) {
        setMessage("Kozmik enerji kaydedildi!");
        setAvailableWeeks((prev) =>
          prev.includes(selectedWeek) ? prev : [selectedWeek, ...prev]
        );
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

  const update = (key: keyof FormData, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const weekStartDate = new Date(selectedWeek);
  const { start, end } = getWeekRange(weekStartDate);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Hafta (Pazartesi):</label>
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

      {availableWeeks.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Arşiv – Kayıtlı haftalar</p>
          <div className="flex flex-wrap gap-2">
            {availableWeeks.map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setSelectedWeek(w)}
                className={`rounded-lg px-3 py-1.5 text-sm ${
                  w === selectedWeek ? "bg-[#5B3FFF] text-white" : "bg-white border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {format(new Date(w + "T12:00:00"), "d MMM yyyy", { locale: tr })}
              </button>
            ))}
          </div>
        </div>
      )}

      {message && (
        <div
          className={`rounded-lg p-3 text-sm ${
            message.includes("Hata") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          }`}
        >
          {message}
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-gray-500">Yükleniyor...</div>
      ) : (
        <div className="space-y-8">
          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Bu Haftanın Genel Enerjisi</h3>
            <textarea
              value={form.generalEnergy}
              onChange={(e) => update("generalEnergy", e.target.value)}
              placeholder="Bu hafta kozmik enerjilerde denge ve uyum..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm min-h-[120px] resize-y"
            />
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Element Enerjileri</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  { key: "elementFire" as const, label: "Ateş" },
                  { key: "elementEarth" as const, label: "Toprak" },
                  { key: "elementAir" as const, label: "Hava" },
                  { key: "elementWater" as const, label: "Su" },
                ] as const
              ).map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <textarea
                    value={form[key]}
                    onChange={(e) => update(key, e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm min-h-[80px] resize-y"
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Gezegen Hareketleri</h3>
            <div className="space-y-4">
              {(
                [
                  { key: "planetMercury" as const, label: "Merkür" },
                  { key: "planetVenus" as const, label: "Venüs" },
                  { key: "planetMars" as const, label: "Mars" },
                ] as const
              ).map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <textarea
                    value={form[key]}
                    onChange={(e) => update(key, e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm min-h-[70px] resize-y"
                  />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Genel Tavsiyeler</h3>
            <p className="text-xs text-gray-500 mb-1">Her satır bir madde olarak gösterilir.</p>
            <textarea
              value={form.advice}
              onChange={(e) => update("advice", e.target.value)}
              placeholder="İletişim konularında netlik...&#10;Planlama ve organizasyon..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm min-h-[100px] resize-y"
            />
          </section>

          <section>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Burçlara Göre Genel Bakış (element bazlı)</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  { key: "overviewFire" as const, label: "Ateş (Koç, Aslan, Yay)" },
                  { key: "overviewEarth" as const, label: "Toprak (Boğa, Başak, Oğlak)" },
                  { key: "overviewAir" as const, label: "Hava (İkizler, Terazi, Kova)" },
                  { key: "overviewWater" as const, label: "Su (Yengeç, Akrep, Balık)" },
                ] as const
              ).map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <textarea
                    value={form[key]}
                    onChange={(e) => update(key, e.target.value)}
                    placeholder="Bu hafta enerji ve hareket ön planda..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm min-h-[60px] resize-y"
                  />
                </div>
              ))}
            </div>
          </section>

          <div className="flex justify-end pt-4 border-t">
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-[#5B3FFF] px-6 py-2 text-sm font-medium text-white hover:bg-[#4A2FCC] disabled:opacity-50"
            >
              {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

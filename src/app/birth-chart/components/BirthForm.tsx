"use client";

import { useState, useCallback, useEffect } from "react";

export interface BirthFormValues {
  fullName: string;
  birthDate: string;
  birthTime?: string;
  timeRange?: string;
  isApproximate: boolean;
  province: string;
  district: string;
}

const DEFAULT_TIME = "12:00";
const TIME_RANGES = [
  { value: "00:00-04:00", label: "00:00–04:00 (Gece)" },
  { value: "04:00-08:00", label: "04:00–08:00 (Sabah Erken)" },
  { value: "08:00-12:00", label: "08:00–12:00 (Sabah)" },
  { value: "12:00-16:00", label: "12:00–16:00 (Öğleden Sonra)" },
  { value: "16:00-20:00", label: "16:00–20:00 (Akşam)" },
  { value: "20:00-24:00", label: "20:00–24:00 (Gece Yarısı)" },
];

function getTodayLocalYYYYMMDD(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

interface BirthFormProps {
  onSubmit: (values: BirthFormValues) => void;
  isLoading?: boolean;
}

interface LocationsResponse {
  provinces: string[];
  districts: Record<string, string[]>;
}

export function BirthForm({ onSubmit, isLoading = false }: BirthFormProps) {
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState(DEFAULT_TIME);
  const [timeRange, setTimeRange] = useState(TIME_RANGES[2].value);
  const [isApproximate, setIsApproximate] = useState(false);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [provinces, setProvinces] = useState<string[]>([]);
  const [districtsByProvince, setDistrictsByProvince] = useState<Record<string, string[]>>({});
  const [dateError, setDateError] = useState("");

  useEffect(() => {
    fetch("/api/birth-chart")
      .then((res) => res.json())
      .then((data: LocationsResponse) => {
        if (data.provinces) setProvinces(data.provinces);
        if (data.districts) setDistrictsByProvince(data.districts);
      })
      .catch(() => {});
  }, []);

  const districts = province ? districtsByProvince[province] ?? [] : [];

  const handleProvinceChange = useCallback((value: string) => {
    setProvince(value);
    setDistrict("");
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setDateError("");
      if (!fullName.trim() || !province || !district) return;
      if (!isApproximate && !birthTime) return;
      if (isApproximate && !timeRange) return;
      const maxDate = getTodayLocalYYYYMMDD();
      if (birthDate && birthDate > maxDate) {
        setDateError("Doğum tarihi bugün veya geçmiş bir tarih olmalıdır.");
        return;
      }

      onSubmit({
        fullName: fullName.trim(),
        birthDate,
        ...(isApproximate ? { timeRange } : { birthTime: birthTime ?? DEFAULT_TIME }),
        isApproximate,
        province,
        district,
      });
    },
    [fullName, birthDate, birthTime, timeRange, isApproximate, province, district, onSubmit]
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8"
    >
      <div>
        <label htmlFor="full-name" className="mb-1.5 block text-sm font-medium text-white/90">
          Adı Soyadı
        </label>
        <input
          id="full-name"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          placeholder="Adınız Soyadınız"
          className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 outline-none transition focus:border-[#8C7BFF] focus:ring-2 focus:ring-[#8C7BFF]/30"
        />
      </div>

      {dateError && (
        <p className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{dateError}</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="birth-date" className="mb-1.5 block text-sm font-medium text-white/90">
            Doğum Tarihi
          </label>
          <input
            id="birth-date"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={getTodayLocalYYYYMMDD()}
            required
            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#8C7BFF] focus:ring-2 focus:ring-[#8C7BFF]/30"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-white/90">
            Doğum Zamanı
          </label>
          <label className="mb-3 flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              checked={isApproximate}
              onChange={(e) => setIsApproximate(e.target.checked)}
              className="rounded border-white/30 bg-white/5 text-[#8C7BFF] focus:ring-[#8C7BFF]"
            />
            Doğum saatimi bilmiyorum
          </label>
          {!isApproximate && (
            <input
              id="birth-time"
              type="time"
              value={birthTime}
              onChange={(e) => setBirthTime(e.target.value)}
              required={!isApproximate}
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#8C7BFF] focus:ring-2 focus:ring-[#8C7BFF]/30"
            />
          )}
          {isApproximate && (
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              required={isApproximate}
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#8C7BFF] focus:ring-2 focus:ring-[#8C7BFF]/30 [&>option]:bg-[#1A163E] [&>option]:text-white"
            >
              {TIME_RANGES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="province" className="mb-1.5 block text-sm font-medium text-white/90">
            Doğum İli
          </label>
          <select
            id="province"
            value={province}
            onChange={(e) => handleProvinceChange(e.target.value)}
            required
            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#8C7BFF] focus:ring-2 focus:ring-[#8C7BFF]/30 [&>option]:bg-[#1A163E] [&>option]:text-white"
          >
            <option value="">İl Seçin</option>
            {provinces.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="district" className="mb-1.5 block text-sm font-medium text-white/90">
            Doğum İlçesi
          </label>
          <select
            id="district"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            required
            disabled={!province}
            className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-[#8C7BFF] focus:ring-2 focus:ring-[#8C7BFF]/30 disabled:opacity-50 [&>option]:bg-[#1A163E] [&>option]:text-white"
          >
            <option value="">İlçe Seçin</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
  type="submit"
  disabled={isLoading}
  className="mt-2 rounded-xl bg-[#5B3FFF] px-6 py-3.5 font-medium text-white shadow-[0_0_20px_rgba(91,63,255,0.4)] transition hover:bg-[#3E2BCB] hover:shadow-[0_0_28px_rgba(91,63,255,0.5)] disabled:opacity-60"
>
  {isLoading ? "Hesaplanıyor…" : "Haritayı Hesapla"}
</button>

    </form>
  );
}

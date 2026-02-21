import { WeeklyHoroscopeClient } from "./WeeklyHoroscopeClient";

export default function AdminWeeklyHoroscopePage() {
  return (
    <div className="min-h-screen bg-white px-8 pb-16 pt-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">Haftalık Burç Yorumları</h1>
        <p className="mt-1 text-sm text-gray-500">
          Her burç için haftalık yorumları ekleyin veya düzenleyin. Sağlık, Aşk, Para ve İş için 1-5 yıldız verin.
        </p>
        <div className="mt-8">
          <WeeklyHoroscopeClient />
        </div>
      </div>
    </div>
  );
}

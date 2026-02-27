import { DailyHoroscopeClient } from "./DailyHoroscopeClient";
import { DailyHoroscopeArchiveClient } from "./DailyHoroscopeArchiveClient";

export default function AdminDailyHoroscopePage() {
  return (
    <div className="min-h-screen bg-white px-8 pb-16 pt-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">Günlük Burç Yorumları</h1>
        <p className="mt-1 text-sm text-gray-500">
          Her burç için günlük yorumları ekleyin veya düzenleyin. Tarih seçerek o günün yorumunu
          güncelleyebilirsiniz.
        </p>
        <div className="mt-8">
          <DailyHoroscopeClient />
        </div>
        <DailyHoroscopeArchiveClient />
      </div>
    </div>
  );
}

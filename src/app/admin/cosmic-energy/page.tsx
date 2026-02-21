import { CosmicEnergyClient } from "./CosmicEnergyClient";

export default function AdminCosmicEnergyPage() {
  return (
    <div className="min-h-screen bg-white px-8 pb-16 pt-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">Haftalık Kozmik Enerji</h1>
        <p className="mt-1 text-sm text-gray-500">
          Dergi sayfası için haftalık kozmik enerji içeriğini ekleyin veya düzenleyin. Hafta seçerek o haftanın sayfasını güncelleyebilirsiniz; eski haftalar arşivde listelenir.
        </p>
        <div className="mt-8">
          <CosmicEnergyClient />
        </div>
      </div>
    </div>
  );
}

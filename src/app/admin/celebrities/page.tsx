import { CelebritiesClient } from "./CelebritiesClient";

export default function AdminCelebritiesPage() {
  return (
    <div className="min-h-screen bg-white px-8 pb-16 pt-8">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-gray-900">Ünlüler</h1>
        <p className="mt-1 text-sm text-gray-500">
          Ünlü – burç rehberi. Liste, arama, düzenleme ve öne çıkan.
        </p>
        <div className="mt-8">
          <CelebritiesClient />
        </div>
      </div>
    </div>
  );
}

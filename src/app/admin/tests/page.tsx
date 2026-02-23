import { TestsClient } from "./TestsClient";

export default function AdminTestsPage() {
  return (
    <div className="px-8 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">
            Kişilik Testleri
          </h1>
          <p className="mt-2 text-zinc-500">
            Testleri yönetin, soru ve cevap ekleyin.
          </p>
        </div>
      </div>

      <TestsClient />
    </div>
  );
}

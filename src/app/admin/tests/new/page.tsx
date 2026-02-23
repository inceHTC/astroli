import Link from "next/link";
import { TestForm } from "../TestForm";

export default function NewTestPage() {
  return (
    <div className="px-8 pb-16">
      <Link
        href="/admin/tests"
        className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-white"
      >
        ← Testlere dön
      </Link>
      <h1 className="mt-6 font-display text-2xl font-semibold text-white">
        Yeni test
      </h1>
      <p className="mt-2 text-zinc-500">
        Test bilgilerini girin. Soru ve sonuçları oluşturduktan sonra düzenleme sayfasından ekleyebilirsiniz.
      </p>
      <div className="mt-8">
        <TestForm />
      </div>
    </div>
  );
}

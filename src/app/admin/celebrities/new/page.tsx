import Link from "next/link";
import { CelebrityForm } from "../CelebrityForm";

export default function NewCelebrityPage() {
  return (
    <div className="min-h-screen bg-white px-8 pb-16 pt-8">
      <Link href="/admin/celebrities" className="text-sm text-gray-500 hover:text-gray-700">
        ← Ünlülere dön
      </Link>
      <h1 className="mt-6 text-xl font-semibold text-gray-900">Yeni ünlü</h1>
      <div className="mt-8 max-w-2xl">
        <CelebrityForm />
      </div>
    </div>
  );
}

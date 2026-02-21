import { notFound } from "next/navigation";
import Link from "next/link";
import { getCelebrityById } from "@/lib/db/repositories/celebrity";
import { CelebrityForm } from "../../CelebrityForm";

export default async function EditCelebrityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const celebrity = await getCelebrityById(id);
  if (!celebrity) notFound();

  const initial = {
    id: celebrity.id,
    name: celebrity.name,
    slug: celebrity.slug,
    job: celebrity.job,
    zodiac: celebrity.zodiac,
    image: celebrity.image,
    birthDate: celebrity.birthDate,
    bio: celebrity.bio,
    featured: celebrity.featured,
  };

  return (
    <div className="min-h-screen bg-white px-8 pb-16 pt-8">
      <Link href="/admin/celebrities" className="text-sm text-gray-500 hover:text-gray-700">
        ← Ünlülere dön
      </Link>
      <h1 className="mt-6 text-xl font-semibold text-gray-900">Ünlüyü düzenle</h1>
      <p className="mt-1 text-sm text-gray-500">{celebrity.slug}</p>
      <div className="mt-8 max-w-2xl">
        <CelebrityForm initial={initial} />
      </div>
    </div>
  );
}

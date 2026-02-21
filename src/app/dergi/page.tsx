import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { getArticles } from "@/lib/getArticles";

export default async function DergiPage() {
  const articles = await getArticles();

  return (
    <div className="bg-white pb-28">

      <section className="py-20 text-center border-b border-gray-200">
        <Container size="md">
          <h1 className="text-4xl sm:text-5xl font-bold text-black">
            Astroli Dergi
          </h1>
          <p className="mt-4 text-gray-600">
            Astroloji, burçlar ve eğlenceli analizler.
          </p>
        </Container>
      </section>

      <Container size="lg" className="mt-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">

          {articles.map((article) => (
            <Link key={article.slug} href={`/dergi/${article.slug}`}>
              <div className="group overflow-hidden rounded-2xl border border-gray-200 hover:shadow-xl transition">

                <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                  {article.image ? (
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition duration-700"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400 text-sm">Görsel yok</div>
                  )}
                </div>

                <div className="p-6">
                  <span className="text-xs uppercase tracking-wider text-[#5B3FFF]">
                    {article.tag}
                  </span>

                  <h2 className="mt-3 text-lg font-semibold text-black">
                    {article.title}
                  </h2>
                </div>

              </div>
            </Link>
          ))}

        </div>
      </Container>

    </div>
  );
}

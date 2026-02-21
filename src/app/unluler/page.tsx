import { listCelebrities } from "@/lib/db/repositories/celebrity";
import { CelebrityGrid } from "@/components/celebrity/CelebrityGrid";
import { Container } from "@/components/layout/Container";

export const metadata = {
  title: "Hangi Ünlü Hangi Burç? | Astroli",
  description:
    "Ünlülerin burçlarını keşfet. Oyuncular, müzisyenler, sporcular ve daha fazlası.",
};

const CELEBRITY_LIST_LIMIT = 2000;

export default async function UnlulerPage() {
  const celebrities = await listCelebrities(CELEBRITY_LIST_LIMIT);
  const list = celebrities.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    job: c.job,
    zodiac: c.zodiac,
    image: c.image,
  }));

  return (
    <div className="min-h-screen bg-[#F7F8FC] pb-28">
      <section className="border-b border-gray-200 bg-white py-16">
        <Container size="lg">
          <h1 className="text-4xl font-bold text-black sm:text-5xl">
            Hangi Ünlü Hangi Burç?
          </h1>
          <p className="mt-4 max-w-2xl text-gray-600">
            İsim veya meslek yazarak arama yapabilirsiniz. 
          </p>
        </Container>
      </section>

      <Container size="full" className="mt-12">
        <CelebrityGrid celebrities={list} />
      </Container>
    </div>
  );
}

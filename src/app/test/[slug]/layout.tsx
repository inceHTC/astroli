import type { Metadata } from "next";
import { TESTS } from "@/data/tests";
import { getBaseUrl } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const test = TESTS.find((t) => t.slug === slug);
  if (!test) return {};

  const base = getBaseUrl();
  const title = `${test.title} | Astroli`;
  const description = test.description.slice(0, 155);

  return {
    title,
    description,
    alternates: { canonical: `${base}/test/${slug}` },
    openGraph: {
      title,
      description,
      url: `${base}/test/${slug}`,
    },
  };
}

export default function TestLayout({ children }: { children: React.ReactNode }) {
  return children;
}

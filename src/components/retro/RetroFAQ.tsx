interface FAQItem {
  question: string;
  answer: string;
}

interface RetroFAQProps {
  planetName: string;
  faq: FAQItem[];
  canonicalUrl: string;
}

export function RetroFAQ({ planetName, faq, canonicalUrl }: RetroFAQProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return (
    <section className="relative mt-10 rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg sm:p-7">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500">
          Sık sorulan sorular
        </p>
        <h2 className="mt-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 bg-clip-text text-xl font-semibold text-transparent sm:text-2xl">
          {planetName.replace(/\s+Retrosu$/, "")} retrosu hakkında merak edilenler
        </h2>
        <p className="mt-1 text-xs text-gray-600 leading-relaxed">
          Bilimsel dengeyi ve psikolojik yaklaşımı koruyarak,{" "}
          <span className="font-semibold text-gray-800">abartısız ve net yanıtlar</span>{" "}
          sunuyoruz.
        </p>

        <div className="mt-5 divide-y divide-gray-200">
          {faq.map((item) => (
            <details
              key={item.question}
              className="group py-3 text-sm"
            >
              <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
                <span className="mr-6 text-left text-[13px] font-semibold text-gray-900 group-open:text-purple-700">
                  {item.question}
                </span>
                <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full border-2 border-gray-300 bg-gray-50 text-[10px] font-semibold text-gray-600 transition group-open:border-purple-400 group-open:bg-purple-100 group-open:text-purple-700">
                  +
                </span>
              </summary>
              <p className="mt-2 pr-8 text-[13px] leading-relaxed text-gray-700">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>

      <link rel="canonical" href={canonicalUrl} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </section>
  );
}


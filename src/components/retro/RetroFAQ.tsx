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
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <section className="relative mt-8 rounded-2xl border border-white/[0.07] bg-[#0E1523] p-6 sm:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#A78BFA]">
        Sik sorulan sorular
      </p>
      <h2 className="mt-1 text-xl font-bold text-[#EDE9DF] sm:text-2xl">
        {planetName.replace(/\s+Retrosu$/, "")} retrosu hakkinda merak edilenler
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-[#7A8090]">
        Bilimsel dengeyi ve psikolojik yaklasimi koruyarak,{" "}
        <span className="text-[#C4C0BA]">abartisiz ve net yanitlar</span>.
      </p>

      <div className="mt-5 divide-y divide-white/[0.05]">
        {faq.map((item) => (
          <details key={item.question} className="group py-4">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-3">
              <span className="mr-4 text-left text-sm font-semibold text-[#C4C0BA] group-open:text-[#A78BFA] transition-colors">
                {item.question}
              </span>
              <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full border border-white/[0.10] bg-white/[0.04] text-[11px] font-semibold text-[#7A8090] transition group-open:border-[#A78BFA]/30 group-open:text-[#A78BFA]">
                +
              </span>
            </summary>
            <p className="mt-3 pr-8 text-sm leading-relaxed text-[#C4C0BA]">
              {item.answer}
            </p>
          </details>
        ))}
      </div>

      <link rel="canonical" href={canonicalUrl} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </section>
  );
}

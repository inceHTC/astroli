"use client";

type ArticleShareProps = {
  title: string;
  slug: string;
  /** Base URL (e.g. https://example.com). Pass from server to avoid hydration mismatch. */
  baseUrl: string;
};

export function ArticleShare({ title, slug, baseUrl }: ArticleShareProps) {
  const url = `${baseUrl}/dergi/${slug}`;
  const shareUrl = encodeURIComponent(url);
  const text = encodeURIComponent(title);

  const twitter = `https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`;
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
  const whatsapp = `https://wa.me/?text=${text}%20${shareUrl}`;

  return (
    <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-gray-200 pt-8">
      <span className="text-sm font-medium text-gray-500">Paylaş:</span>
      <a
        href={twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
      >
        X (Twitter)
      </a>
      <a
        href={facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
      >
        Facebook
      </a>
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
      >
        WhatsApp
      </a>
      <button
        type="button"
        onClick={() => {
          navigator.clipboard?.writeText(url);
        }}
        className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 transition hover:bg-gray-50"
      >
        Linki kopyala
      </button>
    </div>
  );
}

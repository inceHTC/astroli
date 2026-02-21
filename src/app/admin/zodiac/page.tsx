import Link from "next/link";
import { ZODIAC_SIGNS } from "@/data/zodiac";

const ELEMENT_LABELS: Record<string, string> = {
  fire: "Ateş",
  earth: "Toprak",
  air: "Hava",
  water: "Su",
};

export default function AdminZodiacPage() {
  return (
    <div className="px-8 pb-16">
      <h1 className="font-display text-2xl font-semibold text-white">
        Burç İçerikleri
      </h1>
      <p className="mt-2 text-zinc-500">
        Her burcun sayfa içeriğini düzenleyin.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ZODIAC_SIGNS.map((sign) => (
          <div
            key={sign.id}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:border-white/10"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{sign.symbol}</span>
              <div>
                <h3 className="font-semibold text-white">{sign.nameTr}</h3>
                <p className="text-xs text-zinc-500">
                  {ELEMENT_LABELS[sign.element]} · {sign.dates}
                </p>
              </div>
            </div>
            <Link
              href={`/burc/${sign.id}`}
              target="_blank"
              className="mt-4 block text-center rounded-lg border border-white/10 py-2 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
            >
              Sayfayı Görüntüle
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

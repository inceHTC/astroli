"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

export default function IletisimPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError((data.error as string) ?? "Mesaj gönderilemedi.");
        return;
      }
      setSent(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-[#070B12] min-h-screen pb-28">
      <section className="relative overflow-hidden bg-[#070B12]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(91,63,255,0.06),transparent_60%)]" />
        <Container size="md">
          <div className="relative py-16 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#EDE9DF]">
              İletişim
            </h1>
            <p className="mt-4 text-lg text-[#8494B2]">
              Sorularınız veya önerileriniz için aşağıdaki formu kullanabilirsiniz. En kısa sürede size dönüş yapacağız.
            </p>
          </div>
        </Container>
      </section>

      <section className="mt-12">
        <Container size="sm">
          {sent ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-900/20 p-8 text-center">
              <p className="text-lg font-medium text-emerald-400">
                Mesajınız alındı. En kısa sürede size dönüş yapacağız.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-4 text-sm font-medium text-[#ffc552] hover:underline"
              >
                Yeni mesaj gönder
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/[0.10] bg-[#0E1523] p-8 "
            >
              <div className="space-y-6">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-[#8494B2]">
                    Adınız
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-2 w-full rounded-xl border border-white/[0.10] bg-[#0C1220] px-4 py-3 text-[#EDE9DF] focus:border-[#ffc552] focus:ring-1 focus:ring-[#ffc552]/20 outline-none"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-[#8494B2]">
                    E-posta
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-2 w-full rounded-xl border border-white/[0.10] bg-[#0C1220] px-4 py-3 text-[#EDE9DF] focus:border-[#ffc552] focus:ring-1 focus:ring-[#ffc552]/20 outline-none"
                    placeholder="ornek@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-[#8494B2]">
                    Mesajınız
                  </label>
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    className="mt-2 w-full rounded-xl border border-white/[0.10] bg-[#0C1220] px-4 py-3 text-[#EDE9DF] focus:border-[#ffc552] focus:ring-1 focus:ring-[#ffc552]/20 outline-none resize-y"
                    placeholder="Mesajınızı yazın..."
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-400">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#ffc552] px-4 py-3 text-sm font-medium text-white hover:bg-[#ffd47a] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Gönderiliyor…" : "Gönder"}
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-[#6B7A99]">
            <Link href="/" className="text-[#ffc552] hover:underline">
              ← Ana sayfaya dön
            </Link>
          </p>
        </Container>
      </section>
    </div>
  );
}


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
    <div className="bg-[#F7F8FC] min-h-screen pb-28">
      <section className="relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(91,63,255,0.06),transparent_60%)]" />
        <Container size="md">
          <div className="relative py-16 text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-black">
              İletişim
            </h1>
            <p className="mt-4 text-lg text-[#444]">
              Sorularınız veya önerileriniz için aşağıdaki formu kullanabilirsiniz. En kısa sürede size dönüş yapacağız.
            </p>
          </div>
        </Container>
      </section>

      <section className="mt-12">
        <Container size="sm">
          {sent ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-8 text-center">
              <p className="text-lg font-medium text-emerald-800">
                Mesajınız alındı. En kısa sürede size dönüş yapacağız.
              </p>
              <button
                type="button"
                onClick={() => setSent(false)}
                className="mt-4 text-sm font-medium text-[#5B3FFF] hover:underline"
              >
                Yeni mesaj gönder
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
            >
              <div className="space-y-6">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700">
                    Adınız
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-[#5B3FFF] focus:ring-1 focus:ring-[#5B3FFF]/30 outline-none"
                    placeholder="Adınız Soyadınız"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700">
                    E-posta
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-[#5B3FFF] focus:ring-1 focus:ring-[#5B3FFF]/30 outline-none"
                    placeholder="ornek@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700">
                    Mesajınız
                  </label>
                  <textarea
                    id="contact-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-[#5B3FFF] focus:ring-1 focus:ring-[#5B3FFF]/30 outline-none resize-y"
                    placeholder="Mesajınızı yazın..."
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#5B3FFF] px-4 py-3 text-sm font-medium text-white hover:bg-[#4A2FDD] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Gönderiliyor…" : "Gönder"}
                </button>
              </div>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            <Link href="/" className="text-[#5B3FFF] hover:underline">
              ← Ana sayfaya dön
            </Link>
          </p>
        </Container>
      </section>
    </div>
  );
}

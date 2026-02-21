import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dergi | Astroli",
  description: "Astroloji, burçlar ve eğlenceli analizler.",
};

export default function DergiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

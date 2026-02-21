"use client";

import dynamic from "next/dynamic";
import type { TocItem } from "@/lib/utils/content";

const ArticleForm = dynamic(
  () => import("./ArticleForm").then((m) => ({ default: m.ArticleForm })),
  {
    ssr: false,
    loading: () => <div className="mt-8 text-gray-500">Form yükleniyor…</div>,
  }
);

type ArticleFormLoaderProps = {
  initial?: {
    id: string;
    title: string;
    slug: string;
    tag: string;
    image: string | null;
    excerpt: string | null;
    content: string;
    readTime: number | null;
    toc: TocItem[] | null;
    published: boolean;
    featured: boolean;
  };
};

export function ArticleFormLoader(props: ArticleFormLoaderProps) {
  return <ArticleForm {...props} />;
}

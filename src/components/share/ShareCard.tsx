"use client";

import { useRef } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/Button";

interface ShareCardProps {
  title: string;
  subtitle?: string;
  type: "chart" | "test";
  elementBreakdown?: Record<string, number>;
}

export function ShareCard({
  title,
  subtitle,
  type,
  elementBreakdown,
}: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: 1080,
        height: 1920,
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = "astroli-paylas.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Share image error:", err);
    }
  };

  const handleShare = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: 1080,
        height: 1920,
        pixelRatio: 2,
        cacheBust: true,
      });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "astroli.png", { type: "image/png" });
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Astroli - Burcumu Keşfettim!",
        });
      } else {
        handleDownload();
      }
    } catch {
      handleDownload();
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-[#444]">Sonucu paylaş</p>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={handleDownload} className="flex-1">
          İndir
        </Button>
        <Button variant="primary" onClick={handleShare} className="flex-1">
          Paylaş
        </Button>
      </div>

      <div
        ref={cardRef}
        className="mx-auto flex w-[270px] flex-col justify-between overflow-hidden rounded-2xl bg-[#11121A] p-6 sm:w-[300px]"
        style={{
          aspectRatio: "9/16",
          border: "1px solid rgba(91, 63, 255, 0.2)",
        }}
      >
        <div>
          {subtitle && (
            <p className="text-xs font-medium text-[#5B3FFF]">{subtitle}</p>
          )}
          <h2 className="mt-2 text-lg font-semibold leading-tight text-white">
            {title}
          </h2>
          {elementBreakdown && Object.keys(elementBreakdown).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(elementBreakdown).map(([elem, pct]) => (
                <span
                  key={elem}
                  className="rounded-full border border-[#5B3FFF]/30 bg-[#5B3FFF]/10 px-2 py-0.5 text-xs text-[#8C7BFF]"
                >
                  {elem === "fire" && "Ateş"}
                  {elem === "earth" && "Toprak"}
                  {elem === "air" && "Hava"}
                  {elem === "water" && "Su"}
                  {" "}{pct}%
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="text-center">
          <span className="text-sm font-semibold text-[#5B3FFF]">Astroli</span>
        </div>
      </div>
    </div>
  );
}

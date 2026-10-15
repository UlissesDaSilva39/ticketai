"use client";
import { useEffect, useState } from "react";

export default function TicketQR({ value, size = 220 }: { value: string; size?: number }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const QR = await import("qrcode");
        const url = await QR.toDataURL(value, {
          width: size,
          margin: 1,
          color: { dark: "#000000", light: "#ffffff" },
          errorCorrectionLevel: "M",
        });
        if (!cancelled) setDataUrl(url);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "QR generation failed");
      }
    })();
    return () => { cancelled = true; };
  }, [value, size]);

  if (error) {
    return (
      <div className="w-[220px] h-[220px] flex items-center justify-center border border-red-200 bg-red-50 text-xs text-red-600 rounded-lg">
        {error}
      </div>
    );
  }

  if (!dataUrl) {
    return (
      <div className="w-[220px] h-[220px] flex items-center justify-center border border-gray-200 bg-gray-50 text-xs text-gray-500 rounded-lg">
        Generating QR…
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={dataUrl} alt="Ticket QR code" className="rounded-lg border border-gray-200" />
  );
}
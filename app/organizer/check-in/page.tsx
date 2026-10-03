"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type CheckResult = {
  success?: boolean;
  ticket_type?: string;
  event_title?: string;
  checked_in_at?: string;
  error?: string;
};

export default function CheckInPage() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [history, setHistory] = useState<CheckResult[]>([]);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const scannerRef = useRef<unknown>(null);

  useEffect(() => {
    return () => {
      const s = scannerRef.current as { stop?: () => Promise<void>; clear?: () => void } | null;
      if (s) {
        if (s.stop) { s.stop().catch(() => {}); }
        if (s.clear) { try { s.clear(); } catch {} }
      }
    };
  }, []);

  const checkIn = async (qrCode?: string) => {
    const value = (qrCode || code).trim();
    if (!value) return;
    setChecking(true);
    setResult(null);
    try {
      const res = await fetch("/api/tickets/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrCode: value }),
      });
      const data = await res.json();
      setResult(data);
      setHistory((prev) => [data, ...prev.slice(0, 9)]);
      if (data.success) setCode("");
    } catch (err) {
      const errorResult = { error: err instanceof Error ? err.message : "Failed" };
      setResult(errorResult);
      setHistory((prev) => [errorResult, ...prev.slice(0, 9)]);
    } finally {
      setChecking(false);
    }
  };

  const startScanning = async () => {
    setError("");
    setScanning(true);
    try {
      const mod = await import("html5-qrcode");
      const Html5Qrcode = mod.Html5Qrcode;
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText: string) => {
          scanner.stop().catch(() => {});
          scanner.clear();
          scannerRef.current = null;
          setScanning(false);
          checkIn(decodedText);
        },
        () => {}
      );
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Could not start camera. Check permissions."
      );
      setScanning(false);
    }
  };

  const stopScanning = async () => {
    const s = scannerRef.current as { stop?: () => Promise<void>; clear?: () => void } | null;
    if (s) {
      if (s.stop) { try { await s.stop(); } catch {} }
      if (s.clear) { try { s.clear(); } catch {} }
      scannerRef.current = null;
    }
    setScanning(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/organizer" className="text-sm text-gray-500 hover:text-black">
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-5xl font-bold mb-3" style={{ fontFamily: "var(--font-antonio)" }}>
        CHECK-IN
      </h1>
      <p className="text-gray-500 mb-10">Scan tickets with your camera, or enter QR codes manually.</p>

      {!scanning ? (
        <button
          onClick={startScanning}
          className="w-full mb-6 py-6 bg-black text-white text-lg font-medium rounded-full hover:bg-gray-800"
        >
          📷 Scan with Camera
        </button>
      ) : (
        <div className="mb-6">
          <div id="qr-reader" className="rounded-lg overflow-hidden bg-black min-h-[300px]" />
          <button
            onClick={stopScanning}
            className="w-full mt-4 py-3 border-2 border-black font-medium rounded-full hover:bg-gray-50"
          >
            Stop Scanning
          </button>
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg mb-6">{error}</p>
      )}

      <div className="mb-8">
        <label className="block text-sm font-medium mb-2">Or paste QR code manually</label>
        <div className="flex gap-3">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") checkIn(); }}
            placeholder="Paste QR code"
            className="flex-1 px-4 py-4 border border-gray-300 rounded-lg focus:border-black focus:outline-none font-mono text-sm"
          />
          <button
            onClick={() => checkIn()}
            disabled={checking || !code.trim()}
            className="px-8 py-4 bg-black text-white font-medium rounded-full hover:bg-gray-800 disabled:opacity-50"
          >
            {checking ? "..." : "Check In"}
          </button>
        </div>
      </div>

      {result && (
        <div
          className={
            "rounded-lg p-6 mb-8 " +
            (result.success
              ? "bg-[#00FF87] text-black"
              : "bg-red-50 text-red-800 border border-red-200")
          }
        >
          {result.success ? (
            <>
              <p className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-antonio)" }}>✓ CHECKED IN</p>
              <p className="font-medium">{result.event_title}</p>
              <p className="text-sm">{result.ticket_type}</p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold mb-1" style={{ fontFamily: "var(--font-antonio)" }}>
                ✗ {result.error || "Invalid ticket"}
              </p>
              {result.checked_in_at && (
                <p className="text-sm">
                  Checked in at {new Date(result.checked_in_at).toLocaleString("en-GB")}
                </p>
              )}
            </>
          )}
        </div>
      )}

      {history.length > 0 && (
        <div>
          <h2 className="text-sm uppercase tracking-widest text-gray-500 mb-3">Recent Scans</h2>
          <div className="space-y-2">
            {history.map((h, i) => (
              <div
                key={i}
                className={
                  "flex items-center justify-between p-3 rounded-lg text-sm " +
                  (h.success ? "bg-gray-50" : "bg-red-50")
                }
              >
                <span>{h.success ? h.ticket_type + " — " + h.event_title : h.error}</span>
                <span className="text-xs text-gray-500">{h.success ? "✓" : "✗"}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

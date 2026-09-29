"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import QrScanner from "qr-scanner";

export default function QrScannerPanel() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    QrScanner.WORKER_PATH = "/qr-scanner-worker.min.js";

    const scanner = new QrScanner(video, (result) => handleDecode(result.data), {
      preferredCamera: "environment",
      highlightScanRegion: true,
      highlightCodeOutline: true,
    });
    scannerRef.current = scanner;

    scanner.start().catch(() => {
      setError(
        "Impossible d'accéder à la caméra. Utilise l'appareil photo de ton téléphone à la place."
      );
    });

    return () => {
      scanner.stop();
      scanner.destroy();
      scannerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDecode(data: string) {
    setLastResult(data);
    setError(null);
    scannerRef.current?.stop();

    try {
      const url = new URL(data, window.location.origin);
      if (url.origin === window.location.origin) {
        router.push(url.pathname + url.search);
        return;
      }
      window.location.href = url.toString();
    } catch {
      setError(`QR non reconnu : "${data}"`);
      scannerRef.current?.start();
    }
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3">
      <div className="relative w-full overflow-hidden rounded-md border border-white/20 bg-black">
        <video ref={videoRef} className="w-full" muted playsInline />
      </div>
      {error && (
        <p className="rounded-md border border-primary/40 bg-primary/10 p-3 text-white">
          {error}
        </p>
      )}
      {lastResult && !error && (
        <p className="text-white/70">Dernier code lu : {lastResult}</p>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState, type ReactNode } from "react";

type Status = "checking" | "connected" | "not-connected";

// Vérifie que l'appareil est sur le WiFi Localhost avant d'afficher son contenu.
// À utiliser uniquement sur les salles qui ont vraiment besoin du réseau
// (coworking, impression 3D) — les autres salles n'en ont pas besoin.
export default function WifiRequiredGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    setStatus("checking");
    try {
      const res = await fetch("/api/wifi-check");
      const data: { connected: boolean } = await res.json();
      setStatus(data.connected ? "connected" : "not-connected");
    } catch {
      setStatus("not-connected");
    }
  }

  if (status === "checking") {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-white/70">Vérification de la connexion...</p>
      </div>
    );
  }

  if (status === "not-connected") {
    return (
      <div className="flex flex-1 flex-col items-center gap-3 p-8 text-center">
        <p className="text-4xl">📡</p>
        <h2 className="text-2xl font-extrabold text-white">
          Connecte-toi au WiFi Localhost
        </h2>
        <p className="max-w-sm text-white/80">
          Cette salle utilise des appareils connectés au réseau : tu dois être
          sur le WiFi Localhost pour continuer.
        </p>
        <button onClick={checkConnection} className="btn-primary mt-2">
          Réessayer
        </button>
      </div>
    );
  }

  return <>{children}</>;
}

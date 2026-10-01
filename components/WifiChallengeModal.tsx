"use client";

import { useEffect, useState, type SubmitEvent } from "react";
import {
  checkWifiPassword,
  isWifiChallengeSolved,
  markWifiChallengeSolved,
} from "@/lib/wifi";

type NetworkStatus = "checking" | "connected" | "not-connected";

// Pop-up plein écran affiché à l'arrivée sur l'accueil : annonce le tout premier défi
// (trouver le mot de passe du WiFi Localhost). Seul le mot de passe est bloquant ici —
// être réellement connecté au bon réseau n'est utile que pour certaines salles
// (coworking, impression 3D), vérifié là-bas par WifiRequiredGate. Ici, l'état de la
// connexion n'est affiché qu'à titre informatif.
export default function WifiChallengeModal() {
  // null tant qu'on n'a pas encore vérifié le cookie (évite d'afficher le défi une fraction
  // de seconde à chaque visite si le joueur l'a déjà résolu).
  const [solved, setSolved] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [network, setNetwork] = useState<NetworkStatus>("checking");

  useEffect(() => {
    setSolved(isWifiChallengeSolved());
  }, []);

  // Juste informatif : montre si l'appareil est déjà sur le bon réseau ou non.
  useEffect(() => {
    if (solved !== false) return;
    fetch("/api/wifi-check")
      .then((res) => res.json())
      .then((data: { connected: boolean }) => {
        setNetwork(data.connected ? "connected" : "not-connected");
      })
      .catch(() => setNetwork("not-connected"));
  }, [solved]);

  if (solved !== false) return null;

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (checkWifiPassword(password)) {
      markWifiChallengeSolved();
      setSolved(true);
    } else {
      setError(true);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-sm rounded-md bg-white p-6 text-center shadow-xl">
        <p className="text-4xl">📶</p>
        <h2 className="mt-2 text-2xl font-extrabold text-text">
          Premier défi : le WiFi
        </h2>
        <p className="mt-3 text-text-secondary">
          Être connecté au WiFi <strong className="text-text">Localhost</strong> est
          indispensable pour découvrir tout le coworking : plusieurs défis utilisent
          des appareils connectés au réseau.
        </p>
        <p className="mt-3 font-semibold text-text">
          Trouve le mot de passe du WiFi Localhost pour continuer.
        </p>

        {/* Indication informative, non bloquante : juste pour que le joueur sache où il en est. */}
        <p
          className={`mt-3 text-sm ${
            network === "connected" ? "text-lime" : "text-text-secondary"
          }`}
        >
          {network === "checking" && "Vérification de ta connexion..."}
          {network === "connected" && "📶 Tu es connecté au WiFi Localhost."}
          {network === "not-connected" &&
            "📡 Tu n'es pas (encore) connecté au WiFi Localhost."}
        </p>

        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
          <input
            type="text"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            placeholder="Mot de passe du WiFi"
            autoFocus
            className="rounded-md border border-border px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {error && (
            <p className="text-sm text-primary">
              Mot de passe incorrect, cherche encore !
            </p>
          )}
          <button type="submit" className="btn-primary mt-1 w-full">
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}

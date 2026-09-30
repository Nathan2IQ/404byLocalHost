"use client";

import { useEffect, useState } from "react";
import {
  getProgress,
  resetProgress,
  setRoomSolved,
  solvedCount,
  type ProgressState,
  type RoomId,
} from "@/lib/progress";

// Les 4 salles du jeu, avec leur nom affiché.
const ROOMS: { id: RoomId; label: string }[] = [
  { id: "salon", label: "Salon" },
  { id: "coworking", label: "Coworking" },
  { id: "impression-3d", label: "Impression 3D" },
  { id: "hub", label: "Hub" },
];

// Panneau de test : permet de marquer/démarquer une salle comme résolue à la main,
// sans avoir à résoudre les vraies énigmes. Utile tant que les pages des salles
// ne sont pas encore construites.
export default function ProgressTestPanel({
  onChange,
}: {
  // Prévient le composant parent à chaque changement (ex. pour rafraîchir l'affichage).
  onChange?: (progress: ProgressState) => void;
}) {
  const [progress, setProgress] = useState<ProgressState | null>(null);

  // Au montage : on lit la progression déjà sauvegardée dans le cookie.
  useEffect(() => {
    setProgress(getProgress());
  }, []);

  // Tant qu'on n'a pas encore lu la progression, on n'affiche rien.
  if (!progress) return null;

  // Inverse l'état (résolue / non résolue) d'une salle.
  function toggle(roomId: RoomId) {
    const next = setRoomSolved(roomId, !progress![roomId]);
    setProgress(next);
    onChange?.(next);
  }

  // Remet les 4 salles à "non résolues".
  function handleReset() {
    resetProgress();
    const next = getProgress();
    setProgress(next);
    onChange?.(next);
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-3 rounded-md border border-white/20 bg-white/10 p-4">
      <p className="text-white">Progression : {solvedCount(progress)}/4</p>
      <div className="grid w-full grid-cols-2 gap-2">
        {ROOMS.map((room) => (
          <button
            key={room.id}
            onClick={() => toggle(room.id)}
            className={`rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
              progress[room.id]
                ? "border-lime bg-lime/20 text-lime"
                : "border-white/20 bg-transparent text-white/70"
            }`}
          >
            {progress[room.id] ? "✅" : "⬜"} {room.label}
          </button>
        ))}
      </div>
      <button
        onClick={handleReset}
        className="text-sm text-white/60 underline underline-offset-2"
      >
        Réinitialiser
      </button>
    </div>
  );
}

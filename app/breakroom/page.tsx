"use client";

import { useEffect, useState } from "react";
import {
  getProgress,
  isComplete,
  solvedCount,
  type ProgressState,
} from "@/lib/progress";
import PuzzleBoard from "@/components/PuzzleBoard";
import AvancementPartie from "@/components/AvancementPartie";

const TOTAL_ROOMS = 4;

// Page finale ("salle de repos") : bloquée tant que les 4 salles ne sont pas résolues.
// Une fois les 4 résolues, affiche le puzzle à assembler.
export default function FinalPage() {
  const [progress, setProgress] = useState<ProgressState | null>(null);

  // Au montage : on lit la progression sauvegardée dans le cookie.
  useEffect(() => {
    setProgress(getProgress());
  }, []);

  // Tant qu'on n'a pas encore lu la progression, on n'affiche rien.
  if (!progress) return null;

  const discoveredZones = [

    ...(progress.salon ? ["salon"] : []),
    ...(progress.coworking ? ["coworking"] : []),
    ...(progress["impression-3d"] ? ["impression"] : []),
    ...(progress.hub ? ["hub"] : []),

  ];



  const solved = solvedCount(progress);
  const complete = isComplete(progress);
  const missing = TOTAL_ROOMS - solved;
  return (
      <div className="flex flex-col flex-1 items-center justify-center font-sans">
        <main className="flex w-full max-w-md flex-col items-center gap-4 px-4 py-8 text-center md:max-w-xl lg:max-w-2xl">
          {complete ? (
              // Les 4 salles sont résolues : on peut assembler le puzzle final.
              <>
                <h2 className="text-4xl font-extrabold text-white">
                  🔐 Dernière vérification
                </h2>
                <p className="text-white/80">
                  Bravo, tu as résolu les 4 salles. Assemble le puzzle pour continuer !
                </p>
                <PuzzleBoard />
              </>
          ) : (
              // Il manque encore des salles : la page reste bloquée.
              <>
                <AvancementPartie final={true}/>
              </>
          )}
        </main>
      </div>
  );
}
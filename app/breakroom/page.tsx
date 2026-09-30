"use client";

import { useEffect, useState } from "react";
import {
  getProgress,
  isComplete,
  solvedCount,
  type ProgressState,
} from "@/lib/progress";
import ProgressTestPanel from "@/components/ProgressTestPanel";
import PuzzleBoard from "@/components/PuzzleBoard";
import PlanRevele from "@/components/PlanRevele";

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

  const solved = solvedCount(progress);
  const complete = isComplete(progress);
  const missing = TOTAL_ROOMS - solved;

  // Traduit notre progression (par RoomId) en ids de zones attendus par PlanRevele.
  // "impression-3d" -> "impression" et "repos" (salle de repos) une fois les 4 salles finies.
  const discoveredZones = [
    ...(progress.salon ? ["salon"] : []),
    ...(progress.coworking ? ["coworking"] : []),
    ...(progress["impression-3d"] ? ["impression"] : []),
    ...(progress.hub ? ["hub"] : []),
    ...(complete ? ["repos"] : []),
  ];

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex w-full max-w-md flex-col items-center gap-4 px-4 py-8 text-center md:max-w-xl lg:max-w-2xl">
        {complete ? (
          // Les 4 salles sont résolues : on peut assembler le puzzle final.
          <>
            <h2 className="text-4xl font-extrabold text-white">
              🧩 Puzzle complet !
            </h2>
            <p className="text-white/80">
              Bravo, tu as résolu les 4 salles. Assemble le puzzle !
            </p>
            <PuzzleBoard />
          </>
        ) : (
          // Il manque encore des salles : la page reste bloquée.
          <>
            <h2 className="text-3xl font-extrabold text-white">
              🔒 Il te manque {missing} pièce{missing > 1 ? "s" : ""}
            </h2>
            <p className="text-white/80">
              Reviens ici une fois les 4 salles résolues.
            </p>
          </>
        )}
        <p className="text-white/60">
          Progression : {solved}/{TOTAL_ROOMS}
        </p>

        {/* Panneau de test : à retirer une fois les vraies pages des salles construites. */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <h3 className="text-lg font-bold text-white">
            🧪 Test : marquer les salles résolues
          </h3>
          <ProgressTestPanel onChange={setProgress} />
        </div>

        {/* Test : plan qui se révèle salle par salle (plan.svg de remplacement pour l'instant). */}
        <div className="mt-8 flex w-full flex-col items-center gap-2">
          <h3 className="text-lg font-bold text-white">
            🗺️ Test : plan révélé
          </h3>
          <PlanRevele discovered={discoveredZones} />
        </div>
      </main>
    </div>
  );
}

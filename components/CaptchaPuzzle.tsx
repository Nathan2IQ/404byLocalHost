"use client";

import { useEffect, useState } from "react";
import PuzzleBoard from "@/components/PuzzleBoard";
import { isPuzzleSolved } from "@/lib/puzzle";

// Enchaînement après avoir coché la case :
// verification (roue qui tourne) → valide (tic vert) → sortie (le captcha s'efface) → puzzle.
type Etape = "case" | "verification" | "valide" | "sortie" | "puzzle";

// Durée de chaque étape avant de passer à la suivante (en ms).
const DUREES: Partial<Record<Etape, { suivante: Etape; ms: number }>> = {
  verification: { suivante: "valide", ms: 1200 },
  valide: { suivante: "sortie", ms: 800 },
  sortie: { suivante: "puzzle", ms: 500 },
};

// Clin d'œil aux captchas « Je ne suis pas un robot » : le joueur coche la case,
// une fausse vérification tourne, puis le puzzle apparaît comme le défi à résoudre.
// Nom inventé (« LOCALCAPTCHA ») pour ne pas reprendre une vraie marque.
export default function CaptchaPuzzle() {
  // Puzzle déjà terminé (cookie) : pas besoin de refaire le captcha, on l'affiche directement.
  // Lecture du cookie possible ici : la page breakroom n'affiche ce composant
  // qu'après avoir lu la progression dans le navigateur (jamais rendu côté serveur).
  const [dejaResolu] = useState(() => isPuzzleSolved());
  const [etape, setEtape] = useState<Etape>(dejaResolu ? "puzzle" : "case");

  useEffect(() => {
    const transition = DUREES[etape];
    if (!transition) return;
    const timer = setTimeout(
      () => setEtape(transition.suivante),
      transition.ms,
    );
    return () => clearTimeout(timer);
  }, [etape]);

  if (etape === "puzzle") {
    return (
      <div
        className={`flex w-full flex-col items-center gap-4 ${
          dejaResolu ? "" : "animate-captcha-reveal"
        }`}
      >
        {!dejaResolu && (
          <p className="text-white/80">
            Vérification supplémentaire requise : reconstitue l&apos;image.
          </p>
        )}
        <PuzzleBoard />
      </div>
    );
  }

  return (
    <div
      className={`flex w-full flex-col items-center gap-6 transition-all duration-500 ${
        etape === "sortie" ? "scale-95 opacity-0 blur-sm" : ""
      }`}
    >
      <p className="text-lg text-white/80">
        Incroyable, tu es arrivé jusqu&apos;ici ! Une dernière formalité :
        vérifie que tu es bien un humain.
      </p>

      {/* Widget façon captcha : case à cocher à gauche, « logo » à droite. */}
      <div className="flex w-full max-w-xs items-center justify-between gap-3 rounded-sm border border-neutral-300 bg-neutral-50 px-3 py-4 text-left shadow-md">
        <button
          type="button"
          onClick={() => setEtape("verification")}
          disabled={etape !== "case"}
          aria-label="Je ne suis pas un robot"
          className="flex items-center gap-3 disabled:cursor-default"
        >
          <span className="flex size-7 shrink-0 items-center justify-center rounded-sm border-2 border-neutral-400 bg-white">
            {etape === "verification" && (
              <span className="size-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
            )}
            {(etape === "valide" || etape === "sortie") && (
              <span className="animate-quiz-pop text-2xl font-bold leading-none text-green">
                ✓
              </span>
            )}
          </span>
          <span className="text-sm text-neutral-800">
            Je ne suis pas un robot
          </span>
        </button>

        <div className="flex flex-col items-center text-neutral-500">
          <span aria-hidden="true" className="text-2xl leading-none">
            🧩
          </span>
          <span className="mt-1 text-[10px] font-semibold">LOCALCAPTCHA</span>
          <span className="text-[8px]">Aucun robot n&apos;a été blessé</span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { getProgress, solvedCount } from "@/lib/progress";
import { isPuzzleSolved } from "@/lib/puzzle";

const TOTAL_ROOMS = 4;

// Le cookie ne change pas pendant qu'on est sur l'accueil : pas besoin de s'abonner.
const subscribe = () => () => {};

type AccueilSectionsProps = {
  mission: ReactNode;
  salles: ReactNode;
  regles: ReactNode;
};

// Sections de l'accueil sous le plan.
// Premier passage : salles, mission et règles affichées en entier.
// Dès qu'une salle est terminée : la progression passe en premier, et la mission
// et les règles sont repliées derrière un lien discret « Revoir les règles ».
export default function AccueilSections({
  mission,
  salles,
  regles,
}: AccueilSectionsProps) {
  // null côté serveur : le cookie n'est lisible que dans le navigateur.
  const solved = useSyncExternalStore(
    subscribe,
    () => solvedCount(getProgress()),
    () => null,
  );
  // Puzzle final (salle de restauration) terminé ?
  const puzzleTermine = useSyncExternalStore(
    subscribe,
    () => isPuzzleSolved(),
    () => false,
  );

  // Tant que la progression n'est pas lue, on n'affiche rien
  // (évite d'afficher les règles une fraction de seconde puis de les replier).
  if (solved === null) return null;

  if (solved === 0) {
    return (
      <>
        <div className="bg-white my-4 flex flex-col py-4 px-4">
          <h3 className="text-4xl text-text font-bold my-10">🚪Les 4 salles</h3>
          {salles}
        </div>
        {mission}
        {regles}
      </>
    );
  }

  const restantes = TOTAL_ROOMS - solved;
  const pluriel = solved > 1 ? "s" : "";

  return (
    <>
      <div className="bg-white my-4 flex flex-col py-4 px-4">
        <h3 className="text-4xl text-text font-bold mt-10">🚪Ta progression</h3>
        <p className="mt-2 mb-6 text-xl text-text-secondary">
          <span className="font-bold text-green">
            {`${solved} salle${pluriel} terminée${pluriel}`}
          </span>
          {" · "}
          {restantes > 0
            ? `${restantes} à découvrir`
            : puzzleTermine
              ? "puzzle final réussi, aventure terminée 🏆"
              : "direction la salle de restauration pour le défi final !"}
        </p>
        {salles}
      </div>

      <details className="group mt-2 mb-6 px-4">
        {/* Bouton discret dans le style des cartes de salle ; la flèche pivote à l'ouverture. */}
        <summary className="mx-auto flex w-fit cursor-pointer list-none items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white/80 shadow-lg backdrop-blur-xl transition-colors hover:border-yellow/60 hover:text-white [&::-webkit-details-marker]:hidden">
          <span aria-hidden="true">📜</span>
          <span className="group-open:hidden">
            Revoir la mission et les règles
          </span>
          <span className="hidden group-open:inline">
            Masquer la mission et les règles
          </span>
          <span
            aria-hidden="true"
            className="text-yellow transition-transform duration-200 group-open:rotate-180"
          >
            ▾
          </span>
        </summary>
        <div className="mt-4 -mx-4">
          {mission}
          {regles}
        </div>
      </details>
    </>
  );
}

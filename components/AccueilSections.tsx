"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { getProgress, solvedCount } from "@/lib/progress";

const TOTAL_ROOMS = 4;

// Le cookie ne change pas pendant qu'on est sur l'accueil : pas besoin de s'abonner.
const subscribe = () => () => {};

type AccueilSectionsProps = {
  mission: ReactNode;
  salles: ReactNode;
  regles: ReactNode;
};

// Sections de l'accueil sous le plan.
// Premier passage : mission, salles et règles affichées en entier.
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

  // Tant que la progression n'est pas lue, on n'affiche rien
  // (évite d'afficher les règles une fraction de seconde puis de les replier).
  if (solved === null) return null;

  if (solved === 0) {
    return (
      <>
        {mission}
        <div className="bg-stone my-4 flex flex-col py-4 px-4">
          <h3 className="text-4xl text-white font-bold mb-10">
            🚪Les 4 salles
          </h3>
          {salles}
        </div>
        {regles}
      </>
    );
  }

  const restantes = TOTAL_ROOMS - solved;
  const pluriel = solved > 1 ? "s" : "";

  return (
    <>
      <div className="bg-stone my-4 flex flex-col py-4 px-4">
        <h3 className="text-4xl text-white font-bold">🚪Ta progression</h3>
        <p className="mt-2 mb-6 text-xl text-white/80">
          <span className="font-bold text-lime">
            {`${solved} salle${pluriel} terminée${pluriel}`}
          </span>
          {" · "}
          {restantes === 0
            ? "direction la salle de pause pour le défi final !"
            : `${restantes} à découvrir`}
        </p>
        {salles}
      </div>

      <details className="group mt-2 mb-6 px-4">
        <summary className="cursor-pointer list-none text-center text-sm text-white/60 underline underline-offset-2 hover:text-white">
          <span className="group-open:hidden">
            Revoir la mission et les règles
          </span>
          <span className="hidden group-open:inline">
            Masquer la mission et les règles
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

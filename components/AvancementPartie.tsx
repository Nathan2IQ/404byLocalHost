"use client";

import { useEffect, useState } from "react";
import { getProgress, type ProgressState } from "@/lib/progress";
import { isPuzzleSolved } from "@/lib/puzzle";
import PlanRevele from "@/components/PlanRevele";

type AvancementPartieProps = {
  final?: boolean;
};

// Légende des numéros affichés sur le plan, pour aider à s'y repérer.
// `zone` = identifiant de la zone sur le plan ("repos" s'allume quand le puzzle final est terminé).
const LEGENDE_PLAN: { numero: number; label: string; zone?: string }[] = [
  { numero: 1, label: "Flex office", zone: "coworking" },
  { numero: 3, label: "Hub / salle de réunion", zone: "hub" },
  { numero: 5, label: "Salle de détente et bibliotech", zone: "salon" },
  { numero: 7, label: "Sandbox", zone: "impression" },
  { numero: 4, label: "Salle de restauration / cafétéria", zone: "repos" },
];

// Page de chaque zone du plan (pour rendre les salles libérées cliquables).
const PAGE_DE_ZONE: Record<string, string> = {
  coworking: "/coworking",
  hub: "/hub",
  salon: "/canape",
  impression: "/impression-3d",
  repos: "/breakroom",
};

// Les salles déjà résolues passent en vert, comme elles s'éclairent sur le plan.
function LegendePlan({ discovered }: { discovered: string[] }) {
  return (
    <ul className="mt-4 flex max-w-md flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white">
      {LEGENDE_PLAN.map(({ numero, label, zone }) => {
        const resolue = zone !== undefined && discovered.includes(zone);
        return (
          <li
            key={numero}
            className={`flex items-center gap-2 transition-colors ${
              resolue ? "font-semibold text-lime" : ""
            }`}
          >
            <span
              className={`inline-flex size-5 items-center justify-center rounded-full border text-xs font-bold ${
                resolue
                  ? "border-lime bg-lime/20 text-lime"
                  : "border-white/20 bg-white/10 text-white"
              }`}
            >
              {numero}
            </span>
            {label}
          </li>
        );
      })}
    </ul>
  );
}

export default function AvancementPartie({
  final = false,
}: AvancementPartieProps) {
  const [progress, setProgress] = useState<ProgressState | null>(null);
  // Puzzle final (salle de restauration) terminé : lu dans son propre cookie.
  const [puzzleTermine, setPuzzleTermine] = useState(false);

  // Au montage : on lit la progression sauvegardée dans le cookie.
  useEffect(() => {
    setProgress(getProgress());
    setPuzzleTermine(isPuzzleSolved());
  }, []);

  if (!progress) return null;

  // Les 4 salles à énigmes (comptées pour débloquer la finale).
  const sallesEnigmes = [
    ...(progress.salon ? ["salon"] : []),
    ...(progress.coworking ? ["coworking"] : []),
    ...(progress["impression-3d"] ? ["impression"] : []),
    ...(progress.hub ? ["hub"] : []),
  ];
  // Zones allumées sur le plan : les salles à énigmes + la salle de restauration une fois le puzzle fini.
  const discoveredZones = puzzleTermine
    ? [...sallesEnigmes, "repos"]
    : sallesEnigmes;

  // Zones libérées cliquables sur le plan : on peut y retourner directement.
  const liens = Object.fromEntries(
    discoveredZones.map((zone) => [zone, PAGE_DE_ZONE[zone]]),
  );
  // Les 4 salles résolues mais pas encore le puzzle : une flèche montre la salle
  // de restauration (non cliquable : il faut trouver son QR code sur place).
  const fleche =
    sallesEnigmes.length === 4 && !puzzleTermine ? "repos" : undefined;

  let message;

  if (sallesEnigmes.length === 0) {
    message = "Vous n'avez pas encore élucidé de salle 😒";
  } else if (sallesEnigmes.length < 4) {
    message = `Vous avez découvert ${sallesEnigmes.length} salle${
      sallesEnigmes.length > 1 ? "s 😁" : " 😃"
    }`;
  }

  if (!final) {
    return (
      <div className="py-8 px-4">
        <h3 className="text-center text-white font-caveat text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
          {sallesEnigmes.length < 4 ? (
            message
          ) : puzzleTermine ? (
            // Tout est terminé, puzzle final compris.
            <p>
              🏆 Aventure terminée ! 🏆
              <br />
              <span className="text-3xl">
                Tu as exploré tout Localhost. Bienvenue chez toi !
              </span>
            </p>
          ) : (
            <>
              <p>
                🎉 Bravo 🎉
                <br />
                Vous avez découvert toutes les salles !
                <br />
                <span className="text-3xl">
                  Dirigez-vous maintenant vers la{" "}
                  <span className="font-bold text-5xl font-caveat text-yellow-500">
                    salle de restauration / cafétéria
                  </span>{" "}
                  pour réaliser l&apos;épreuve finale. 🏴‍☠️
                </span>
              </p>
              <p className="text-lg font-sans text-text text-center border rounded-2xl border-red-500 bg-red-200 p-4 mt-4">
                Attention : cette fois le QR code sera bien dissimulé, soyez
                attentif !
              </p>
            </>
          )}
        </h3>

        <PlanRevele
          discovered={discoveredZones}
          liens={liens}
          fleche={fleche}
        />
        <LegendePlan discovered={discoveredZones} />
      </div>
    );
  } else {
    return (
      <div>
        <h2 className="text-3xl font-extrabold text-white">
          🔒 Il te manque {4 - sallesEnigmes.length} pièce
          {4 - sallesEnigmes.length > 1 ? "s" : ""} pour découvrir cette salle
        </h2>
        <br />
        <PlanRevele discovered={discoveredZones} liens={liens} />
        <LegendePlan discovered={discoveredZones} />
        <br />
        <p className="text-white/80">
          Reviens ici une fois les 4 salles résolues.
        </p>
      </div>
    );
  }
}

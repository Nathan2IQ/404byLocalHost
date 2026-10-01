"use client";

import { useEffect, useState } from "react";
import { getProgress, type ProgressState } from "@/lib/progress";
import PlanRevele from "@/components/PlanRevele";

type AvancementPartieProps = {
  final?: boolean;
};

// Légende des numéros affichés sur le plan, pour aider à s'y repérer.
const LEGENDE_PLAN = [
  { numero: 1, label: "Coworking" },
  { numero: 3, label: "HUB" },
  { numero: 5, label: "Canapé" },
  { numero: 7, label: "Imprimante 3D" },
  { numero: 4, label: "Salle de repos" },
];

function LegendePlan() {
  return (
    <ul className="mt-4 flex max-w-md flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-white">
      {LEGENDE_PLAN.map(({ numero, label }) => (
        <li key={numero} className="flex items-center gap-2">
          <span className="inline-flex size-5 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-bold text-white">
            {numero}
          </span>
          {label}
        </li>
      ))}
    </ul>
  );
}

export default function AvancementPartie({
  final = false,
}: AvancementPartieProps) {
  const [progress, setProgress] = useState<ProgressState | null>(null);

  // Au montage : on lit la progression sauvegardée dans le cookie.
  useEffect(() => {
    setProgress(getProgress());
  }, []);

  if (!progress) return null;

  const discoveredZones = [
    ...(progress.salon ? ["salon"] : []),
    ...(progress.coworking ? ["coworking"] : []),
    ...(progress["impression-3d"] ? ["impression"] : []),
    ...(progress.hub ? ["hub"] : []),
  ];

  let message;

  if (discoveredZones.length === 0) {
    message = "Vous n'avez pas encore élucidé de salle 😒";
  } else if (discoveredZones.length < 4) {
    message = `Vous avez découvert ${discoveredZones.length} salle${
      discoveredZones.length > 1 ? "s 😁" : " 😃"
    }`;
  }

  if (!final) {
    return (
      <div className="py-8 px-4">
        <h3 className="text-center text-white font-caveat text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
          {discoveredZones.length < 4 ? (
            message
          ) : (
            <>
              🎉 Bravo 🎉
              <br />
              Vous avez découvert toutes les salles !
              <br />
              <span className="text-3xl">
                Dirigez-vous maintenant vers la{" "}
                <span className="font-bold text-5xl font-caveat text-yellow-500">
                  salle de pause
                </span>{" "}
                pour réaliser l&apos;épreuve finale. 🏴‍☠️
              </span>
            </>
          )}
        </h3>

        <PlanRevele discovered={discoveredZones} />
        <LegendePlan />
      </div>
    );
  } else {
    return (
      <div>
        <h2 className="text-3xl font-extrabold text-white">
          🔒 Il te manque {4 - discoveredZones.length} pièce
          {4 - discoveredZones.length > 1 ? "s" : ""} pour découvrir cette salle
        </h2>
        <br />
        <PlanRevele discovered={discoveredZones} />
        <LegendePlan />
        <br />
        <p className="text-white/80">
          Reviens ici une fois les 4 salles résolues.
        </p>
      </div>
    );
  }
}

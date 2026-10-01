"use client";

import { useEffect, useState } from "react";
import { getProgress, type ProgressState } from "@/lib/progress";

const CARD_BASE =
  "my-4 gap-2 flex flex-col rounded-md border p-4 shadow-lg backdrop-blur-xl transition-colors";
const CARD_SOLVED = "border-green-300/30 bg-green-400/10 text-white";
const CARD_PENDING = "border-white/20 bg-white/10 text-white";

const SALLES = [
  {
    key: "salon" as const,
    title: "Les canapés 🛋️",
    description: "Un espace confortable pour se détendre et discuter.",
  },
  {
    key: "coworking" as const,
    title: "L'open space 💻",
    description:
      "Un espace de coworking pour collaborer et échanger des idées.",
  },
  {
    key: "hub" as const,
    title: "Le HUB 📊",
    description:
      "Un espace dédié aux discussions importantes et aux présentations.",
  },
  {
    key: "impression-3d" as const,
    title: "L'atelier 🛠️",
    description:
      "Un espace pour les activités créatives et les projets pratiques.",
  },
];

export default function SallesList() {
  const [progress, setProgress] = useState<ProgressState | null>(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  return (
    <>
      {/* Salles restantes d'abord, salles terminées ensuite. */}
      {[...SALLES]
        .sort(
          (a, b) => Number(!!progress?.[a.key]) - Number(!!progress?.[b.key]),
        )
        .map(({ key, title, description }) => {
          const solved = !!progress?.[key];
          return (
            <div
              key={key}
              className={`${CARD_BASE} ${solved ? CARD_SOLVED : CARD_PENDING}`}
            >
              <h4 className="flex items-center text-2xl font-bold">
                {title}
                {solved && <span aria-label="Défi réussi">✅</span>}
              </h4>
              <p className="text-lg text-white/80">{description}</p>
            </div>
          );
        })}
    </>
  );
}

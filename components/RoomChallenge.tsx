"use client";

import { useEffect, useState } from "react";
import { getProgress, type RoomId } from "@/lib/progress";
import Link from "next/link";

type RoomChallengeProps = {
  // Salle à vérifier : si déjà résolue, le défi (children) n'est plus accessible.
  roomId: RoomId;
  children: React.ReactNode;
};

// Empêche de refaire le défi d'une salle déjà validée (ex. en rescannant son QR code).
export default function RoomChallenge({
  roomId,
  children,
}: RoomChallengeProps) {
  const [solved, setSolved] = useState<boolean | null>(null);

  // Au montage : on lit la progression sauvegardée dans le cookie.
  useEffect(() => {
    setSolved(getProgress()[roomId]);
  }, [roomId]);

  // Tant qu'on n'a pas encore lu la progression, on n'affiche rien (évite un flash du défi).
  if (solved === null) return null;

  if (solved) {
    return (
      <div className="py-8 px-4 bg-white text-center">
        <h3 className="text-3xl font-bold font-caveat mb-2">
          Défi déjà résolu ✅
        </h3>
        <p className="text-text-secondary text-lg">
          Tu as déjà validé cette salle, direction une autre pièce !
        </p>
        <Link href="/" className="text-primary underline">
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}

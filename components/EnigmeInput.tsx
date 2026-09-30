"use client";

import { useId, useState, type FormEvent } from "react";
import { markRoomSolved, solvedCount, type RoomId } from "../lib/progress";

// Nombre total de salles à résoudre pour compléter le jeu.
const TOTAL_ROOMS = 4;

type EnigmeInputProps = {
  label: string;
  reponseAttendue: number;
  // Salle associée à cette énigme, utilisée pour mettre à jour la progression.
  roomId: RoomId;
};

export default function EnigmeInput({
  label,
  reponseAttendue,
  roomId,
}: EnigmeInputProps) {
  const [reponse, setReponse] = useState("");
  const [statut, setStatut] = useState<
    "idle" | "vide" | "incorrecte" | "correcte"
  >("idle");
  // Non-null déclenche l'affichage du pop-up de confirmation (contient le nombre de salles restantes).
  const [restantes, setRestantes] = useState<number | null>(null);
  const inputId = useId();
  const messageId = useId();

  function verifierReponse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const valeur = reponse.trim();
    if (!valeur) {
      setStatut("vide");
      return;
    }

    const estCorrecte = valeur === String(reponseAttendue);
    setStatut(estCorrecte ? "correcte" : "incorrecte");

    if (estCorrecte) {
      // Sauvegarde la salle comme résolue et calcule le nombre de salles restantes pour le pop-up.
      const progress = markRoomSolved(roomId);
      setRestantes(TOTAL_ROOMS - solvedCount(progress));
    }
  }

  // Message affiché sous le champ selon le statut de la validation.
  const message =
    statut === "idle"
      ? undefined
      : {
          vide: "Entre une réponse avant de valider.",
          incorrecte: "Ce n'est pas encore ça. Réessaie !",
          correcte: "Bonne réponse ! Bien joué !",
        }[statut];

  return (
    <div className="flex flex-col mt-8 mb-4 border border-gray-300 p-4 rounded-md bg-olive-100">
      <form onSubmit={verifierReponse} noValidate>
        <label
          htmlFor={inputId}
          className="text-text-secondary font-bold pb-4 pt-2 text-xl"
        >
          {label}
        </label>
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          value={reponse}
          onChange={(event) => {
            setReponse(event.target.value);
            setStatut("idle");
          }}
          aria-invalid={statut === "vide" || statut === "incorrecte"}
          aria-describedby={statut === "idle" ? undefined : messageId}
          placeholder="Votre réponse"
          className={`border rounded-md p-2 mt-4 w-full ${
            statut === "vide" || statut === "incorrecte"
              ? "border-red-600 focus:outline-red-600"
              : statut === "correcte"
                ? "border-green-700 focus:outline-green-700"
                : "border-gray-300"
          }`}
        />
        <button
          type="submit"
          className="mt-4 w-full bg-yellow-400 font-bold py-2 px-4 rounded-md"
        >
          Valider
        </button>
        {message && (
          <p
            id={messageId}
            role="status"
            className={`mt-3 font-semibold ${
              statut === "correcte" ? "text-green-800" : "text-red-700"
            }`}
          >
            {message}
          </p>
        )}
      </form>
      {/* Pop-up de confirmation affiché uniquement après une réponse correcte. */}
      {restantes !== null && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <div className="bg-white rounded-md p-6 max-w-sm w-full text-center shadow-xl">
            <h4 className="text-2xl font-bold font-caveat mb-2">
              Salle validée !
            </h4>
            <p className="text-text-secondary text-lg mb-4">
              {restantes === 0
                ? "Bravo, tu as résolu toutes les salles !"
                : `Il reste encore ${restantes} salle${restantes > 1 ? "s" : ""} à résoudre.`}
            </p>
            <button
              type="button"
              onClick={() => setRestantes(null)}
              className="bg-yellow-400 font-bold py-2 px-4 rounded-md"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

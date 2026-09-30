"use client";

import { useId, useState, type FormEvent } from "react";

type EnigmeInputProps = {
  label: string;
  reponseAttendue: number;
};

export default function EnigmeInput({
  label,
  reponseAttendue,
}: EnigmeInputProps) {
  const [reponse, setReponse] = useState("");
  const [statut, setStatut] = useState<
    "idle" | "vide" | "incorrecte" | "correcte"
  >("idle");
  const inputId = useId();
  const messageId = useId();

  function verifierReponse(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const valeur = reponse.trim();
    if (!valeur) {
      setStatut("vide");
      return;
    }

    setStatut(valeur === String(reponseAttendue) ? "correcte" : "incorrecte");
  }

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
    </div>
  );
}

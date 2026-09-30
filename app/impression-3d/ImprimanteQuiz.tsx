"use client";

import { useState, type FormEvent } from "react";
import { markRoomSolved, solvedCount } from "@/lib/progress";

// Nombre total de salles à résoudre pour compléter le jeu (comme dans EnigmeInput).
const TOTAL_ROOMS = 4;

// Question du quiz : Vrai/Faux (réponse unique) ou texte libre (réponses acceptées).
type Question =
  | { id: string; label: string; type: "bool"; answer: "vrai" | "faux" }
  | { id: string; label: string; type: "text"; accepted: string[] };

// Les 5 questions du quiz, avec leurs bonnes réponses.
const QUESTIONS: Question[] = [
  {
    id: "q1",
    label:
      "Est-ce qu'une imprimante 3D utilise de l'encre pour imprimer un objet ?",
    type: "bool",
    answer: "faux",
  },
  {
    id: "q2",
    label: "Faut-il être ingénieur pour imprimer un objet ?",
    type: "bool",
    answer: "faux",
  },
  {
    id: "q3",
    label:
      "Quelle est la marque de l'imprimante 3D se trouvant dans cette pièce ?",
    type: "text",
    accepted: ["ender"],
  },
  {
    id: "q4",
    label:
      "Est-ce qu'une imprimante 3D imprime les objets couche par couche comme un millefeuille ?",
    type: "bool",
    answer: "vrai",
  },
  {
    id: "q5",
    label:
      "Quel est le nom de la machine rouge, verte et bleue servant à créer du fil utilisable par l'imprimante 3D à base de bouteilles en plastique ?",
    type: "text",
    accepted: ["module01", "module1"],
  },
];

// Accès à OctoPi pour lancer l'impression du cadeau (nom d'hôte par défaut, résolu sur le Wi-Fi local).
const PRINTER_URL = "http://octopi.local";
const PRINTER_USER = "guest";
const PRINTER_PASSWORD = "guest";
// Réponse attendue à "Que peux-tu lire sur l'objet imprimé ?" (forme normalisée, voir normalize()).
const PRINTED_TEXT_ACCEPTED = ["localhost"];

// Minuscules, sans accents ni espaces : "Module 01" -> "module01".
function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

// Vrai si la saisie contient une des réponses acceptées (ex. "Creality Ender 3" -> "ender").
function matches(value: string, accepted: string[]) {
  const input = normalize(value);
  return input !== "" && accepted.some((a) => input.includes(a));
}

// Vérifie la réponse du joueur à une question du quiz.
function isCorrect(question: Question, value: string) {
  if (question.type === "bool") return value === question.answer;
  return matches(value, question.accepted);
}

// Classes du champ texte selon le résultat (bordure rouge/verte), reprises d'EnigmeInput.
function inputClass(statut: "idle" | "incorrecte" | "correcte") {
  return `border rounded-md p-2 mt-4 w-full bg-white ${
    statut === "incorrecte"
      ? "border-red-600 focus:outline-red-600"
      : statut === "correcte"
        ? "border-green-700 focus:outline-green-700"
        : "border-gray-300"
  }`;
}

// Étape cadeau, affichée après le quiz réussi : impression via OctoPi, puis question sur l'objet imprimé qui valide la salle.
function PrintStep() {
  const [printedText, setPrintedText] = useState<string | null>(null);
  // Non-null déclenche l'affichage du pop-up de confirmation (contient le nombre de salles restantes).
  const [restantes, setRestantes] = useState<number | null>(null);
  const correct =
    printedText !== null && matches(printedText, PRINTED_TEXT_ACCEPTED);

  // Vérifie le texte lu sur l'objet ; si c'est bon, marque la salle comme résolue.
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = String(new FormData(e.currentTarget).get("objet") ?? "");
    setPrintedText(value);

    if (matches(value, PRINTED_TEXT_ACCEPTED)) {
      // Sauvegarde la salle comme résolue et calcule le nombre de salles restantes pour le pop-up.
      const progress = markRoomSolved("impression-3d");
      setRestantes(TOTAL_ROOMS - solvedCount(progress));
    }
  }

  return (
    <>
      <div className="px-4 py-8 bg-neutral-dark">
        <h4 className="text-3xl font-bold text-white mb-2">
          Tu as gagné un petit{" "}
          <span className="font-bold text-5xl pr-1 font-caveat text-yellow-500">
            cadeau de bienvenue
          </span>{" "}
          !
        </h4>
        <p className="text-white px-1 pt-2 text-xl">
          Lance son impression depuis{" "}
          <span className="font-bold text-2xl pr-1.5 font-caveat text-yellow-500">
            OctoPi
          </span>
          en te connectant avec :
        </p>
        <p className="text-white px-1 pt-2 text-xl">
          Utilisateur :{" "}
          <span className="font-bold text-2xl font-caveat text-yellow-500">
            {PRINTER_USER}
          </span>
          <br />
          Mot de passe :{" "}
          <span className="font-bold text-2xl font-caveat text-yellow-500">
            {PRINTER_PASSWORD}
          </span>
        </p>
        <a
          href={PRINTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block w-full rounded-lg bg-yellow-500 px-4 py-2 text-center font-bold text-white hover:bg-yellow-600"
        >
          Ouvrir OctoPi
        </a>
      </div>

      <div className="py-8 px-4 bg-white">
        <h3 className="text-4xl font-bold font-caveat mb-2">
          Partage-nous ta trouvaille !
        </h3>

        <div className="flex flex-col mt-8 mb-4 border border-gray-300 p-4 rounded-md bg-olive-100">
          <form onSubmit={handleSubmit}>
            <label
              htmlFor="objet"
              className="text-text-secondary font-bold pb-4 pt-2 text-xl"
            >
              Que peux-tu lire sur l&apos;objet imprimé ?
            </label>
            <input
              id="objet"
              type="text"
              name="objet"
              placeholder="Votre réponse"
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              required
              className={inputClass(
                printedText === null
                  ? "idle"
                  : correct
                    ? "correcte"
                    : "incorrecte"
              )}
            />
            <button
              type="submit"
              className="mt-4 w-full bg-yellow-400 font-bold py-2 px-4 rounded-md"
            >
              Valider
            </button>
            {printedText !== null && (
              <p
                role="status"
                className={`mt-3 font-semibold ${
                  correct ? "text-green-800" : "text-red-700"
                }`}
              >
                {correct
                  ? "Bonne réponse ! Bien joué !"
                  : "Ce n'est pas encore ça. Réessaie !"}
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Pop-up de confirmation affiché uniquement après une réponse correcte (identique à EnigmeInput). */}
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
    </>
  );
}

// Quiz de la salle : 5 questions, correction à la validation, puis étape cadeau si tout est juste.
export default function ImprimanteQuiz() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = QUESTIONS.filter((q) =>
    isCorrect(q, answers[q.id] ?? "")
  ).length;
  const won = submitted && score === QUESTIONS.length;

  // Récupère les réponses du formulaire et affiche la correction.
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setAnswers(
      Object.fromEntries(
        QUESTIONS.map((q) => [q.id, String(data.get(q.id) ?? "")])
      )
    );
    setSubmitted(true);
  }

  return (
    <>
      <div className="py-8 px-4 bg-white">
        <h3 className="text-4xl font-bold font-caveat mb-2">
          Prêt pour le quiz ?
        </h3>
        <p className="text-text-secondary px-1 text-xl">
          Observe bien la pièce et réponds aux 5 questions pour débloquer ton
          cadeau.
        </p>

        <form onSubmit={handleSubmit}>
          {QUESTIONS.map((q, i) => {
            const value = answers[q.id] ?? "";
            const correct = isCorrect(q, value);
            const statut = !submitted
              ? "idle"
              : correct
                ? "correcte"
                : "incorrecte";
            return (
              <fieldset
                key={q.id}
                className="flex min-w-0 flex-col mt-8 mb-4 border border-gray-300 p-4 rounded-md bg-olive-100"
              >
                <legend className="sr-only">Question {i + 1}</legend>
                <p className="text-text-secondary font-bold pb-4 pt-2 text-xl">
                  {i + 1}. {q.label}
                </p>

                {q.type === "bool" ? (
                  <div className="grid grid-cols-2 gap-3">
                    {(["vrai", "faux"] as const).map((option) => (
                      <label
                        key={option}
                        className="cursor-pointer select-none rounded-md border border-gray-300 bg-white py-2 px-4 text-center font-bold has-checked:border-yellow-400 has-checked:bg-yellow-400 has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary"
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={option}
                          required
                          className="sr-only"
                        />
                        {option === "vrai" ? "Vrai" : "Faux"}
                      </label>
                    ))}
                  </div>
                ) : (
                  <input
                    type="text"
                    name={q.id}
                    placeholder="Votre réponse"
                    autoComplete="off"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    required
                    className={inputClass(statut)}
                  />
                )}

                {submitted && (
                  <p
                    className={`mt-3 font-semibold ${
                      correct ? "text-green-800" : "text-red-700"
                    }`}
                  >
                    {correct
                      ? "Bonne réponse ! Bien joué !"
                      : "Ce n'est pas encore ça. Réessaie !"}
                  </p>
                )}
              </fieldset>
            );
          })}

          <button
            type="submit"
            className="mt-4 w-full bg-yellow-400 font-bold py-2 px-4 rounded-md"
          >
            Valider
          </button>

          {submitted && (
            <p
              role="status"
              className={`mt-3 font-semibold text-xl ${
                won ? "text-green-800" : "text-red-700"
              }`}
            >
              {won
                ? "Bravo, tu as réussi le quiz ! 🎉"
                : `${score} / ${QUESTIONS.length} bonnes réponses. Corrige les erreurs et retente ta chance !`}
            </p>
          )}
        </form>
      </div>

      {won && <PrintStep />}
    </>
  );
}

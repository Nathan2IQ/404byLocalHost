"use client";

import { useEffect, useRef, useState } from "react";
import { markRoomSolved, solvedCount } from "@/lib/progress";

// Nombre total de salles à résoudre pour compléter le jeu (comme dans EnigmeInput).
const TOTAL_ROOMS = 4;

type Question =
  | { id: string; label: string; type: "bool"; answer: "vrai" | "faux" }
  | { id: string; label: string; type: "text"; accepted: string[] };

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

// Nom d'hôte par défaut d'OctoPi (résolu en mDNS sur le Wi-Fi local).
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

function matches(value: string, accepted: string[]) {
  const input = normalize(value);
  return input !== "" && accepted.some((a) => input.includes(a));
}

function isCorrect(question: Question, value: string) {
  if (question.type === "bool") return value === question.answer;
  return matches(value, question.accepted);
}

function Credential({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-bg px-4 py-3">
      <span className="text-text-secondary">{label}</span>
      <code className="select-all font-mono text-lg font-bold text-text">
        {value}
      </code>
    </div>
  );
}

function PrintStep() {
  const [printedText, setPrintedText] = useState<string | null>(null);
  // Non-null déclenche l'affichage du pop-up de confirmation (contient le nombre de salles restantes).
  const [restantes, setRestantes] = useState<number | null>(null);
  const correct =
    printedText !== null && matches(printedText, PRINTED_TEXT_ACCEPTED);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
    <div className="flex flex-col gap-4 rounded-md border border-border bg-bg p-4 shadow-sm">
      <h4 className="text-2xl font-bold text-text">🎁 Ton cadeau</h4>
      <p className="text-lg text-text-secondary">
        Lance l&apos;impression de ton cadeau depuis l&apos;adresse suivante :
      </p>
      <a
        href={PRINTER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all rounded-lg border border-border px-4 py-3 font-mono text-primary underline"
      >
        {PRINTER_URL}
      </a>
      <p className="text-lg text-text-secondary">Connecte-toi avec :</p>
      <div className="flex flex-col gap-2">
        <Credential label="Utilisateur" value={PRINTER_USER} />
        <Credential label="Mot de passe" value={PRINTER_PASSWORD} />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="objet" className="text-lg font-bold text-text">
          Que peux-tu lire sur l&apos;objet imprimé ?
        </label>
        <input
          id="objet"
          type="text"
          name="objet"
          placeholder="Ta réponse…"
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="done"
          required
          className="min-h-12 w-full rounded-lg border border-border bg-bg px-4 text-base text-text"
        />
        <button
          type="submit"
          className="btn-primary min-h-12 w-full touch-manipulation text-lg"
        >
          Vérifier
        </button>
        {printedText !== null && (
          <p
            role="status"
            className={`font-semibold ${correct ? "text-green" : "text-primary"}`}
          >
            {correct
              ? "✅ Bonne réponse, bien joué !"
              : "❌ Ce n'est pas ça, regarde bien l'objet…"}
          </p>
        )}
      </form>

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
    </div>
  );
}

export default function ImprimanteQuiz() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  // Incrémenté à chaque validation pour redéfiler vers le résultat.
  const [submitCount, setSubmitCount] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const submitted = submitCount > 0;
  const score = QUESTIONS.filter((q) =>
    isCorrect(q, answers[q.id] ?? "")
  ).length;
  const won = submitted && score === QUESTIONS.length;

  useEffect(() => {
    if (submitCount > 0) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [submitCount]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setAnswers(
      Object.fromEntries(
        QUESTIONS.map((q) => [q.id, String(data.get(q.id) ?? "")])
      )
    );
    setSubmitCount((n) => n + 1);
  }

  return (
    <section className="bg-bg px-4 py-6">
      <h3 className="mb-2 text-3xl font-bold text-text">Prêt pour le quiz ?</h3>
      <p className="mb-6 text-lg text-text-secondary">
        Observe bien la pièce et réponds aux 5 questions pour décrocher ta pièce
        du puzzle.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {QUESTIONS.map((q, i) => {
          const correct = isCorrect(q, answers[q.id] ?? "");
          return (
            <fieldset
              key={q.id}
              className={`flex min-w-0 flex-col gap-3 rounded-md border bg-bg p-4 shadow-sm ${
                submitted
                  ? correct
                    ? "border-green"
                    : "border-primary"
                  : "border-border"
              }`}
            >
              <legend className="sr-only">Question {i + 1}</legend>
              <p className="text-lg font-bold text-text">
                <span className="mr-2 text-primary">Q{i + 1}.</span>
                {q.label}
              </p>

              {q.type === "bool" ? (
                <div className="grid grid-cols-2 gap-3">
                  {(["vrai", "faux"] as const).map((option) => (
                    <label
                      key={option}
                      className="flex min-h-12 cursor-pointer touch-manipulation select-none items-center justify-center rounded-lg border border-border bg-bg px-4 text-lg font-semibold text-text transition-colors duration-150 active:bg-neutral-light/15 has-checked:border-neutral-dark has-checked:bg-neutral-dark has-checked:text-white has-focus-visible:outline-2 has-focus-visible:outline-offset-2 has-focus-visible:outline-primary"
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
                // text-base (16px) minimum : en dessous, iOS zoome sur le champ au focus.
                <input
                  type="text"
                  name={q.id}
                  placeholder="Ta réponse…"
                  autoComplete="off"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="done"
                  required
                  className="min-h-12 w-full rounded-lg border border-border bg-bg px-4 text-base text-text"
                />
              )}

              {submitted && (
                <p
                  className={`font-semibold ${correct ? "text-green" : "text-primary"}`}
                >
                  {correct ? "✅ Bonne réponse !" : "❌ Essaie encore…"}
                </p>
              )}
            </fieldset>
          );
        })}

        <button
          type="submit"
          className="btn-primary min-h-12 w-full touch-manipulation text-lg"
        >
          Valider mes réponses
        </button>
      </form>

      {submitted && (
        <div
          ref={resultRef}
          role="status"
          className={`mt-4 scroll-mt-4 rounded-md border p-4 text-center ${
            won
              ? "border-green bg-green/10 text-text"
              : "border-primary/40 bg-primary/5 text-text"
          }`}
        >
          {won ? (
            <>
              <p className="text-3xl font-caveat text-green">
                Bravo, tu as réussi le quiz ! 🎉
              </p>
              <p className="text-text-secondary">
                Tu as gagné un petit cadeau 🎁
              </p>
            </>
          ) : (
            <p className="font-semibold">
              {score} / {QUESTIONS.length} bonnes réponses. Corrige les erreurs
              et retente ta chance !
            </p>
          )}
        </div>
      )}

      {won && (
        <div className="mt-4">
          <PrintStep />
        </div>
      )}
    </section>
  );
}

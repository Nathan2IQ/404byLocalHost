"use client";

import {
  useEffect,
  useState,
  useSyncExternalStore,
  type FormEvent,
} from "react";
import {
  isImpression3dQuizSolved,
  markImpression3dQuizSolved,
  markRoomSolved,
  subscribeToImpression3dQuiz,
  solvedCount,
} from "@/lib/progress";
import { SalleValideePopup } from "@/components/EnigmeInput";

// Nombre total de salles à résoudre pour compléter le jeu (comme dans EnigmeInput).
const TOTAL_ROOMS = 4;
// Délai avant de passer automatiquement à la question suivante après correction.
const AUTO_NEXT_DELAY_MS = 1000;

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
      <div className="px-4 py-8 bg-roche">
        <h4 className="text-3xl font-bold text-white mb-2">
          Tu as gagné un petit{" "}
          <span className="font-bold text-5xl pr-1 font-caveat text-yellow-500">
            cadeau de bienvenue
          </span>{" "}
        </h4>
        <p className="text-white px-1 pt-2 text-xl">
          Lance son impression depuis{" "}
          <span className="font-bold text-2xl pr-1.5 font-caveat text-yellow-500">
            OctoPi
          </span>
          en te connectant avec :
        </p>
        <p className="text-white px-1 pt-2 pb-2 text-xl">
          Utilisateur :{" "}
          <span className="font-bold text-3xl font-caveat text-yellow-500">
            {PRINTER_USER}
          </span>
          <br />
          Mot de passe :{" "}
          <span className="font-bold text-3xl font-caveat text-yellow-500">
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
        <p className="mt-4 rounded-md border border-red-300/80 bg-red-950/20 px-3 py-2 text-center text-sm font-medium text-white">
          L&apos;impression prend environ 10 minutes. Pendant ce temps, tu peux
          continuer le jeu et explorer d&apos;autres salles si tu le souhaites.
        </p>
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
                    : "incorrecte",
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

      {/* Pop-up de confirmation affichée uniquement après une réponse correcte (composant partagé avec EnigmeInput). */}
      {restantes !== null && <SalleValideePopup restantes={restantes} />}
    </>
  );
}

// Quiz de la salle : une carte verticale par question (mobile first), avec
// correction immédiate au clic puis avancée automatique vers la suivante,
// et étape cadeau si le score est parfait.
export default function ImprimanteQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [finished, setFinished] = useState(false);
  const quizSolved = useSyncExternalStore(
    subscribeToImpression3dQuiz,
    isImpression3dQuizSolved,
    () => false,
  );

  const total = QUESTIONS.length;
  const question = QUESTIONS[step];
  const value = answers[question.id] ?? "";
  const isChecked = checked[question.id] ?? false;
  const correct = isCorrect(question, value);
  const isLast = step === total - 1;

  const score = QUESTIONS.filter((q) =>
    isCorrect(q, answers[q.id] ?? ""),
  ).length;
  const won = quizSolved || (finished && score === total);

  // Une fois la correction affichée, on enchaîne automatiquement sur la suite.
  useEffect(() => {
    if (!isChecked) return;

    const timeout = setTimeout(() => {
      if (isLast) {
        if (score === total) {
          markImpression3dQuizSolved();
        }
        setFinished(true);
      } else {
        setStep((s) => s + 1);
      }
    }, AUTO_NEXT_DELAY_MS);

    return () => clearTimeout(timeout);
  }, [isChecked, isLast, score, total]);

  function setAnswer(id: string, v: string) {
    setAnswers((prev) => ({ ...prev, [id]: v }));
  }

  // Cliquer sur une réponse Vrai/Faux la valide immédiatement.
  function selectBool(option: "vrai" | "faux") {
    if (isChecked) return;
    setAnswer(question.id, option);
    setChecked((prev) => ({ ...prev, [question.id]: true }));
  }

  function handleValidateText() {
    if (isChecked || !value) return;
    setChecked((prev) => ({ ...prev, [question.id]: true }));
  }

  function handleRestart() {
    setStep(0);
    setAnswers({});
    setChecked({});
    setFinished(false);
  }

  if (finished && !won) {
    return (
      <div className="py-8 px-4 bg-white text-center">
        <h3 className="text-4xl font-bold font-caveat mb-2">Résultat</h3>
        <p className="mb-6 text-xl font-semibold text-red-700">
          {score} / {total} bonnes réponses. Retente ta chance !
        </p>
        <button
          type="button"
          onClick={handleRestart}
          className="w-full rounded-md bg-yellow-400 py-2 px-4 font-bold"
        >
          Recommencer le quiz
        </button>
      </div>
    );
  }

  if (won) {
    return (
      <>
        <div className="animate-quiz-pop px-4 pt-8 pb-4 bg-roche text-center">
          <div className="mx-auto max-w-sm rounded-xl border border-green-700/30 bg-green-100 p-5 shadow-sm">
            <h3 className="text-4xl font-bold font-caveat text-green-800">
              Bravo, tu as réussi le quiz ! 🎉
            </h3>
          </div>
        </div>
        <PrintStep />
      </>
    );
  }

  return (
    <div className="pb-8 px-4 bg-white">
      <div className="pt-8 pb-2">
        <h3 className="text-4xl font-bold font-caveat mb-2">
          Prêt pour le quiz ?
        </h3>
        <p className="text-text-secondary px-1 text-lg">
          Observe bien la pièce et réponds aux 5 questions pour débloquer ton
          cadeau.
        </p>
      </div>

      {/* Carte verticale : une seule question affichée à la fois, remontée à chaque changement pour l'animation. */}
      <div key={question.id} className="animate-quiz-card-in">
        <fieldset className="flex flex-col mt-4 mb-4 border border-gray-300 p-5 rounded-xl bg-olive-100 shadow-sm">
          <legend className="sr-only">{question.label}</legend>
          <p className="text-text-secondary font-bold pb-4 pt-2 text-xl">
            {question.label}
          </p>

          {question.type === "bool" ? (
            <div className="flex flex-col gap-3">
              {(["vrai", "faux"] as const).map((option) => {
                const isPicked = isChecked && value === option;
                return (
                  <button
                    key={option}
                    type="button"
                    disabled={isChecked}
                    onClick={() => selectBool(option)}
                    className={`w-full rounded-md border py-3 px-4 text-center font-bold transition-colors ${
                      isPicked
                        ? correct
                          ? "border-green-700 bg-green-100"
                          : "border-red-600 bg-red-100"
                        : isChecked
                          ? "border-gray-200 bg-white opacity-50"
                          : "border-gray-300 bg-white hover:border-yellow-400"
                    }`}
                  >
                    {option === "vrai" ? "Vrai" : "Faux"}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={value}
                onChange={(e) => setAnswer(question.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleValidateText();
                  }
                }}
                disabled={isChecked}
                placeholder="Votre réponse"
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
                className={inputClass(
                  !isChecked ? "idle" : correct ? "correcte" : "incorrecte",
                )}
              />
              {!isChecked && (
                <button
                  type="button"
                  disabled={!value}
                  onClick={handleValidateText}
                  className="w-full rounded-md bg-yellow-400 py-2 px-4 font-bold transition-opacity disabled:opacity-50"
                >
                  Valider ma réponse
                </button>
              )}
            </div>
          )}

          {isChecked && (
            <p
              className={`animate-quiz-feedback mt-4 text-center font-semibold ${
                correct ? "text-green-800" : "animate-quiz-shake text-red-700"
              }`}
            >
              {correct
                ? "Bonne réponse ! Bien joué !"
                : "Ce n'est pas encore ça."}
            </p>
          )}
        </fieldset>
      </div>

      {/* Barre de progression : une pastille par question. */}
      <div className="flex items-center justify-center gap-2 pt-2 pb-2">
        {QUESTIONS.map((q, i) => (
          <span
            key={q.id}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step
                ? "w-6 bg-yellow-400"
                : i < step
                  ? "w-2 bg-green-600"
                  : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </div>
      <p className="text-center text-sm font-semibold text-text-secondary">
        Question {step + 1} / {total}
      </p>
    </div>
  );
}

import type { Metadata } from "next";
import ImprimanteQuiz from "./ImprimanteQuiz";

// Route accessible uniquement via QR code : ne pas y lier depuis la navigation.
export const metadata: Metadata = {
  title: "Imprimante - Localhost",
};

export default function ImprimantePage() {
  return (
    <div className="flex flex-col flex-1 font-sans">
      <main className="flex w-full flex-col">
        <div className="px-4 pt-6 pb-4">
          {/* text-4xl : en text-6xl, "l'imprimante" déborde d'un écran de 360px. */}
          <h2 className="text-4xl text-white font-extrabold mb-2 wrap-break-word">
            Bienvenue dans la salle de l&apos;imprimante 3D
          </h2>
          <p className="text-lg pt-2 text-text-secondary">
            Ici tu pourras matérialiser toutes tes idées créatives grâce à notre
            imprimante 3D
          </p>
        </div>

        <ImprimanteQuiz />
      </main>
    </div>
  );
}

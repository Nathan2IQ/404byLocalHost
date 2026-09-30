import type { Metadata } from "next";
import ImprimanteQuiz from "./ImprimanteQuiz";
import AvancementPartie from "@/components/AvancementPartie";

// Route accessible uniquement via QR code : ne pas y lier depuis la navigation.
export const metadata: Metadata = {
  title: "Impression 3D - Localhost",
};

// Page de la salle impression 3D : présentation de la salle, puis quiz.
export default function Impression3DPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-col">
        <div className="p-4 mt-4">
          {/* wrap-break-word : en text-6xl, "l'imprimante" est plus large qu'un écran de téléphone. */}
          <h2 className="text-6xl text-white font-extrabold mb-2 wrap-break-word">
            Bienvenue dans la salle de l&apos;imprimante 3D !
          </h2>
          <p className="text-xl py-4 mb-4 text-white">
            Ici tu pourras{" "}
            <span className="font-bold text-2xl pl-1 pr-2 font-caveat text-yellow-500">
              matérialiser
            </span>
            toutes tes{" "}
            <span className="font-bold text-2xl pl-1 pr-2 font-caveat text-yellow-500">
              idées créatives
            </span>
            grâce à notre{" "}
            <span className="font-bold text-2xl font-caveat text-yellow-500">
              imprimante 3D
            </span>
          </p>
        </div>
          <AvancementPartie final={false}/>

        <ImprimanteQuiz />
      </main>

    </div>
  );
}

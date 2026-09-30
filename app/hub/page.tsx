import type { Metadata } from "next";
import EnigmeInput from "../../components/EnigmeInput";

// Route accessible uniquement via QR code : ne pas y lier depuis la navigation.
export const metadata: Metadata = {
  title: "Hub - Localhost",
};

export default function HubPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-col">
        {" "}
        <div className="flex flex-col flex-1 items-center justify-center font-sans">
          <main className="flex flex-col">
            <div className="p-4 mt-4">
              <h2 className="text-6xl text-white font-extrabold mb-2">
                Bienvenue au HUB !
              </h2>
              <p className="text-xl py-4 mb-4 text-white">
                <span className="font-bold pr-1 text-2xl font-caveat text-yellow-500">
                  Réunions
                </span>{" "}
                en ligne, écran connecté,{" "}
                <span className="font-bold pr-1 text-2xl font-caveat text-yellow-500">
                  Nintendo Switch 2
                </span>{" "}
                : tout est à disposition pour travailler… <br />
                ou se{" "}
                <span className="font-bold pr-1 text-2xl font-caveat text-yellow-500">
                  détendre
                </span>{" "}
                !
              </p>
            </div>

            <div className="py-8 px-4 bg-white">
              <h3 className="text-4xl font-bold font-caveat mb-2">
                Vous aimez les défis ?
              </h3>
              <p className="text-text-secondary px-1 text-xl">
                Pour mieux découvrir cet espace je vous propose de répondre à la
                question suivante :
              </p>
              <EnigmeInput
                label="Combien y-a-t-il de pages dans le livre noir et vert avec un disque sur la couverture ?"
                reponseAttendue={314}
              />
            </div>
          </main>
        </div>
      </main>
    </div>
  );
}

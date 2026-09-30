import EnigmeInput from "@/components/EnigmeInput";
import Link from "next/link";
import type { Metadata } from "next";

// Route accessible uniquement via QR code : ne pas y lier depuis la navigation.
export const metadata: Metadata = {
  title: "Coworking - Localhost",
};

export default function CoworkingPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-col">
        <div className="p-4 mt-4">
          <h2 className="text-6xl text-white font-extrabold mb-2">
            Bienvenue au Coworking !
          </h2>
          <p className="text-xl py-4 mb-4 text-white">
            Ici, tu peux{" "}
            <span className="font-bold text-2xl pl-1 pr-2 font-caveat text-yellow-500">
              travailler
            </span>
            et{" "}
            <span className="font-bold text-2xl pl-1 font-caveat text-yellow-500">
              collaborer
            </span>
            , avec tes collègues dans une ambiance tech et{" "}
            <span className="font-bold text-2xl font-caveat text-yellow-500">
              conviviale
            </span>
          </p>
        </div>
        <div className="py-8 px-4 bg-white">
          <h3 className="text-4xl font-bold font-caveat mb-2">
            Vous aimez les défis ?
          </h3>
          <p className="text-text-secondary px-1 text-xl">
            Pour mieux découvrir cet espace je vous propose de commencer par
            trouver le code WIFI !
          </p>
        </div>
        <div className="px-4 py-8 bg-neutral-dark">
          <h4 className="text-3xl font-bold text-white mb-2">
            Ça y est vous êtes{" "}
            <span className="font-bold text-5xl pr-1 font-caveat text-yellow-500">
              connecté
            </span>{" "}
            ?
          </h4>
          <p className="text-white px-1 pt-2 text-xl">
            Si oui, vous pouvez maintenant apprendre à utiliser{" "}
            <span className="font-bold text-2xl pr-1.5 font-caveat text-yellow-500">
              l&apos;imprimante
            </span>
            du coworking
          </p>
          <Link
            href="/coworking/indice-imprimante"
            className="mt-4 block w-full rounded-lg bg-yellow-500 px-4 py-2 text-center font-bold text-white hover:bg-yellow-600"
          >
            Découvrir l&apos;imprimante
          </Link>
        </div>
        <div className="py-8 px-4 bg-white">
          <h3 className="text-4xl font-bold font-caveat mb-2">
            Partage-nous ta trouvaille !
          </h3>

          <EnigmeInput
            label="La clim est bavarde ?"
            reponseAttendue={50}
            roomId="coworking"
          />
        </div>{" "}
      </main>
    </div>
  );
}

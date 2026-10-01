import EnigmeInput from "@/components/EnigmeInput";
import Link from "next/link";
import type { Metadata } from "next";
import AvancementPartie from "@/components/AvancementPartie";
import RoomChallenge from "@/components/RoomChallenge";
import WifiRequiredGate from "@/components/WifiRequiredGate";

// Route accessible uniquement via QR code : ne pas y lier depuis la navigation.
export const metadata: Metadata = {
  title: "Coworking - Localhost",
};

export default function CoworkingPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <WifiRequiredGate>
        <main className="flex flex-col">
          <div className="p-4 mt-4">
            <h2 className="text-5xl text-white font-extrabold mb-2">
              Bienvenue au Coworking !
            </h2>
            <p className="text-xl pt-4 text-white">
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
          <AvancementPartie final={false} />
          <RoomChallenge roomId="coworking">
            <div className="px-4 pt-8 pb-4 bg-white">
              <h4 className="text-3xl font-bold text-black mb-2">
                Vous êtes bien{" "}
                <span className="font-bold text-5xl pr-1 font-caveat text-yellow-500">
                  connecté
                </span>{" "}
                au WIFI ?
              </h4>
              <p className="text-black px-1 pt-2 text-xl">
                Si oui, vous pouvez maintenant apprendre à utiliser{" "}
                <span className="font-bold text-2xl pr-1.5 font-caveat text-yellow-500">
                  l&apos;imprimante
                </span>
                du coworking
              </p>
              <Link
                href="/coworking/indice-imprimante"
                className="mt-6 block w-full rounded-lg bg-yellow-500 px-4 py-2 text-center font-bold text-white hover:bg-yellow-600"
              >
                Découvrir l&apos;imprimante
              </Link>

              <p className="text-black px-1 pt-2 text-lg">
                Elle est accessible à tous les membres du coworking ;)
              </p>
            </div>
            <div className="py-8 px-4 bg-white">
              <h3 className="text-4xl font-bold font-caveat mb-2">
                Partage-nous ta trouvaille !
              </h3>

              <EnigmeInput
                label="La clim est bavarde ?"
                reponseAttendue={"flocon"}
                roomId="coworking"
              />
            </div>
          </RoomChallenge>
        </main>
      </WifiRequiredGate>
    </div>
  );
}

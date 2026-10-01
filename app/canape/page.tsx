import type { Metadata } from "next";
import EnigmeInput from "../../components/EnigmeInput";
import AvancementPartie from "@/components/AvancementPartie";
import RoomChallenge from "@/components/RoomChallenge";

// Route accessible uniquement via QR code : ne pas y lier depuis la navigation.
export const metadata: Metadata = {
  title: "Canapé - Localhost",
};

export default function CanapePage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-col">
        <div className="p-4 mt-4">
          <h2 className="text-5xl text-white font-extrabold mb-2">
            Bienvenue au Canapé !
          </h2>
          <p className="text-xl pt-4 mt-4 text-white">
            Ici, tu peux trouver la{" "}
            <span className="font-bold text-2xl font-caveat text-yellow-500">
              bibliotech
            </span>
            ,<br /> des jeux de société et un espace convivial pour te{" "}
            <span className="font-bold text-2xl font-caveat text-yellow-500">
              détendre
            </span>
          </p>
        </div>

        <AvancementPartie final={false} />

        <RoomChallenge roomId="salon">
          <div className="py-8 px-4 bg-white">
            <h3 className="text-4xl font-bold font-caveat mb-2">
              Vous aimez les énigmes ?
            </h3>
            <p className="text-text-secondary px-1 text-lg">
              Pour mieux découvrir cet espace je vous propose de répondre à la
              question suivante :
            </p>
            <EnigmeInput
              label="Combien y-a-t-il de pages dans le livre noir et vert avec un disque sur la couverture ?"
              reponseAttendue={314}
              roomId="salon"
            />
          </div>
        </RoomChallenge>
      </main>
    </div>
  );
}

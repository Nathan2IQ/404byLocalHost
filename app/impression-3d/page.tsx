import type { Metadata } from "next";
import AvancementPartie from "@/components/AvancementPartie";

// Route accessible uniquement via QR code : ne pas y lier depuis la navigation.
export const metadata: Metadata = {
  title: "Imprimante - Localhost",
};

export default function ImprimantePage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-col">
          <AvancementPartie final={false}/>
      </main>
    </div>

  );
}

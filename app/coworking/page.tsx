import type { Metadata } from "next";

// Route accessible uniquement via QR code : ne pas y lier depuis la navigation.
export const metadata: Metadata = {
  title: "Coworking - Localhost",
};

export default function CoworkingPage() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-col">{/* TODO: contenu de la page */}</main>
    </div>
  );
}

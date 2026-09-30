import PrintOnLoad from "@/components/PrintOnLoad";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Indice imprimé - Coworking - Localhost",
};

export default function IndiceImprimantePage() {
  return (
    <main className="print-page-container flex-1 px-4 py-10">
      <PrintOnLoad />

      <article className="print-sheet mx-auto max-w-[174mm] border-t-8 border-primary bg-white p-10 text-text">
        <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
          <div>
            <p className="text-sm font-extrabold uppercase text-primary">
              Localhost · Jeu de piste
            </p>
            <p className="mt-1 font-caveat text-2xl text-text-secondary">
              Espace coworking
            </p>
          </div>
          <span className="rounded-full bg-yellow-500 px-4 py-2 text-sm font-bold text-white">
            Indice
          </span>
        </div>

        <div className="py-12">
          <p className="mb-3 font-caveat text-3xl text-primary">
            Ouvre l&apos;oeil...
          </p>
          <h1 className="text-4xl font-extrabold leading-tight text-text">
            Un mot se cache sur le boîtier.
          </h1>
          <p className="mt-8 border-l-4 border-yellow-500 bg-stone-50 px-6 py-5 text-xl leading-relaxed text-text-secondary">
            Si tu as trop chaud ou trop froid, n’hésites pas à régler la
            climatisation sur le boitier de commande sur le mur. D’ailleurs, si
            tu y jettes un coup d’œil, tu dois trouver un mot de marqué. Quel
            est-il ?
          </p>
        </div>

        <div className="border-t border-border pt-5">
          <p className="text-sm font-bold uppercase text-text-secondary">
            Entrez le mot inscrit sur le boîtier dans le support !
          </p>
        </div>
      </article>
    </main>
  );
}

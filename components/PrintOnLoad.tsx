"use client";

export default function PrintOnLoad() {
  return (
    <section className="print-screen-only mx-auto mb-8 max-w-xl rounded-lg bg-white p-6 text-center">
      <button
        type="button"
        onClick={() => window.print()}
        className="btn-primary"
      >
        Imprimer l’indice
      </button>
      <p className="mt-3 text-sm text-text-secondary">
        L’impression s’ouvrira après avoir appuyé sur le bouton.
      </p>
      <a
        href="/coworking"
        className="mt-4 block text-sm font-semibold text-text-secondary underline"
      >
        Retourner au coworking
      </a>
    </section>
  );
}

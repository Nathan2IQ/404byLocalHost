import QrScannerPanel from "@/components/QrScanner";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans">
      <main className="flex flex-col">
        <div className="bg-neutral-dark py-8 px-4">
          <h2 className="text-6xl text-white font-extrabold my-4">
            4 salles
            <br /> 4 défis
            <br /> 1 challenge final
          </h2>
          <p className="text-xl mt-2 text-white">
            Pour découvrir ton environemment,
          </p>
          <p className="text-3xl font-caveat mb-2 text-yellow">
            Explore, scanne, résous... et assemble le puzzle !
          </p>

          <div className="mt-6 flex flex-col items-center gap-2">
            <h3 className="text-xl font-bold text-white">
              🔍 Test : scanner un QR
            </h3>
            <QrScannerPanel />
          </div>
        </div>

        <section className="my-4 bg-bg px-4 py-8 md:px-6">
          <h3 className="mb-6 text-3xl font-bold text-text md:text-4xl">
            Ta mission, si tu l&apos;acceptes
          </h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <article className="flex min-h-full flex-col gap-3 rounded-md border border-border bg-white p-5 shadow-sm">
              <span className="inline-flex size-12 items-center justify-center rounded-md bg-red-500 text-xl font-extrabold leading-none text-white">
                01
              </span>
              <h4 className="text-2xl font-bold text-text">Explore</h4>
              <p className="text-lg text-text-secondary">
                Trouve les QR codes cachés dans les espaces.
              </p>
            </article>
            <article className="flex min-h-full flex-col gap-3 rounded-md border border-border bg-white p-5 shadow-sm">
              <span className="inline-flex size-12 items-center justify-center rounded-md bg-yellow-500 text-xl font-extrabold leading-none text-text">
                02
              </span>
              <h4 className="text-2xl font-bold text-text">Relève les défis</h4>
              <p className="text-lg text-text-secondary">
                4 salles, 4 défis et 4 pièces du puzzle à récupérer.
              </p>
            </article>
            <article className="flex min-h-full flex-col gap-3 rounded-md border border-border bg-white p-5 shadow-sm">
              <span className="inline-flex size-12 items-center justify-center rounded-md bg-green-600 text-xl font-extrabold leading-none text-white">
                03
              </span>
              <h4 className="text-2xl font-bold text-text">
                Débloque le final
              </h4>
              <p className="text-lg text-text-secondary">
                Assemble les pièces et tente de résoudre le challenge ultime.
              </p>
            </article>
          </div>
        </section>

        <div className="bg-neutral-dark my-4 py-6 px-4">
          <h3 className="text-4xl text-white font-bold mb-8">🚪Les 4 salles</h3>
          <div className="my-4 gap-2 flex flex-col rounded-md border border-white/20 bg-white/10 p-4 text-white shadow-lg backdrop-blur-xl">
            <h4 className="text-2xl font-bold">Les canapés 🛋️</h4>
            <p className="text-xl text-white/80">
              Un espace confortable pour se détendre et discuter.
            </p>
          </div>
          <div className="my-4 gap-2 flex flex-col rounded-md border border-white/20 bg-white/10 p-4 text-white shadow-lg backdrop-blur-xl">
            <h4 className="text-2xl font-bold">L&apos;open space 💻</h4>
            <p className="text-xl text-white/80">
              Un espace de coworking pour collaborer et échanger des idées.
            </p>
          </div>
          <div className="my-4 gap-2 flex flex-col rounded-md border border-white/20 bg-white/10 p-4 text-white shadow-lg backdrop-blur-xl">
            <h4 className="text-2xl font-bold">Le HUB 📊</h4>
            <p className="text-xl text-white/80">
              Un espace dédié aux discussions importantes et aux présentations.
            </p>
          </div>
          <div className="my-4 gap-2 flex flex-col rounded-md border border-white/20 bg-white/10 p-4 text-white shadow-lg backdrop-blur-xl">
            <h4 className="text-2xl font-bold">L&apos;atelier 🛠️</h4>
            <p className="text-xl text-white/80">
              Un espace pour les activités créatives et les projets pratiques.
            </p>
          </div>
        </div>

        <section className="mt-4 bg-bg px-4 py-8 md:px-6">
          <h3 className="mb-2 text-3xl font-bold text-text md:text-4xl">
            📜 Les règles
          </h3>
          <p className="mb-6 text-xl font-semibold text-text-secondary">
            Avant de partir… 👀
          </p>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <article className="flex gap-4 rounded-md border border-border bg-white p-4">
              <span className="text-2xl" aria-hidden="true">
                🔐
              </span>
              <div>
                <h4 className="mb-1 text-xl font-bold text-text">Accès</h4>
                <p className="text-text-secondary">
                  Seules les salles indiquées dans le jeu sont accessibles.
                </p>
              </div>
            </article>
            <article className="flex gap-4 rounded-md border border-border bg-white p-4">
              <span className="text-2xl" aria-hidden="true">
                📱
              </span>
              <div>
                <h4 className="mb-1 text-xl font-bold text-text">QR codes</h4>
                <p className="text-text-secondary">
                  Chaque espace cache son QR code. Scanne-le pour découvrir son
                  défi.
                </p>
              </div>
            </article>
            <article className="flex gap-4 rounded-md border border-border bg-white p-4">
              <span className="text-2xl" aria-hidden="true">
                🫶
              </span>
              <div>
                <h4 className="mb-1 text-xl font-bold text-text">
                  Respect des lieux
                </h4>
                <p className="text-text-secondary">
                  On explore, mais en respectant les gens qui travaille et on ne
                  casse rien :)
                </p>
              </div>
            </article>
            <article className="flex gap-4 rounded-md border border-primary/40 bg-primary/5 p-4">
              <span className="text-2xl" aria-hidden="true">
                🔥
              </span>
              <div>
                <h4 className="mb-1 text-xl font-bold text-text">Attention</h4>
                <p className="text-text-secondary">
                  La buse de l&apos;imprimante 3D peut être{" "}
                  <strong className="font-bold text-primary">
                    très chaude
                  </strong>
                  . On n&apos;y touche pas !
                </p>
              </div>
            </article>
            <article className="flex gap-4 rounded-md border border-border bg-white p-4">
              <span className="text-2xl" aria-hidden="true">
                🧩
              </span>
              <div>
                <h4 className="mb-1 text-xl font-bold text-text">
                  Chaque victoire compte
                </h4>
                <p className="text-text-secondary">
                  Un défi réussi = une pièce du puzzle final.
                </p>
              </div>
            </article>
            <article className="flex gap-4 rounded-md border border-border bg-white p-4">
              <span className="text-2xl" aria-hidden="true">
                🙋
              </span>
              <div>
                <h4 className="mb-1 text-xl font-bold text-text">
                  Besoin d&apos;aide ?
                </h4>
                <p className="text-text-secondary">
                  N&apos;hésite pas à poser des questions !
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

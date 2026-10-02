export default function SalleInterdite() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center bg-stone px-4 py-8 text-center">
            <div className="max-w-2xl">
                <h1 className="mb-4 text-6xl font-extrabold text-white">
                    🚫 Accès refusé
                </h1>

                <p className="mb-8 text-3xl font-caveat text-yellow">
                    Oups... tu as trouvé une salle secrète.
                </p>

                <div className="rounded-lg bg-white p-6 shadow-lg">
                    <h2 className="mb-4 text-3xl font-bold text-text">
                        Permission denied
                    </h2>

                    <div className="flex justify-center">
                        <img src="/stop.gif" width="240"/>
                    </div>

                    <br/>

                    <div className="rounded border border-yellow-500 bg-yellow-50 p-4">
                        <p className="font-bold text-text">
                            💡 Conseil de geek
                        </p>
                        <p className="text-text-secondary">
                            Retourne explorer les salles autorisées. Cette salle ne fait pas parti des salles accessibles aux co-workers
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
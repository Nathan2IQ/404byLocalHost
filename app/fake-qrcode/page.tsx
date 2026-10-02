export default function SalleInterdite() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center bg-stone px-4 py-8 text-center">
            <div className="w-full max-w-2xl">
                <div className="rounded-lg bg-white p-6 shadow-lg">
                    <div className="flex justify-center">
                        <iframe
                            src="https://giphy.com/embed/TKa7fQzChHylCQ89to"
                            className="pointer-events-none w-[90vw] max-w-[480px] aspect-square"
                            frameBorder="0"
                            allowFullScreen
                        />
                    </div>

                    <p className="mt-6 text-xl font-bold text-red-600">
                        😈 Tu t'es fait avoir !
                    </p>

                    <p className="mt-2 text-gray-700">
                        Ce n'était pas le bon QR code...
                        <br />
                        Reprends tes recherches et continue à chercher le bon QR code. 🔍
                    </p>
                </div>
            </div>
        </div>
    );
}
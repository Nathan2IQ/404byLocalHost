export default function FakeQrCode() {
    return (
        <div className="flex flex-1 flex-col items-center justify-center bg-stone px-4 py-8 text-center">
            <div className="w-full max-w-2xl">
                <div className="rounded-lg bg-white p-6 shadow-lg">
                    <div className="flex justify-center">
                        <iframe
                            src="https://giphy.com/embed/TKa7fQzChHylCQ89to"
                            className="w-full max-w-[480px] aspect-square"
                            frameBorder="0"
                            allowFullScreen
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
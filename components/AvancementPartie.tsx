"use client";

import {useEffect, useState} from "react";
import {
    getProgress,
    type ProgressState,
} from "@/lib/progress";
import PlanRevele from "@/components/PlanRevele";

type AvancementPartieProps = {
    final?: boolean;
};

export default function AvancementPartie({final = false,}:AvancementPartieProps) {
    const [progress,setProgress] = useState<ProgressState | null>(null);

    // Au montage : on lit la progression sauvegardée dans le cookie.
    useEffect(() => {
        setProgress(getProgress());
    }, []);

    if (!progress) return null;

    const discoveredZones = [

        ...(progress.salon ? ["salon"] : []),
        ...(progress.coworking ? ["coworking"] : []),
        ...(progress["impression-3d"] ? ["impression"] : []),
        ...(progress.hub ? ["hub"] : []),
    ];

    let message;

    if (discoveredZones.length === 0) {
        message = "Vous n'avez pas encore découvert de salle...😒";
    } else if (discoveredZones.length < 4) {
        message = `Vous avez découvert ${discoveredZones.length} salle${
            discoveredZones.length > 1 ? "s 😁" : " 😃"
        }`;
    }

    if(!final)
    {
        return(
            <div className="py-8 px-4">
                <h3 className="text-center text-white font-caveat text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">
                    {discoveredZones.length < 4 ? (
                        message
                    ) : (
                        <>
                            🎉 Bravo 🎉
                            <br />
                            Vous avez découvert toutes les salles !
                            <br />
                            <span className="text-3xl">
          Dirigez-vous maintenant vers la salle de pause pour réaliser
          l'épreuve finale. 🏴‍☠️
        </span>
                        </>
                    )}
                </h3>

                <PlanRevele discovered={discoveredZones} />
            </div>
        )
    }
    else{
        return(
            <div>
                <h2 className="text-3xl font-extrabold text-white">
                    🔒 Il te manque {4-discoveredZones.length} pièce{4-discoveredZones.length > 1 ? "s" : ""} pour découvrir cette salle
                </h2>
                <br/>
                <PlanRevele discovered={discoveredZones} />
                <br/>
                <p className="text-white/80">
                    Reviens ici une fois les 4 salles résolues.
                </p>
            </div>
        )

    }



}
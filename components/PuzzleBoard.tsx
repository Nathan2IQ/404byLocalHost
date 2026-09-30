"use client";

import { useEffect, useState, type PointerEvent } from "react";
import confetti from "canvas-confetti";
import {
  GRID_COLS,
  GRID_ROWS,
  PIECE_COUNT,
  getPlacedPieces,
  placePiece,
  resetPuzzle,
  isPuzzleSolved,
  type PuzzleState,
} from "@/lib/puzzle";

// Image du puzzle (celle qui est découpée en pièces) et ses dimensions réelles en pixels.
// Important : si l'image change de taille, il faut mettre à jour ces deux valeurs.
const IMAGE_SRC = "/pictures/localhost-numbers.png";
const IMAGE_WIDTH = 1484;
const IMAGE_HEIGHT = 778;

// Images de la révélation finale : même cadrage exact que IMAGE_SRC, donc superposables telles quelles.
const SIGN_OFF_SRC = "/pictures/localhost-sign-off.png";
const SIGN_ON_SRC = "/pictures/localhost-sign-on.png";

// Proportion (largeur/hauteur) d'une seule pièce, utilisée pour l'affichage des pièces
// dans la bandeja (elles ne sont pas dans la grille, donc pas de ratio automatique).
const PIECE_ASPECT = `${IMAGE_WIDTH / GRID_COLS} / ${IMAGE_HEIGHT / GRID_ROWS}`;

// Pièce en cours de déplacement : son numéro + la position actuelle du doigt/curseur.
type Dragging = { index: number; x: number; y: number };

// Mélange un tableau (algorithme de Fisher-Yates).
function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Calcule le pourcentage de position de fond CSS pour une pièce donnée
// (technique classique de découpage d'image en grille avec background-position).
function backgroundPositionFor(pieceIndex: number) {
  const col = pieceIndex % GRID_COLS;
  const row = Math.floor(pieceIndex / GRID_COLS);
  return {
    x: (col / (GRID_COLS - 1)) * 100,
    y: (row / (GRID_ROWS - 1)) * 100,
  };
}

// Style CSS qui affiche uniquement le morceau d'image correspondant à cette pièce.
function pieceBackgroundStyle(pieceIndex: number) {
  const { x, y } = backgroundPositionFor(pieceIndex);
  return {
    backgroundImage: `url(${IMAGE_SRC})`,
    backgroundSize: `${GRID_COLS * 100}% ${GRID_ROWS * 100}%`,
    backgroundPosition: `${x}% ${y}%`,
  };
}

export default function PuzzleBoard() {
  // placed[i] = true si la pièce i est bien posée sur le plateau.
  const [placed, setPlaced] = useState<PuzzleState | null>(null);
  // Pièces encore dans la bandeja (pas encore placées), dans un ordre mélangé.
  const [trayPieces, setTrayPieces] = useState<number[] | null>(null);
  // Pièce actuellement déplacée par le joueur (null si aucune).
  const [dragging, setDragging] = useState<Dragging | null>(null);
  // Étape de la révélation finale, une fois le puzzle terminé.
  const [reveal, setReveal] = useState<"hidden" | "off" | "on">("hidden");

  // Au montage : on lit ce qui est déjà placé, et on mélange les pièces restantes.
  useEffect(() => {
    const initialPlaced = getPlacedPieces();
    setPlaced(initialPlaced);
    const remaining = Array.from({ length: PIECE_COUNT }, (_, i) => i).filter(
      (i) => !initialPlaced[i]
    );
    setTrayPieces(shuffle(remaining));
  }, []);

  // Dès que le puzzle est terminé : petite pause, puis le néon apparaît éteint,
  // puis il s'allume en grésillant.
  useEffect(() => {
    if (!placed || !isPuzzleSolved(placed)) {
      setReveal("hidden");
      return;
    }
    const showOff = setTimeout(() => setReveal("off"), 800);
    const showOn = setTimeout(() => setReveal("on"), 1600);
    return () => {
      clearTimeout(showOff);
      clearTimeout(showOn);
    };
  }, [placed]);

  // Une fois le néon allumé : des feux d'artifice depuis les deux côtés de l'écran.
  useEffect(() => {
    if (reveal !== "on") return;

    const duration = 8000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 100,
        origin: { x: Math.random() * 0.2 + 0.1, y: Math.random() - 0.2 },
      });
      confetti({
        particleCount,
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        zIndex: 100,
        origin: { x: Math.random() * 0.2 + 0.7, y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, [reveal]);

  // Tant qu'on n'a pas encore lu la progression sauvegardée, on n'affiche rien.
  if (!placed || !trayPieces) return null;

  // Remet le puzzle à zéro : toutes les pièces retournent dans la bandeja, mélangées.
  function handleReset() {
    resetPuzzle();
    const fresh = getPlacedPieces();
    setPlaced(fresh);
    setTrayPieces(shuffle(Array.from({ length: PIECE_COUNT }, (_, i) => i)));
  }

  // Début du glisser : on "capture" le pointeur pour continuer à recevoir
  // les événements même si le doigt/curseur sort de la pièce.
  function handlePointerDown(e: PointerEvent<HTMLDivElement>, pieceIndex: number) {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging({ index: pieceIndex, x: e.clientX, y: e.clientY });
  }

  // Pendant le glisser : on met à jour la position de la pièce qui suit le doigt/curseur.
  function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    setDragging({ ...dragging, x: e.clientX, y: e.clientY });
  }

  // Fin du glisser : on regarde sur quel emplacement la pièce a été lâchée.
  // Si c'est le bon emplacement, la pièce est placée définitivement.
  // Sinon, elle retourne simplement dans la bandeja.
  function handlePointerUp(e: PointerEvent<HTMLDivElement>) {
    if (!dragging) return;

    const slot = document
      .elementsFromPoint(e.clientX, e.clientY)
      .find((el) => el.hasAttribute("data-slot-index"));
    const slotIndex = slot ? Number(slot.getAttribute("data-slot-index")) : null;

    if (slotIndex === dragging.index) {
      const next = placePiece(dragging.index);
      setPlaced(next);
      setTrayPieces((tray) => tray!.filter((i) => i !== dragging.index));
    }

    setDragging(null);
  }

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 md:max-w-xl lg:max-w-2xl">
      {/* Plateau : 16 emplacements dans l'ordre attendu de l'image. */}
      <div
        className="relative w-full overflow-hidden rounded-md border border-white/20"
        style={{ aspectRatio: `${IMAGE_WIDTH} / ${IMAGE_HEIGHT}` }}
      >
        <div
          className="grid h-full w-full"
          style={{
            gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
          }}
        >
          {Array.from({ length: PIECE_COUNT }, (_, slotIndex) => (
            <div
              key={slotIndex}
              // Attribut utilisé par handlePointerUp pour savoir sur quel emplacement on a lâché la pièce.
              data-slot-index={slotIndex}
              className="border border-white/10"
              style={placed[slotIndex] ? pieceBackgroundStyle(slotIndex) : { backgroundColor: "rgba(255,255,255,0.06)" }}
            />
          ))}
        </div>

        {/* Révélation : le néon "LOCALHOST" éteint apparaît par-dessus les pièces. */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-700"
          style={{
            backgroundImage: `url(${SIGN_OFF_SRC})`,
            backgroundSize: "100% 100%",
            opacity: reveal === "off" || reveal === "on" ? 1 : 0,
          }}
        />

        {/* Puis il s'allume, avec un effet de grésillement de néon. */}
        {reveal === "on" && (
          <div
            className="animate-neon-flicker pointer-events-none absolute inset-0"
            style={{
              backgroundImage: `url(${SIGN_ON_SRC})`,
              backgroundSize: "100% 100%",
            }}
          />
        )}
      </div>

      {/* Bandeja : pièces encore à placer. */}
      {trayPieces.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1">
          {trayPieces.map((pieceIndex) => (
            <div
              key={pieceIndex}
              onPointerDown={(e) => handlePointerDown(e, pieceIndex)}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              // touch-none : empêche le téléphone de faire défiler la page pendant le glisser.
              className="w-20 cursor-grab touch-none rounded border border-white/20 active:cursor-grabbing"
              style={{
                aspectRatio: PIECE_ASPECT,
                // On cache la pièce d'origine pendant qu'elle "vole" vers le plateau.
                opacity: dragging?.index === pieceIndex ? 0.2 : 1,
                ...pieceBackgroundStyle(pieceIndex),
              }}
            />
          ))}
        </div>
      )}

      {/* Pièce en cours de déplacement : suit le doigt / le curseur à l'écran. */}
      {dragging && (
        <div
          className="pointer-events-none fixed z-50 w-20 rounded border-2 border-yellow shadow-lg"
          style={{
            left: dragging.x - 40,
            top: dragging.y - 28,
            aspectRatio: PIECE_ASPECT,
            ...pieceBackgroundStyle(dragging.index),
          }}
        />
      )}

      {isPuzzleSolved(placed) && (
        <p className="text-2xl font-bold text-lime">🎉 Puzzle terminé !</p>
      )}

      <button
        onClick={handleReset}
        className="text-sm text-white/60 underline underline-offset-2"
      >
        Réinitialiser le puzzle
      </button>
    </div>
  );
}

// Nom du cookie utilisé pour stocker l'avancement du puzzle final.
const COOKIE_NAME = "localhost_puzzle";
const COOKIE_MAX_AGE_DAYS = 30;

// Le puzzle est une grille 4x4 = 16 pièces.
export const GRID_COLS = 4;
export const GRID_ROWS = 4;
export const PIECE_COUNT = GRID_COLS * GRID_ROWS;

// État du puzzle : un booléen par pièce (true = bien placée).
export type PuzzleState = boolean[];

// Au départ, aucune pièce n'est placée.
function createDefaultPuzzle(): PuzzleState {
  return new Array(PIECE_COUNT).fill(false);
}

// Lit l'avancement du puzzle sauvegardé dans le cookie du navigateur.
// À appeler uniquement depuis le navigateur (ex. dans un useEffect).
export function getPlacedPieces(): PuzzleState {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));

  if (!match) return createDefaultPuzzle();

  try {
    const value = JSON.parse(decodeURIComponent(match.slice(COOKIE_NAME.length + 1)));
    if (Array.isArray(value) && value.length === PIECE_COUNT) return value;
    return createDefaultPuzzle();
  } catch {
    return createDefaultPuzzle();
  }
}

// Enregistre l'avancement du puzzle dans le cookie.
function savePlacedPieces(placed: PuzzleState) {
  const value = encodeURIComponent(JSON.stringify(placed));
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60; // en secondes
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

// Marque une pièce (0 à 15) comme bien placée sur le plateau.
export function placePiece(pieceIndex: number): PuzzleState {
  const placed = getPlacedPieces();
  placed[pieceIndex] = true;
  savePlacedPieces(placed);
  return placed;
}

// Remet le puzzle à zéro (utile entre deux joueurs).
export function resetPuzzle() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
}

// Vrai seulement si les 16 pièces sont bien placées.
export function isPuzzleSolved(placed: PuzzleState = getPlacedPieces()): boolean {
  return placed.every(Boolean);
}

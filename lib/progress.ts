// Nom du cookie utilisé pour stocker la progression du joueur.
const COOKIE_NAME = "localhost_progress";
// Durée de vie du cookie : 30 jours.
const COOKIE_MAX_AGE_DAYS = 30;
const quizListeners = new Set<() => void>();

// Identifiant de chaque salle du jeu.
export type RoomId = "salon" | "coworking" | "impression-3d" | "hub";

// État de progression des salles et réussite du quiz de l'imprimante.
export type ProgressState = Record<RoomId, boolean> & {
  impression3dQuiz: boolean;
};

// Liste des 4 salles, utilisée pour compter/vérifier la progression.
const ROOM_IDS: RoomId[] = ["salon", "coworking", "impression-3d", "hub"];

// Progression de départ : aucune salle résolue.
function createDefaultProgress(): ProgressState {
  return {
    salon: false,
    coworking: false,
    "impression-3d": false,
    hub: false,
    impression3dQuiz: false,
  };
}

// Lit la progression sauvegardée dans le cookie du navigateur
export function getProgress(): ProgressState {
  // On cherche notre cookie parmi tous les cookies du site.
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${COOKIE_NAME}=`));

  // Aucun cookie trouvé : le joueur n'a encore rien résolu.
  if (!match) return createDefaultProgress();

  try {
    // Le cookie contient un JSON encodé : on le décode et on le parse.
    const value = JSON.parse(
      decodeURIComponent(match.slice(COOKIE_NAME.length + 1)),
    );
    return { ...createDefaultProgress(), ...value };
  } catch {
    // Cookie corrompu ou invalide : on repart de zéro.
    return createDefaultProgress();
  }
}

// Enregistre la progression dans le cookie.
function saveProgress(progress: ProgressState) {
  const value = encodeURIComponent(JSON.stringify(progress));
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60; // en secondes
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

// Marque une salle comme résolue (utilisé quand le joueur trouve la bonne réponse).
export function markRoomSolved(roomId: RoomId): ProgressState {
  return setRoomSolved(roomId, true);
}

// Marque le quiz de l'imprimante comme réussi sans valider la salle elle-même.
export function markImpression3dQuizSolved(): ProgressState {
  const progress = getProgress();
  progress.impression3dQuiz = true;
  saveProgress(progress);
  quizListeners.forEach((listener) => listener());
  return progress;
}

export function isImpression3dQuizSolved(): boolean {
  return getProgress().impression3dQuiz;
}

export function subscribeToImpression3dQuiz(listener: () => void) {
  quizListeners.add(listener);
  return () => quizListeners.delete(listener);
}

// Change l'état (résolue ou non) d'une salle précise.
export function setRoomSolved(roomId: RoomId, solved: boolean): ProgressState {
  const progress = getProgress();
  progress[roomId] = solved;
  saveProgress(progress);
  return progress;
}

// Remet la progression à zéro (utile entre deux joueurs).
export function resetProgress() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0`;
  quizListeners.forEach((listener) => listener());
}

// Compte le nombre de salles déjà résolues (entre 0 et 4).
export function solvedCount(progress: ProgressState = getProgress()): number {
  return ROOM_IDS.filter((id) => progress[id]).length;
}

// Vrai seulement si les 4 salles sont résolues (débloque la page finale).
export function isComplete(progress: ProgressState = getProgress()): boolean {
  return solvedCount(progress) === ROOM_IDS.length;
}

// Mot de passe attendu pour valider le défi du WiFi.
const WIFI_PASSWORD = "127.0.0.1";

const COOKIE_NAME = "localhost_wifi_connected";
const COOKIE_MAX_AGE_DAYS = 30;

// Normalise avant de comparer : minuscules, sans espaces superflus.
function normalize(value: string): string {
  return value.trim().toLowerCase();
}

// Vrai si le mot de passe saisi correspond au bon mot de passe WiFi.
export function checkWifiPassword(input: string): boolean {
  return normalize(input) === normalize(WIFI_PASSWORD);
}

// Vrai si le défi a déjà été résolu lors d'une visite précédente.
export function isWifiChallengeSolved(): boolean {
  return document.cookie
    .split("; ")
    .some((row) => row === `${COOKIE_NAME}=true`);
}

// Marque le défi comme résolu, pour ne pas redemander le mot de passe à chaque visite.
export function markWifiChallengeSolved() {
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60; // en secondes
  document.cookie = `${COOKIE_NAME}=true; path=/; max-age=${maxAge}; SameSite=Lax`;
}

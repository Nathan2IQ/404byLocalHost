// Adresses relevées une fois connecté au WiFi Localhost (en cherchant "quelle est mon IP").
// TODO avant l'événement : si le fournisseur internet change d'adresse, remettre à jour ces valeurs.
const KNOWN_WIFI_IPV6 = "2001:861:3dc6:7a70:7cb1:4a1f:b052:d544";
// En IPv4, tous les appareils du réseau partagent exactement la même IP publique (NAT du routeur),
// contrairement à l'IPv6 où seul le début (le préfixe) est commun.
const KNOWN_WIFI_IPV4 = "176.149.210.12";

// Décompose une IPv6 (avec ou sans "::") en ses 8 groupes de 16 bits.
function expandIPv6(ip: string): string[] | null {
  if (!ip.includes(":")) return null;

  const [head, tail] = ip.split("::");
  const headGroups = head ? head.split(":") : [];
  const tailGroups = tail !== undefined && tail !== "" ? tail.split(":") : [];
  const missing = 8 - headGroups.length - tailGroups.length;
  if (missing < 0) return null;

  const groups = [...headGroups, ...Array(missing).fill("0"), ...tailGroups];
  if (groups.length !== 8) return null;

  return groups.map((g) => g.padStart(4, "0").toLowerCase());
}

// Les 64 premiers bits (4 premiers groupes) identifient le réseau, pas l'appareil :
// chaque appareil a sa propre fin d'adresse, mais le même début s'il est sur le même WiFi.
function networkPrefix(ip: string): string | null {
  const groups = expandIPv6(ip);
  if (!groups) return null;
  return groups.slice(0, 4).join(":");
}

const KNOWN_PREFIX = networkPrefix(KNOWN_WIFI_IPV6);

// Vrai si l'IP donnée appartient au même réseau que le WiFi Localhost
// (même préfixe IPv6, ou exactement la même IPv4).
export function isOnLocalhostNetwork(ip: string | null | undefined): boolean {
  if (!ip) return false;
  const trimmed = ip.trim();

  if (trimmed === KNOWN_WIFI_IPV4) return true;

  const prefix = networkPrefix(trimmed);
  return prefix !== null && prefix === KNOWN_PREFIX;
}

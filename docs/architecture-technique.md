# Documentation technique

## Objectif et stack

Ce dépôt contient le jeu de piste web « Easter Egg by Localhost ». Le visiteur ouvre le site sur son téléphone, résout quatre défis dans les locaux, puis assemble un puzzle final.

Le projet utilise Next.js 16 avec l'App Router, React 19, TypeScript et Tailwind CSS 4. Vitest exécute les tests unitaires. Le navigateur conserve l'état de la visite dans des cookies; il n'y a ni base de données ni stockage de progression côté serveur.

## Organisation des dossiers

| Chemin        | Rôle                                                                                                                                                       |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/`        | Routes Next.js, pages et endpoints API. Une page `page.tsx` définit la route correspondant à son dossier.                                                  |
| `app/api/`    | Routes serveur. `api/wifi-check/route.ts` vérifie l'adresse IP de la requête.                                                                              |
| `components/` | Composants d'interface réutilisables : scanner, contrôles d'accès, énigmes, progression et puzzle.                                                         |
| `lib/`        | Logique métier indépendante de l'interface : progression, état du puzzle et vérifications WiFi/réseau. Les tests unitaires sont placés à côté des modules. |
| `public/`     | Ressources servies directement, dont images, favicons et worker du scanner QR.                                                                             |
| `coverage/`   | Rapport HTML de couverture généré par Vitest; ce n'est pas du code applicatif à modifier.                                                                  |
| `docs/`       | Documentation du projet.                                                                                                                                   |

### Fichiers de configuration à la racine

- `package.json` : dépendances et commandes `dev`, `test`, `build`, `start` et `lint`.
- `tsconfig.json` : configuration TypeScript et alias d'import `@/`.
- `next.config.ts` : configuration Next.js.
- `postcss.config.mjs` : intégration PostCSS/Tailwind.
- `eslint.config.mjs` : règles de lint.
- `vitest.config.ts` : configuration des tests.
- `app/globals.css` : styles globaux et utilitaires personnalisés.
- `app/layout.tsx` : layout partagé, métadonnées, polices, en-tête/pied de page et affichage global du défi WiFi.

## Routes et composition

| URL                            | Fichier                                    | Responsabilité principale                                                     |
| ------------------------------ | ------------------------------------------ | ----------------------------------------------------------------------------- |
| `/`                            | `app/page.tsx`                             | Accueil, progression, scanner QR et règles du jeu.                            |
| `/canape`                      | `app/canape/page.tsx`                      | Énigme du salon, réponse simple.                                              |
| `/coworking`                   | `app/coworking/page.tsx`                   | Défi Flex office; accès limité au réseau Localhost.                           |
| `/coworking/indice-imprimante` | `app/coworking/indice-imprimante/page.tsx` | Feuille d'indice imprimable.                                                  |
| `/impression-3d`               | `app/impression-3d/page.tsx`               | Quiz de l'imprimante et étape d'impression; accès limité au réseau Localhost. |
| `/hub`                         | `app/hub/page.tsx`                         | Énigme de la salle de réunion.                                                |
| `/breakroom`                   | `app/breakroom/page.tsx`                   | Débloque le captcha ludique et le puzzle après les quatre salles.             |
| `/acces-refuse`                | `app/acces-refuse/page.tsx`                | Écran informatif pour une salle non autorisée.                                |
| `/api/wifi-check`              | `app/api/wifi-check/route.ts`              | Retourne `{ connected: boolean }` à partir de l'IP du client.                 |

Les pages d'activité composent principalement des composants partagés. `RoomChallenge` masque un défi déjà résolu; `WifiRequiredGate` est utilisé uniquement autour des pages Coworking et Impression 3D. `/breakroom` lit la progression dans le navigateur et n'affiche `CaptchaPuzzle` qu'une fois les quatre salles validées.

## Architecture et flux de données

1. Le layout affiche l'interface commune et `WifiChallengeModal`. Le défi initial vérifie une réponse saisie par le visiteur; l'état est mémorisé dans un cookie distinct.
2. Le visiteur ouvre une salle en scannant son QR code ou via un lien. `QrScanner` utilise la caméra avec la bibliothèque `qr-scanner`; les URL du site ouvrent la route dans l'application.
3. Une réponse correcte appelle les fonctions de `lib/progress.ts`, qui mettent à jour le cookie `localhost_progress`. L'accueil relit ce cookie pour afficher les salles terminées et le plan révélé.
4. Pour Coworking et Impression 3D, `WifiRequiredGate` appelle `/api/wifi-check`. En production, la route lit `x-forwarded-for` (première IP) ou `x-real-ip` et la compare au réseau configuré dans `lib/wifiNetwork.ts`. En développement, la route répond toujours `connected: true`.
5. Après les quatre salles, `/breakroom` autorise la finale. `CaptchaPuzzle` mène au puzzle; chaque pièce placée est sauvegardée dans `localhost_puzzle`. Une fois terminé, `PuzzleBoard` révèle l'image et peut transmettre le badge et le commentaire facultatif à EmailJS.

### Persistance et limites de confiance

Les cookies de progression, du défi WiFi initial et du puzzle sont accessibles au navigateur et ont une durée de vie de 30 jours. Ils ne sont pas partagés entre navigateurs ou appareils. Les fonctions qui les lisent utilisent `document.cookie` et doivent donc être appelées côté client, après montage ou depuis un composant client.

La vérification du mot de passe initial et les réponses aux énigmes sont également exécutées dans le navigateur : elles servent au jeu, pas à protéger des données ou des ressources sensibles. La vérification de l'IP est effectuée par l'endpoint serveur. Les adresses réseau connues sont configurées dans `lib/wifiNetwork.ts`; une modification de l'IP publique du lieu peut donc bloquer ces deux salles en production.

## Composants principaux

| Composant            | Responsabilité                                                                                                           |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `WifiChallengeModal` | Présente le défi de mot de passe WiFi au premier passage et affiche l'état réseau à titre informatif.                    |
| `WifiRequiredGate`   | Gère les états de vérification, refus et accès accordé à une salle nécessitant le WiFi.                                  |
| `QrScanner`          | Démarre/arrête la caméra, décode les QR codes et navigue vers leur URL. Le worker chargé du décodage est dans `public/`. |
| `RoomChallenge`      | Empêche de refaire une salle déjà enregistrée comme résolue.                                                             |
| `EnigmeInput`        | Champ de réponse générique; valide, met à jour la progression et affiche la confirmation partagée `SalleValideePopup`.   |
| `ImprimanteQuiz`     | Gère les cinq questions du quiz, leur correction, la reprise et l'étape d'impression du cadeau.                          |
| `AvancementPartie`   | Affiche les salles terminées, l'état du puzzle et la carte révélée.                                                      |
| `SallesList`         | Liste et trie les salles selon leur état de résolution.                                                                  |
| `AccueilSections`    | Adapte les sections de l'accueil à la progression du joueur.                                                             |
| `CaptchaPuzzle`      | Enchaîne les étapes du faux captcha avant de montrer le puzzle.                                                          |
| `PuzzleBoard`        | Gère le glisser-déposer des pièces, la révélation finale, les confettis et l'envoi EmailJS.                              |
| `PlanRevele`         | Révèle sur le plan les zones dont les défis sont terminés; les coordonnées sont définies dans `ZONES`.                   |
| `PrintOnLoad`        | Déclenche l'impression navigateur de l'indice du Coworking.                                                              |
| `RandomGiphy`        | Sélectionne un GIF aléatoire pour la page d'accès refusé.                                                                |
| `ProgressTestPanel`  | Outil de test permettant de modifier/réinitialiser manuellement la progression; ce n'est pas un mécanisme de production. |

## Fonctions métier importantes

### Progression : `lib/progress.ts`

- `getProgress()` lit et décode le cookie, puis complète les valeurs absentes avec l'état initial. Un cookie absent ou invalide produit une progression vide.
- `setRoomSolved(roomId, solved)` persiste l'état d'une salle; `markRoomSolved(roomId)` est le raccourci pour la marquer terminée.
- `solvedCount(progress)` compte les quatre salles; `isComplete(progress)` indique si elles sont toutes terminées. Le quiz 3D n'est pas compté comme une salle.
- `markImpression3dQuizSolved()` mémorise séparément la réussite du quiz et notifie ses abonnés. `subscribeToImpression3dQuiz()` permet à `ImprimanteQuiz` de réagir à cette modification.
- `resetProgress()` supprime le cookie de progression.

### Puzzle : `lib/puzzle.ts`

- `getPlacedPieces()` lit un tableau de 16 booléens et rejette un cookie mal formé ou d'une taille inattendue.
- `placePiece(pieceIndex)` marque une pièce comme placée et sauvegarde le tableau.
- `isPuzzleSolved(placed)` renvoie `true` seulement si toutes les pièces le sont; `resetPuzzle()` efface l'état.
- Dans `PuzzleBoard`, `handlePointerDown`, `handlePointerMove` et `handlePointerUp` pilotent le glisser-déposer. Une pièce n'est acceptée que si l'index de l'emplacement visé correspond à celui de la pièce.

### WiFi : `lib/wifi.ts`, `lib/wifiNetwork.ts` et l'API

- `checkWifiPassword(input)` normalise la saisie (espaces en bordure et casse) puis la compare à la réponse attendue. `markWifiChallengeSolved()` et `isWifiChallengeSolved()` gèrent le cookie du défi initial.
- `isOnLocalhostNetwork(ip)` accepte l'IPv4 connue exacte ou une IPv6 du préfixe `/64` configuré. Les entrées absentes ou invalides sont refusées.
- `GET` dans `app/api/wifi-check/route.ts` récupère l'adresse cliente depuis les en-têtes proxy et renvoie le résultat JSON. Le mode développement est explicitement autorisé pour faciliter les tests locaux.

### Validation des énigmes

- `EnigmeInput.verifierReponse()` vérifie une réponse non vide sans tenir compte de la casse, valide la salle et calcule les salles restantes.
- Dans `ImprimanteQuiz`, `normalize()` retire les accents et les caractères non alphanumériques; `matches()` accepte les réponses contenant un terme autorisé; `isCorrect()` applique cette règle ou la réponse Vrai/Faux. La réussite du quiz est distincte de la validation de la salle, qui n'arrive qu'après la réponse correcte sur l'objet imprimé.
- Dans `PuzzleBoard`, `handleEnvoyer()` vérifie la forme de l'email, envoie d'abord le badge puis le commentaire via EmailJS. L'échec du commentaire seul ne bloque pas l'envoi du badge.

## Tests et commandes

Les tests unitaires de `lib/` couvrent le stockage/réinitialisation des cookies, le calcul de progression, l'état du puzzle, le mot de passe WiFi et les cas IPv4/IPv6. Ils n'exécutent pas les composants React ni l'intégration réelle avec EmailJS ou OctoPrint.

```bash
npm install
npm run dev       # serveur local
npm test          # tests Vitest
npm run lint      # ESLint
npm run build     # tests via prebuild, puis build Next.js
```

Pour modifier un défi, changer le contenu de sa page ou de son composant, puis vérifier l'identifiant `RoomId` et la réponse attendue. Pour modifier le plan, mettre à jour `ZONES` dans `components/PlanRevele.tsx`. Pour changer le nombre de pièces, garder cohérents `GRID_COLS`, `GRID_ROWS`, les dimensions et l'image source dans `lib/puzzle.ts` et `components/PuzzleBoard.tsx`.

## Workshop Project - 404 by LocalHost

Visite interactive des locaux de **LocalHost**, à faire seul, à son rythme, avec un simple smartphone.

Dans chaque espace du lieu (le Canapé, le Coworking, l'atelier d'impression 3D, le Hub), un QR code ouvre une courte activité qui invite le visiteur à utiliser ce que le lieu met à sa disposition : se connecter au WiFi, imprimer un document, lancer une impression 3D, démarrer une réunion. La visite se termine en salle de pause.

## Sommaire

- [Aperçu](#aperçu)
- [Stack technique](#stack-technique)
- [Architecture](#architecture)
- [Démarrage](#démarrage)
- [Déploiement](#déploiement)
- [Configuration](#configuration)
- [Maintenance](#maintenance)
- [Pistes d'évolution](#pistes-dévolution)

## Aperçu

|                          |                                                                                                                                             |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Format**               | Application web, ouverte dans le navigateur du téléphone en scannant un QR code. Rien à installer.                                          |
| **Durée**                | Environ 20 minutes                                                                                                                          |
| **Prérequis visiteur**   | Un smartphone avec appareil photo, capable de se connecter au WiFi du lieu. Aucune connaissance technique.                                  |
| **Progression**          | Enregistrée dans des cookies pendant 30 jours : le visiteur peut faire une pause et reprendre avec le même téléphone et le même navigateur. |
| **Données personnelles** | Aucune progression ni compte utilisateur stocké par l'application. À la fin, l'adresse email et le commentaire facultatif sont transmis via EmailJS pour envoyer le badge et le retour. |

### Parcours

1. **Accueil** : première activité, trouver le mot de passe du WiFi.
2. **Canapé, Coworking, Impression 3D, Hub** : dans l'ordre de son choix, chaque bonne réponse valide un espace.
3. **Salle de pause** : puzzle final 4 × 4, débloqué une fois les quatre espaces validés.

## Stack technique

- [Next.js](https://nextjs.org/) (App Router) avec TypeScript
- [React](https://react.dev/)
- Hébergement sur [Vercel](https://vercel.com/) (déploiement continu depuis GitHub)
- Impression 3D pilotée via un Raspberry Pi sous [OctoPi / OctoPrint](https://octoprint.org/)

## Architecture

L'application n'a **ni base de données ni serveur d'état** : les pages affichent les activités, vérifient les réponses et enregistrent la progression dans le navigateur du visiteur.

Chaque espace correspond à une route, vers laquelle pointe le QR code collé sur place.

| Espace         | Route            | Fichier principal            |
| -------------- | ---------------- | ---------------------------- |
| Accueil        | `/`              | `app/page.tsx`               |
| Canapé         | `/canape`        | `app/canape/page.tsx`        |
| Coworking      | `/coworking`     | `app/coworking/page.tsx`     |
| Impression 3D  | `/impression-3d` | `app/impression-3d/page.tsx` |
| Hub            | `/hub`           | `app/hub/page.tsx`           |
| Salle de pause | `/breakroom`     | `app/breakroom/page.tsx`     |

Les éléments partagés se trouvent dans `lib/` (`wifi.ts`, `wifiNetwork.ts`).

### Sauvegarde de la progression

Trois cookies, valables 30 jours :

| Cookie                     | Contenu                                 |
| -------------------------- | --------------------------------------- |
| `localhost_wifi_connected` | Première activité (WiFi) réussie ou non |
| `localhost_progress`       | Espaces terminés                        |
| `localhost_puzzle`         | Pièces du puzzle final déjà placées     |

Changer de téléphone ou de navigateur fait repartir la visite de zéro.

### Vérification du réseau

Les activités du Coworking et de l'atelier 3D ne s'ouvrent que si le téléphone est connecté au WiFi du lieu. Le site compare l'adresse IP publique du visiteur à celle du local, définie dans `lib/wifiNetwork.ts`.

> ⚠️ C'est le point le plus fragile du projet : si le fournisseur d'accès change l'adresse IP du local, ces deux espaces deviennent inaccessibles. Voir [Mettre à jour l'adresse IP du WiFi](#mettre-à-jour-ladresse-ip-du-wifi).

### Équipements connectés

L'imprimante 3D est pilotée par un Raspberry Pi (OctoPi) accessible sur le réseau local à l'adresse `http://octopi.local`. Le site ne communique pas directement avec elle : c'est le visiteur qui lance l'impression depuis l'interface OctoPrint.

## Démarrage

### Prérequis

- [Node.js](https://nodejs.org/) (version LTS recommandée)
- npm

### Installation

```bash
git clone <url-du-depot>
cd <nom-du-depot>
npm install
```

### Lancer en local

```bash
npm run dev
```

Le site est alors disponible sur [http://localhost:3000](http://localhost:3000).

> En local, la vérification réseau compare votre IP publique à celle du lieu : les espaces Coworking et Impression 3D resteront verrouillés hors du WiFi LocalHost.

## Déploiement

Le déploiement est automatique : chaque modification poussée sur le dépôt GitHub est redéployée par Vercel, sans autre intervention.

## Configuration

### Mettre à jour l'adresse IP du WiFi

À faire si les espaces Coworking et Impression 3D refusent l'accès alors que le téléphone est bien connecté au WiFi du lieu.

1. Connecté au WiFi LocalHost (4G coupée), rechercher « quelle est mon IP » sur internet.
2. Reporter l'IPv4 et l'IPv6 dans `lib/wifiNetwork.ts` (`KNOWN_WIFI_IPV4` et `KNOWN_WIFI_IPV6`).
3. Pousser la modification sur GitHub : Vercel redéploie automatiquement.

### Modifier une activité

| À modifier                  | Fichier                                                              |
| --------------------------- | -------------------------------------------------------------------- |
| Mot de passe WiFi           | `lib/wifi.ts`                                                        |
| Canapé                      | `app/canape/page.tsx`                                                |
| Coworking et indice imprimé | `app/coworking/page.tsx`, `app/coworking/indice-imprimante/page.tsx` |
| Quiz de l'Impression 3D     | `app/impression-3d/ImprimanteQuiz.tsx`                               |
| Hub                         | `app/hub/page.tsx`                                                   |

Toute modification d'un objet physique du lieu (livre déplacé, nouvel équipement, autre écran) impose de vérifier que la réponse attendue de l'activité correspondante est toujours juste.

## Maintenance

### Réinitialiser un téléphone

Aucune remise à zéro côté serveur n'est nécessaire. Pour un téléphone réutilisé (nouveau visiteur ou test) :

1. Ouvrir les réglages du navigateur, section cookies / données des sites.
2. Supprimer les trois cookies `localhost_*` du site.
3. Recharger le site.

Plus simple : utiliser la navigation privée, tout s'efface à la fermeture de l'onglet.

### Entretien régulier

- **Imprimante 3D** : filament, nettoyage du plateau, fichier G-code conservé sur OctoPi.
- **QR codes** : à réimprimer s'ils sont abîmés ou si l'URL du site change.
- **Dépendances** (Next.js, React) : à maintenir à jour.

### Dépannage

| Problème                                                              | Cause probable                                                       | Solution                                                                    |
| --------------------------------------------------------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| « Connecte-toi au WiFi Localhost » alors que le visiteur est connecté | L'IP publique du lieu a changé, ou le téléphone utilise encore la 4G | Couper la 4G, puis [mettre à jour l'IP](#mettre-à-jour-ladresse-ip-du-wifi) |
| `http://octopi.local` ne s'ouvre pas                                  | Certains téléphones ne résolvent pas les adresses `.local`           | Utiliser l'adresse IP fixe du Raspberry Pi                                  |
| La caméra ne scanne pas le QR code                                    | Accès à la caméra refusé                                             | Utiliser l'appareil photo natif du téléphone                                |
| La salle de pause reste bloquée                                       | Un espace n'est pas validé, ou le visiteur a changé de navigateur    | Vérifier les espaces validés dans la progression                            |

## Pistes d'évolution

- [ ] Détecter le WiFi sans IP écrite en dur (ex. appel à un appareil du réseau local)
- [ ] Vérifier les réponses côté serveur
- [ ] Bouton « Recommencer » accessible aux visiteurs
- [ ] Espace animateur (statistiques, réinitialisation, modification des activités sans coder)
- [ ] Nouveaux espaces et activités renouvelées
- [ ] Mode équipe et classement par temps
- [ ] Version anglaise

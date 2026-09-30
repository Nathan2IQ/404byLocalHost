# Suivi — Salle Impression 3D

Page : `/impression-3d`, accessible uniquement via QR code sur smartphone (site web, pas une application).
Tout fonctionne côté navigateur, sans serveur (page statique).

## Fichiers

| Fichier | Rôle |
|---|---|
| `page.tsx` | Titre de l'onglet et présentation de la salle |
| `ImprimanteQuiz.tsx` | Composant client : quiz, étape cadeau, validation de la salle |

## Déroulé pour le joueur

1. **Présentation** : « Bienvenue dans la salle de l'imprimante 3D ! »
2. **Quiz** (5 questions, correction à la validation) :

   | # | Question | Réponse |
   |---|---|---|
   | 1 | Une imprimante 3D utilise-t-elle de l'encre ? | Faux |
   | 2 | Faut-il être ingénieur pour imprimer un objet ? | Faux |
   | 3 | Marque de l'imprimante de la pièce ? | Ender |
   | 4 | Impression couche par couche comme un millefeuille ? | Vrai |
   | 5 | Nom de la machine rouge, verte et bleue qui fait du fil à partir de bouteilles ? | Module 01 |

   Les réponses texte ignorent majuscules, accents et espaces, et acceptent une saisie qui contient la réponse (ex. « Creality Ender 3 »).
3. **Quiz réussi** : « Bravo, tu as réussi le quiz ! » puis bloc cadeau :
   impression via OctoPi (`http://octopi.local`, utilisateur `guest`, mot de passe `guest`).
4. **Question finale** : « Que peux-tu lire sur l'objet imprimé ? » → **Localhost**.
   Bonne réponse : `markRoomSolved("impression-3d")` (cookie de progression, compte pour la page finale)
   et pop-up « Salle validée ! » identique à `EnigmeInput`.

## Choix techniques

- Style repris de la page coworking et d'`EnigmeInput` (blocs blanc / sombre, surlignage jaune en police Caveat, bouton jaune).
- `EnigmeInput` n'est pas réutilisé car il n'accepte que des réponses numériques ; sa logique et son pop-up sont recopiés.
- Les bonnes réponses sont dans le JavaScript de la page (inévitable sans serveur).
- Titre en `text-6xl` avec `wrap-break-word` : « l'imprimante » est plus large qu'un écran de téléphone.

## À vérifier avant l'événement

- [ ] `http://octopi.local` s'ouvre depuis un iPhone et un Android sur le Wi-Fi du coworking (sinon, IP fixe du Raspberry Pi).
- [ ] Test complet sur smartphone via le QR code (quiz, impression, validation, pop-up).
- [ ] QR code pointant vers l'URL d'hébergement définitive + `/impression-3d`.

## Historique

- Création du quiz et de l'étape cadeau (page `/imprimante`).
- Renommage de la route en `/impression-3d` lors d'une fusion avec `main`.
- Ajout de la progression (`markRoomSolved`) comme les autres salles.
- Reprise du style de la page coworking, simplification du code, commentaires.

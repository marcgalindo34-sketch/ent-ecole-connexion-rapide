# ENT-École : Connexion Rapide 

![Privacy Focused](https://img.shields.io/badge/Privacy-100%25%20Local-green.svg)
![License](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-red.svg)
![Commercial Use](https://img.shields.io/badge/Commercial%20Use-FORBIDDEN-red)

**L'extension navigateur pour simplifier la connexion aux Espaces Numériques de Travail (ENT) pour les élèves non-lecteurs.**

Ce projet open-source permet aux enseignants de générer un tableau de bord local (Trombinoscope). Les élèves cliquent sur leur photo, et l'extension remplit automatiquement les identifiants via des paramètres URL sécurisés.

🔗 **Site Officiel & Documentation :** [marcgalindo.fr/ent-ecole-connexion-rapide](https://marcgalindo.fr/ent-ecole-connexion-rapide/)

---

## ⚠️ CONDITIONS D'UTILISATION (Licence)

Ce projet est protégé par la licence **CC BY-NC-SA 4.0** (Creative Commons).

* ✅ **Vous êtes libre** de télécharger, utiliser, modifier et partager ce code.
* ❌ **Interdiction formelle de vendre** ce logiciel ou une version dérivée.
* ✍️ **Obligation de citer l'auteur** (Marc Galindo) dans toute redistribution.

---

## 🛡️ Audit de Sécurité & RGPD (Privacy Policy)

La priorité absolue de ce projet est la protection des données des élèves et la conformité RGPD. Voici les garanties techniques vérifiables dans ce code source :

### 1. Architecture "Local-First" (Sans Serveur)
* **Zéro Base de Données :** Cette extension ne possède aucune base de données.
* **Zéro Tracking :** Aucun script d'analyse (Google Analytics, Matomo, etc.) n'est inclus.
* **Zéro Exfiltration :** Le code ne contient aucun appel réseau (`fetch`, `axios`) vers un serveur tiers. Les données restent strictement confinées entre le fichier HTML de l'enseignant et le navigateur de l'école.

### 2. Fonctionnement Technique
L'extension agit comme un simple "passe-plat" local :
1.  Elle détecte l'URL de connexion officielle de l'ENT.
2.  Elle lit les paramètres URL éphémères (`?u=login&p=password`) générés par le tableau de bord local.
3.  Elle injecte ces valeurs dans les champs `<input>` de la page.
4.  Elle efface les paramètres de l'URL immédiatement après l'injection par sécurité.

👉 **Vérifiez par vous-même :** Toute la logique critique se trouve dans le fichier [`src/contents/login-filler.ts`](./src/contents/login-filler.ts).

---

## 🛠️ Installation & Build (Pour les développeurs)

Ce projet utilise le framework **Plasmo** (React + TypeScript). Si vous êtes une académie ou une mairie, vous pouvez auditer et compiler vous-même l'extension.

### Prérequis
* Node.js 18+
* NPM ou PNPM

### Instructions de compilation
```bash
# 1. Cloner le projet
git clone [https://github.com/marcgalindo34-sketch/ent-ecole-connexion-rapide](https://github.com/marcgalindo34-sketch/ent-ecole-connexion-rapide)
cd ent-ecole-connexion-rapide

# 2. Installer les dépendances
npm install

# 3. Lancer en mode développement (Hot Reload)
npm run dev

# 4. Compiler pour la production (Génère un ZIP)
npm run build
# Le résultat sera dans le dossier /build/chrome-mv3-prod ou /build/firefox-mv2-prod
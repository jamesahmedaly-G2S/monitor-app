<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENT.md - Directives Système pour l'Agent de Codage (Codex)

> **IMPORTANT :** Ce fichier est la source unique de vérité opérationnelle pour l'IA. Tu dois lire et appliquer ces instructions avant toute génération de code.

## 1. Identité et Rôle
Tu es un ingénieur logiciel full-stack expert en TypeScript et Next.js (App Router). Ta mission est de développer l'application de centralisation et d'automatisation des codes d'erreurs d'audit en te basant sur les fichiers de spécifications.

## 2. Conteneur de Contexte & Sources
Pour chaque tâche, tu dois impérativement croiser tes implémentations avec les fichiers suivants :
- `@ARCHITECTURE.md` : Pour les règles SOLID/KISS/DRY et la structure exacte du modèle de données (22 colonnes).
- `@TASKS.md` : Pour l'ordre séquentiel des fonctionnalités à coder (Import CSV, Slug dynamique, Mailto).

## 3. Règles de Code Strictes (Zéro Compromis)
- **TypeScript :** Interdiction stricte d'utiliser `any`. Tout doit être typé via l'interface `ErrorCodeRegistry`. Les statuts et priorités doivent être des types unions littéraux.
- **UI & Composants :** Utilise exclusivement **Tailwind CSS** et les primitives de **Shadcn/ui** / **Radix UI**. Le design doit être ultra-moderne, sombre/clair (mode "Dashboard professionnel").
- **KISS :** Ne crée pas d'abstractions, de services ou de patterns superflus avant que l'étape de l'automatisation par API (Phase 2) ne soit active.

## 4. Commandes du Projet
- Installer les dépendances : `npm install`
- Lancer en développement : `npm run dev`
- Parser CSV : Utiliser `react-dropzone` et `papaparse`

## 5. Définition de "Terminé" (Definition of Done)
Une tâche est considérée comme validée uniquement si :
1. Le code compile sans aucun warning TypeScript.
2. La logique de séparation des responsabilités (SRP) est respectée.
3. Le fichier `CHANGELOG.md` a été mis à jour pour acter la modification.
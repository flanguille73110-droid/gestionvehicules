# AutoSuivi - Application de Suivi de Maintenance Véhicule

Cette application vous permet de suivre l'entretien de vos véhicules, de planifier les futures interventions et de gérer vos dépenses.

## Déploiement sur Vercel

1.  Créez un compte sur [Vercel](https://vercel.com/).
2.  Connectez votre compte GitHub.
3.  Importez ce dépôt.
4.  Dans les paramètres du projet sur Vercel, ajoutez la variable d'environnement suivante si vous utilisez des fonctionnalités IA :
    *   `GEMINI_API_KEY` : Votre clé API Google Gemini.
5.  Cliquez sur **Deploy**.

Le fichier `vercel.json` inclus assure que le routage côté client fonctionne correctement.

## Déploiement sur GitHub Pages

Note : GitHub Pages ne gère pas nativement le routage des Single Page Applications (SPA). Il est recommandé d'utiliser Vercel pour une expérience optimale.

Si vous souhaitez utiliser GitHub Pages :
1.  Installez le package `gh-pages` : `npm install gh-pages --save-dev`.
2.  Ajoutez `"homepage": "https://<votre-nom>.github.io/<nom-du-depot>"` dans votre `package.json`.
3.  Ajoutez les scripts de déploiement dans `package.json`.

## Développement local

```bash
npm install
npm run dev
```

## Sauvegarde des données

L'application utilise le stockage local de votre navigateur (via l'état React dans cette version). Pour conserver vos données de manière permanente, utilisez la fonction **Exporter les données (JSON)** dans les paramètres. Vous pourrez les réimporter plus tard ou sur un autre appareil.

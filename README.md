# Battaille Navale - Configuration Jest avec ESM

Ce projet utilise Jest avec Babel pour supporter les modules ES (ESM) en JavaScript.

## Configuration

### Fichiers de configuration

- **package.json** : Configuré avec `"type": "module"` pour utiliser ESM
- **babel.config.cjs** : Configure Babel pour transformer les modules ESM en CommonJS pour Jest
- **jest.config.cjs** : Configuration de Jest avec babel-jest comme transformateur

### Installation des dépendances

Pour installer les dépendances nécessaires, exécutez :

```bash
npm install --save-dev jest @babel/core @babel/preset-env babel-jest
```

## Utilisation

### Lancer les tests

```bash
npm test
```

### Lancer les tests en mode watch

```bash
npm run test:watch
```

### Générer un rapport de couverture

```bash
npm run test:coverage
```

## Points clés de la configuration

1. **Type module** : Le `package.json` contient `"type": "module"` pour activer les modules ESM
2. **Babel** : Transforme les modules ESM en CommonJS pour Jest via `babel.config.cjs`
3. **Jest** : Utilise `babel-jest` pour transformer les fichiers `.js` avant de les tester
4. **NODE_OPTIONS** : Utilise `--experimental-vm-modules` pour supporter les ESM avec Jest

## Structure du projet

```
cuirass-/
├── src/
│   ├── example.js        # Code source avec exports ESM
│   └── example.test.js   # Tests avec imports ESM
├── babel.config.cjs      # Configuration Babel (CommonJS)
├── jest.config.cjs       # Configuration Jest (CommonJS)
└── package.json          # Configuration du projet (ESM)
```

## Remarques importantes

- Les fichiers de configuration Babel et Jest utilisent l'extension `.cjs` (CommonJS) car ils doivent être chargés avant la transformation des modules
- Le code source et les tests utilisent l'extension `.js` avec la syntaxe ESM (`import`/`export`)
- Jest ne supporte pas nativement les ESM, d'où l'utilisation de Babel comme pont

module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": [
    "airbnb",
    "eslint:recommended",
    "plugin:react/recommended",
  ],
  "parserOptions": {
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "sourceType": "module"
  },
  "plugins": [
    "react"
  ],
  "globals": {
    "chrome": true,
  },
  "rules": {
    "arrow-parens": ["error", "always"],
    "arrow-spacing": ["error"],
    "arrow-body-style": ["error", "as-needed"],
    "no-var": ["error"],
    "prefer-const": ["error"],
    "object-shorthand": ["error"],
    "prefer-rest-params": ["error"],
    "prefer-spread": ["error"],
    "prefer-template": ["error"],
    "template-curly-spacing": ["error"],
    "consistent-return": ["error"],
    "prefer-arrow-callback": ["error"],
    "react/no-unused-prop-types": ["error", {skipShapeProps: true}],
    "react/jsx-closing-bracket-location": ["error", "props-aligned"],
    "react/jsx-boolean-value": ["error", "always"],
    "react/require-extension": ["off"],
    "import/extensions": ["error", {"jsx": "always"}],
    "quotes": [
      "error",
      "double"
    ],
    "semi": [
      "error",
      "always"
    ]
  }
};

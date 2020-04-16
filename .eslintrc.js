module.exports = {
    "parser": "babel-eslint",
    "extends": [
        "google",
        "eslint:recommended",
        "plugin:react/recommended",
    ],
    "env": {
        "browser": true,
        "node": true,
        "amd": true
    },
    "rules": {
        "no-console": 'off',
        "no-unexpected-multiline": "off",
        "no-sparse-arrays": "off",
        "no-useless-escape": "off",
        "no-undef" : "off",
    },
};
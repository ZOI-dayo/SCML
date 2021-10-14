module.exports = {
    root: true,
    env: {
        es6: true,
        node: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        sourceType: "module",
        ecmaVersion: 5, // Node.js 12の場合は2019、他のバージョンのNode.jsを利用している場合は場合は適宜変更する
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.eslint.json"]
    },
    plugins: [
        "@typescript-eslint",
    ],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
    ],
    rules: {
        "semi": [2, "always"],
        "quotes": [2, "double"],
        "semi-spacing": ["error", {"after": true, "before": false}],
        "semi-style": ["error", "last"],
        "no-extra-semi": 2,
        "no-unexpected-multiline": 2,
        "no-unreachable": 2,
        "@typescript-eslint/no-unused-vars": 1,
        "@typescript-eslint/explicit-function-return-type": 2,
        "@typescript-eslint/no-explicit-any": 2,
        "@typescript-eslint/typedef": 2,
        "@typescript-eslint/no-non-null-assertion": 2,
        "@typescript-eslint/adjacent-overload-signatures": 2,
        "@typescript-eslint/naming-convention": [
            2,
            {"selector": "default", "format": ["camelCase"]},
            {"selector": "variable", "format": ["camelCase", "UPPER_CASE"]},
            {"selector": "parameter", "format": ["camelCase"], "leadingUnderscore": "allow"},
            {"selector": "memberLike",/* "modifiers": ["private"], */"format": ["camelCase"],"leadingUnderscore": "allow"},
            {"selector": "typeLike", "format": ["PascalCase"]}
        ]
    },
};
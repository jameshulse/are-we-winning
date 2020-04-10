module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: ["plugin:vue/essential", "@vue/standard"],
    parserOptions: {
        parser: "babel-eslint"
    },
    rules: {
        "indent": ["error", 4],
        "semi": ["error", "always"],
        "comma-dangle": ["warn", "only-multiline"],
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
    }
};

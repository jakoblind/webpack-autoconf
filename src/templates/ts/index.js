export const tsconfig = `{
    "compilerOptions": {
        "outDir": "./dist/",
        "sourceMap": true,
        "strict": true,
        "noImplicitReturns": true,
        "noImplicitAny": true,
        "module": "es6",
        "moduleResolution": "node",
        "target": "es5",
        "allowJs": true,
    },
    "include": [
        "./src/**/*"
    ]
}`;

export const tsconfigReact = `{
    "compilerOptions": {
        "outDir": "./dist/",
        "sourceMap": true,
        "strict": true,
        "noImplicitReturns": true,
        "noImplicitAny": true,
        "module": "es6",
        "moduleResolution": "node",
        "target": "es5",
        "allowJs": true,
        "jsx": "react",
    },
    "include": [
        "./src/**/*"
    ]
}`;

export const indexTypescript = `
async function helloWorld() {
  return 'hello world!';
}

helloWorld()
  .then((msg) => console.log(msg))
  .catch((e) => console.error(e));
`;

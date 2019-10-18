export const css = `h1 {
  color: white;
  background-color: black;
}`;

export const scss = `$primary-color: white;
$bg: black;
h1 {
  color: $primary-color;
  background-color: $bg;
}`;

export const less = `@primary-color: white;
@bg: black;
h1 {
  color: @primary-color;
  background-color: @bg;
}`;

export const stylus = `primary-color = white
bg = black
h1
  color: primary-color;
  background-color: bg;
`;

export const postCssConfig = `module.exports = {
  plugins: [
    require('autoprefixer')
  ]
};`;

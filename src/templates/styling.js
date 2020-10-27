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

export const tailwindcss = ({ withPostCSS = true }) => {
  const importKeyword = withPostCSS ? '@tailwind' : '@import';
  return `${importKeyword} ${
    withPostCSS ? `base` : `'tailwindcss/dist/base.css'`
  };

${importKeyword} ${
    withPostCSS ? `components` : `'tailwindcss/dist/components.css'`
  };

${importKeyword} ${
    withPostCSS ? `utilities` : `'tailwindcss/dist/utilities.css'`
  };`;
};

export const postCssConfig = isTailwindcss => `module.exports = {
  plugins: [${
    isTailwindcss
      ? `
    require('tailwindcss'),`
      : ''
  }
    require('autoprefixer')
  ]
};`;

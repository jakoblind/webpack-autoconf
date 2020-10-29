import _ from 'lodash';

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

export function getStyleTags(configItems) {
  const isCss = _.includes(configItems, 'CSS');
  const isLess = _.includes(configItems, 'Less');
  const isSass = _.includes(configItems, 'Sass');
  const isStylus = _.includes(configItems, 'stylus');
  const isTailwindCSS = _.includes(configItems, 'Tailwind CSS');
  const cssStyle = `<style>
${css}
</style>`;
  const lessStyle = `<style lang="less">
${less}
</style>`;
  const sassStyle = `<style lang="scss">
${scss}
</style>`;
  const stylusStyle = `<style lang="styl">
${stylus}
</style>`;
  const tailwindcssStyle = `<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>`;

  return _.concat(
    [],
    isCss && !isTailwindCSS ? cssStyle : [],
    isSass ? sassStyle : [],
    isLess ? lessStyle : [],
    isStylus ? stylusStyle : [],
    isTailwindCSS ? tailwindcssStyle : []
  );
}

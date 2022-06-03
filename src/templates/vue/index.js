import _ from 'lodash';

const joinToString = (list) => _.reduce(list, (all, i) => `${all + i}\n`, '');

export const vueIndexTs = (extraImports = []) => `import { createApp } from 'vue';
import App from './App.vue';
${joinToString(extraImports)}
createApp(App).mount("#app");`;

export const vueIndexAppVue = (styling, configItems) => {
  const isTailwindcss = _.includes(configItems, 'tailwind-css');
  const isBootstrap = _.includes(configItems, 'bootstrap');
  const isTypescript = _.includes(configItems, 'typescript');
  return `<template>
  <div>
    <h1${isTailwindcss ? ' class="text-4xl text-white bg-black"' : ''}>
      {{name}}
    </h1>${
      isBootstrap
        ? `\n    <button type="button" class="btn btn-primary">
      This is a bootstrap button
    </button>`
        : ''
    }
  </div>
</template>
${
  isTypescript 
  ? '<script lang="ts">\n' 
  : '<script>'
}${
  isTypescript 
    ? 'import { defineComponent } from \'vue\'\n' 
    : ''
}${
  isBootstrap
    ? `\n  import 'bootstrap';\n  import 'bootstrap/dist/css/bootstrap.min.css';`
    : ''
}
export default ${isTypescript ? 'defineComponent(' : ''}{
  data: function() {
    return {
      name: 'Hello World!',
    }
  },
}${isTypescript ? ')' : ''};
</script>

${styling}
`;
};

export const vueShimType = `declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
`;

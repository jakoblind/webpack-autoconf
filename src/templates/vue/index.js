import _ from "lodash";

const joinToString = list => _.reduce(list, (all, i) => `${all + i}\n`, "");

export const vueIndexTs = (extraImports = []) => `import Vue from 'vue';
import App from './App';
${joinToString(extraImports)}
new Vue({
  el: '#app',
  render: h => h(App),
});`;

export const vueIndexAppVue = (styling, configItems) => {
  const isTailwindcss = _.includes(configItems, "Tailwind CSS");
  const isBootstrap = _.includes(configItems, "Bootstrap");
  return `
<template>
  <div>
    <h1${isTailwindcss ? ' class="text-4xl text-white bg-black"' : ""}>
      {{name}}
    </h1>${isBootstrap ? `\n    <button type="button" class="btn btn-primary">
      This is a bootstrap button
    </button>` : ""}
  </div>
</template>

<script lang="ts">
  import Vue from "vue";${isBootstrap ? `\n  import 'bootstrap';\n  import 'bootstrap/dist/css/bootstrap.min.css';` : ""}

  export default Vue.extend({
    data: function() {
      return {
        name: 'Hello World!',
      }
    },
  });
</script>

${styling}
`;
};

export const vueShimType = `
declare module "*.vue" {
  import Vue from 'vue'
  export default Vue
}
`;

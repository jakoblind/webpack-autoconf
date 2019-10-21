import _ from 'lodash';

const joinToString = list => _.reduce(list, (all, i) => `${all + i}\n`, '');
export const vueIndexTs = (extraImports = []) => `import Vue from 'vue';
import App from './App';
${joinToString(extraImports)}
new Vue({
  el: '#app',
  render: h => h(App),
});`;
export const vueIndexAppVue = styling => `
<template>
  <h1>
    {{name}}
  </h1>
</template>

<script lang="ts">
  import Vue from "vue";

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

export const vueShimType = `
declare module "*.vue" {
  import Vue from 'vue'
  export default Vue
}
`;

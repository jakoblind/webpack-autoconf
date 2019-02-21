import _ from 'lodash'

const joinToString = list => _.reduce(list, (all, i) => all + i + '\n', '')
export const vueIndexTs = (extraImports = []) => `import Vue from 'vue';
import App from './App';
${joinToString(extraImports)}
new Vue({
  el: '#app',
  render: h => h(App),
});`
export const vueIndexAppVue = styling => `
<template>
  <div>
    {{name}}
  </div>
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
`

export const vueIndexHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body>
    <div id="app"></div>
</body>

<script src="bundle.js"></script>

</html>`

export const vueHelloWorldTS = `<template>
    <div>
        <div class="greeting">Hello {{name}}{{exclamationMarks}}</div>
        <button @click="decrement">-</button>
        <button @click="increment">+</button>
    </div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
    props: ['name', 'initialEnthusiasm'],
    data() {
        return {
            enthusiasm: this.initialEnthusiasm,
        }
    },
    methods: {
        increment() { this.enthusiasm++; },
        decrement() {
            if (this.enthusiasm > 1) {
                this.enthusiasm--;
            }
        },
    },
    computed: {
        exclamationMarks(): string {
            return Array(this.enthusiasm + 1).join('!');
        }
    }
});
</script>
`

export const vueHelloWorldJs = `<template>
    <div>
        <div class="greeting">Hello {{name}}{{exclamationMarks}}</div>
        <button @click="decrement">-</button>
        <button @click="increment">+</button>
    </div>
</template>

<script lang="js">
import Vue from "vue";
export default Vue.extend({
    props: ['name', 'initialEnthusiasm'],
    data() {
        return {
            enthusiasm: this.initialEnthusiasm,
        }
    },
    methods: {
        increment() { this.enthusiasm++; },
        decrement() {
            if (this.enthusiasm > 1) {
                this.enthusiasm--;
            }
        },
    },
    computed: {
        exclamationMarks() {
            return Array(this.enthusiasm + 1).join('!');
        }
    }
});
</script>
`

export const vueShimType = `
declare module "*.vue" {
  import Vue from 'vue'
  export default Vue
}
`

export const vueIndexTs = `import Vue from 'vue';
import App from './App';
new Vue({
  el: '#app',
  render: h => h(App),
});`;
export const vueIndexAppVue = `
<template>
    <div>
        Name: <input v-model="name" type="text">
        <hello-component :name="name" :initialEnthusiasm="initialEnthusiasm"/>
    </div>
</template>

<script lang="ts">
  import HelloComponent from "./Hello.vue";
  import Vue from "vue";

  export default Vue.extend({
    data: function() {
      return {
        name: 'World',
        initialEnthusiasm: 5
      }
    },
    components: {
      HelloComponent,
    },
  });
</script>
`;

export const vueIndexHtml = `<!doctype html>
<html>

<body>
    <div id="app"></div>
</body>

<script src="bundle.js"></script>

</html>`;

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
`;

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
`;

export const vueShimType = `
declare module "*.vue" {
  import Vue from 'vue'
  export default Vue
}
`;

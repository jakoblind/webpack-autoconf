export const vueIndexTs = `import Vue from "vue";
import HelloComponent from "./Hello.vue";
let v = new Vue({
    el: "#app",
    template: \`
    <div>
        Name: <input v-model="name" type="text">
        <h1>Hello Component</h1>
        <hello-component :name="name" :initialEnthusiasm="5" />
        </div>
    \`,
    data: { name: "World" },
    components: {
        HelloComponent,
    }
});`;

export const vueIndexHtml = `<!doctype html>
<html>

<body>
    <div id="app"></div>
</body>

<script src="bundle.js"></script>

</html>`;

export const vueHelloWorld = `<template>
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

<style>
.greeting {
    font-size: 20px;
}
</style>
`;

export const vueShimType = `
declare module "*.vue" {
  import Vue from 'vue'
  export default Vue
}
`;
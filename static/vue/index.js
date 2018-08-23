export const vueIndexTs = `import Vue from "vue";
let v = new Vue({
    el: "#app",
    template: \`
    <div>
        <div>Hello {{name}}!</div>
        Name: <input v-model="name" type="text">
    </div>\`,
    data: {
        name: "World"
    }
});`;

export const vueIndexHtml = `<!DOCTYPE html>
<html>
    <head>
        <title>Vue starter app</title>
    </head>
    <body>
        <div id="app"></div>
        <script src="bundle.js"></script>
    </body>
</html>`

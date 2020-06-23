import _ from "lodash";

export const svelteIndexJs = () => `import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    name: 'world'
  }
});

window.app = app;

export default app;`;

export const svelteAppSvelte = (styling, configItems) => {
  const isTailwindcss = _.includes(configItems, 'Tailwind CSS');
  const isBootstrap = _.includes(configItems, "Bootstrap");
  return `<script>${isBootstrap ? `\n  import 'bootstrap';\n  import 'bootstrap/dist/css/bootstrap.min.css';\n` : ""}
  export let name;
</script>
${styling}
<h1${
    isTailwindcss ? ' class="text-4xl text-white bg-black"' : ""
  }>Hello {name}!</h1>
${isBootstrap ? `<button type="button" class="btn btn-primary">
  This is a bootstrap button
</button>` : ""}`;
};

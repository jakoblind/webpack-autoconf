export const svelteIndexJs = () => `import App from './App.svelte';

const app = new App({
  target: document.body,
  props: {
    name: 'world'
  }
});

window.app = app;

export default app;`;

export const svelteAppSvelte = (styling, isTailwindcss) => `<script>
  export let name;
</script>
${styling}
<h1${
  isTailwindcss ? ' class="text-4xl text-white bg-black"' : ''
}>Hello {name}!</h1>`;

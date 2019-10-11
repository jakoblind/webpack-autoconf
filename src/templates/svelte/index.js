export const svelteIndexJs = () => `import App from './App.svelte';

const app = new App({
        target: document.body,
        props: {
                name: 'world'
        }
});

window.app = app;

export default app;`

export const svelteAppSvelte = () => `<script>
        export let name;
</script>

<h1>Hello {name}!</h1>`

# SvelteKit Sync / Async (boilerplate)

## Installation

* clone this project
* `npm install`
* (optional: if you don't use localhost, update the PUBLIC_API_URL variable in .env)
* `npm run dev` (or `npm run dev -- --host` if you don't use localhost)
* install the Backend part to test it [Ruby On Rails Sync / Async (boilerplate)](https://github.com/jyclem/rails-sync-async-boilerplate)

## Goal

To show how we can use the Ruby On Rails Sync / Async (boilerplate) project in 4 different ways:
* synchronously like we would do with a classic API
* asynchronously using polling
* asynchronously using websockets
* (bonus) asynchronously using websockets but with sending a chain of actions instead of one action each time

The interesting thing here is that we always use the same endpoint Backend side, that is to say that we develop the endpoint once, and then, for all the different ways of accessing it, we benefit from the same authorization/sanitization/serialization mechanism, as well as the error handling.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

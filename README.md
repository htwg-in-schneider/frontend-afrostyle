# frontend-afrostyle

Frontend for a string instrument webshop.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-blue?style=for-the-badge)](https://github.com/htwg-in-schneider/frontend-afrostyle/)

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd) 
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```



## Iterations

### Iteration 0: Getting started

Created new Vue project with `npm create vue:latest`.

### Iteration 1: Static content

Made static product page from mock work as a Vue project:

- Source: kategorie.html from static project
- Logo and CSS go into assets folder
- index.html: link CSS and bootstrap JS
- App.vue: Main content goes here. Logo image link adapted.




### Iteration 2: GitHub Page deployment

- Added `.github/workflows/build-and-deploy.js.yml` to deploy as GitHub Page.
- Tweaked `vite.config.js` to use correct base URL - otherwise the JS files won't be loaded when hosted as a GitHub page.
- Added custom favicon


### Iteration 3: Dynamic product loading from local data

- Replaced static product cards with dynamic rendering using Vue's `v-for` from local `products` array in data.js.
- Products are displayed in a grid.
- "Details" button shows product description in an alert.
- Product images, titles, and prices are now populated from array data.


### Iteration 4: High-Level components

- Vue components have been created inside `src/components`.
- `ProductCard.vue` is used inside `App.vue` for showing a product summary.
- `App.vue` is now using  `Navbar.vue`, and `Footer.vue` components for better structure.
- Styles specific to components have been moved from `style.css` into their respective `<style scoped>` sections.
- Logic specific to components has been moved into their respective `<script setup>` sections.




### Iteration 5: Low-Level components

- Introduced some low-level reusable components:
  - `Button.vue`: A reusable button component with different variants (accent, secondary).
  - `FooterLink.vue`: A link component specifically for footer links (styled appropriately).



### Iteration 6: Added Vue-Router and product detail view

- Integrated Vue-Router as preparation to adding different views (`router/index.js`)
  - Important note: When hosting the app not under / on the server (as we are doing with GitHub Pages), `createWebHistory` must be provided with the app path!
  - also `main.js` must be imported relatively
- Updated `App.vue` to include `<router-view>` for rendering routed components.
- Created route `/` to `ProductCatalog.vue` for the product listing page
- Added a new product detail view that is linked from `ProductCard.vue` and can be accessed via `/product/:id`.






### Iteration 7: State management with Pinia

- Integrated Pinia for simple global state (banner visibility is saved through different views) and updated the banner component to use the store:
  - Installed Pinia: `npm install pinia`.
  - Added a small store: `src/stores/banner.js` (defines `isVisible` and `hideBanner()`).
  - Registered Pinia in `src/main.js` with `createPinia()` and `app.use(pinia)`.
  - Updated `SpecialBanner.vue` to use `useBannerStore()` and call `hideBanner` on button click.
- Note: For persistence across reloads you can extend the store to sync with `localStorage` or use a pinia plugin, see e.g.

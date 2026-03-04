// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';
import icon from "astro-icon";


// https://astro.build/config
export default defineConfig({
  site: 'https://mauriciovillegasbelmont.github.io',
  base:'/portafolio-astro-25',
  integrations: [
    tailwind(),
    icon(),
  ],
  vite: {
    resolve: {
      alias: {
        components: '/src/components',
        layouts: '/src/layouts',
        modules: '/src/modules',
        pages: '/src/pages',
        styles: '/src/styles',
        assets: '/src/assets',
        data: '/src/data',
        icons: '/src/icons',
        libs: '/src/libs',
        utils: '/src/utils',
      }
    }
  }
});
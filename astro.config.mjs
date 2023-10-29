import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';
import compress from 'astro-compress';
import { astroImageTools } from "astro-imagetools";

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  compressHTML: true,
  markdown: {
    shikiConfig: {
      lineNumbers: true,
    },
  },
  integrations: [
    astroImageTools,
    mdx(),
    tailwind({
      applyBaseStyles: false,
    }),
    compress(),
    react(),
  ],
});

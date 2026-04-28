// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

export default defineConfig({
  site: "https://www.ictira.com",
  integrations: [
    icon(),
    sitemap({
      filter: (page) => !page.includes('/lp/'),
    }),
  ],
});

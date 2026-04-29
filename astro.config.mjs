// @ts-check
import { defineConfig, fontProviders, envField } from "astro/config";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

export default defineConfig({
  site: "https://www.ictira.com",
  integrations: [
    icon(),
    sitemap({
      filter: (page) => !page.includes("/lp/"),
    }),
  ],
  fonts: [
    {
      name: "Inter Tight",
      cssVariable: "--font-inter-tight",
      provider: fontProviders.google(),
      weights: [400, 500, 600, 700, 800, 900],
      styles: ["normal"],
    },
    {
      name: "Inter Tight",
      cssVariable: "--font-inter-tight",
      provider: fontProviders.google(),
      weights: [500, 700, 800],
      styles: ["italic"],
    },
    {
      name: "JetBrains Mono",
      cssVariable: "--font-jetbrains-mono",
      provider: fontProviders.google(),
      weights: [400, 500, 600],
      styles: ["normal"],
    },
  ],
  env: {
    schema: {
      PUBLIC_GTM_ID: envField.string({
        context: "client",
        access: "public",
        optional: false,
      }),
      PUBLIC_TURNSTILE_SITE_KEY: envField.string({
        context: "client",
        access: "public",
        optional: false,
      }),
    },
  },
});

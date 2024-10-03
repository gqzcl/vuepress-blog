import { defineUserConfig } from "vuepress";
import { googleAnalyticsPlugin } from "@vuepress/plugin-google-analytics";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  head: [
    [
      "link",
      {
        rel: "stylesheet",
        href: "//at.alicdn.com/t/font_2410206_mfj6e1vbwo.css",
      },
    ],
    [
      "link",
      {
        rel: "stylesheet",
        href: "//at.alicdn.com/t/font_3401690_wecuwi6w62.css",
      },
    ],
  ],

  locales: {
    "/": {
      lang: "zh-CN",
      title: "黑色夜猫",
      description: "gqzcl 的私人博客",
    },
    "/en/": {
      lang: "en-US",
      title: "Black Cat",
      description: "gqzcl's personal blog",
    },
  },

  theme,

  plugins: [
    googleAnalyticsPlugin({
      id: "G-J8LPGDC9JT",
    }),
  ],

  // Enable it with pwa
  // shouldPrefetch: false,
});

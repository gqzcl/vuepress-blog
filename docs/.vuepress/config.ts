import theme from "./theme";
import { defineUserConfig } from "vuepress";
import { autoCatalogPlugin } from "vuepress-plugin-auto-catalog";
import { docsearchPlugin } from "@vuepress/plugin-docsearch";

export default defineUserConfig({
  base: "/",

  head: [
    ["link",{rel: "stylesheet",href: "//at.alicdn.com/t/font_2410206_mfj6e1vbwo.css"}],
    ["link",{rel: "stylesheet",href: "//at.alicdn.com/t/font_3401690_wecuwi6w62.css"}],
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

  plugins: [
    // 搜索插件
    docsearchPlugin({
      apiKey: "",
      indexName: "",
      appId: 'YOUR_APP_ID',
    }),
    // 自动生成目录
    autoCatalogPlugin({
      //插件选项
      index: true,
    }),
  ],

  theme,
});

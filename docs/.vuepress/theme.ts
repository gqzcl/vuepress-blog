import { hopeTheme } from "vuepress-theme-hope";
import * as navbar from "./navbar";
import * as sidebar from "./sidebar";


export default hopeTheme({
  hostname: "https://gqzcl.cn",

  author: {
    name: "gqzcl",
    url: "https://gqzcl.cn",
  },

  iconPrefix: "iconfont icon-",

  logo: "/logo.svg",

  repo: "gqzcl",

  docsDir: "src",

  pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],

  blog: {
    medias: {
      Email: "mailto:gqzcl@qq.com",
      GitHub: "https://github.com/gqzcl",
      Gmail: "mailto:q1476048558@gmail.com",
      QQ: "http://wpa.qq.com/msgrd?v=3&uin=1476048558&site=qq&menu=yes",
      Wechat: "/icon/wechat.jpg",
    },
  },

  locales: {
    
    "/": {
      // navbar
      navbar: navbar.zh,

      // sidebar
      sidebar: sidebar.zh,

      footer: '<a href="http://beian.miit.gov.cn/" rel="noopener noreferrer" target="_blank">ICP备案号：苏ICP备19021780号</a> | <a href="/about/site.html">关于网站</a>' ,

      displayFooter: true,
      blog: {
        description: "后端开发工程师",
        intro: "/intro.html",
      },
      
    },

    /**
     * English locale config
     */
    "/en/": {
      // navbar
      navbar: navbar.en,

      // sidebar
      sidebar: sidebar.en,

      footer: "Default footer",

      displayFooter: true,

      blog: {
        description: "A FrontEnd programmer",
        intro: "/en/intro.html",
      },
    },
  },

  encrypt: {
    config: {
      "/guide/encrypt.html": ["1234"],
      "/en/guide/encrypt.html": ["1234"],
    },
  },

  displayFooter: true,
  copyright: "Copyright © 2020-present gqzcl",

  plugins: {
    blog: {
      autoExcerpt: true,
    },

    comment: {
      /**
       * Using giscus
       */
      type: "giscus",
      repo: "vuepress-theme-hope/giscus-discussions",
      repoId: "R_kgDOG_Pt2A",
      category: "Announcements",
      categoryId: "DIC_kwDOG_Pt2M4COD69",

      /**
       * Using twikoo
       */
      // type: "twikoo",
      // envId: "https://twikoo.ccknbc.vercel.app",

      /**
       * Using Waline
       */
      // type: "waline",
      // serverURL: "https://vuepress-theme-hope-comment.vercel.app",
    },

    // markdown 增强插件
    mdEnhance: {
      enableAll: true,
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
      },
    },

    // feed
    feed:{
      atom: true,
      json: true,
      rss: true,
    },

    // 语法高亮
    prismjs: true,

    // copyright: {
    //   hostname: "gqzcl.cn",
    //   author: "gqzcl",
    //   license: "MIT",
    //   global: true,
    //   disableCopy: true,
    // },

    pwa: {
      favicon: "/favicon.ico",
      themeColor: "#5c92d1",
      cacheHTML: false,
      maxSize: 3072,
      apple: {
        icon: "/icon/apple-touch-icon.png",
        statusBarColor: "white",
      },
      msTile: {
        image: "/icon/mstile-150x150.png",
        color: "#ffffff",
      },
      manifest: {
        name: "gqzcl 的个人博客",
        short_name: "gqzcl Blog",
        description: "gqzcl 的个人博客",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        icons: [
          {
            src: "/icon/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    },

  },
});

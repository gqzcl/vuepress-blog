import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  "/",
  {
    text: "笔记",
    icon: "note",
    prefix: "/notes/",
    children: [
      { text: "笔记", link: "", icon: "note", activeMatch: "^/notes/$" },
      { text: "Golang相关", icon: "actions", link: "Golang相关/" },
      { text: "Golang后端技术", icon: "animation", link: "Golang后端技术/" },
      { text: "Golang进阶训练营", icon: "study", link: "Golang进阶训练营/" },
      { text: "Git", icon: "github", link: "Git/" },
      { text: "Kubernetes", icon: "flower", link: "Kubernetes/" },
      { text: "Kafka", icon: "note", link: "Kafka/" },
      { text: "数据库", icon: "mysql", link: "数据库/" },
      { text: "数据结构", icon: "stack", link: "数据结构/" },
      { text: "Linux", icon: "linux", link: "Linux/" },
      { text: "网络相关", icon: "network", link: "网络相关/" },
      { text: "操作系统", icon: "process", link: "操作系统/" },
      { text: "杂项", icon: "folder", link: "杂项/" },
    ],
  },
  {
    text: "文档",
    icon: "read",
    prefix: "/docs/",
    children: [],
  },
  {
    text: "博文",
    icon: "edit",
    prefix: "/posts/",
    children: [
      { text: "y2021", icon: "leaf", link: "y2021/" },
      { text: "y2022", icon: "leaf", link: "y2022/" },
      { text: "y2023", icon: "leaf", link: "y2023/" },
    ],
  },
  "/home",
  {
    text: "V2 文档",
    icon: "book",
    link: "https://theme-hope.vuejs.press/zh/",
  },
]);

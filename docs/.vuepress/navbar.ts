import { navbar } from "vuepress-theme-hope";

export const zh = navbar([
    "/",
    { 
      text: "笔记", 
      icon: "note", 
      prefix: "/notes/",
      children: [
        {text: "笔记",link: "",icon: "note",activeMatch: "^/notes/$"},
        {text: "Golang相关", icon: "actions", link: "Golang相关/"},
        {text: "Golang后端技术", icon: "animation", link: "Golang后端技术/"},
        {text: "Golang进阶训练营", icon: "study", link: "Golang进阶训练营/"},
        {text: "Git", icon: "github", link: "Git/"},
        {text: "Kafka", icon: "note", link: "Kafka/"},
        {text: "数据库", icon: "mysql", link: "数据库/"},               
        {text: "数据结构", icon: "stack", link: "数据结构/"},        
        {text: "Linux", icon: "linux", link: "Linux/"},
        {text: "网络相关", icon: "network", link: "网络相关/"},
        {text: "操作系统", icon: "process", link: "操作系统/"},           
        {text: "杂项", icon: "folder", link: "杂项/"},
      ],
    },
    { 
      text: "文档", 
      icon: "read", 
      prefix: "/docs/",
      children: [
        {text: "Golang相关", icon: "note", link: "/docs/Golang相关/"},
      ],
    },
    {
      text: "博文",
      icon: "edit",
      prefix: "/posts/",
      children: [
        {
          text: "文章 1-4",
          icon: "edit",
          prefix: "article/",
          children: [
            { text: "文章 1", icon: "edit", link: "article1" },
            { text: "文章 2", icon: "edit", link: "article2" },
            "article3",
            "article4",
          ],
        },
        {
          text: "文章 5-12",
          icon: "edit",
          children: [
            {
              text: "文章 5",
              icon: "edit",
              link: "article/article5",
            },
            {
              text: "文章 6",
              icon: "edit",
              link: "article/article6",
            },
            "article/article7",
            "article/article8",
          ],
        },
        { text: "文章 9", icon: "edit", link: "article9" },
        { text: "文章 10", icon: "edit", link: "article10" },
        "article11",
        "article12",
      ],
    },
    "/home",
  ]);

export const en = navbar([
    "/en/",
    "/home",
    {
      text: "Posts",
      icon: "edit",
      prefix: "/posts/",
      children: [
        {
          text: "Articles 1-4",
          icon: "edit",
          prefix: "article/",
          children: [
            { text: "Article 1", icon: "edit", link: "article1" },
            { text: "Article 2", icon: "edit", link: "article2" },
            "article3",
            "article4",
          ],
        },
        {
          text: "Articles 5-12",
          icon: "edit",
          children: [
            {
              text: "Article 5",
              icon: "edit",
              link: "article/article5",
            },
            {
              text: "Article 6",
              icon: "edit",
              link: "article/article6",
            },
            "article/article7",
            "article/article8",
          ],
        },
        { text: "Article 9", icon: "edit", link: "article9" },
        { text: "Article 10", icon: "edit", link: "article10" },
        "article11",
        "article12",
      ],
    },
  ]);
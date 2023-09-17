import { sidebar } from "vuepress-theme-hope";

import { Golang相关 } from "./notes/Golang相关";
import { Golang后端技术 } from "./notes/Golang后端技术";
import { Go进阶训练营 } from "./notes/Go进阶训练营";
import { Git } from "./notes/Git";
import { Kubernetes } from "./notes/Kubernetes";
import { Kafka } from "./notes/Kafka";
import { 数据库 } from "./notes/数据库";
import { 数据结构 } from "./notes/数据结构";
import { Linux } from "./notes/Linux";
import { 网络相关 } from "./notes/网络相关";
import { 操作系统 } from "./notes/操作系统";
import { 杂项 } from "./notes/杂项";
import { notes } from "./notes/notes";

import { docs } from "./docs/docs";

import { posts } from "./posts/posts";
import {y2021} from "./posts/y2021";
import { y2022 } from "./posts/y2022";
import { y2023 } from "./posts/y2023";

export const zh = sidebar({
  "/": [
    "",
    "home",
    "slide",
    {
      text: "笔记",
      icon: "read",
      link: "/notes/",
    },
    {
      text: "文章",
      icon: "note",
      prefix: "posts/",
      children: [
        {
          text: "文章 1-4",
          icon: "note",
          collapsible: true,
          prefix: "article/",
          children: ["article1", "article2", "article3", "article4"],
        },
        {
          text: "文章 5-12",
          icon: "note",
          children: [],
        },
      ],
    },
  ],

  "/notes/Golang相关/": Golang相关,
  "/notes/Golang后端技术/": Golang后端技术,
  "/notes/Go进阶训练营/": Go进阶训练营,
  "/notes/Git/": Git,
  "/notes/Kubernetes/": Kubernetes,
  "/notes/Kafka/": Kafka,
  "/notes/数据库/": 数据库,
  "/notes/数据结构/": 数据结构,
  "/notes/Linux/": Linux,
  "/notes/网络相关/": 网络相关,
  "/notes/操作系统/": 操作系统,
  "/notes/杂项/": 杂项,
  "/notes/": notes,

  "/docs/": docs,

  "/posts/": posts,
  "/posts/y2021": y2021,
  "/posts/y2022": y2022,
  "/posts/y2023": y2023,
  
});

export const en = sidebar({
  "/en/": [
    "",
    "home",
    "slide",
    {
      icon: "creative",
      text: "Guide",
      prefix: "guide/",
      link: "guide/",
      children: "structure",
    },
    {
      text: "Articles",
      icon: "note",
      prefix: "posts/",
      children: [
        {
          text: "Articles 1-4",
          icon: "note",
          collapsible: true,
          prefix: "article/",
          children: ["article1", "article2", "article3", "article4"],
        },
        {
          text: "Articles 5-12",
          icon: "note",
          children: [
            {
              text: "Articles 5-8",
              icon: "note",
              collapsible: true,
              prefix: "article/",
              children: ["article5", "article6", "article7", "article8"],
            },
            {
              text: "Articles 9-12",
              icon: "note",
              children: ["article9", "article10", "article11", "article12"],
            },
          ],
        },
      ],
    },
  ],
});

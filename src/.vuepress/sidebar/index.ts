import { sidebar } from "vuepress-theme-hope";

import { Golang相关 } from "./notes/Golang相关.js";
import { Golang后端技术 } from "./notes/Golang后端技术.js";
import { Go进阶训练营 } from "./notes/Go进阶训练营.js";
import { Git } from "./notes/Git.js";
import { Kubernetes } from "./notes/Kubernetes.js";
import { Kafka } from "./notes/Kafka.js";
import { 数据库 } from "./notes/数据库.js";
import { 数据结构 } from "./notes/数据结构.js";
import { Linux } from "./notes/Linux.js";
import { 网络相关 } from "./notes/网络相关.js";
import { 操作系统 } from "./notes/操作系统.js";
import { 杂项 } from "./notes/杂项.js";
import { notes } from "./notes/notes.js";

import { docs } from "./docs/docs.js";

import { posts } from "./posts/posts.js";
import { y2021 } from "./posts/y2021.js";
import { y2022 } from "./posts/y2022.js";
import { y2023 } from "./posts/y2023.js";

export const zhSidebar = sidebar({
  "/": ["", "home", "slide"],

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
  "/en/": ["", "home", "slide"],
});

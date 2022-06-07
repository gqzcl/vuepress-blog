---
icon: page
title: 如何设计RESTful接口
category:
  - Golang后端
tag:
  - 接口
  - 后端
# 此页面会出现在首页的文章板块中
star: true
---
# 如何设计RESTful接口

### 什么是RESTful

RESTful是一种网络应用程序的设计风格和开发方式，基于HTTP，可以用XML格式或JSON格式定义

#### 设计规则

后端提供的RESTful API中，URL只使用名词来指定资源，原则上不使用动词，例如：`http://api.com/v1/profile` 表示获取某人的详细信息。

使用HTTP协议里的动词来实现资源的添加，修改，删除等操作。即通过HTTP动词来实现资源的状态扭转： 

* GET(SELECT)从服务器取出资源

* POST(CREATE)在服务器新建一个资源

* PUT(UPDATE)在服务器更新资源

* DELETE从服务器删除资源

比如： 

`DELETE http://api.com/v1/profile`: 删除某人的好友 （在http parameter指定好友id）

`POST http://api.com/v1/friends`: 添加好友

`UPDATE http://api.com/v1/profile`: 更新个人资料

### 注意事项

#### 接口要保证幂等性

当多次重复请求接口时要能保证与预期相符

解决方案：
- [保证接口幂等性](保证接口幂等性.md)


#### 标准化的响应结果集

响应结构中要包含code和message两项，以及可选的data属性，包含额外数据

语义层面也要遵循响应的规则，如code状态码要同一规范

#### 设计无状态接口

每一个请求都能得到相同的预期

使用redis等中间件来集中管理状态信息。


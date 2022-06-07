---
icon: page
title: GRPC传递与解析动态参数
category:
  - Golang后端
tag:
  - 接口
  - 后端
  - GRPC
# 此页面会出现在首页的文章板块中
star: true
---
# GRPC传递与解析动态参数

目前有以下几种方式

* 使用google.protobuf.Struct
* 使用google.protobuf.Any
* 使用map类型Map<string,string>
* 使用bytes类型传递JSON

https://juejin.cn/post/6894116401582505997

如果已有JSON数据，使用bytes会是一个更好的选择，而使用google.protobuf.Struct也没问题，但不够优雅，使用google.protobuf.Any会比较麻烦，而使用map类型则限制比较多

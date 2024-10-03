---
icon: page
title: Goland 使用
category:
  - Golang相关
tag:
  - Golang
---
# Goland 使用

关于[GO111MODULE](https://zhuanlan.zhihu.com/p/374372749
)

1.17不再支持GO111MODULE了，所以新项目不需要配置这个了

应该从1.13就可以不用配置这个变量了

## 创建项目

新版本当然是使用go mod了

![image.png](https://raw.githubusercontent.com/gqzcl/blog_image/master/20220607120835.png)

可以在创建项目的时候配置好环境变量

```go
GOPROXY=https://goproxy.cn,direct
```

## 配置

### 设置一下自动格式化

添加一个go fmt即可

![image.png](https://raw.githubusercontent.com/gqzcl/blog_image/master/20220607120853.png)

设置完之后就会在自动格式化了，最好重启一下，不然可能不生效。

## 在wsl2中使用goland

[视频](https://youtu.be/Xk8_jw94Ikc)

### 在wsl中编译

**在这里添加运行环境**

![image.png](https://raw.githubusercontent.com/gqzcl/blog_image/master/20220607120911.png)

**添加如下内容**

![image.png](https://raw.githubusercontent.com/gqzcl/blog_image/master/20220607121048.png)

### 使用wsl终端

![image.png](https://raw.githubusercontent.com/gqzcl/blog_image/master/20220607121109.png)

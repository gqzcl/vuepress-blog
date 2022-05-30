---
index: 2
icon: page
title: 语义化版本控制gsemver
date: 2020-01-01
category:
  - Golang后端
tag:
  - gsemver
  - 后端
# 此页面会在文章列表置顶
sticky: true
# 此页面会出现在首页的文章板块中
star: true
---


# 语义化版本控制gsemver

[地址](https://github.com/arnaud-deprez/gsemver)

在scripts/ensure_tag.sh文件中：

```bash
version=v`gsemver bump`
# shellcheck disable=SC1073
# shellcheck disable=SC1019
if [ -z "`git tag -l $version`"];then
  git tag -a -m "release version $version" $version
fi 
```

在scripts/ensure_tag.sh脚本中通过gsemver bump命令自动化生成语义化的版本号，并执行git tag -a给仓库打上版本号标签，gsemver命令会根据Commit Message自动生成版本号。

然后在scripts/make-rules/common.mk中

```bash
VERSION := $(shell git describe --tags --always --match='v*')
```

该命令是通过git describe来获取最近提交的tag

```bash
git describe --tags --always --match='v*'
v0.2.0-4-gc355cad
```

各参数的含义

--tag 不要只使用带注释的标签，而要使用refs/tags名称空间中的任何标签

--always，显示唯一缩写的提交对象作为后备

--match，只考虑与给定模式相匹配的标签

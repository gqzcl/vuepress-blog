---
icon: page
title: 使用Makefile管理项目
category:
  - Golang后端
tag:
  - makefile
  - 后端
---
# 使用Makefile管理项目

### Makefile使用

一般建议以`Makefile`为文件名，以及使用`xxx.mk`作为子文件名

### Makefile规则

规则：

```makefile
target ... : prerequisites ...
    command

# example
tidy:
	@go mod tidy
```

**target** 可以是一个**目标文件**（object file），也可以是一个**执行文件**，还可以是一个**标签**（label）。

**prerequisites** 是生成该target所需要的依赖项，当有多个依赖项时用空格隔开。

**command** 是该target要执行的命令（任意的shell命令）。


**tips**：

* 在执行command之前会默认打印出该命令，如果不需要打印可以在command之前加上@。
* command可以分行写，但是每行前面都要以tab键开始。
* 如果一条命令依赖前一条命令，那么必须写在同一行，并以分号间隔。
* 如果要忽略命令的报错，可以在command前加上 `-` 号
* 如果target不存在或者prerequisites中任一文件比target新，都会执行command命令更新操作，否则command不会执行
* 可以使用通配符来简化命令，make支持`*`，`?`，`~` 这三个通配符

#### 伪目标

上面的example中的tidy其实就是一个伪目标，因为其没有依赖文件，也不需要为他生成文件，其本身也不是文件，make无法决定是否要执行它，所以我们需要显示的表示其为伪目标，make中使用`.PHONY`来表示伪目标。

同时也是为了避免和文件重名的这种情况，用`.PHONY`来显式地指明一个目标是“伪目标”，向make说明，不管是否有这个文件，这个目标就是“伪目标”。

伪目标相当于一个标签。

写法：

```makefile
.PHONY: clean
clean:
	rm -vrf output
```

但伪目标可以有依赖文件

```makefile
.PHONY: all
all: gen test build 
```

因为伪目标一定会被执行，所以其依赖的各项也一定会被“决议”，通过这种方式可以执行所有依赖目标。(make all)

也可以这样写来默认执行所有目标：

```makefile
# 写在文件开头
all: gen test build 
# 这里的.PHONY不写也行，但是写了更好
.PHONY: all
```

这样执行make时就会执行所有目标了，因为make会将文件中的第一个目标当作默认目标。

#### order-only 依赖

我们可以通过以下方式来决定某些文件在改变时就会重新构造target而某些文件改变时不会重新构造target。

```makefile
targets: normal-prerequisites | order-only-prerequisites
	command
```

在上述规则中，`|`前面的依赖项在发生改变时会重新构造target，而后面的依赖项只有初次构造时会使用。

### Makefile语法

#### 命令

Makefile支持Linux命令，使用方式如下

```makefile
.PHONY: clean
clean:
	-@rm -vrf ./output
```

**tips：**

* make默认会打印被执行的命令，可以在前面加上`@`来禁止打印

* make在执行完一条命令后会检查其返回码，如果发生错误会终止执行，当我们不想其终止执行而是跳过时可以在命令前面加上`-`号来忽略错误

#### 变量

变量的使用如下：

```makefile
# 赋值
PATH = ~/user
# 使用
list: 
	ls -la $(PATH)
```

使用`=`赋值需要注意的是当一个变量重复赋值时，后赋值的会覆盖前面赋值的，同时也会造成下面的情况：

```makefile
A = a
B = $(A) b
A = c
```

最后B的值是 `a b` ，取的是最终赋值的结果，想要避免这种情况可以使用`:=` 来赋值当前值

```makefile
A = a
B := $(A) b
A = c
```

`?=`表示如果当前值没有被赋值在使用等号后的值

```makefile
A ?= a
```

`+=`表示将等号后的值添加到变量上

```makefile
A += a
```

#### 多行变量

使用`define`可以设置多行变量

```makefile
define A
a
b
c
endef
```

#### 环境变量

使用export来声明环境变量，普通变量只能在当前文件中使用，而环境变量可以在子文件中使用（一个Makefile文件调用另一个Makefile）

```makefile
export A
```

#### 预定义变量

* MAKE，当前make解释器的文件名
* MAKECMDGOALS，命令行中指定的目标名
* CURDIR，当前make解释器的工作目录
* MAKE_VERSION，当前make解释器的版本
* MAKEFILE_LIST，make所需处理的makefile文件列表，当前makefile文件名总是位于列表的最后。
* .DEFAULT_GOAL，如果命令行未指定目标，则使用这个目标
* .VARIABLES，所有已定义的变量名列表
* .FEATURES，所有本版本支持的功能
* .INCLUDE_DIRS，make查询makefile的路径。

#### 条件语句

```makefile
ifeq xxx
	command
else
	command
endif
```

其中条件表达式有四个关键字

`ifeq`,`ifneq`,`ifdef`,`ifndef`

分别表示：是否相等，是否不相等，是否已定义，是否未定义

#### 函数

可以通过define来定义函数

```makefile
# 定义
define foo
	@echo "hello $(A)"
endef
# 使用
B := $(call foo)
```

define本质上是定义多行变量，使用call可以当作函数使用。

#### 预定义函数

详情见[这里](https://seisman.github.io/how-to-write-makefile/functions.html)

#### 引用其他Makefile

```makefile
include <filename>
```

`filename`可以是当前操作系统Shell的文件模式（可以包含路径和通配符）。

### 其他

更多细节可以阅读 [跟我一起写Makefile](https://seisman.github.io/how-to-write-makefile/index.html)

### Go中合理使用Makefile

#### 要实现的功能

通常Go中的Makefile建议要实现以下功能：代码生成、格式化代码、静态代码检查、单元测试、代码构建、文件清理、docker部署等

#### 合适的Makefile文件结构

如果内容较少，直接放在根目录下的Makefile文件下就行了，但是如果内容较多，则需要合理设计Makefile文件结构了。

可以选择在根目录下的Makefile文件中聚合所有的Makefile命令，然后按照不同的功能在子文件中实现具体的功能。

同时如果Makefile命令中如果有大量复杂的shell命令，可以将其写在单独的shell脚本中，然后在Makefile文件中调用即可。

文件结构示例如下：

```shell

├── Makefile
└── scripts 
    ├── makefiles
    │   ├── a.mk
    │   └── b.mk
    │── b.sh
    ├── a.sh

```

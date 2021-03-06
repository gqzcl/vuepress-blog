---
icon: page
title: bash的一些知识
category:
  - Golang后端
tag:
  - 事务
  - 后端
  - 分布式
---
# bash的一些知识

### 参数`$0、$1、$2、$#、$@、$*、$?` 的含义

[参考](https://segmentfault.com/a/1190000021435389)

假设执行 `./test.sh a b c` 这样一个命令，则可以使用下面的参数来获取一些值：

* `$0`对应 *./test.sh* 这个值。如果执行的是 `./work/test.sh`， 则对应 *./work/test.sh* 这个值，而不是只返回文件名本身的部分。
* `$1`会获取到 a，即 `$1` 对应传给脚本的第一个参数。
* `$2`会获取到 b，即 `$2` 对应传给脚本的第二个参数。
* `$3`会获取到 c，即 `$3` 对应传给脚本的第三个参数。`$4`、`$5` 等参数的含义依此类推。
* `$#`会获取到 3，对应传入脚本的参数个数，统计的参数不包括 `$0`。
* `$@`会获取到 "a" "b" "c"，也就是所有参数的列表，不包括 `$0`。
* `$*`也会获取到 "a" "b" "c"， 其值和 `$@` 相同。但 `"$*"` 和 `"$@"` 有所不同。`"$*"` 把所有参数合并成一个字符串，而 `"$@"` 会得到一个字符串参数数组。
* `$?`可以获取到执行 `./test.sh a b c` 命令后的返回值。在执行一个前台命令后，可以立即用 `$?` 获取到该命令的返回值。该命令可以是系统自身的命令，可以是 shell 脚本，也可以是自定义的 bash 函数。

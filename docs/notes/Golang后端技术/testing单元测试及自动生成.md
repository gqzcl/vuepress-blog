---
icon: page
title: testing单元测试及自动生成
category:
  - Golang后端
tag:
  - 后端
---
# testing单元测试及自动生成

### go test 命令

go test 支持以下参数

```bash
-v 显示所有测试函数的运行细节

-run <regexp> 指定要执行的测试函数

-count N 指定执行测试函数的次数
```

```bash
# 执行所有以TestA开头的测试函数两次
go test -v -run="TestA.*" -count=2
```

### 使用assert包进行结果对比

包名：

```bash
"github.com/stretchr/testify/assert"
```

示例：

```bash
func TestAbs(t *testing.T) {
	got := Abs(-1)
	assert.Equal(t, got, 1)
}
```

了解更多函数：

```bash
go doc github.com/stretchr/testify/assert
```

### 自动生成单元测试

自动生成工具gotests

安装gotests

```bash
go get -u github.com/cweill/gotests/...
```

进入测试代码目录，执行gotests生成测试用例

```bash
gotests -all -w .
```
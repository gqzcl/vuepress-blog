---
title: Golang中Test使用及技巧
date: '2022-08-30 09:56:12'
meta: []
permalink: /post/test-in-golang-and-skills-1g2gs8.html
author:
  name: gqzcl
  link: https://github.com/gqzcl
---


<!-- more -->


# Golang中Test使用及技巧

## 单元测试

单元测试的目的是隔离程序中的每个部分，并表明每个部分是正确的。这样可以可以在代码编写初期发现问题。

### 原则

* 单元测试关注的是行为是否正常，而不是函数具体的实现。
* 单元测试要做到细粒度，为每个最小可测试单元编写测试，但不需要追求为每个函数都编写单元测试，只需要覆盖即可。
* 单元测试应该只关注函数的入参和出参，在单元测试中应当尽量减少一些复杂操作，避免在单元测试中引入bug。
* 一个单元测试应当只测试一个场景，同一函数不同的场景应当在不同的单元测试中实现。
* 单元测试应当只测试公有方法，私有方法可以通过对公有方法的测试进行验证。
* 单元测试应该尽量覆盖代码的每个分支。

### 好处

* 早期发现问题
* 敏捷编程
* 回归测试，在以后修改或者重构代码时，可以通过单元测试检测修改是否正确，确保不会发生破坏性的变更。
* 确保代码每个部分是正确的。
* 单元测试看起来像是一个文档，通过查看单元测试可以了解这个单元实现了什么功能。

### 单元测试应该做到什么程度

* Level1：输入一个正确的参数，返回正确的输出。
* Level2：输入一个错误的参数，返回自定义的报错。
* Level3：对于一些极端情况和边界数据进行单独测试，确保可以正常运行。
* Level4：测试覆盖到所有的分支，循环。
* Level5：对于有着复杂数据结构的输出，保证每个字段都是正确的。

## UT 的编写

首先，单元测试的函数名命名应当以Test开头，例如TestXxx，其中Xxx首字母大写。当有不同场景的测试时，可以命名为TestXxxWithName的格式，来区分不同场景。

单元测试要放在以_test.go结尾的文件中，该文件要放在与被测试代码相同的package下。文件的命名规则可以是`package_xyz_test.go`。

下面是几种UT的编写方法

### 表格驱动型单元测试

通过将输入和输出列在表格中，可以覆盖到很多的测试用例，使得测试更加轻松。

代码如下所示

```go
func TestReverse(t *testing.T) {
	testcases := []struct {
		in, want string
	}{
		{"Hello, world", "dlrow ,olleH"},
		{" ", " "},
		{"!12345", "54321!"},
	}
	for _, tc := range testcases {
		rev := Reverse(tc.in)
		if rev != tc.want {
			t.Errorf("Reverse(%q) = %q, want %q", tc.in, rev, tc.want)
		}
	}
}
```

有很多工具可以帮助自动生成表格型单元测试，如[cweill/gotests](https://github.com/cweill/gotests)，在Vscode、Vim等IDE中也集成了相关功能，可以直接鼠标右键生成。

### golden file

在一些复杂测试中，可以将期望的输入输出写到测试文件中，当测试的时候，单元测试的输出就会和这些文件进行比较。

在go中有一个特殊的文件夹testdata，可以将goldenfile放到这个文件夹中，这个文件夹不会被Go编译。

例如下面的代码。

```go
// TestRewrite processes testdata/*.input files and compares them to the
// corresponding testdata/*.golden files. The gofmt flags used to process
// a file must be provided via a comment of the form
//
// //gofmt flags
//
// in the processed file within the first 20 lines, if any.
func TestRewrite(t *testing.T) {
	// determine input files
	match, err := filepath.Glob("testdata/*.input")
	if err != nil {
		t.Fatal(err)
	}
	// add larger examples
	match = append(match, "gofmt.go", "gofmt_test.go")
	for _, in := range match {
		name := filepath.Base(in)
		t.Run(name, func(t *testing.T) {
			out := in // for files where input and output are identical
			if strings.HasSuffix(in, ".input") {
				out = in[:len(in)-len(".input")] + ".golden"
			}
			runTest(t, in, out)
			if in != out && !t.Failed() {
				// Check idempotence.
				runTest(t, out, out)
			}
		})
	}
}
```

goldenfile可以手动创建，也可以直接在单元测试中进行初始化，或者在某次测试中进行更新：

```go
var update = flag.Bool("update", false, "update .golden files")

func runTest(t *testing.T, in, out string) {

	expected, err := os.ReadFile(out)
	if err != nil {
		t.Error(err)
		return
	}
	if got := buf.Bytes(); !bytes.Equal(got, expected) {
		if *update {
			if in != out {
				if err := os.WriteFile(out, got, 0666); err != nil {
					t.Error(err)
				}
				return
			}
			// in == out: don't accidentally destroy input
			t.Errorf("WARNING: -update did not rewrite input file %s", in)
		}
		t.Errorf("(gofmt %s) != %s (see %s.gofmt)\n%s", in, out, in,
			diff.Diff("expected", expected, "got", got))
		if err := os.WriteFile(in+".gofmt", got, 0666); err != nil {
			t.Error(err)
		}
	}
}

```

然后在运行test命令时加上如下参数

```go
go test -update
```

### 彩色测试结果显示

如果对测试结果进行染色，可以更好的区分成功和失败的结果，有一个工具可以做到：[rakyll/gotest](https://github.com/rakyll/gotest)

在使用时只需要将go test 中间的空格去掉即可

```go
gotest ./...
```

## go test 命令实用用法解析

## 代码覆盖率

代码覆盖率时可以衡量自动化测试执行的代码比例。

代码覆盖率工具可以通过一些标准来计算代码的覆盖率，我们可以使用工具识别代码库中没有被单元测试覆盖的部分。

通过对代码覆盖率的检测，可以查看我们的单元测试是否覆盖了某些代码逻辑。

我们可以通过如下命令开启覆盖率分析：

```go
# 开启代码覆盖率分析
go test -cover
# 分析代码覆盖率的模式
# set:bool 该语句是否运行
# count:int 该语句执行了多少次
# atomic:int 多线程下语句执行次数
go test -covermode set,count,atomic
# 指定package，他可以跨package统计代码覆盖率
go test -coverpkg=./...
```

生成测试报告

```go
go tool cover -html=cover.out -o cover.html
```

可以在网页中查看代码的覆盖情况

生成treemap图

有一个工具可以查看一个项目的整体代码状况：nikolaydubina/go-cover-treemap

它可以生成一个SVG格式的treemap图，用来查看项目整体的单元测试覆盖情况。

使用方法如下

```go
go install github.com/nikolaydubina/go-cover-treemap@latest
go test -coverprofile cover.out ./...
go-cover-treemap -coverprofile cover.out > out.svg
```

## 第三方工具库

## mock，容器，monkey patching

## 压力测试benchmark

## 模糊测试Fuzzing

testing单元测试及自动生成[^1]

‍

[^1]: # testing单元测试及自动生成

    #### go test 命令

    go test 支持以下参数

    -v 显示所有测试函数的运行细节

    -run <regexp> 指定要执行的测试函数

    -count N 指定执行测试函数的次数

    ```bash
    # 执行所有以TestA开头的测试函数两次
    go test -v -run="TestA.*" -count=2
    ```
    #### 使用assert包进行结果对比

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
    #### 自动生成单元测试

    自动生成工具gotests

    安装gotests

    ```bash
    go get -u github.com/cweill/gotests/...
    ```
    进入测试代码目录，执行gotests生成测试用例

    ```bash
    gotests -all -w .
    ```

---
icon: page
title: 使用cz-cli来规范git-commit
date: 2022-07-06
category:
  - 博文
tag:
  - Golang
  - git
isOriginal: true
---
# 使用cz-cli来规范git-commit

一般提交commit都会要写Commit message，目的是为了提供一些信息，方便以后更好的翻阅，所以对Commit meaage进行一些书写规范是很有必要的。

对于Commit message的规范，社区也有很多种，不过使用最多的还是[Angular规范](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit#heading=h.greljkmo14y0)，那么遵循这套规范，手写自然也是可以，但是使用工具无疑是更方便且严谨的做法。

## Commit message格式

Commit message的格式包含三个部分：Header，Body 和 Footer。

```bash
<type>(<scope>): <subject>
// 空一行
<body>
// 空一行
<footer>
```

其中，Header 是必需的，Body 和 Footer 可以省略。每一行字符不能超过72个。

### 2.1 Header

Header部分只有一行，包括三个字段：`type`（必需）、`scope`（可选）和`subject`（必需）。

**（1）type**

`type`用于说明 commit 的类别，只允许使用下面7个标识。

> * feat：新功能（feature）
> * fix：修补bug
> * docs：文档（documentation）
> * style： 格式（不影响代码运行的变动）
> * refactor：重构（即不是新增功能，也不是修改bug的代码变动）
> * test：增加测试
> * chore：构建过程或辅助工具的变动

如果`type`为`feat`和`fix`，则该 commit 将肯定出现在 Change log 之中。其他情况（`docs`、`chore`、`style`、`refactor`、`test`）由你决定，要不要放入 Change log，建议是不要。

**（2）scope**

`scope`用于说明 commit 影响的范围，比如数据层、控制层、视图层等等，视项目不同而不同。

**（3）subject**

`subject`是 commit 目的的简短描述，不超过50个字符。

> * 以动词开头，使用第一人称现在时，比如`change`，而不是`changed`或`changes`
> * 第一个字母小写
> * 结尾不加句号（`.`）

### 2.2 Body

Body 部分是对本次 commit 的详细描述，可以分成多行。下面是一个范例。

> ```bash
>
> More detailed explanatory text, if necessary.  Wrap it to 
> about 72 characters or so. 
>
> Further paragraphs come after blank lines.
>
> - Bullet points are okay, too
> - Use a hanging indent
> ```

有两个注意点。

（1）使用第一人称现在时，比如使用`change`而不是`changed`或`changes`。

（2）应该说明代码变动的动机，以及与以前行为的对比。

### 2.3 Footer

Footer 部分只用于两种情况。

**（1）不兼容变动**

如果当前代码与上一个版本不兼容，则 Footer 部分以`BREAKING CHANGE`开头，后面是对变动的描述、以及变动理由和迁移方法。

> ```bash
>
> BREAKING CHANGE: isolate scope bindings definition has changed.
>
>     To migrate the code follow the example below:
>
>     Before:
>
>     scope: {
>       myAttr: 'attribute',
>     }
>
>     After:
>
>     scope: {
>       myAttr: '@',
>     }
>
>     The removed `inject` wasn't generaly useful for directives so there should be no code using it.
> ```

**（2）关闭 Issue**

如果当前 commit 针对某个issue，那么可以在 Footer 部分关闭这个 issue 。

> ```bash
>
> Closes #234
> ```

也可以一次关闭多个 issue 。

> ```bash
>
> Closes #123, #245, #992
> ```

### 2.4 Revert

还有一种特殊情况，如果当前 commit 用于撤销以前的 commit，则必须以`revert:`开头，后面跟着被撤销 Commit 的 Header。

> ```bash
>
> revert: feat(pencil): add 'graphiteWidth' option
>
> This reverts commit 667ecc1654a317a13331b17617d973392f415f02.
> ```

Body部分的格式是固定的，必须写成`This reverts commit &lt;hash>.`，其中的`hash`是被撤销 commit 的 SHA 标识符。

如果当前 commit 与被撤销的 commit，在同一个发布（release）里面，那么它们都不会出现在 Change log 里面。如果两者在不同的发布，那么当前 commit，会出现在 Change log 的`Reverts`小标题下面。

## 使用commitizen

****

全局**安装commitizen** 

```bash
sudo npm install -g commitizen cz-conventional-changelog
echo '{ "path": "cz-conventional-changelog" }' > ~/.czrc
```

安装完成后直接使用`cz` 或者`git cz`命令即可

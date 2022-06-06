---
icon: page
title: Go编程规范
category:
  - Golang相关
tag:
  - Golang
# 此页面会出现在首页的文章板块中
star: true
---
# Go编程规范

# The Go Programming Language Specification 编程语言规范

Version of 2020年1月14日

## Introduction 引言

This is a reference manual for the Go programming language. For more information and other documents, see [golang.org](http://docscn.studygolang.com/).

这是 Go 编程语言的参考手册。有关更多信息和其他文档，请参阅 golang. org。

Go is a general-purpose language designed with systems programming in mind. It is strongly typed and garbage-collected and has explicit support for concurrent programming. Programs are constructed from *packages*, whose properties allow efficient management of dependencies.

Go 是一种通用语言，设计时考虑到了系统编程。它是强类型和垃圾回收的，并且对并发编程有明确的支持。程序是由包构成的，其属性允许对依赖关系进行有效的管理。

The grammar is compact and simple to parse, allowing for easy analysis by automatic tools such as integrated development environments.

该文法简洁且易于解析，允许使用诸如集成开发环境之类的自动工具进行简单的分析。

## Notation 记号法

The syntax is specified using Extended Backus-Naur Form (EBNF):

语法是使用 Extended Backus-Naur Form (EBNF)指定的:

```
Production  = production_name "=" [ Expression ] "." .
Expression  = Alternative { "|" Alternative } .
Alternative = Term { Term } .
Term        = production_name | token [ "…" token ] | Group | Option | Repetition .
Group       = "(" Expression ")" .
Option      = "[" Expression "]" .
Repetition  = "{" Expression "}" .
```

Productions are expressions constructed from terms and the following operators, in increasing precedence:

结果是由术语和以下运算符构造的表达式，优先级依次递增:

```
|   alternation
()  grouping
[]  option (0 or 1 times)
{}  repetition (0 to n times)
```

Lower-case production names are used to identify lexical tokens. Non-terminals are in CamelCase. Lexical tokens are enclosed in double quotes `""` or back quotes ````.

小写生产名称用于标识词法标记。非终端是在 CamelCase。词法标记用双引号“”或反引号“括起来。

The form `a … b` represents the set of characters from `a` through `b` as alternatives. The horizontal ellipsis `…` is also used elsewhere in the spec to informally denote various enumerations or code snippets that are not further specified. The character `…` (as opposed to the three characters `...`) is not a token of the Go language.

形式 a… b 表示从 a 到 b 的字符集作为替换。规范中的其他地方也使用了水平省略号… 来非正式地表示未进一步指定的各种枚举或代码段。字符… (相对于三个字符…)不是围棋语言的标志。

## Source code representation 源代码表示

Source code is Unicode text encoded in [UTF-8](https://en.wikipedia.org/wiki/UTF-8). The text is not canonicalized, so a single accented code point is distinct from the same character constructed from combining an accent and a letter; those are treated as two code points. For simplicity, this document will use the unqualified term *character* to refer to a Unicode code point in the source text.

源代码是采用 UTF-8编码的 Unicode 文本。文本没有规范化，因此单个重音代码点不同于由重音符和字母组合构成的相同字符; 这些字符被视为两个代码点。为了简单起见，本文将使用非限定术语字符来指代源文本中的 Unicode字符。

Each code point is distinct; for instance, upper and lower case letters are different characters.

每个编码点都是不同的; 例如，大小写字母是不同的字符。

Implementation restriction: For compatibility with other tools, a compiler may disallow the NUL character (U+0000) in the source text.

实现限制: 为了与其他工具兼容，编译器可能不允许源文本中的 NUL 字符(u + 0000)。

Implementation restriction: For compatibility with other tools, a compiler may ignore a UTF-8-encoded byte order mark (U+FEFF) if it is the first Unicode code point in the source text. A byte order mark may be disallowed anywhere else in the source.

实现限制: 为了与其他工具兼容，编译器可能会忽略 utf-8编码的字节顺序标记(u + feff) ，如果它是源文本中的第一个 Unicode字符。字节顺序标记可能在源代码的其他任何地方被禁用。

### Characters 人物

The following terms are used to denote specific Unicode character classes:

以下术语用于表示特定的 Unicode字符类别:

```
newline        = /* the Unicode code point U+000A */ .
unicode_char   = /* an arbitrary Unicode code point except newline */ .
unicode_letter = /* a Unicode code point classified as "Letter" */ .
unicode_digit  = /* a Unicode code point classified as "Number, decimal digit" */ .
```

In [The Unicode Standard 8.0](https://www.unicode.org/versions/Unicode8.0.0/), Section 4.5 “General Category” defines a set of character categories. Go treats all characters in any of the Letter categories Lu, Ll, Lt, Lm, or Lo as Unicode letters, and those in the Number category Nd as Unicode digits.

在 Unicode 标准8.0中，第4.5节“一般类别”定义了一组字符类别。Go 将任何字母类别中的所有字符都视为 Unicode 字母，而数字类别中的 Nd 则视为 Unicode 数字。

### Letters and digits 字母和数字

The underscore character `_` (U+005F) is considered a letter.

下划线字符 _ (u + 005f)被认为是字母。

```
letter        = unicode_letter | "_" .
decimal_digit = "0" … "9" .
binary_digit  = "0" | "1" .
octal_digit   = "0" … "7" .
hex_digit     = "0" … "9" | "A" … "F" | "a" … "f" .
```

## Lexical elements 词汇元素

### Comments 评论

Comments serve as program documentation. There are two forms:

注释作为程序文档，有两种形式:

1. *Line comments 行注释* start with the character sequence 从字符序列开始`//` and stop at the end of the line. 然后在终点站停下
2. *General comments 一般评论* start with the character sequence 从字符序列开始`/*` and stop with the first subsequent character sequence 然后停止第一个后续字符序列`/`.

A comment cannot start inside a [rune](http://docscn.studygolang.com/ref/spec#Rune_literals) or [string literal](http://docscn.studygolang.com/ref/spec#String_literals), or inside a comment. A general comment containing no newlines acts like a space. Any other comment acts like a newline.

注释不能在符文、字符串或注释中启动。不包含换行符的一般性注释就像一个空格。其他任何注释都像换行符一样。

### Tokens 代币

Tokens form the vocabulary of the Go language. There are four classes: *identifiers*, *keywords*, *operators and punctuation*, and *literals*. *White space*, formed from spaces (U+0020), horizontal tabs (U+0009), carriage returns (U+000D), and newlines (U+000A), is ignored except as it separates tokens that would otherwise combine into a single token. Also, a newline or end of file may trigger the insertion of a [semicolon](http://docscn.studygolang.com/ref/spec#Semicolons). While breaking the input into tokens, the next token is the longest sequence of characters that form a valid token.

标记形成了围棋语言的词汇表。有四个类: 标识符、关键字、运算符和标点符号以及文本。由空格(u + 0020)、水平制表符(u + 0009)、回车(u + 000d)和换行符(u + 000a)组成的空白被忽略，除非它分离标记，否则这些标记将合并为单个标记。此外，换行符或文件末尾可能会触发插入分号。在将输入分解为标记时，下一个标记是形成有效标记的最长字符序列。

### Semicolons 分号

The formal grammar uses semicolons `";"` as terminators in a number of productions. Go programs may omit most of these semicolons using the following two rules:

形式语法在许多结果中使用分号“ ;”作为结束符。程序可以用以下两个规则省略大部分分号:

1. When the input is broken into tokens, a semicolon is automatically inserted into the token stream immediately after a line’s final token if that token is

   当输入被分解为令牌时，如果一行的最终令牌是，则分号会自动插入到令牌流中

   - an 一个[identifier 标识符](http://docscn.studygolang.com/ref/spec#Identifiers)
   - an 一个[integer 整数](http://docscn.studygolang.com/ref/spec#Integer_literals), [floating-point 浮点数](http://docscn.studygolang.com/ref/spec#Floating-point_literals), [imaginary 想象的](http://docscn.studygolang.com/ref/spec#Imaginary_literals), [rune 符文](http://docscn.studygolang.com/ref/spec#Rune_literals), or ，或[string 弦](http://docscn.studygolang.com/ref/spec#String_literals) literal 文字的
   - one of the 其中一个[keywords 关键字](http://docscn.studygolang.com/ref/spec#Keywords) `break`, `continue`, `fallthrough`, or ，或`return`
   - one of the 其中一个[operators and punctuation 操作符和标点符号](http://docscn.studygolang.com/ref/spec#Operators_and_punctuation) `++`, `-`, `)`, `]`, or ，或`}`
2. To allow complex statements to occupy a single line, a semicolon may be omitted before a closing 为了使复杂语句占据一行，结束语前可以省略分号`")"` or 或`"}"`.

To reflect idiomatic use, code examples in this document elide semicolons using these rules.

为了反映惯用用法，本文档中的代码示例使用这些规则省略了分号。

### Identifiers 标识符

Identifiers name program entities such as variables and types. An identifier is a sequence of one or more letters and digits. The first character in an identifier must be a letter.

标识符命名程序实体，如变量和类型。标识符是由一个或多个字母和数字组成的序列。标识符的第一个字符必须是字母。

```
identifier = letter { letter | unicode_digit } .
a
_x9
ThisVariableIsExported
αβ
```

Some identifiers are [predeclared](http://docscn.studygolang.com/ref/spec#Predeclared_identifiers).

有些标识符是预声明的。

### Keywords 关键词

The following keywords are reserved and may not be used as identifiers.

下列关键字是保留的，不能用作标识符。

```
break        default      func         interface    select
case         defer        go           map          struct
chan         else         goto         package      switch
const        fallthrough  if           range        type
continue     for          import       return       var
```

### Operators and punctuation 操作符和标点符号

The following character sequences represent [operators](http://docscn.studygolang.com/ref/spec#Operators) (including [assignment operators](http://docscn.studygolang.com/ref/spec#assign_op)) and punctuation:

下面的字符序列表示运算符(包括赋值运算符)和标点符号:

```
+    &     +=    &=     &&    ==    !=    (    )
-    |     -=    |=     ||    <     <=    [    ]
*    ^     *=    ^=     <-    >     >=    {    }
/    <<    /=    <<=    ++    =     :=    ,    ;
%    >>    %=    >>=    --    !     ...   .    :
     &^          &^=
```

### Integer literals 整数字面值

An integer literal is a sequence of digits representing an [integer constant](http://docscn.studygolang.com/ref/spec#Constants). An optional prefix sets a non-decimal base: `0b` or `0B` for binary, `0`, `0o`, or `0O` for octal, and `0x` or `0X` for hexadecimal. A single `0` is considered a decimal zero. In hexadecimal literals, letters `a` through `f` and `A` through `F` represent values 10 through 15.

整数文字量是表示整数常量的数字序列。一个可选的前缀设置一个非十进制的基数: 0B 或0B 表示二进制，0,0O 或0O 表示八进制，0X 或0X 表示十六进制。一个0被认为是一个十进制零。在十六进制字面值中，字母 a 到 f 和 a 到 f 表示值10到15。

For readability, an underscore character `_` may appear after a base prefix or between successive digits; such underscores do not change the literal’s value.

为了便于阅读，下划线字符 _ 可以出现在基前缀之后或连续数字之间; 这样的下划线不会改变字面值。

```
int_lit        = decimal_lit | binary_lit | octal_lit | hex_lit .
decimal_lit    = "0" | ( "1" … "9" ) [ [ "_" ] decimal_digits ] .
binary_lit     = "0" ( "b" | "B" ) [ "_" ] binary_digits .
octal_lit      = "0" [ "o" | "O" ] [ "_" ] octal_digits .
hex_lit        = "0" ( "x" | "X" ) [ "_" ] hex_digits .

decimal_digits = decimal_digit { [ "_" ] decimal_digit } .
binary_digits  = binary_digit { [ "_" ] binary_digit } .
octal_digits   = octal_digit { [ "_" ] octal_digit } .
hex_digits     = hex_digit { [ "_" ] hex_digit } .
42
4_2
0600
0_600
0o600
0O600       // second character is capital letter 'O'
0xBadFace
0xBad_Face
0x_67_7a_2f_cc_40_c6
170141183460469231731687303715884105727
170_141183_460469_231731_687303_715884_105727

_42         // an identifier, not an integer literal
42_         // invalid: _ must separate successive digits
4__2        // invalid: only one _ at a time
0_xBadFace  // invalid: _ must separate successive digits
```

### Floating-point literals 浮点文字

A floating-point literal is a decimal or hexadecimal representation of a [floating-point constant](http://docscn.studygolang.com/ref/spec#Constants).

浮点文字是浮点常数的十进制或十六进制表示形式。

A decimal floating-point literal consists of an integer part (decimal digits), a decimal point, a fractional part (decimal digits), and an exponent part (`e` or `E` followed by an optional sign and decimal digits). One of the integer part or the fractional part may be elided; one of the decimal point or the exponent part may be elided. An exponent value exp scales the mantissa (integer and fractional part) by 10exp.

十进制浮点数字面值由一个整数部分(小数位)、一个小数部分(小数位)和一个指数部分(e 或 e 后面跟随一个可选的符号和小数位)组成。一个整数部分或小数部分可以省略，一个小数点或指数部分可以省略。指数值 exp 将尾数(整数部分和小数部分)缩放10exp。

A hexadecimal floating-point literal consists of a `0x` or `0X` prefix, an integer part (hexadecimal digits), a radix point, a fractional part (hexadecimal digits), and an exponent part (`p` or `P` followed by an optional sign and decimal digits). One of the integer part or the fractional part may be elided; the radix point may be elided as well, but the exponent part is required. (This syntax matches the one given in IEEE 754-2008 §5.12.3.) An exponent value exp scales the mantissa (integer and fractional part) by 2exp.

十六进制浮点数字面值由一个0 x 或0 x 前缀、一个整数部分(十六进制数字)、一个基数部分、一个小数部分(十六进制数字)和一个指数部分(p 或 p 后跟一个可选的符号和十进制数字)组成。可以省略整数部分或小数部分之一; 也可以省略基数点，但需要省略指数部分。(此语法与 IEEE 754-20085.12.3中给出的语法相匹配。)指数值 exp 将尾数(整数部分和小数部分)缩放2 exp。

For readability, an underscore character `_` may appear after a base prefix or between successive digits; such underscores do not change the literal value.

为了便于阅读，下划线字符 _ 可以出现在基前缀之后或连续数字之间; 这样的下划线不会改变原义值。

```
float_lit         = decimal_float_lit | hex_float_lit .

decimal_float_lit = decimal_digits "." [ decimal_digits ] [ decimal_exponent ] |
                    decimal_digits decimal_exponent |
                    "." decimal_digits [ decimal_exponent ] .
decimal_exponent  = ( "e" | "E" ) [ "+" | "-" ] decimal_digits .

hex_float_lit     = "0" ( "x" | "X" ) hex_mantissa hex_exponent .
hex_mantissa      = [ "_" ] hex_digits "." [ hex_digits ] |
                    [ "_" ] hex_digits |
                    "." hex_digits .
hex_exponent      = ( "p" | "P" ) [ "+" | "-" ] decimal_digits .
0.
72.40
072.40       // == 72.40
2.71828
1.e+0
6.67428e-11
1E6
.25
.12345E+5
1_5.         // == 15.0
0.15e+0_2    // == 15.0

0x1p-2       // == 0.25
0x2.p10      // == 2048.0
0x1.Fp+0     // == 1.9375
0X.8p-0      // == 0.5
0X_1FFFP-16  // == 0.1249847412109375
0x15e-2      // == 0x15e - 2 (integer subtraction)

0x.p1        // invalid: mantissa has no digits
1p-2         // invalid: p exponent requires hexadecimal mantissa
0x1.5e-2     // invalid: hexadecimal mantissa requires p exponent
1_.5         // invalid: _ must separate successive digits
1._5         // invalid: _ must separate successive digits
1.5_e1       // invalid: _ must separate successive digits
1.5e_1       // invalid: _ must separate successive digits
1.5e1_       // invalid: _ must separate successive digits
```

### Imaginary literals 虚构的文字

An imaginary literal represents the imaginary part of a [complex constant](http://docscn.studygolang.com/ref/spec#Constants). It consists of an [integer](http://docscn.studygolang.com/ref/spec#Integer_literals) or [floating-point](http://docscn.studygolang.com/ref/spec#Floating-point_literals) literal followed by the lower-case letter `i`. The value of an imaginary literal is the value of the respective integer or floating-point literal multiplied by the imaginary unit *i*.

假想的字面量表示复常数的假想部分。它由一个整数或浮点字面值后跟小写字母 i 组成。虚值的值是相应的整数或浮点值乘以虚值单位 i 的值。

```
imaginary_lit = (decimal_digits | int_lit | float_lit) "i" .
```

For backward compatibility, an imaginary literal’s integer part consisting entirely of decimal digits (and possibly underscores) is considered a decimal integer, even if it starts with a leading `0`.

对于向下兼容来说，一个虚构的整数部分完全由十进制数字(可能还有下划线)组成，即使以0开头，也被认为是一个十进制整数。

```
0i
0123i         // == 123i for backward-compatibility
0o123i        // == 0o123 * 1i == 83i
0xabci        // == 0xabc * 1i == 2748i
0.i
2.71828i
1.e+0i
6.67428e-11i
1E6i
.25i
.12345E+5i
0x1p-2i       // == 0x1p-2 * 1i == 0.25i
```

### Rune literals 符文字面值

A rune literal represents a [rune constant](http://docscn.studygolang.com/ref/spec#Constants), an integer value identifying a Unicode code point. A rune literal is expressed as one or more characters enclosed in single quotes, as in `'x'` or `'\n'`. Within the quotes, any character may appear except newline and unescaped single quote. A single quoted character represents the Unicode value of the character itself, while multi-character sequences beginning with a backslash encode values in various formats.

一个 rune literal 表示一个 rune 常量，一个整数值表示一个 rune Unicode字符。一个 rune literal 是用单引号括起来的一个或多个字符来表示的，比如在‘ x’或者‘ n’中。在引号中，除了换行符和未转义的单引号外，任何字符都可以出现。单引号字符表示字符本身的 Unicode 值，而多字符序列以各种格式的反斜杠编码值开头。

The simplest form represents the single character within the quotes; since Go source text is Unicode characters encoded in UTF-8, multiple UTF-8-encoded bytes may represent a single integer value. For instance, the literal `'a'` holds a single byte representing a literal `a`, Unicode U+0061, value `0x61`, while `'ä'` holds two bytes (`0xc3` `0xa4`) representing a literal `a`-dieresis, U+00E4, value `0xe4`.

最简单的形式表示引号中的单个字符; 因为 Go 源文本是 UTF-8编码的 Unicode 字符，所以多个 UTF-8编码的字节可以表示单个整数值。例如，文本‘ a’包含一个字节，表示文本 a，Unicode + 0061，value 0x61，而‘ ä’包含两个字节(0xc30xa4) ，表示文本 a-dieresis，u + 00 E4，value 0x4。

Several backslash escapes allow arbitrary values to be encoded as ASCII text. There are four ways to represent the integer value as a numeric constant: `\x` followed by exactly two hexadecimal digits; `\u` followed by exactly four hexadecimal digits; `\U` followed by exactly eight hexadecimal digits, and a plain backslash `\` followed by exactly three octal digits. In each case the value of the literal is the value represented by the digits in the corresponding base.

多个反斜杠转义允许将任意值编码为 ASCII 文本。有四种方法可以将整数值表示为一个数字常量: x 后跟正好两个十六进制数字; u 后跟正好四个十六进制数字; u 后跟正好八个十六进制数字，纯斜杠后跟正好三个八进制数字。在每种情况下，文字的值都是由对应基数中的数字表示的值。

Although these representations all result in an integer, they have different valid ranges. Octal escapes must represent a value between 0 and 255 inclusive. Hexadecimal escapes satisfy this condition by construction. The escapes `\u` and `\U` represent Unicode code points so within them some values are illegal, in particular those above `0x10FFFF` and surrogate halves.

尽管这些表示都以整数形式出现，但它们有不同的有效范围。八进制转义必须表示一个介于0和255之间的值。十六进制转义通过构造来满足这一条件。Escapes u 和 u 表示 Unicode 代码点，因此它们中的一些值是非法的，特别是上面的0x10f 和代理 half。

After a backslash, certain single-character escapes represent special values:

在反斜杠之后，某些单字符转义表示特殊的值:

```
\a   U+0007 alert or bell
\b   U+0008 backspace
\f   U+000C form feed
\n   U+000A line feed or newline
\r   U+000D carriage return
\t   U+0009 horizontal tab
\v   U+000b vertical tab
\\   U+005c backslash
\'   U+0027 single quote  (valid escape only within rune literals)
\"   U+0022 double quote  (valid escape only within string literals)
```

All other sequences starting with a backslash are illegal inside rune literals.

所有其他以反斜杠开头的序列在符文文本中都是非法的。

```
rune_lit         = "'" ( unicode_value | byte_value ) "'" .
unicode_value    = unicode_char | little_u_value | big_u_value | escaped_char .
byte_value       = octal_byte_value | hex_byte_value .
octal_byte_value = `\` octal_digit octal_digit octal_digit .
hex_byte_value   = `\` "x" hex_digit hex_digit .
little_u_value   = `\` "u" hex_digit hex_digit hex_digit hex_digit .
big_u_value      = `\` "U" hex_digit hex_digit hex_digit hex_digit
                           hex_digit hex_digit hex_digit hex_digit .
escaped_char     = `\` ( "a" | "b" | "f" | "n" | "r" | "t" | "v" | `\` | "'" | `"` ) .
'a'
'ä'
'本'
'\t'
'\000'
'\007'
'\377'
'\x07'
'\xff'
'\u12e4'
'\U00101234'
'\''         // rune literal containing single quote character
'aa'         // illegal: too many characters
'\xa'        // illegal: too few hexadecimal digits
'\0'         // illegal: too few octal digits
'\uDFFF'     // illegal: surrogate half
'\U00110000' // illegal: invalid Unicode code point
```

### String literals 字符串文字

A string literal represents a [string constant](http://docscn.studygolang.com/ref/spec#Constants) obtained from concatenating a sequence of characters. There are two forms: raw string literals and interpreted string literals.

字符串字面值表示串联一个字符序列而获得的字符串常量。有两种形式: 原始字符串和解释字符串。

Raw string literals are character sequences between back quotes, as in `foo`. Within the quotes, any character may appear except back quote. The value of a raw string literal is the string composed of the uninterpreted (implicitly UTF-8-encoded) characters between the quotes; in particular, backslashes have no special meaning and the string may contain newlines. Carriage return characters (’) inside raw string literals are discarded from the raw string value.

原始字符串文字是反引号之间的字符序列，如‘ foo’中的字符序列。在引号中，除了反引号外，任何字符都可以出现。原始字符串的值是由引号之间未解释的(隐式 utf-8编码的)字符组成的字符串; 特别是反斜杠没有特殊含义，字符串可能包含换行符。原始字符串中的回车字符(’r’)将从原始字符串值中丢弃。

Interpreted string literals are character sequences between double quotes, as in `"bar"`. Within the quotes, any character may appear except newline and unescaped double quote. The text between the quotes forms the value of the literal, with backslash escapes interpreted as they are in [rune literals](http://docscn.studygolang.com/ref/spec#Rune_literals) (except that `\'` is illegal and `\"` is legal), with the same restrictions. The three-digit octal (`\`*nnn*) and two-digit hexadecimal (`\x`*nn*) escapes represent individual *bytes* of the resulting string; all other escapes represent the (possibly multi-byte) UTF-8 encoding of individual *characters*. Thus inside a string literal `\377` and `\xFF` represent a single byte of value `0xFF`=255, while `ÿ`, `\u00FF`, `\U000000FF` and `\xc3\xbf` represent the two bytes `0xc3` `0xbf` of the UTF-8 encoding of character U+00FF.

解释的字符串文字是双引号之间的字符序列，如“ bar”中所示。在引号中，除了换行符和未转义的双引号之外，任何字符都可以出现。双引号之间的文本构成了文字的值，反斜杠转义解释为它们是符文文本(除非’是非法的和’是合法的) ，具有相同的限制。三位八进制(nnn)和两位十六进制(xnn)转义表示结果字符串的单个字节; 所有其他转义表示单个字符的(可能是多字节的) UTF-8编码。因此，字符串 literal 377和 xFF 表示值0xFF = 255的一个字节，而 ÿ、 u00FF、 U000000FF 和 xc3 xbf 表示字符 u + 00ff 的 UTF-8编码的两个字节0xc30xbf。

```
string_lit             = raw_string_lit | interpreted_string_lit .
raw_string_lit         = "`" { unicode_char | newline } "`" .
interpreted_string_lit = `"` { unicode_value | byte_value } `"` .
`abc`                // same as "abc"
`\n
\n`                  // same as "\\n\n\\n"
"\n"
"\""                 // same as `"`
"Hello, world!\n"
"日本語"
"\u65e5本\U00008a9e"
"\xff\u00FF"
"\uD800"             // illegal: surrogate half
"\U00110000"         // illegal: invalid Unicode code point
```

These examples all represent the same string:

这些例子都代表同一个字符串:

```
"日本語"                                 // UTF-8 input text
`日本語`                                 // UTF-8 input text as a raw literal
"\u65e5\u672c\u8a9e"                    // the explicit Unicode code points
"\U000065e5\U0000672c\U00008a9e"        // the explicit Unicode code points
"\xe6\x97\xa5\xe6\x9c\xac\xe8\xaa\x9e"  // the explicit UTF-8 bytes
```

If the source code represents a character as two code points, such as a combining form involving an accent and a letter, the result will be an error if placed in a rune literal (it is not a single code point), and will appear as two code points if placed in a string literal.

如果源代码将一个字符表示为两个代码点，例如一个包含重音和字母的组合表单，那么如果将其放在一个 rune literal 中，结果将是一个错误(它不是单个代码点) ，如果将其放在一个字符串 literal 中，结果将显示为两个代码点。

## Constants 常量

There are *boolean constants*, *rune constants*, *integer constants*, *floating-point constants*, *complex constants*, and *string constants*. Rune, integer, floating-point, and complex constants are collectively called *numeric constants*.

有布尔常量、符文常量、整数常量、浮点常量、复合常量和字符串常量。Rune、 integer、浮点数和复数常量统称为数值型常量。

A constant value is represented by a [rune](http://docscn.studygolang.com/ref/spec#Rune_literals), [integer](http://docscn.studygolang.com/ref/spec#Integer_literals), [floating-point](http://docscn.studygolang.com/ref/spec#Floating-point_literals), [imaginary](http://docscn.studygolang.com/ref/spec#Imaginary_literals), or [string](http://docscn.studygolang.com/ref/spec#String_literals) literal, an identifier denoting a constant, a [constant expression](http://docscn.studygolang.com/ref/spec#Constant_expressions), a [conversion](http://docscn.studygolang.com/ref/spec#Conversions) with a result that is a constant, or the result value of some built-in functions such as `unsafe.Sizeof` applied to any value, `cap` or `len` applied to [some expressions](http://docscn.studygolang.com/ref/spec#Length_and_capacity), `real` and `imag` applied to a complex constant and `complex` applied to numeric constants. The boolean truth values are represented by the predeclared constants `true` and `false`. The predeclared identifier [iota](http://docscn.studygolang.com/ref/spec#Iota) denotes an integer constant.

常量值由符文、整数、浮点数、虚数或字符串文字、表示常量的标识符、常量表达式、结果为常量的转换或某些内置函数(如 unsafe)的结果值表示。Sizeof 应用于任何值，cap 或 len 应用于某些表达式，real 和 imag 应用于复杂的常量和复杂的数字常量。布尔真值由预先声明的常量 true 和 false 表示。预声明的标识符 iota 表示整数常量。

In general, complex constants are a form of [constant expression](http://docscn.studygolang.com/ref/spec#Constant_expressions) and are discussed in that section.

一般来说，复常数是常数表达式的一种形式，本节将对其进行讨论。

Numeric constants represent exact values of arbitrary precision and do not overflow. Consequently, there are no constants denoting the IEEE-754 negative zero, infinity, and not-a-number values.

数值常量表示任意精度的精确值，不会溢出。因此，没有表示 IEEE-754负零、无穷和非数值的常数。

Constants may be [typed](http://docscn.studygolang.com/ref/spec#Types) or *untyped*. Literal constants, `true`, `false`, `iota`, and certain [constant expressions](http://docscn.studygolang.com/ref/spec#Constant_expressions) containing only untyped constant operands are untyped.

常量可以是类型化的，也可以是非类型化的。文字常量、 true、 false、 iota 和某些只包含非类型常量操作数的常量表达式是无类型的。

A constant may be given a type explicitly by a [constant declaration](http://docscn.studygolang.com/ref/spec#Constant_declarations) or [conversion](http://docscn.studygolang.com/ref/spec#Conversions), or implicitly when used in a [variable declaration](http://docscn.studygolang.com/ref/spec#Variable_declarations) or an [assignment](http://docscn.studygolang.com/ref/spec#Assignments) or as an operand in an [expression](http://docscn.studygolang.com/ref/spec#Expressions). It is an error if the constant value cannot be [represented](http://docscn.studygolang.com/ref/spec#Representability) as a value of the respective type.

常量可以通过常量声明或转换显式地给定类型，或者隐式地用于变量声明或赋值，或者用作表达式中的操作数。如果常量值不能表示为相应类型的值，则为错误。

An untyped constant has a *default type* which is the type to which the constant is implicitly converted in contexts where a typed value is required, for instance, in a [short variable declaration](http://docscn.studygolang.com/ref/spec#Short_variable_declarations) such as `i := 0` where there is no explicit type. The default type of an untyped constant is `bool`, `rune`, `int`, `float64`, `complex128` or `string` respectively, depending on whether it is a boolean, rune, integer, floating-point, complex, or string constant.

非类型化常量具有默认类型，该类型是在需要类型化值的上下文中隐式转换该常量的类型，例如，在没有显式类型的简短变量声明中，如 i: = 0。非类型化常量的默认类型分别为 bool、 rune、 int、 float64、 complex128或 string，具体取决于它是布尔型、 rune 型、整数型、浮点型、复数型还是字符串常量。

Implementation restriction: Although numeric constants have arbitrary precision in the language, a compiler may implement them using an internal representation with limited precision. That said, every implementation must:

实现限制: 尽管数值常量在语言中具有任意精度，但编译器可以使用有限精度的内部表示来实现它们。尽管如此，每一项实施都必须:

- Represent integer constants with at least 256 bits. 用至少256位表示整数常量
- Represent floating-point constants, including the parts of a complex constant, with a mantissa of at least 256 bits and a signed binary exponent of at least 16 bits. 表示浮点常数，包括复常数的部分，尾数至少为256位，有符号二进制指数至少为16位
- Give an error if unable to represent an integer constant precisely. 如果无法精确表示整数常数，则给出错误
- Give an error if unable to represent a floating-point or complex constant due to overflow. 如果由于溢出而无法表示浮点或复常数，则给出错误
- Round to the nearest representable constant if unable to represent a floating-point or complex constant due to limits on precision. 如果由于精度限制而无法表示浮点数或复数常数，则舍入到最接近的可表示常数

These requirements apply both to literal constants and to the result of evaluating [constant expressions](http://docscn.studygolang.com/ref/spec#Constant_expressions).

这些要求既适用于文字常量，也适用于计算常量表达式的结果。

## Variables 变量

A variable is a storage location for holding a *value*. The set of permissible values is determined by the variable’s *[type](http://docscn.studygolang.com/ref/spec#Types)*.

变量是保存值的存储位置。允许值的集合由变量的类型确定。

A [variable declaration](http://docscn.studygolang.com/ref/spec#Variable_declarations) or, for function parameters and results, the signature of a [function declaration](http://docscn.studygolang.com/ref/spec#Function_declarations) or [function literal](http://docscn.studygolang.com/ref/spec#Function_literals) reserves storage for a named variable. Calling the built-in function `[new](http://docscn.studygolang.com/ref/spec#Allocation)` or taking the address of a [composite literal](http://docscn.studygolang.com/ref/spec#Composite_literals) allocates storage for a variable at run time. Such an anonymous variable is referred to via a (possibly implicit) [pointer indirection](http://docscn.studygolang.com/ref/spec#Address_operators).

变量声明，或者，对于函数参数和结果，函数声明的签名或者匿名函数声明为指定的变量保留存储空间。在运行时调用内置函数 new 或获取复合文本的地址为变量分配存储空间。这样的匿名变量通过一个(可能是隐式的)指针间接引用。

*Structured* variables of [array](http://docscn.studygolang.com/ref/spec#Array_types), [slice](http://docscn.studygolang.com/ref/spec#Slice_types), and [struct](http://docscn.studygolang.com/ref/spec#Struct_types) types have elements and fields that may be [addressed](http://docscn.studygolang.com/ref/spec#Address_operators) individually. Each such element acts like a variable.

数组、片和结构类型的结构化变量具有可单独寻址的元素和字段。每个这样的元素都像一个变量。

The *static type* (or just *type*) of a variable is the type given in its declaration, the type provided in the `new` call or composite literal, or the type of an element of a structured variable. Variables of interface type also have a distinct *dynamic type*, which is the concrete type of the value assigned to the variable at run time (unless the value is the predeclared identifier `nil`, which has no type). The dynamic type may vary during execution but values stored in interface variables are always [assignable](http://docscn.studygolang.com/ref/spec#Assignability) to the static type of the variable.

变量的静态类型(或仅仅类型)是其声明中给出的类型、新调用或复合文本中提供的类型或结构化变量的元素类型。接口类型的变量还有一个不同的动态类型，这是在运行时分配给变量的值的具体类型(除非该值是预声明的标识符 nil，它没有类型)。在执行过程中，动态类型可能会发生变化，但是存储在接口变量中的值总是可以分配给变量的静态类型。

```
var x interface{}  // x is nil and has static type interface{}
var v *T           // v has value nil, static type *T
x = 42             // x has value 42 and dynamic type int
x = v              // x has value (*T)(nil) and dynamic type *T
```

A variable’s value is retrieved by referring to the variable in an [expression](http://docscn.studygolang.com/ref/spec#Expressions); it is the most recent value [assigned](http://docscn.studygolang.com/ref/spec#Assignments) to the variable. If a variable has not yet been assigned a value, its value is the [zero value](http://docscn.studygolang.com/ref/spec#The_zero_value) for its type.

通过引用表达式中的变量来检索变量的值; 它是分配给该变量的最新值。如果一个变量还没有被赋值，那么它的值就是它的类型的零值。

## Types 类型

A type determines a set of values together with operations and methods specific to those values. A type may be denoted by a *type name*, if it has one, or specified using a *type literal*, which composes a type from existing types.

类型确定一组值以及特定于这些值的操作和方法。类型可以用类型名称表示(如果它有类型名称的话) ，或者使用类型文字(由现有类型组成的类型)指定。

```
Type      = TypeName | TypeLit | "(" Type ")" .
TypeName  = identifier | QualifiedIdent .
TypeLit   = ArrayType | StructType | PointerType | FunctionType | InterfaceType |
        SliceType | MapType | ChannelType .
```

The language [predeclares](http://docscn.studygolang.com/ref/spec#Predeclared_identifiers) certain type names. Others are introduced with [type declarations](http://docscn.studygolang.com/ref/spec#Type_declarations). *Composite types*—array, struct, pointer, function, interface, slice, map, and channel types—may be constructed using type literals.

该语言预先声明了某些类型名称。另外一些是通过类型声明引入的。可以使用类型文本构造复合类型ー array、 struct、 pointer、 function、 interface、 slice、 map 和 channel 类型ー。

Each type `T` has an *underlying type*: If `T` is one of the predeclared boolean, numeric, or string types, or a type literal, the corresponding underlying type is `T` itself. Otherwise, `T`’s underlying type is the underlying type of the type to which `T` refers in its [type declaration](http://docscn.studygolang.com/ref/spec#Type_declarations).

每个类型 t 都有一个基础类型: 如果 t 是预先声明的布尔类型、数值类型或字符串类型或类型文字之一，那么对应的基础类型就是 t 本身。否则，t 的基础类型是 t 在其类型声明中引用的类型的基础类型。

```
type (
    A1 = string
    A2 = A1
)

type (
    B1 string
    B2 B1
    B3 []B1
    B4 B3
)
```

The underlying type of `string`, `A1`, `A2`, `B1`, and `B2` is `string`. The underlying type of `[]B1`, `B3`, and `B4` is `[]B1`.

字符串的基本类型是字符串，A1、 A2、 B1和 B2。[] B1，B3和 B4的基本类型是[] B1。

### Method sets 方法集

A type may have a *method set* associated with it. The method set of an [interface type](http://docscn.studygolang.com/ref/spec#Interface_types) is its interface. The method set of any other type `T` consists of all [methods](http://docscn.studygolang.com/ref/spec#Method_declarations) declared with receiver type `T`. The method set of the corresponding [pointer type](http://docscn.studygolang.com/ref/spec#Pointer_types) `*T` is the set of all methods declared with receiver `*T` or `T` (that is, it also contains the method set of `T`). Further rules apply to structs containing embedded fields, as described in the section on [struct types](http://docscn.studygolang.com/ref/spec#Struct_types). Any other type has an empty method set. In a method set, each method must have a [unique](http://docscn.studygolang.com/ref/spec#Uniqueness_of_identifiers) non-[blank](http://docscn.studygolang.com/ref/spec#Blank_identifier) [method name](http://docscn.studygolang.com/ref/spec#MethodName).

类型可以有一个与之关联的方法集。接口类型的方法集是它的接口。任何其他类型 t 的方法集都包含用接收器类型 t 声明的所有方法。相应的指针类型 * t 的方法集是用接收器 * t 或 t 声明的所有方法的集合(也就是说，它还包含 t 的方法集)。进一步的规则适用于包含嵌入字段的结构，如关于结构类型的部分所述。任何其他类型都有一个空方法集。在方法集中，每个方法必须有唯一的非空方法名称。

The method set of a type determines the interfaces that the type [implements](http://docscn.studygolang.com/ref/spec#Interface_types) and the methods that can be [called](http://docscn.studygolang.com/ref/spec#Calls) using a receiver of that type.

类型的方法集确定该类型实现的接口以及可以使用该类型的接收方调用的方法。

### Boolean types 布尔类型

A *boolean type* represents the set of Boolean truth values denoted by the predeclared constants `true` and `false`. The predeclared boolean type is `bool`; it is a [defined type](http://docscn.studygolang.com/ref/spec#Type_definitions).

布尔类型表示由预先声明的常量 true 和 false 表示的布尔真值集。预先声明的布尔类型是 bool; 它是已定义的类型。

### Numeric types 数字类型

A *numeric type* represents sets of integer or floating-point values. The predeclared architecture-independent numeric types are:

数值类型表示整数或浮点值的集合。预声明的与体系结构无关的数值类型是:

```
uint8       the set of all unsigned  8-bit integers (0 to 255)
uint16      the set of all unsigned 16-bit integers (0 to 65535)
uint32      the set of all unsigned 32-bit integers (0 to 4294967295)
uint64      the set of all unsigned 64-bit integers (0 to 18446744073709551615)

int8        the set of all signed  8-bit integers (-128 to 127)
int16       the set of all signed 16-bit integers (-32768 to 32767)
int32       the set of all signed 32-bit integers (-2147483648 to 2147483647)
int64       the set of all signed 64-bit integers (-9223372036854775808 to 9223372036854775807)

float32     the set of all IEEE-754 32-bit floating-point numbers
float64     the set of all IEEE-754 64-bit floating-point numbers

complex64   the set of all complex numbers with float32 real and imaginary parts
complex128  the set of all complex numbers with float64 real and imaginary parts

byte        alias for uint8
rune        alias for int32
```

The value of an *n*-bit integer is *n* bits wide and represented using [two’s complement arithmetic](https://en.wikipedia.org/wiki/Two's_complement).

一个 n 位整数的值是 n 位宽的，并且使用两个补数运算来表示。

There is also a set of predeclared numeric types with implementation-specific sizes:

还有一组预先声明的具有特定实现大小的数值类型:

```
uint     either 32 or 64 bits
int      same size as uint
uintptr  an unsigned integer large enough to store the uninterpreted bits of a pointer value
```

To avoid portability issues all numeric types are [defined types](http://docscn.studygolang.com/ref/spec#Type_definitions) and thus distinct except `byte`, which is an [alias](http://docscn.studygolang.com/ref/spec#Alias_declarations) for `uint8`, and `rune`, which is an alias for `int32`. Explicit conversions are required when different numeric types are mixed in an expression or assignment. For instance, `int32` and `int` are not the same type even though they may have the same size on a particular architecture.

为了避免可移植性问题，所有数值类型都是已定义类型，因此除了 byte 和 rune，前者是 uint8的别名，后者是 int32的别名。当表达式或赋值中混合了不同的数值类型时，需要进行显式转换。例如，int32和 int 不是相同的类型，即使它们在特定的体系结构上具有相同的大小。

### String types 字符串类型

A *string type* represents the set of string values. A string value is a (possibly empty) sequence of bytes. The number of bytes is called the length of the string and is never negative. Strings are immutable: once created, it is impossible to change the contents of a string. The predeclared string type is `string`; it is a [defined type](http://docscn.studygolang.com/ref/spec#Type_definitions).

字符串类型表示字符串值的集合。字符串值是一个(可能是空的)字节序列。字节数称为字符串的长度，从来不是负数。字符串是不可变的: 一旦创建，就不可能改变字符串的内容。预声明的字符串类型是 string; 它是已定义的类型。

The length of a string `s` can be discovered using the built-in function `[len](http://docscn.studygolang.com/ref/spec#Length_and_capacity)`. The length is a compile-time constant if the string is a constant. A string’s bytes can be accessed by integer [indices](http://docscn.studygolang.com/ref/spec#Index_expressions) 0 through `len(s)-1`. It is illegal to take the address of such an element; if `s[i]` is the `i`’th byte of a string, `&s[i]` is invalid.

字符串 s 的长度可以使用内置函数 len 来发现。如果字符串是常量，则长度为编译时常量。整数索引0到 len (s)-1可以访问字符串的字节。获取这种元素的地址是非法的; 如果 s [ i ]是字符串的 i‘ th 字节，& s [ i ]是无效的。

### Array types 数组类型

An array is a numbered sequence of elements of a single type, called the element type. The number of elements is called the length of the array and is never negative.

数组是单一类型的元素的编号序列，称为元素类型。元素的个数称为数组的长度，永远不会为负数。

```
ArrayType   = "[" ArrayLength "]" ElementType .
ArrayLength = Expression .
ElementType = Type .
```

The length is part of the array’s type; it must evaluate to a non-negative [constant](http://docscn.studygolang.com/ref/spec#Constants) [representable](http://docscn.studygolang.com/ref/spec#Representability) by a value of type `int`. The length of array `a` can be discovered using the built-in function `[len](http://docscn.studygolang.com/ref/spec#Length_and_capacity)`. The elements can be addressed by integer [indices](http://docscn.studygolang.com/ref/spec#Index_expressions) 0 through `len(a)-1`. Array types are always one-dimensional but may be composed to form multi-dimensional types.

长度是数组类型的一部分; 它必须计算为一个非负常数，该常数可由 int 类型的值表示。数组 a 的长度可以通过使用内置函数 len 来发现。元素可以通过整数索引0到 len (a)-1来寻址。数组类型始终是一维的，但可以组合成多维类型。

```
[32]byte
[2*N] struct { x, y int32 }
[1000]*float64
[3][5]int
[2][2][2]float64  // same as [2]([2]([2]float64))
```

### Slice types 切片类型

A slice is a descriptor for a contiguous segment of an *underlying array* and provides access to a numbered sequence of elements from that array. A slice type denotes the set of all slices of arrays of its element type. The number of elements is called the length of the slice and is never negative. The value of an uninitialized slice is `nil`.

片是基础数组的连续段的描述符，并提供对该数组中元素序列的编号访问。片类型表示其元素类型的所有数组片的集合。元素的数量称为切片的长度，从来不是负数。未初始化的片的值为 nil。

```
SliceType = "[" "]" ElementType .
```

The length of a slice `s` can be discovered by the built-in function `[len](http://docscn.studygolang.com/ref/spec#Length_and_capacity)`; unlike with arrays it may change during execution. The elements can be addressed by integer [indices](http://docscn.studygolang.com/ref/spec#Index_expressions) 0 through `len(s)-1`. The slice index of a given element may be less than the index of the same element in the underlying array.

片的长度可以通过内置的函数 len 来发现; 与数组不同，它可以在执行过程中改变。元素可以通过整数索引0到 len (s)-1来寻址。给定元素的片索引可以小于基础数组中同一元素的索引。

A slice, once initialized, is always associated with an underlying array that holds its elements. A slice therefore shares storage with its array and with other slices of the same array; by contrast, distinct arrays always represent distinct storage.

一个片一旦初始化，总是与包含其元素的基础数组关联。因此，切片与其数组以及同一数组的其他切片共享存储; 相比之下，不同的数组始终表示不同的存储。

The array underlying a slice may extend past the end of the slice. The *capacity* is a measure of that extent: it is the sum of the length of the slice and the length of the array beyond the slice; a slice of length up to that capacity can be created by *[slicing](http://docscn.studygolang.com/ref/spec#Slice_expressions)* a new one from the original slice. The capacity of a slice `a` can be discovered using the built-in function `[cap(a)](http://docscn.studygolang.com/ref/spec#Length_and_capacity)`.

切片的基础数组可以延伸到切片的末端。容量就是这种程度的度量: 它是切片长度和切片之外的数组长度的总和; 通过从原始切片切片创建一个新的切片，可以创建一个达到这个容量的切片。可以使用内置的功能盖(a)发现片 a 的容量。

A new, initialized slice value for a given element type `T` is made using the built-in function `[make](http://docscn.studygolang.com/ref/spec#Making_slices_maps_and_channels)`, which takes a slice type and parameters specifying the length and optionally the capacity. A slice created with `make` always allocates a new, hidden array to which the returned slice value refers. That is, executing

使用内置函数 make 为给定元素类型 t 创建一个新的初始化切片值，该值采用切片类型和参数，指定长度和可选的容量。使用 make 创建的片总是分配返回的片值所引用的新的隐藏数组。也就是说，执行

```
make([]T, length, capacity)
```

produces the same slice as allocating an array and [slicing](http://docscn.studygolang.com/ref/spec#Slice_expressions) it, so these two expressions are equivalent:

生成与分配数组和切片相同的切片，所以这两个表达式是等价的:

```
make([]int, 50, 100)
new([100]int)[0:50]
```

Like arrays, slices are always one-dimensional but may be composed to construct higher-dimensional objects. With arrays of arrays, the inner arrays are, by construction, always the same length; however with slices of slices (or arrays of slices), the inner lengths may vary dynamically. Moreover, the inner slices must be initialized individually.

像数组一样，切片始终是一维的，但可以组合为构造更高维的对象。对于数组数组，根据结构，内部数组总是相同的长度; 但是对于切片(或切片数组) ，内部长度可以动态变化。此外，内部片必须单独初始化。

### Struct types 结构类型

A struct is a sequence of named elements, called fields, each of which has a name and a type. Field names may be specified explicitly (IdentifierList) or implicitly (EmbeddedField). Within a struct, non-[blank](http://docscn.studygolang.com/ref/spec#Blank_identifier) field names must be [unique](http://docscn.studygolang.com/ref/spec#Uniqueness_of_identifiers).

Struct 是一个命名元素序列，称为字段，每个字段都有一个名称和一个类型。字段名可以显式指定(IdentifierList)或隐式指定(EmbeddedField)。在结构中，非空字段名称必须是唯一的。

```
StructType    = "struct" "{" { FieldDecl ";" } "}" .
FieldDecl     = (IdentifierList Type | EmbeddedField) [ Tag ] .
EmbeddedField = [ "*" ] TypeName .
Tag           = string_lit .
// An empty struct.
struct {}

// A struct with 6 fields.
struct {
    x, y int
    u float32
    _ float32  // padding
    A *[]int
    F func()
}
```

A field declared with a type but no explicit field name is called an *embedded field*. An embedded field must be specified as a type name `T` or as a pointer to a non-interface type name `*T`, and `T` itself may not be a pointer type. The unqualified type name acts as the field name.

用类型声明但没有显式字段名称的字段称为嵌入字段。嵌入字段必须指定为类型名 t 或指向非接口类型名 * t 的指针，而且 t 本身可能不是指针类型。未限定的类型名充当字段名。

```
// A struct with four embedded fields of types T1, *T2, P.T3 and *P.T4
struct {
    T1        // field name is T1
    *T2       // field name is T2
    P.T3      // field name is T3
    *P.T4     // field name is T4
    x, y int  // field names are x and y
}
```

The following declaration is illegal because field names must be unique in a struct type:

下面的声明是非法的，因为字段名在结构类型中必须是唯一的:

```
struct {
    T     // conflicts with embedded field *T and *P.T
    *T    // conflicts with embedded field T and *P.T
    *P.T  // conflicts with embedded field T and *T
}
```

A field or [method](http://docscn.studygolang.com/ref/spec#Method_declarations) `f` of an embedded field in a struct `x` is called *promoted* if `x.f` is a legal [selector](http://docscn.studygolang.com/ref/spec#Selectors) that denotes that field or method `f`.

如果 x.f 是表示字段或方法 f 的合法选择器，则调用 structx 中嵌入字段的字段或方法 f。

Promoted fields act like ordinary fields of a struct except that they cannot be used as field names in [composite literals](http://docscn.studygolang.com/ref/spec#Composite_literals) of the struct.

提升字段与结构的普通字段相似，只是不能用作结构的复合文本中的字段名。

Given a struct type `S` and a [defined type](http://docscn.studygolang.com/ref/spec#Type_definitions) `T`, promoted methods are included in the method set of the struct as follows:

给定结构类型 s 和定义类型 t，提升方法包含在结构的方法集中，如下所示:

- If 如果`S` contains an embedded field 包含一个嵌入字段`T`, the 、预防退伍军人病委员会[method sets 方法集](http://docscn.studygolang.com/ref/spec#Method_sets) of 的`S` and 及`S` both include promoted methods with receiver 两者都包括接收器的升级方法`T`. The method set of 。方法集`S` also includes promoted methods with receiver 还包括用接收器提升的方法`T`.
- If 如果`S` contains an embedded field 包含一个嵌入字段`T`, the method sets of ，方法集的`S` and 及`S` both include promoted methods with receiver 两者都包括接收器的升级方法`T` or 或`T`.

A field declaration may be followed by an optional string literal *tag*, which becomes an attribute for all the fields in the corresponding field declaration. An empty tag string is equivalent to an absent tag. The tags are made visible through a [reflection interface](http://docscn.studygolang.com/pkg/reflect/#StructTag) and take part in [type identity](http://docscn.studygolang.com/ref/spec#Type_identity) for structs but are otherwise ignored.

字段声明之后可以跟随一个可选的字符串文本标记，该标记将成为相应字段声明中所有字段的属性。一个空的标记字符串等价于一个缺失的标记。标记通过反射接口可见，并参与结构的类型标识，但在其他情况下被忽略。

```
struct {
    x, y float64 ""  // an empty tag string is like an absent tag
    name string  "any string is permitted as a tag"
    _    [4]byte "ceci n'est pas un champ de structure"
}

// A struct corresponding to a TimeStamp protocol buffer.
// The tag strings define the protocol buffer field numbers;
// they follow the convention outlined by the reflect package.
struct {
    microsec  uint64 `protobuf:"1"`
    serverIP6 uint64 `protobuf:"2"`
}
```

### Pointer types 指针类型

A pointer type denotes the set of all pointers to [variables](http://docscn.studygolang.com/ref/spec#Variables) of a given type, called the *base type* of the pointer. The value of an uninitialized pointer is `nil`.

指针类型表示指向给定类型变量(称为指针的基类型)的所有指针的集合。未初始化的指针的值为 nil。

```
PointerType = "*" BaseType .
BaseType    = Type .
*Point
*[4]int
```

### Function types 功能类型

A function type denotes the set of all functions with the same parameter and result types. The value of an uninitialized variable of function type is `nil`.

函数类型表示具有相同参数和结果类型的所有函数的集合。函数类型的未初始化变量的值为 nil。

```
FunctionType   = "func" Signature .
Signature      = Parameters [ Result ] .
Result         = Parameters | Type .
Parameters     = "(" [ ParameterList [ "," ] ] ")" .
ParameterList  = ParameterDecl { "," ParameterDecl } .
ParameterDecl  = [ IdentifierList ] [ "..." ] Type .
```

Within a list of parameters or results, the names (IdentifierList) must either all be present or all be absent. If present, each name stands for one item (parameter or result) of the specified type and all non-[blank](http://docscn.studygolang.com/ref/spec#Blank_identifier) names in the signature must be [unique](http://docscn.studygolang.com/ref/spec#Uniqueness_of_identifiers). If absent, each type stands for one item of that type. Parameter and result lists are always parenthesized except that if there is exactly one unnamed result it may be written as an unparenthesized type.

在参数或结果列表中，名称(IdentifierList)必须全部出现或全部缺失。如果存在，则每个名称代表指定类型的一个项(参数或结果) ，签名中的所有非空名称都必须是唯一的。如果没有，每个类型表示该类型的一个项。参数和结果列表总是用圆括号括起来，除非只有一个未命名的结果，否则可以将其写为未用圆括号括起来的类型。

The final incoming parameter in a function signature may have a type prefixed with `...`. A function with such a parameter is called *variadic* and may be invoked with zero or more arguments for that parameter.

函数签名中的最终传入参数可以有一个前缀为… 的类型。具有这样一个参数的函数称为可变参数，并且可以使用该参数的零个或多个参数进行调用。

```
func()
func(x int) int
func(a, _ int, z float32) bool
func(a, b int, z float32) (bool)
func(prefix string, values ...int)
func(a, b int, z float64, opt ...interface{}) (success bool)
func(int, int, float64) (float64, *[]int)
func(n int) func(p *T)
```

### Interface types 接口类型

An interface type specifies a [method set](http://docscn.studygolang.com/ref/spec#Method_sets) called its *interface*. A variable of interface type can store a value of any type with a method set that is any superset of the interface. Such a type is said to *implement the interface*. The value of an uninitialized variable of interface type is `nil`.

接口类型指定称为其接口的方法集。接口类型的变量可以用方法集存储任何类型的值，该方法集是接口的任何超集。这种类型被称为实现接口。接口类型的未初始化变量的值为 nil。

```
InterfaceType      = "interface" "{" { ( MethodSpec | InterfaceTypeName ) ";" } "}" .
MethodSpec         = MethodName Signature .
MethodName         = identifier .
InterfaceTypeName  = TypeName .
```

An interface type may specify methods *explicitly* through method specifications, or it may *embed* methods of other interfaces through interface type names.

接口类型可以通过方法规范显式地指定方法，也可以通过接口类型名称嵌入其他接口的方法。

```
// A simple File interface.
interface {
    Read([]byte) (int, error)
    Write([]byte) (int, error)
    Close() error
}
```

The name of each explicitly specified method must be [unique](http://docscn.studygolang.com/ref/spec#Uniqueness_of_identifiers) and not [blank](http://docscn.studygolang.com/ref/spec#Blank_identifier).

每个显式指定的方法的名称必须是唯一的，而不是空白的。

```
interface {
    String() string
    String() string  // illegal: String not unique
    _(x int)         // illegal: method must have non-blank name
}
```

More than one type may implement an interface. For instance, if two types `S1` and `S2` have the method set

多个类型可以实现一个接口。例如，如果两个类型 S1和 S2已经设置了该方法

```
func (p T) Read(p []byte) (n int, err error)
func (p T) Write(p []byte) (n int, err error)
func (p T) Close() error
```

(where `T` stands for either `S1` or `S2`) then the `File` interface is implemented by both `S1` and `S2`, regardless of what other methods `S1` and `S2` may have or share.

(t 代表 S1或 S2)那么文件接口是由 S1和 S2实现的，而不管 S1和 S2可能拥有或共享什么其他方法。

A type implements any interface comprising any subset of its methods and may therefore implement several distinct interfaces. For instance, all types implement the *empty interface*:

类型实现包含其方法的任何子集的任何接口，因此可以实现几个不同的接口。例如，所有类型都实现空接口:

```
interface{}
```

Similarly, consider this interface specification, which appears within a [type declaration](http://docscn.studygolang.com/ref/spec#Type_declarations) to define an interface called `Locker`:

类似地，考虑一下这个接口规范，它出现在一个类型声明中来定义一个名为 Locker 的接口:

```
type Locker interface {
    Lock()
    Unlock()
}
```

If `S1` and `S2` also implement

如中一及中二同时实施

```
func (p T) Lock() { … }
func (p T) Unlock() { … }
```

they implement the `Locker` interface as well as the `File` interface.

它们实现了 Locker 接口和 File 接口。

An interface `T` may use a (possibly qualified) interface type name `E` in place of a method specification. This is called *embedding* interface `E` in `T`. The [method set](http://docscn.studygolang.com/ref/spec#Method_sets) of `T` is the *union* of the method sets of `T`’s explicitly declared methods and of `T`’s embedded interfaces.

接口 t 可以使用(可能限定的)接口类型名 e 来代替方法规范。这就是所谓的嵌入界面 e 在 t。T 的方法集是 t 的显式声明方法集和 t 的嵌入接口的方法集的并集。

```
type Reader interface {
    Read(p []byte) (n int, err error)
    Close() error
}

type Writer interface {
    Write(p []byte) (n int, err error)
    Close() error
}

// ReadWriter's methods are Read, Write, and Close.
type ReadWriter interface {
    Reader  // includes methods of Reader in ReadWriter's method set
    Writer  // includes methods of Writer in ReadWriter's method set
}
```

A *union* of method sets contains the (exported and non-exported) methods of each method set exactly once, and methods with the [same](http://docscn.studygolang.com/ref/spec#Uniqueness_of_identifiers) names must have [identical](http://docscn.studygolang.com/ref/spec#Type_identity) signatures.

方法集的并集包含每个方法集的(导出和非导出)方法，并且具有相同名称的方法必须具有相同的签名。

```
type ReadCloser interface {
    Reader   // includes methods of Reader in ReadCloser's method set
    Close()  // illegal: signatures of Reader.Close and Close are different
}
```

An interface type `T` may not embed itself or any interface type that embeds `T`, recursively.

接口类型 t 不能嵌入自身或者递归嵌入 t 的任何接口类型。

```
// illegal: Bad cannot embed itself
type Bad interface {
    Bad
}

// illegal: Bad1 cannot embed itself using Bad2
type Bad1 interface {
    Bad2
}
type Bad2 interface {
    Bad1
}
```

### Map types 地图类型

A map is an unordered group of elements of one type, called the element type, indexed by a set of unique *keys* of another type, called the key type. The value of an uninitialized map is `nil`.

Map 是一种类型的无序元素组，称为元素类型，由另一种类型的一组唯一键(称为键类型)进行索引。未初始化映射的值为 nil。

```
MapType     = "map" "[" KeyType "]" ElementType .
KeyType     = Type .
```

The [comparison operators](http://docscn.studygolang.com/ref/spec#Comparison_operators) `==` and `!=` must be fully defined for operands of the key type; thus the key type must not be a function, map, or slice. If the key type is an interface type, these comparison operators must be defined for the dynamic key values; failure will cause a [run-time panic](http://docscn.studygolang.com/ref/spec#Run_time_panics).

比较运算符 = = 和！必须为键类型的操作数完全定义; 因此键类型不能是函数、映射或片。如果键类型是接口类型，则必须为动态键值定义这些比较运算符; 失败将导致运行时恐慌。

```
map[string]int
map[*T]struct{ x, y float64 }
map[string]interface{}
```

The number of map elements is called its length. For a map `m`, it can be discovered using the built-in function `[len](http://docscn.studygolang.com/ref/spec#Length_and_capacity)` and may change during execution. Elements may be added during execution using [assignments](http://docscn.studygolang.com/ref/spec#Assignments) and retrieved with [index expressions](http://docscn.studygolang.com/ref/spec#Index_expressions); they may be removed with the `[delete](http://docscn.studygolang.com/ref/spec#Deletion_of_map_elements)` built-in function.

映射元素的个数称为它的长度。对于 map m，可以使用内置函数 len 发现它，并且在执行过程中可能会发生更改。可以在执行期间使用赋值添加元素，并使用索引表达式检索元素; 可以使用 delete 内置函数删除元素。

A new, empty map value is made using the built-in function `[make](http://docscn.studygolang.com/ref/spec#Making_slices_maps_and_channels)`, which takes the map type and an optional capacity hint as arguments:

使用内置函数 make 生成一个新的空 map 值，它将 map 类型和一个可选的容量提示作为参数:

```
make(map[string]int)
make(map[string]int, 100)
```

The initial capacity does not bound its size: maps grow to accommodate the number of items stored in them, with the exception of `nil` maps. A `nil` map is equivalent to an empty map except that no elements may be added.

初始容量没有限制其大小: 映射增长以容纳存储在其中的项目数，空映射除外。Nil 映射相当于空映射，只是不能添加任何元素。

### Channel types 通道类型

A channel provides a mechanism for [concurrently executing functions](http://docscn.studygolang.com/ref/spec#Go_statements) to communicate by [sending](http://docscn.studygolang.com/ref/spec#Send_statements) and [receiving](http://docscn.studygolang.com/ref/spec#Receive_operator) values of a specified element type. The value of an uninitialized channel is `nil`.

通道提供了一种机制，用于同时执行的函数通过发送和接收指定元素类型的值进行通信。未初始化通道的值为 nil。

```
ChannelType = ( "chan" | "chan" "<-" | "<-" "chan" ) ElementType .
```

The optional `<-` operator specifies the channel *direction*, *send* or *receive*. If no direction is given, the channel is *bidirectional*. A channel may be constrained only to send or only to receive by [assignment](http://docscn.studygolang.com/ref/spec#Assignments) or explicit [conversion](http://docscn.studygolang.com/ref/spec#Conversions).

可选的 <-operator 指定通道方向，发送或接收。如果没有给出方向，则通道是双向的。通道可能仅限于通过赋值或显式转换发送或接收。

```
chan T          // can be used to send and receive values of type T
chan<- float64  // can only be used to send float64s
<-chan int      // can only be used to receive ints
```

The `<-` operator associates with the leftmost `chan` possible:

<-operator 与最左边的 chan 关联:

```
chan<- chan int    // same as chan<- (chan int)
chan<- <-chan int  // same as chan<- (<-chan int)
<-chan <-chan int  // same as <-chan (<-chan int)
chan (<-chan int)
```

A new, initialized channel value can be made using the built-in function `[make](http://docscn.studygolang.com/ref/spec#Making_slices_maps_and_channels)`, which takes the channel type and an optional *capacity* as arguments:

可以使用内置函数 make 创建一个新的初始化通道值，该函数将通道类型和可选容量作为参数:

```
make(chan int, 100)
```

The capacity, in number of elements, sets the size of the buffer in the channel. If the capacity is zero or absent, the channel is unbuffered and communication succeeds only when both a sender and receiver are ready. Otherwise, the channel is buffered and communication succeeds without blocking if the buffer is not full (sends) or not empty (receives). A `nil` channel is never ready for communication.

容量(以元素数目表示)设置通道中缓冲区的大小。如果容量为零或不存在，则信道不缓冲，通信只有在发送方和接收方都准备好时才能成功。否则，如果缓冲区没有满(发送)或者没有空(接收) ，通道将被缓冲并且通信成功而不会阻塞。无通道永远不会准备好进行通信。

A channel may be closed with the built-in function `[close](http://docscn.studygolang.com/ref/spec#Close)`. The multi-valued assignment form of the [receive operator](http://docscn.studygolang.com/ref/spec#Receive_operator) reports whether a received value was sent before the channel was closed.

通道可以关闭，内置函数关闭。接收运算符的多值赋值表单报告接收值是否在通道关闭之前发送。

A single channel may be used in [send statements](http://docscn.studygolang.com/ref/spec#Send_statements), [receive operations](http://docscn.studygolang.com/ref/spec#Receive_operator), and calls to the built-in functions `[cap](http://docscn.studygolang.com/ref/spec#Length_and_capacity)` and `[len](http://docscn.studygolang.com/ref/spec#Length_and_capacity)` by any number of goroutines without further synchronization. Channels act as first-in-first-out queues. For example, if one goroutine sends values on a channel and a second goroutine receives them, the values are received in the order sent.

单个通道可以用于发送语句、接收操作以及任意数量的 goroutine 对内置函数的调用，而无需进一步同步。通道充当先进先出队列。例如，如果一个 goroutine 在通道上发送值，而另一个 goroutine 接收值，则按照发送的顺序接收值。

## Properties of types and values 类型和值的属性

### Type identity 类型标识

Two types are either *identical* or *different*.

两种类型要么相同，要么不同。

A [defined type](http://docscn.studygolang.com/ref/spec#Type_definitions) is always different from any other type. Otherwise, two types are identical if their [underlying](http://docscn.studygolang.com/ref/spec#Types) type literals are structurally equivalent; that is, they have the same literal structure and corresponding components have identical types. In detail:

已定义的类型始终不同于任何其他类型。否则，如果两个类型的基础类型文字在结构上是等价的，那么它们是相同的; 也就是说，它们具有相同的文字结构，而相应的组件具有相同的类型。详细内容:

- Two array types are identical if they have identical element types and the same array length. 如果两个数组具有相同的元素类型和相同的数组长度，那么它们是相同的
- Two slice types are identical if they have identical element types. 如果两个切片类型具有相同的元素类型，那么它们是相同的
- Two struct types are identical if they have the same sequence of fields, and if corresponding fields have the same names, and identical types, and identical tags. 如果两个结构类型具有相同的字段序列，并且相应的字段具有相同的名称、相同的类型和相同的标记，则它们是相同的[Non-exported 非输出](http://docscn.studygolang.com/ref/spec#Exported_identifiers) field names from different packages are always different. 不同软件包的字段名总是不同的
- Two pointer types are identical if they have identical base types. 如果两个指针类型具有相同的基类型，则它们是相同的
- Two function types are identical if they have the same number of parameters and result values, corresponding parameter and result types are identical, and either both functions are variadic or neither is. Parameter and result names are not required to match. 如果两个函数类型具有相同数目的参数和结果值，那么它们是相同的，相应的参数和结果类型是相同的，并且两个函数要么是可变参数，要么都不是。参数和结果名称不需要匹配
- Two interface types are identical if they have the same set of methods with the same names and identical function types. 如果两个接口类型具有相同的方法集，且具有相同的名称和相同的函数类型，则它们是相同的[Non-exported 非输出](http://docscn.studygolang.com/ref/spec#Exported_identifiers) method names from different packages are always different. The order of the methods is irrelevant. 来自不同包的方法名称总是不同的。方法的顺序是无关的
- Two map types are identical if they have identical key and element types. 如果两个映射类型具有相同的键和元素类型，那么它们是相同的
- Two channel types are identical if they have identical element types and the same direction. 如果两个通道具有相同的元素类型和相同的方向，则它们是相同的

Given the declarations

考虑到这些声明

```
type (
    A0 = []string
    A1 = A0
    A2 = struct{ a, b int }
    A3 = int
    A4 = func(A3, float64) *A0
    A5 = func(x int, _ float64) *[]string
)

type (
    B0 A0
    B1 []string
    B2 struct{ a, b int }
    B3 struct{ a, c int }
    B4 func(int, float64) *B0
    B5 func(x int, y float64) *A1
)

type    C0 = B0
```

these types are identical:

这些类型是一样的:

```
A0, A1, and []string
A2 and struct{ a, b int }
A3 and int
A4, func(int, float64) *[]string, and A5

B0 and C0
[]int and []int
struct{ a, b *T5 } and struct{ a, b *T5 }
func(x int, y float64) *[]string, func(int, float64) (result *[]string), and A5
```

`B0` and `B1` are different because they are new types created by distinct [type definitions](http://docscn.studygolang.com/ref/spec#Type_definitions); `func(int, float64) *B0` and `func(x int, y float64) *[]string` are different because `B0` is different from `[]string`.

B0和 B1是不同的，因为它们是由不同的类型定义创建的新类型; func (int，float64) * B0和 func (x int，y float64) * [] string 是不同的，因为 B0不同于[] string。

### Assignability 可转让性

A value `x` is *assignable* to a [variable](http://docscn.studygolang.com/ref/spec#Variables) of type `T` (“`x` is assignable to `T`”) if one of the following conditions applies:

如果下列条件之一适用，则值 x 可分配给类型为 t 的变量(“ x 可分配给 t”) :

- `x`’s type is identical to 的类型与`T`.
- `x`’s type 的类型`V` and 及`T` have identical 有相同的[underlying types 基本类型](http://docscn.studygolang.com/ref/spec#Types) and at least one of 至少有一个`V` or 或`T` is not a 不是一个[defined 定义](http://docscn.studygolang.com/ref/spec#Type_definitions) type. 类型
- `T` is an interface type and 是一种接口类型`x` [implements 工具](http://docscn.studygolang.com/ref/spec#Interface_types) `T`.
- `x` is a bidirectional channel value, 是一个双向信道值,`T` is a channel type, 是一种通道类型,`x`’s type 的类型`V` and 及`T` have identical element types, and at least one of 有相同的元素类型，并且至少有一个`V` or 或`T` is not a defined type. 不是定义类型
- `x` is the predeclared identifier 是预先声明的标识符`nil` and 及`T` is a pointer, function, slice, map, channel, or interface type. 是指针、函数、片段、映射、通道或接口类型
- `x` is an untyped 是一个未打字的[constant 常数](http://docscn.studygolang.com/ref/spec#Constants) [representable 可代表的](http://docscn.studygolang.com/ref/spec#Representability) by a value of type 类型的值`T`.

### Representability 具有代表性

A [constant](http://docscn.studygolang.com/ref/spec#Constants) `x` is *representable* by a value of type `T` if one of the following conditions applies:

如果符合下列条件之一，常数 x 可以用类型 t 的值表示:

- `x` is in the set of values 是在一系列的值中[determined 坚定的](http://docscn.studygolang.com/ref/spec#Types) by 作者`T`.
- `T` is a floating-point type and 是浮点类型`x` can be rounded to 可舍入至`T`’s precision without overflow. Rounding uses IEEE 754 round-to-even rules but with an IEEE negative zero further simplified to an unsigned zero. Note that constant values never result in an IEEE negative zero, NaN, or infinity. 没有溢出的精度。四舍五入使用 IEEE 754四舍五入规则，但使用 IEEE 负零进一步简化为无符号零。请注意，常量值不会导致 IEEE 负零、 NaN 或无穷大
- `T` is a complex type, and 是一种复杂的类型`x`’s 是的[components 组件](http://docscn.studygolang.com/ref/spec#Complex_numbers) `real(x)` and 及`imag(x)` are representable by values of 可以通过值来表示`T`’s component type ( 的组件类型(`float32` or 或`float64`).

```
x                   T           x is representable by a value of T because

'a'                 byte        97 is in the set of byte values
97                  rune        rune is an alias for int32, and 97 is in the set of 32-bit integers
"foo"               string      "foo" is in the set of string values
1024                int16       1024 is in the set of 16-bit integers
42.0                byte        42 is in the set of unsigned 8-bit integers
1e10                uint64      10000000000 is in the set of unsigned 64-bit integers
2.718281828459045   float32     2.718281828459045 rounds to 2.7182817 which is in the set of float32 values
-1e-1000            float64     -1e-1000 rounds to IEEE -0.0 which is further simplified to 0.0
0i                  int         0 is an integer value
(42 + 0i)           float32     42.0 (with zero imaginary part) is in the set of float32 values
x                   T           x is not representable by a value of T because

0                   bool        0 is not in the set of boolean values
'a'                 string      'a' is a rune, it is not in the set of string values
1024                byte        1024 is not in the set of unsigned 8-bit integers
-1                  uint16      -1 is not in the set of unsigned 16-bit integers
1.1                 int         1.1 is not an integer value
42i                 float32     (0 + 42i) is not in the set of float32 values
1e1000              float64     1e1000 overflows to IEEE +Inf after rounding
```

## Blocks 积木

A *block* is a possibly empty sequence of declarations and statements within matching brace brackets.

块可能是匹配大括号中的声明和语句的空序列。

```
Block = "{" StatementList "}" .
StatementList = { Statement ";" } .
```

In addition to explicit blocks in the source code, there are implicit blocks:

除了源代码中的显式块，还有隐式块:

1. The 这个*universe block 宇宙块* encompasses all Go source text. 包含所有 Go 源文本
2. Each 每个人[package 包装](http://docscn.studygolang.com/ref/spec#Packages) has a 有*package block 封装块* containing all Go source text for that package. 包含该包的所有 Go 源文本
3. Each file has a 每个文件都有一个*file block 文件块* containing all Go source text in that file. 包含该文件中的所有 Go 源文本
4. Each 每个人[“if” “如果”](http://docscn.studygolang.com/ref/spec#If_statements), [“for” “ for”](http://docscn.studygolang.com/ref/spec#For_statements), and ，及[“switch” ”开关”](http://docscn.studygolang.com/ref/spec#Switch_statements) statement is considered to be in its own implicit block. 语句被认为在它自己的隐式块中
5. Each clause in a 中的每个子句[“switch” ”开关”](http://docscn.studygolang.com/ref/spec#Switch_statements) or 或[“select” ”选择”](http://docscn.studygolang.com/ref/spec#Select_statements) statement acts as an implicit block. 语句充当隐式块

Blocks nest and influence [scoping](http://docscn.studygolang.com/ref/spec#Declarations_and_scope).

块嵌套和影响范围。

## Declarations and scope 声明和范围

A *declaration* binds a non-[blank](http://docscn.studygolang.com/ref/spec#Blank_identifier) identifier to a [constant](http://docscn.studygolang.com/ref/spec#Constant_declarations), [type](http://docscn.studygolang.com/ref/spec#Type_declarations), [variable](http://docscn.studygolang.com/ref/spec#Variable_declarations), [function](http://docscn.studygolang.com/ref/spec#Function_declarations), [label](http://docscn.studygolang.com/ref/spec#Labeled_statements), or [package](http://docscn.studygolang.com/ref/spec#Import_declarations). Every identifier in a program must be declared. No identifier may be declared twice in the same block, and no identifier may be declared in both the file and package block.

声明将非空标识符绑定到常量、类型、变量、函数、标签或包。程序中的每个标识符都必须声明。不能在同一块中声明任何标识符两次，也不能在文件块和包块中声明任何标识符。

The [blank identifier](http://docscn.studygolang.com/ref/spec#Blank_identifier) may be used like any other identifier in a declaration, but it does not introduce a binding and thus is not declared. In the package block, the identifier `init` may only be used for `[init` function](http://docscn.studygolang.com/ref/spec#Package_initialization) declarations, and like the blank identifier it does not introduce a new binding.

空白标识符可以像声明中的任何其他标识符一样使用，但它不引入绑定，因此不声明。在包块中，标识符 init 只能用于 init 函数声明，并且与空白标识符一样，它不引入新的绑定。

```
Declaration   = ConstDecl | TypeDecl | VarDecl .
TopLevelDecl  = Declaration | FunctionDecl | MethodDecl .
```

The *scope* of a declared identifier is the extent of source text in which the identifier denotes the specified constant, type, variable, function, label, or package.

声明标识符的范围是源文本的范围，其中标识符表示指定的常量、类型、变量、函数、标签或包。

Go is lexically scoped using [blocks](http://docscn.studygolang.com/ref/spec#Blocks):

使用块来定义字典范围:

1. The scope of a 的范围[predeclared identifier 预先声明的标识符](http://docscn.studygolang.com/ref/spec#Predeclared_identifiers) is the universe block. 就是宇宙块
2. The scope of an identifier denoting a constant, type, variable, or function (but not method) declared at top level (outside any function) is the package block. 标识符的作用域表示在顶层(任何函数之外)声明的常量、类型、变量或函数(但不包括方法) ，即包块
3. The scope of the package name of an imported package is the file block of the file containing the import declaration. 导入包的包名称的范围是包含导入声明的文件的文件块
4. The scope of an identifier denoting a method receiver, function parameter, or result variable is the function body. 表示方法接收者、函数参数或结果变量的标识符的作用域是函数体
5. The scope of a constant or variable identifier declared inside a function begins at the end of the ConstSpec or VarSpec (ShortVarDecl for short variable declarations) and ends at the end of the innermost containing block. 函数内声明的常量或变量标识符的作用域从 constanspec 或 VarSpec (短变量声明的 ShortVarDecl)的结尾开始，到最内层包含块的结尾结束
6. The scope of a type identifier declared inside a function begins at the identifier in the TypeSpec and ends at the end of the innermost containing block. 函数内声明的类型标识符的作用域从 TypeSpec 中的标识符开始，到最里面的包含块结束

An identifier declared in a block may be redeclared in an inner block. While the identifier of the inner declaration is in scope, it denotes the entity declared by the inner declaration.

在块中声明的标识符可以在内部块中重新声明。当内部声明的标识符在范围内时，它表示由内部声明声明的实体。

The [package clause](http://docscn.studygolang.com/ref/spec#Package_clause) is not a declaration; the package name does not appear in any scope. Its purpose is to identify the files belonging to the same [package](http://docscn.studygolang.com/ref/spec#Packages) and to specify the default package name for import declarations.

包子句不是声明; 包名称不出现在任何范围中。其目的是标识属于同一个包的文件，并为导入声明指定默认的包名。

### Label scopes 标签范围

Labels are declared by [labeled statements](http://docscn.studygolang.com/ref/spec#Labeled_statements) and are used in the [“break”](http://docscn.studygolang.com/ref/spec#Break_statements), [“continue”](http://docscn.studygolang.com/ref/spec#Continue_statements), and [“goto”](http://docscn.studygolang.com/ref/spec#Goto_statements) statements. It is illegal to define a label that is never used. In contrast to other identifiers, labels are not block scoped and do not conflict with identifiers that are not labels. The scope of a label is the body of the function in which it is declared and excludes the body of any nested function.

标签由带标签的语句声明，用于“ break”、“ continue”和“ goto”语句。定义一个从未使用过的标签是非法的。与其他标识符不同，标识符不阻塞作用域，并且与不是标识符的标识符不冲突。标签的作用域是声明它的函数体，并排除任何嵌套函数体。

### Blank identifier 空白标识符

The *blank identifier* is represented by the underscore character `_`. It serves as an anonymous placeholder instead of a regular (non-blank) identifier and has special meaning in [declarations](http://docscn.studygolang.com/ref/spec#Declarations_and_scope), as an [operand](http://docscn.studygolang.com/ref/spec#Operands), and in [assignments](http://docscn.studygolang.com/ref/spec#Assignments).

空白标识符由下划线字符 _ 表示。它充当匿名占位符，而不是常规(非空白)标识符，在声明、操作数和赋值中具有特殊意义。

### Predeclared identifiers 预先声明的标识符

The following identifiers are implicitly declared in the [universe block](http://docscn.studygolang.com/ref/spec#Blocks):

在 universe 块中隐式声明了以下标识符:

```
Types:
    bool byte complex64 complex128 error float32 float64
    int int8 int16 int32 int64 rune string
    uint uint8 uint16 uint32 uint64 uintptr

Constants:
    true false iota

Zero value:
    nil

Functions:
    append cap close complex copy delete imag len
    make new panic print println real recover
```

### Exported identifiers 导出标识符

An identifier may be *exported* to permit access to it from another package. An identifier is exported if both:

可以导出一个标识符，以允许从另一个包访问该标识符。如果两者兼有，则导出标识符:

1. the first character of the identifier’s name is a Unicode upper case letter (Unicode class “Lu”); and 标识符名称的第一个字符是 Unicode 大写字母(Unicode 类“ Lu”) ; 以及
2. the identifier is declared in the 标识符在[package block 封装块](http://docscn.studygolang.com/ref/spec#Blocks) or it is a 或者它是一个[field name 字段名](http://docscn.studygolang.com/ref/spec#Struct_types) or 或[method name 方法名](http://docscn.studygolang.com/ref/spec#MethodName).

All other identifiers are not exported.

不导出所有其他标识符。

### Uniqueness of identifiers 标识符的唯一性

Given a set of identifiers, an identifier is called *unique* if it is *different* from every other in the set. Two identifiers are different if they are spelled differently, or if they appear in different [packages](http://docscn.studygolang.com/ref/spec#Packages) and are not [exported](http://docscn.studygolang.com/ref/spec#Exported_identifiers). Otherwise, they are the same.

给定一组标识符，如果标识符与集合中的其他标识符不同，则称其为唯一标识符。如果两个标识符的拼写不同，或者它们出现在不同的包中并且没有导出，则它们是不同的。否则，它们是一样的。

### Constant declarations 不断的声明

A constant declaration binds a list of identifiers (the names of the constants) to the values of a list of [constant expressions](http://docscn.studygolang.com/ref/spec#Constant_expressions). The number of identifiers must be equal to the number of expressions, and the *n*th identifier on the left is bound to the value of the *n*th expression on the right.

常量声明将标识符列表(常量的名称)绑定到常量表达式列表的值。标识符的数量必须等于表达式的数量，左侧的第 n 个标识符与右侧的第 n 个表达式的值绑定。

```
ConstDecl      = "const" ( ConstSpec | "(" { ConstSpec ";" } ")" ) .
ConstSpec      = IdentifierList [ [ Type ] "=" ExpressionList ] .

IdentifierList = identifier { "," identifier } .
ExpressionList = Expression { "," Expression } .
```

If the type is present, all constants take the type specified, and the expressions must be [assignable](http://docscn.studygolang.com/ref/spec#Assignability) to that type. If the type is omitted, the constants take the individual types of the corresponding expressions. If the expression values are untyped [constants](http://docscn.studygolang.com/ref/spec#Constants), the declared constants remain untyped and the constant identifiers denote the constant values. For instance, if the expression is a floating-point literal, the constant identifier denotes a floating-point constant, even if the literal’s fractional part is zero.

如果存在类型，则所有常量都采用指定的类型，表达式必须可分配给该类型。如果省略类型，则常量取相应表达式的单个类型。如果表达式值是非类型化常量，则声明的常量仍然是非类型化的，常量标识符表示常量值。例如，如果表达式是浮点文字，则常量标识符表示浮点常量，即使该文字的小数部分为零。

```
const Pi float64 = 3.14159265358979323846
const zero = 0.0         // untyped floating-point constant
const (
    size int64 = 1024
    eof        = -1  // untyped integer constant
)
const a, b, c = 3, 4, "foo"  // a = 3, b = 4, c = "foo", untyped integer and string constants
const u, v float32 = 0, 3    // u = 0.0, v = 3.0
```

Within a parenthesized `const` declaration list the expression list may be omitted from any but the first ConstSpec. Such an empty list is equivalent to the textual substitution of the first preceding non-empty expression list and its type if any. Omitting the list of expressions is therefore equivalent to repeating the previous list. The number of identifiers must be equal to the number of expressions in the previous list. Together with the `[iota` constant generator](http://docscn.studygolang.com/ref/spec#Iota) this mechanism permits light-weight declaration of sequential values:

在带括号的 const 声明列表中，除了第一个 ConstSpec 之外，表达式列表可以省略。这样一个空列表等价于前面第一个非空表达式列表的文本替换，如果有的话，还等价于它的类型。因此，省略表达式列表等同于重复前面的列表。标识符的数目必须等于前一个列表中的表达式的数目。该机制与 iota 常数生成器一起，允许轻量级声明顺序值:

```
const (
    Sunday = iota
    Monday
    Tuesday
    Wednesday
    Thursday
    Friday
    Partyday
    numberOfDays  // this constant is not exported
)
```

### Iota 女名女子名

Within a [constant declaration](http://docscn.studygolang.com/ref/spec#Constant_declarations), the predeclared identifier `iota` represents successive untyped integer [constants](http://docscn.studygolang.com/ref/spec#Constants). Its value is the index of the respective [ConstSpec](http://docscn.studygolang.com/ref/spec#ConstSpec) in that constant declaration, starting at zero. It can be used to construct a set of related constants:

在一个常量声明中，预声明的标识符 iota 表示连续的非类型整数常量。它的值是该常量声明中各个 constanspec 的索引，从零开始。它可以用来构造一组相关的常量:

```
const (
    c0 = iota  // c0 == 0
    c1 = iota  // c1 == 1
    c2 = iota  // c2 == 2
)

const (
    a = 1 << iota  // a == 1  (iota == 0)
    b = 1 << iota  // b == 2  (iota == 1)
    c = 3          // c == 3  (iota == 2, unused)
    d = 1 << iota  // d == 8  (iota == 3)
)

const (
    u         = iota * 42  // u == 0     (untyped integer constant)
    v float64 = iota * 42  // v == 42.0  (float64 constant)
    w         = iota * 42  // w == 84    (untyped integer constant)
)

const x = iota  // x == 0
const y = iota  // y == 0
```

By definition, multiple uses of `iota` in the same ConstSpec all have the same value:

根据定义，在相同的 constanspec 中多次使用 iota 都具有相同的值:

```
const (
    bit0, mask0 = 1 << iota, 1<<iota - 1  // bit0 == 1, mask0 == 0  (iota == 0)
    bit1, mask1                           // bit1 == 2, mask1 == 1  (iota == 1)
    _, _                                  //                        (iota == 2, unused)
    bit3, mask3                           // bit3 == 8, mask3 == 7  (iota == 3)
)
```

This last example exploits the [implicit repetition](http://docscn.studygolang.com/ref/spec#Constant_declarations) of the last non-empty expression list.

最后一个示例利用了最后一个非空表达式列表的隐式重复。

### Type declarations 类型声明

A type declaration binds an identifier, the *type name*, to a [type](http://docscn.studygolang.com/ref/spec#Types). Type declarations come in two forms: alias declarations and type definitions.

类型声明将标识符(类型名称)绑定到类型。类型声明有两种形式: 别名声明和类型定义。

```
TypeDecl = "type" ( TypeSpec | "(" { TypeSpec ";" } ")" ) .
TypeSpec = AliasDecl | TypeDef .
```

### Alias declarations

### 别名声明

An alias declaration binds an identifier to the given type.

别名声明将标识符绑定到给定的类型。

```
AliasDecl = identifier "=" Type .
```

Within the [scope](http://docscn.studygolang.com/ref/spec#Declarations_and_scope) of the identifier, it serves as an *alias* for the type.

在标识符的范围内，它充当类型的别名。

```
type (
    nodeList = []*Node  // nodeList and []*Node are identical types
    Polar    = polar    // Polar and polar denote identical types
)
```

### Type definitions

### 类型定义

A type definition creates a new, distinct type with the same [underlying type](http://docscn.studygolang.com/ref/spec#Types) and operations as the given type, and binds an identifier to it.

类型定义创建具有与给定类型相同的基础类型和操作的新的不同类型，并将标识符绑定到该类型。

```
TypeDef = identifier Type .
```

The new type is called a *defined type*. It is [different](http://docscn.studygolang.com/ref/spec#Type_identity) from any other type, including the type it is created from.

新类型称为已定义类型。它不同于任何其他类型，包括它所创建的类型。

```
type (
    Point struct{ x, y float64 }  // Point and struct{ x, y float64 } are different types
    polar Point                   // polar and Point denote different types
)

type TreeNode struct {
    left, right *TreeNode
    value *Comparable
}

type Block interface {
    BlockSize() int
    Encrypt(src, dst []byte)
    Decrypt(src, dst []byte)
}
```

A defined type may have [methods](http://docscn.studygolang.com/ref/spec#Method_declarations) associated with it. It does not inherit any methods bound to the given type, but the [method set](http://docscn.studygolang.com/ref/spec#Method_sets) of an interface type or of elements of a composite type remains unchanged:

定义的类型可能具有与其关联的方法。它不继承任何绑定到给定类型的方法，但接口类型或复合类型元素的方法集保持不变:

```
// A Mutex is a data type with two methods, Lock and Unlock.
type Mutex struct         { /* Mutex fields */ }
func (m *Mutex) Lock()    { /* Lock implementation */ }
func (m *Mutex) Unlock()  { /* Unlock implementation */ }

// NewMutex has the same composition as Mutex but its method set is empty.
type NewMutex Mutex

// The method set of PtrMutex's underlying type *Mutex remains unchanged,
// but the method set of PtrMutex is empty.
type PtrMutex *Mutex

// The method set of *PrintableMutex contains the methods
// Lock and Unlock bound to its embedded field Mutex.
type PrintableMutex struct {
    Mutex
}

// MyBlock is an interface type that has the same method set as Block.
type MyBlock Block
```

Type definitions may be used to define different boolean, numeric, or string types and associate methods with them:

类型定义可用于定义不同的布尔类型、数值类型或字符串类型，并将方法与它们关联:

```
type TimeZone int

const (
    EST TimeZone = -(5 + iota)
    CST
    MST
    PST
)

func (tz TimeZone) String() string {
    return fmt.Sprintf("GMT%+dh", tz)
}
```

### Variable declarations 变量声明

A variable declaration creates one or more [variables](http://docscn.studygolang.com/ref/spec#Variables), binds corresponding identifiers to them, and gives each a type and an initial value.

变量声明创建一个或多个变量，将相应的标识符绑定到这些变量，并为每个变量提供一个类型和初始值。

```
VarDecl     = "var" ( VarSpec | "(" { VarSpec ";" } ")" ) .
VarSpec     = IdentifierList ( Type [ "=" ExpressionList ] | "=" ExpressionList ) .
var i int
var U, V, W float64
var k = 0
var x, y float32 = -1, -2
var (
    i       int
    u, v, s = 2.0, 3.0, "bar"
)
var re, im = complexSqrt(-1)
var _, found = entries[name]  // map lookup; only interested in "found"
```

If a list of expressions is given, the variables are initialized with the expressions following the rules for [assignments](http://docscn.studygolang.com/ref/spec#Assignments). Otherwise, each variable is initialized to its [zero value](http://docscn.studygolang.com/ref/spec#The_zero_value).

如果给定了表达式列表，则按照赋值规则使用表达式初始化变量。否则，将每个变量初始化为其零值。

If a type is present, each variable is given that type. Otherwise, each variable is given the type of the corresponding initialization value in the assignment. If that value is an untyped constant, it is first implicitly [converted](http://docscn.studygolang.com/ref/spec#Conversions) to its [default type](http://docscn.studygolang.com/ref/spec#Constants); if it is an untyped boolean value, it is first implicitly converted to type `bool`. The predeclared value `nil` cannot be used to initialize a variable with no explicit type.

如果存在类型，则为每个变量提供该类型。否则，每个变量都会在赋值中给出相应初始化值的类型。如果该值是非类型化常量，则首先将其隐式转换为默认类型; 如果该值是非类型化布尔值，则首先将其隐式转换为 bool 类型。预声明的值 nil 不能用于初始化没有显式类型的变量。

```
var d = math.Sin(0.5)  // d is float64
var i = 42             // i is int
var t, ok = x.(T)      // t is T, ok is bool
var n = nil            // illegal
```

Implementation restriction: A compiler may make it illegal to declare a variable inside a [function body](http://docscn.studygolang.com/ref/spec#Function_declarations) if the variable is never used.

实现限制: 如果一个变量从未被使用，编译器可能会使在函数体中声明该变量是非法的。

### Short variable declarations 短变量声明

A *short variable declaration* uses the syntax:

一个简短的变量声明使用了以下语法:

```
ShortVarDecl = IdentifierList ":=" ExpressionList .
```

It is shorthand for a regular [variable declaration](http://docscn.studygolang.com/ref/spec#Variable_declarations) with initializer expressions but no types:

它简化了带有初始化器表达式的正则变量声明，但没有类型:

```
"var" IdentifierList = ExpressionList .
i, j := 0, 10
f := func() int { return 7 }
ch := make(chan int)
r, w, _ := os.Pipe()  // os.Pipe() returns a connected pair of Files and an error, if any
_, y, _ := coord(p)   // coord() returns three values; only interested in y coordinate
```

Unlike regular variable declarations, a short variable declaration may *redeclare* variables provided they were originally declared earlier in the same block (or the parameter lists if the block is the function body) with the same type, and at least one of the non-[blank](http://docscn.studygolang.com/ref/spec#Blank_identifier) variables is new. As a consequence, redeclaration can only appear in a multi-variable short declaration. Redeclaration does not introduce a new variable; it just assigns a new value to the original.

与常规变量声明不同，短变量声明可以重新声明变量，前提是它们最初是在同一块中声明的(或者如果块是函数体，参数列表) ，并且具有相同的类型，而且至少有一个非空变量是新的。因此，重新声明只能出现在多变量短声明中。重新声明不会引入新的变量; 它只是将一个新值赋给原始变量。

```
field1, offset := nextField(str, 0)
field2, offset := nextField(str, offset)  // redeclares offset
a, a := 1, 2                              // illegal: double declaration of a or no new variable if a was declared elsewhere
```

Short variable declarations may appear only inside functions. In some contexts such as the initializers for [“if”](http://docscn.studygolang.com/ref/spec#If_statements), [“for”](http://docscn.studygolang.com/ref/spec#For_statements), or [“switch”](http://docscn.studygolang.com/ref/spec#Switch_statements) statements, they can be used to declare local temporary variables.

短变量声明可能只出现在函数内部。在某些上下文中，例如“ if”、“ for”或“ switch”语句的初始化器，可以使用它们声明局部临时变量。

### Function declarations 函数声明

A function declaration binds an identifier, the *function name*, to a function.

函数声明将一个标识符(函数名)绑定到一个函数。

```
FunctionDecl = "func" FunctionName Signature [ FunctionBody ] .
FunctionName = identifier .
FunctionBody = Block .
```

If the function’s [signature](http://docscn.studygolang.com/ref/spec#Function_types) declares result parameters, the function body’s statement list must end in a [terminating statement](http://docscn.studygolang.com/ref/spec#Terminating_statements).

如果函数的签名声明结果参数，函数体的语句列表必须以终止语句结束。

```
func IndexRune(s string, r rune) int {
    for i, c := range s {
        if c == r {
            return i
        }
    }
    // invalid: missing return statement
}
```

A function declaration may omit the body. Such a declaration provides the signature for a function implemented outside Go, such as an assembly routine.

函数声明可能省略正文。这样的声明为在围棋之外实现的函数(如程序集例程)提供签名。

```
func min(x int, y int) int {
    if x < y {
        return x
    }
    return y
}

func flushICache(begin, end uintptr)  // implemented externally
```

### Method declarations 方法声明

A method is a [function](http://docscn.studygolang.com/ref/spec#Function_declarations) with a *receiver*. A method declaration binds an identifier, the *method name*, to a method, and associates the method with the receiver’s *base type*.

方法是带有接收器的函数。方法声明将标识符(方法名)绑定到方法，并将该方法与接收方的基类型关联。

```
MethodDecl = "func" Receiver MethodName Signature [ FunctionBody ] .
Receiver   = Parameters .
```

The receiver is specified via an extra parameter section preceding the method name. That parameter section must declare a single non-variadic parameter, the receiver. Its type must be a [defined](http://docscn.studygolang.com/ref/spec#Type_definitions) type `T` or a pointer to a defined type `T`. `T` is called the receiver *base type*. A receiver base type cannot be a pointer or interface type and it must be defined in the same package as the method. The method is said to be *bound* to its receiver base type and the method name is visible only within [selectors](http://docscn.studygolang.com/ref/spec#Selectors) for type `T` or `*T`.

---
icon: page
title: Go技巧
category:
  - Golang相关
tag:
  - Golang
---
# Go技巧

## go 参考资料

- [go 实效编程](https://go-zh.org/doc/effective_go.html)
- [go by example](https://gobyexample-cn.github.io/)

## 2^n

```go
0x1pn
example:
0x1p32
```

## 最大的int

```
int(^uint(0)>>1)
math.MaxInt64
```

## 判断变量类型

### 方法一

```
package main

import (
 "fmt"
)

func main() {
    v1 := "abc"
    for i, c := range v1 {
        //%T 必须是Printf
        fmt.Printf("type:%T ", c)
        fmt.Printf("type:%T\n", v1[i])
    }
}
```

output:

> type:int32 type:uint8 type:int32 type:uint8 type:int32 type:uint8
>

### 方法二

```
package main

import (
 "fmt"
 "reflect"
)

func main() {

    v1 := "abc"
    for i, c := range v1 {
        //reflect
        fmt.Println("type:", reflect.TypeOf(c) ,reflect.TypeOf(v1[i]))
    }
}
```

output:

> type: int32 uint8 type: int32 uint8 type: int32 uint8
>

## string 和 int 类型互转

- string 转成 int：

> int, err := strconv.Atoi(string)
>

- string 转成 int64：

> int64, err := strconv.ParseInt(string, 10, 64)
>

- int 转成 string：

> string := strconv.Itoa(int)
>

- int64 转成 string：

> string := strconv.FormatInt(int64,10)
>

## uintptr

uintptr是一个整数类型，其大小足以容纳任何指针。

## 数组和切片创建的区别

```go
a:=[5]int{1,2,3,4}//数组
b:=[]int{1,2,3,4}//slice
b=nil//空切片，切片的零值是 nil
b=a[1:2]//底层数组是a，且只能向右扩展，无法访问左边的a[0]

//初始化多维切片，多维切片的元素类型是切片
twoD := make([][]int,3)
for i := 0; i < len(twoD);i++ {
   for j := 0; j < 2; j++ {
      twoD[i] = append(twoD[i], i*j)
   }
}
```

定义数组相比，切片字面量只是没有指定元素数量。如果你在[]中填入数字，你将得到的是数组。

## make

make 只能创建 slice, map, channel

make slice 至少包含两个参数

## 从一个切片获取一个新的切片

使用copy()函数，copy（a,b）.

使用copy()时你应小心翼翼，因为内建函数copy(dst,src)会以len(dst)和len(src)中的最小值为复制长度。

```go
a1 := []int{-10, 1, 2, 3, 4, 5}
a2 := []int{1}
copy(a1, a2)
fmt.Println(a1)
copy(a2, a1[2:])
fmt.Println(a2)
```

```bash
[1 1 2 3 4 5]
[2]
```

## sort.Slice() 自定义排序

```go
sort.Slice(slice1,func(i,j int)bool{
    return slice1[i]<slice1[j]
})
```

## map 第二个值消除键不存在和键为0的歧义

```go
//a:=map[string]int{}
a:=make(map[string]int)
a["aa"]=0
v,is:=a["aa"]//v=0,is=true
```

## const 常量一次定义多个

```go
const(
A1=10
A2="a2"
)
```

## 定义类型

```go
type Digit int//Digit类型
```

## 常量生成器 iota

```go
type Digit int
type Power2 int

const   (
   Zero Digit = iota
   One
   Two
   Three
   Four
)
fmt.Println(One) //1
fmt.Println(Two) //2
)

//_ 代表跳过本次常量生命
const (
      p2_0 Power2 = 1 << iota
      _
      p2_2
      _
      p2_4
      _
      p2_6
   )
   fmt.Println("2^0:", p2_0) //1
   fmt.Println("2^2:", p2_2) //4
   fmt.Println("2^4:", p2_4) //16
   fmt.Println("2^6:", p2_6) //64
}

```

## 指针

使用指针时，*可以获取指针的值，此操作成为指针的解引用，*也叫取值操作符；&可以获取非指针变量的地址，叫做取地址操作符。

```go
i:=-10
var j *int
j=&i

pi:=&i

pi //地址
*pi //-10

j//地址
*j//-10
```

## 时间与日期的处理技巧

Go自带一个处理时间与日期的神器 time 包

```go
package main
import (
   "fmt"
   "time"
)
func main() {
   fmt.Println("Epoch Time:", time.Now().Unix())//Epoch Time: 1616938369
   t := time.Now()
   fmt.Println(t,t.Format(time.RFC3339))//2021-03-28 21:32:49.751457355 +0800 CST m=+0.000134097 2021-03-28T21:32:49+08:00
   fmt.Println(t.Weekday(), t.Day(), t.Month(), t.Year())//Sunday 28 March 2021
   time.Sleep(time.Second)
   t1 := time.Now()
   fmt.Println("Time difference:", t1.Sub(t))//Time difference: 1.000222509s
   formatT := t.Format("01 January 2006")
   fmt.Println(formatT)//03 March 2021
   loc, _ := time.LoadLocation("Europe/Paris")
   LondonTime := t.In(loc)
   fmt.Println("Paris:",LondonTime)//Paris: 2021-03-28 15:32:49.751457355 +0200 CEST
}
```

time.Now().Unix()返回UNIX时间（UNIX时间是计算了从00:00:00 UTC，1970年1月1日以来的秒数）。Format()能够将time类型的变量转换成其他格式，例如RFC3339格式。

time.Sleep()是一种最简单的产生延时的函数。time.Second意思是1秒，如果你想产生10s的延迟，只需将time.Second*10即可。对于time.Nanosecond、time.Microsecond、time.minute、time.Hour是同样的道理。使用time包能够定义的最小时间间隔是1纳秒。

time.Sub() 函数能够得到两个时间之间的时间差

time.Format定义了一个新的日期格式，并且得到指定时区的时间

## 解析时间

time包提供了time.parse()函数帮助你解析时间与日期字符串，将其转换成time类型

time.Parse()接收两个参数，第一个参数是你期望得到的时间格式，第二个参数是你要解析的时间字符串

第一个参数是Go与时间解析相关的一系列常量。这些与时间处理相关的常量分别是，15代表解析小时，04代表解析分钟，05解析秒，同时你可以使用PM将字符串中的字母转为大写，pm转为小写。

```go
package main
import (
   "fmt"
   "os"
   "path/filepath"
   "time"
)
func main() {
   var myTime string
   if len(os.Args) != 2 {
      fmt.Printf("Usage: %s string\n",
         filepath.Base(os.Args[0]))//Usage: gcs string
      os.Exit(0)
   }
   myTime = os.Args[1]
   d,err := time.Parse("15:04",myTime)
   if err == nil {
      fmt.Println("Full",d)//Full 0000-01-01 21:42:00 +0000 UTC
      fmt.Println("Time", d.Hour(), d.Minute())//Time 21 42
   } else {
      fmt.Println(err)
   }
}
```

`run parseTime.go 21:42`

Go解析日期的常量是：Jan用来解析月份（英文月份简写），2006用来解析年，02用来解析天，Mon用来解析周几（如果是Monday，那就是周几的英文全称），同样如果你使用January而不是Jan，你将会得到月份的英文全称而不是三个字母的简写。

```go
package main
import (
   "fmt"
   "os"
   "path/filepath"
   "time"
)
func main() {
   var myDate string
   if len(os.Args) != 2 {
      fmt.Printf("Usage: %s date\n",
         filepath.Base(os.Args[0]))
      os.Exit(0)
   }
   myDate = os.Args[1]
   d,err := time.Parse("02 January 2006",myDate)
   if err == nil {
      fmt.Println("Full",d) //Full 2020-01-21 00:00:00 +0000 UTC
      fmt.Println("Time", d.Day(), d.Month(), d.Year())//Time 21 January
   } else {
      fmt.Println(err)
   }
}
```

`run parseDate.go “21 January 2020”`

## 格式化时间与日期

处理既有时间又有日期的字符串，这种格式的时间在web服务器中最常见到，例如Apache，Nginx等

```go
package main
import (
   "fmt"
   "regexp"
   "time"
)
func main() {
   logs := []string{"127.0.0.1 - - [16/Nov/2017:10:49:46 +0200] 325504",
      "127.0.0.1 - - [16/Nov/2017:10:16:41 +0200] \"GET /CVEN HTTP/1.1\" 200 12531 \"-\" \"Mozilla/5.0 AppleWebKit/537.36",
      "127.0.0.1 200 9412 - - [12/Nov/2017:06:26:05 +0200] \"GET \"http://www.mtsoukalos.eu/taxonomy/term/47\" 1507",
      "[12/Nov/2017:16:27:21 +0300]",
      "[12/Nov/2017:20:88:21 +0200]",
      "[12/Nov/2017:20:21 +0200]",
   }
    for _, logEntry := range logs {
        r := regexp.MustCompile(`.*\[(\d\d\/\w+/\d\d\d\d:\d\d:\d\d:\d\d.*)\].*`)
        if r.MatchString(logEntry) {
            match := r.FindStringSubmatch(logEntry)
            dt, err := time.Parse("02/Jan/2006:15:04:05 -0700", match[1])
            if err == nil {
                newFormat := dt.Format(time.RFC850)
                fmt.Println(newFormat)
            } else {
                fmt.Println("Not a valid date time format!")
            }
        } else {
            fmt.Println("Not a match!")
        }
    }
}
```

```bash
Thursday, 16-Nov-17 10:49:46 +0200
Thursday, 16-Nov-17 10:16:41 +0200
Sunday, 12-Nov-17 06:26:05 +0200
Sunday, 12-Nov-17 16:27:21 +0300
Not a valid date time format!
Not a match!
```

## 元组

```go
package main
import "fmt"
func retThree(x int) (int, int, int) {
      return 2 * x, x*x,-x
}
func main() {
   fmt.Println(retThree(10))//20 100 -10
   n1, n2, n3 := retThree(20)
   fmt.Println(n1,n2,n3) //40 400 -20
   n1, n2 = n2, n1
   fmt.Println(n1, n2, n3)//400 40 -20
   x1, x2, x3 := n1*2,n1*n1, -n1
   fmt.Println(x1,x2,x3)//800 160000 -400
}
```

依靠这种元组操作，我们无需借助temp变量就可以实现两个数字的交换。

## 字符串处理

```go
package main

import (
    "fmt"
)

func main() {
    //每一个\xAB都代表sLiteral的一个字符，所以调用len()就会得到sLiteral的字符数量。%x会得到\xAB中的AB部分。
    const sLiteral = "\x99\x42\x32\x55\x50\x35\x23\x50\x29\x9c"
    fmt.Println(sLiteral)
    fmt.Printf("x: %x\n", sLiteral)
    fmt.Printf("sLiteral length: %d\n", len(sLiteral))

    //如代码所示，你可以像操作一个切片那样去操作字符串。使用%q作为字符串格式化参数，可以安全地打印出带双引号的字符串，%+q可以保证输出是ASCII格式。最后，% x（注意%与x之间的空格）将会在输出的字符之间加上空格，如果你想打印字符串格式，就要使用%s
    for i := 0; i < len(sLiteral); i++ {
        fmt.Printf("%x ", sLiteral[i])
    }
    fmt.Println()
    fmt.Printf("q: %q\n", sLiteral)
    fmt.Printf("+q: %+q\n", sLiteral)
    fmt.Printf(" x: % x\n", sLiteral)
    fmt.Printf("s: As a string: %s\n", sLiteral)

    //在这里定义了字符串s2，内容是3个unicode字符。使用%#U可以打印出U+0058格式的字符，range关键字能够迭代包含Unicode字符的字符串，这样就可以逐个处理Unicode字符。len(s2)的输出可能会令你困惑，解释一下，s2包含的是Unicode字符，Unicode字符的字节数量是大于该字符串中的元素数量的，而len()函数计算的是字节数量，所以len(s2)的值是7而不是3
    s2 := "€£³"
    for x, y := range s2 {
        fmt.Printf("%x starts at byte position %d\n", int32(y), x)
    }
    fmt.Printf("s2 length: %d\n", len(s2))

    //
    const s3 = "ab12AB"
    fmt.Println("s4:", s3)
    fmt.Printf("x: % x\n", s3)
    fmt.Printf("s3 length: %d\n", len(s3))
    for i := 0; i < len(s3); i++ {
        fmt.Printf("%x ", s3[i])
    }
    fmt.Println()
}
```

```bash
�B2UP5#P)�
x: 9942325550352350299c
sLiteral length: 10
99 42 32 55 50 35 23 50 29 9c
q: "\x99B2UP5#P)\x9c"
+q: "\x99B2UP5#P)\x9c"
 x: 99 42 32 55 50 35 23 50 29 9c
s: As a string: �B2UP5#P)�
20ac starts at byte position 0
a3 starts at byte position 3
b3 starts at byte position 5
s2 length: 7
s3: ab12AB
x: 61 62 31 32 41 42
s3 length: 6
61 62 31 32 41 42
```

## 关于string rune 和 byte

- string 是 []rune 数组
- 以 %s 格式可以以字符串形式输出字节数组
- rune 是 int32
- range遍历 string 得到的是rune
- 对于不止一个字节的 rune 可以 string(rune) 转为字符串,然后[]byte(string)转为字节数组，rune不可以直接转为[]byte, rune 可以直接转为 byte ，但是会损失高位

## 占位符一览

%v 默认格式的值，打印结构时，加号标志（%+v）会添加字段名 %#v 值的Go语法表示 %T 值**类型**的Go语法表示 %% 百分号标记；不代表值

### 布尔值

%t 这个词是真是假

### 整数

%b 2进制 %c 由相应的Unicode码位表示的字符 %d 10进制 %o 8进制 %O 带O前缀的8进制 %q Go语法安全地转义了一个单引号字符。 %x 16进制，小写字母表示a-f %X 16进制，大写字母表示A-F %U Unicode格式：U+1234；如“U+%04X”

### 浮点数

%b 指数为二次幂的无小数科学记数法，以…的方式strconv.FormatFloat格式使用“b”格式，e.g.-123456p-78 %e 科学记数法，例如-1.234456e+78 %E 科学记数法，例如-1.234456E+78 %f 小数点但没有指数，例如123.456 %F %f的同义词 %g %e表示大指数，否则为%f。精度讨论如下。 %G %E表示大指数，否则为%F %x 十六进制表示法（二指数的十进制幂），例如-0x1.23abcp+20 %X 大写十六进制表示法，例如-0X1.23ABCP+20

### string and slice of bytes

%s 字符串或片的未解释字节 %q 用Go语法安全地转义了一个双引号字符串 %x 16进制，小写，每个字节两个字符 %X 16进制，大写，每个字节两个字符

### slice

%p 以16进制表示法表示的第0个元素的地址，前导为0x

### pointer

%p 16进制表示法，带前导0x %b、%d、%o、%x和%X 也适用于指针，将值格式化为整数。

### %v 的默认格式

布尔： %t int、int 8等： %d uint、uint8等： %d,如果用%#v打印，则为、%#x float32、complex64等：%g 字符串： %s chan： %p 指针： %p

## 字符串处理的函数（strings包）

```go
package main

import (
    "fmt"
    s "strings" //别名
    "unicode"
)

var f = fmt.Printf

func main() {
    upper := s.ToUpper("Hello there!")
    f("To Upper: %s\n", upper)//To Upper: HELLO THERE!
    f("To Lower: %s\n", s.ToLower("Hello THERE"))// To Lower: hello there

    f("%s\n", s.Title("tHis wiLL be A title!"))// THis WiLL Be A Title!

    //strings.EqualFold()函数能够判断两个字符串是否相同
    f("EqualFold: %v\n", s.EqualFold("Mihalis", "MIHAlis"))// EqualFold: true
    f("EqualFold: %v\n", s.EqualFold("Mihalis", "MIHAli"))// EqualFold: false

    //strings.HasPrefix()函数判断字符串是否是以某字符串开头
    f("Prefix: %v\n", s.HasPrefix("Mihalis", "Mi"))// Prefix: true
    f("Prefix: %v\n", s.HasPrefix("Mihalis", "mi"))// Prefix: false

    //strings.HasSuffix()判断字符串是否以某字符串结尾。
    f("Suffix: %v\n", s.HasSuffix("Mihalis", "is"))// Suffix: true
    f("Suffix: %v\n", s.HasSuffix("Mihalis", "IS"))// Suffix: false

    f("Index: %v\n", s.Index("Mihalis", "ha"))// Index: 2
    f("Index: %v\n", s.Index("Mihalis", "Ha"))// Index: -1

    f("Count: %v\n", s.Count("Mihalis", "i"))// Count: 2
    f("Count: %v\n", s.Count("Mihalis", "I"))// Count: 0

    f("Repeat: %s\n", s.Repeat("ab", 5))// Repeat: ababababab

    //strings.TrimSpace去掉前后空格
    //strings.TrimLeft把cutset里面的字符串拆分成字符，然后从左往右，逐个比对字符串中的每个字符，直到遇到没有在cutset中出现的字符。
    //strings.TrimRight其实就是把cutset里面的字符串拆分成字符，然后从右往左，逐个比对字符串中的每个字符，直到遇到没有在cutset中出现的字符。
    //strings.TrimSuffix返回不带尾部后缀字符串的trims,如果s不以后缀结尾，则返回s

    f("TrimSpace: %s\n", s.TrimSpace(" abcde"))
    // TrimSpace: abcde
    f("TrimLeft: %s", s.TrimLeft("abcde", "acde"))
    // TrimLeft: bcde
    f("TrimRight: %s\n", s.TrimRight("abcde", "acde"))
    // TrimRight: ab
    f("TrimSuffix: %s\n", s.TrimSuffix("abcde", "de"))
    // TrimTrimSuffix: abc

    //strings.Compare()函数用于比较两个字符串是否相等，相等返回true，否则返回1或者-1
    f("Compare: %v\n", s.Compare("Mihalis", "MIHALIS"))// Compare: 1
    f("Compare: %v\n", s.Compare("Mihalis", "Mihalis"))// Compare: 0
    f("Compare: %v\n", s.Compare("MIHALIS", "MIHalis"))// Compare: -1

    //strings.Fields()按照空格将字符串分割
    f("Fields: %v\n", s.Fields("This is a string!"))// Fields: [This is a string!]
    f("Fields: %v\n", s.Fields("Thisis\na\tstring!"))// Fields: [Thisis a string!]

    //strings.Split()能够以特定字符分割字符串，并返回一个字符串切片。
    f("%s\n", s.Split("abcd efg", ""))// [a b c d   e f g]

    //strings.Replace()函数需要4个参数，第一个是你要处理的字符串，第二个是你准备替换的字符，第三个是你要用该字符去替换，第四个参数是你要替换的数量，如果是-1就意味着你会替换所有要替换的字符。
    f("%s\n", s.Replace("abcd efg", "", "_", -1))// _a_b_c_d_ _e_f_g_
    f("%s\n", s.Replace("abcd efg", "", "_", 4))// _a_b_c_d efg
    f("%s\n", s.Replace("abcd efg", "", "_", 2))// _a_bcd efg

    lines := []string{"Line 1", "Line 2", "Line 3"}
    f("Join: %s\n", s.Join(lines, "+++"))// Join: Line 1+++Line 2+++Line 3
    //strings.SplitAfter()函数基于指定分隔符将字符串分割。
    f("SplitAfter: %s\n", s.SplitAfter("123++432++", "++"))// SplitAfter: [123++ 432++ ]

    //strings.TrimFunc()函数可按照自定义函数获取你感兴趣的内容；
    trimFunction := func(c rune) bool {
        return !unicode.IsLetter(c)
    }
    f("TrimFunc: %s\n", s.TrimFunc("123 abc ABC \t .", trimFunction))// TrimFunc: abc ABC
}
```

## make 和 new 的区别

new和make最大的区别就是：new返回的是空的内存地址，即没有做初始化。另外，make仅可以用来创建映射，切片和通道，而且并不是返回指针。 下面的代码将会创建一个指向切片的指针，并且值为nil: `sP := new([]aStructure)`

## 类型断言

类型断言表示方法 x.(T),其中x是接口类型的变量，T是要判断的类型。

类型断言做两件事：第一件事是检查接口类型变量是否是特定的类型，这样使用时，类型断言返回两个值：基础值和bool值。基础值是您可能想要使用的值，布尔值告诉您类型断言是否成功！

类型断言所做的第二件事是允许您使用存储在接口中的具体值或将其分配给新变量。这意味着如果接口中有一个int变量，可以使用类型断言获取该值。

```go
package main
import (
    "fmt"
)
func main() {
    //首先，声明myInt变量，该变量具有动态类型int和值123。然后使用类型断言测试两次myInt变量的接口类型 — 分别是int类型和float64类型。
    var myInt interface{} = 123
    k, ok := myInt.(int)
    if ok {
        fmt.Println("Success:", k)//Success: 123
    }

    //由于myInt变量不包含float64值，因此类型断言myInt.(float64)执行时，如果没有恰当的处理，则会引发错误。因此在这种情况下，使用ok变量来判断类型断言是否成功，将使程序免于panic异常。
    v, ok := myInt.(float64)
    if ok {
        fmt.Println(v)
    } else {
        fmt.Println("Failed without panicking!")//Failed without panicking!
    }

    //第一个类型断言是成功的，因此不会有任何问题。但是，让我们进一步回顾一下这个特定类型的断言。变量i的类型为int，其值为123，存储在myInt中。因此由于int满足myInt接口，并且myInt接口不需要实现接口函数，所以myInt.(int)的值是一个int值。
    i := myInt.(int)
    fmt.Println("No cheking:", i)//No cheking: 123

    //第二个类型断言myInt.(bool)将触发panic异常，因为myInt的基础值不是布尔值（bool）。
    j := myInt.(bool)
//panic: interface conversion: interface {} is int, not bool
//goroutine 1 [running]:
//main.main()
//      /Users/mtsouk/Desktop/masterGo/ch/ch7/code/assertion.go:25 +0x1d9
//exit status 2

    fmt.Println(j)
}
```

## Go 里的数据结构(TODO)

### 图

### 哈希表

```go
package main

import (
    "fmt"
)

const SIZE = 15

type Node struct {
    Value int
    Next  *Node
}
type HashTable struct {
    Table map[int]*Node
    Size  int
}

func hashFunction(i, size int) int {
    return (i % size)
}
func insert(hash *HashTable, value int) int {
    index := hashFunction(value, hash.Size)
    element := Node{Value: value, Next: hash.Table[index]}
    hash.Table[index] = &element
    return index
}
func traverse(hash *HashTable) {
    for k := range hash.Table {
        if hash.Table[k] != nil {
            t := hash.Table[k]
            for t != nil {
                fmt.Printf("%d -> ", t.Value)
                t = t.Next
            }
        }
        fmt.Println()
    }
}
func main() {
    table := make(map[int]*Node, SIZE)
    hash := &HashTable{Table: table, Size: SIZE}
    fmt.Println("Numbder of spaces:", hash.Size)
    for i := 0; i < 120; i++ {
        insert(hash, i)
    }
    traverse(hash)
}
```

### 链表

### 双向链表

### 队列

### 栈

## [flag 包](http://docscn.studygolang.com/pkg/flag/)

Value接口用于将动态的值保存在一个 flag 里（默认值被表示为一个字符串）。

如果 Value 接口具有 IsBoolFlag() 方法，且返回真，命令行解析会将 -name 等价于 -name=true，而不是使用下一个命令行参数

对于每个存在的 flag，Set 会按顺序调用一次。 flag 包可以使用零值接收器(例如 nil 指针)调用 String 方法。

```go
//funWithFlag.go中使用的flag.Var()函数创建一个满足flag.Value接口的任意类型的标识，flag.Value接口定义如下：
type Value interface {
    String() string
    Set(string) error
}
```

```go
package main

import (
    "flag"
    "fmt"
    "strings"
)
type NamesFlag struct {
    Names []string
}

func (s *NamesFlag) GetNames() []string {
    return s.Names
}
func (s *NamesFlag) String() string {
    return fmt.Sprint(s.Names)
}

//Set() 方法确保相关命令行选项没有被设置。之后，获取输入并使用 strings.Split() 函数来分隔参数。最后，参数被保存在 NamesFlag 结构的 Names 字段
func (s *NamesFlag) Set(v string) error {
    if len(s.Names) > 0 {
        return fmt.Errorf("Cannot use names flag more than once!")
    }
    names := strings.Split(v, ",")
    for _, item := range names {
        s.Names = append(s.Names, item)
    }
    return nil
}
func main() {
    var manyNames NamesFlag
    minusK := flag.Int("k:", 0, "An int")
    minusO := flag.String("o", "Mihalis", "The name")
    flag.Var(&manyNames, "names", "Comma-separated list")
    flag.Parse()
    fmt.Println("-k:", *minusK)
    fmt.Println("-o:", *minusO)
    for i, item := range manyNames.GetNames() {
        fmt.Println(i, item)
    }
    fmt.Println("Remaing command-line arugments:")
    for index, val := range flag.Args() {
        fmt.Println(index, ":", val)
    }
}
```

```bash
go run gcs.go -names=Mihalis,Jim,Athina -o=str -k: 12 one two
-k: 12
-o: str
0 Mihalis
1 Jim
2 Athina
Remaing command-line arugments:
0 : one
1 : two
```

## [bufio 包](http://docscn.studygolang.com/pkg/bufio/)

读取文本文件可以用三种方式：逐行、逐词、逐字符读取。逐行读取最简单，逐词则相对较难。

bufio 包是关于缓冲输入输出的

下面代码是关于逐词读取的，其他两种类似

```go
package main

import (
    "bufio"
    "flag"
    "fmt"
    "io"
    "os"
    "regexp"
)

func lineByLine(file string) error {
    var err error
    f, err := os.Open(file)//读取文件
    if err != nil {
        return err
    }
    defer f.Close()//关闭文件
    r := bufio.NewReader(f)//创建一个读实例
    for {
        //调用bufio.ReadString()逐行读取文件。行分隔符通过bufio.ReadString()参数指定，它指示bufio.ReadString()一直读取，直到碰到行分隔符为止。
        //每个读取行里包含了换行符，所以输出行时应使用fmt.Print()
        line, err := r.ReadString('\n')
        //遇到结束符停止
        if err == io.EOF {
            break
        } else if err != nil {
            fmt.Printf("error reading file %s", err)
            break
        }
        //正则表达式regexp.MustCompile("[^\\s]+")使用空格分割单词
        r := regexp.MustCompile("[^\\s]+")
        words := r.FindAllString(line, -1)
        for i := 0; i < len(words); i++ {
            fmt.Printf(words[i])
        }
        //逐字符读取这里需要使用string()转换为字符，因为x是rune类型
        //for _, x := range line {
        //    fmt.Println(string(x))
        //}
    }
    return nil
}
func main() {
    flag.Parse()
    if len(flag.Args()) == 0 {
        fmt.Printf("usage: byLine <file1> [<file2> ...]\n")
        return
    }
    for _, file := range flag.Args() {
        err := lineByLine(file)
        if err != nil {
            fmt.Println(err)
        }
    }
}
```

bufio 包 中buffer 中一个token的最大长度为64*1024

更多参阅 [bufio](http://docscn.studygolang.com/pkg/bufio/) 包

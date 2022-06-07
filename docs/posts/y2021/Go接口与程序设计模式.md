---
icon: page
title: Go接口与程序设计模式
date: 2021-10-06
category:
  - Golang
tag:
  - Golang
  - 接口
isOriginal: true
---

## 前言

Go的面向对象编程和Java、C++相比有些不同，在Go中可以为任何自定义的类型添加方法，而不只是类(struct)。经典OOP的四大特性是封装、抽象、继承、多态，但是Go中**没有基于类型的继承**，而是使用接口来实现扁平化、面向**组合**的设计模式。

## Go中的接口

在Go语言中，接口是一种其他类型可以实现的方法签名的集合。方法签名只包含方法名，参数和返回值，只要其他类型实现了接口中定义的方法，就相当于实现了这个接口，下为接口A定义：

```go
type A interface {
	Hello()
}
```

在实际开发中，通常使用只有一个方法的接口来定义某些行为，这些行为可以充当各个模块组件之间的“共享边界”

### 接口实践

下面通过一个例子来理解接口的作用。

通常我们会使用orm来操作数据库，假如出于某种原因，我们原本使用的是xorm要更换到gorm。

在xorm中插入一行通常是这样写的：

```go
user := User{Name: "xxx", Age: 18}
db.Insert(&User)
```

而在grom中插入一行通常是这样写的：

```go
user := User{Name: "xxx", Age: 18}
db.Create(&User)
```

如果不使用接口，一般会创建一个操作数据库的实例XormDB，并注入到实际业务的结构体中：

```go
type XormDB struct {
	db *xorm.Session
}
type T struct {
	*XormDB
}

func (t *T) InsertT() {
	t.db.Insert(t)
}
```

如果要将xorm更换到gorm，就需要重新创建一个操作数据库实例GormDB，然后将项目中所有使用了XormDB结构体替换为GormDB，然后将db操作进行修改：

```go
type GormDB struct {
	db *gorm.Session
}
type T struct {
	*GormDB
}

func (t *T) InsertT() {
	t.db.Create(t)
}
```

如果项目很大，那么这样的改动耗时耗力，而且对数据库操作逻辑的修改可能会破坏项目中一些核心流程的代码，接口可以很好的解决这个问题

```go
type CommonDB interface {
	insert(ctx context.Context, instance interface{})
}
// XormDB 实现CommonDB接口
type XormDB struct {
	db *xorm.Session
}

func (xorm *XormDB) Insert(ctx context.Context, instance ...interface{}) {
	xorm.db.Context(ctx).Insert(instance)
}

type T struct {
	db CommonDB
}

func (t *T) AddDB() {
	t.db = new(XormDB)
}

func (t *T) InsertT() {
	t.db.insert(context.Background(), t)
}
```

如果要修改成grom，只需要让GormDB实现这些接口类，而不需要修改其他的业务代码：

```go
type GormDB struct {
	db *gorm.Session
}

func (xorm *GormDB) Insert(ctx context.Context, instance ...interface{}) {
	xorm.db.Context(ctx).Create(instance)
}

func (t *T) AddDB() {
	t.db = new(GormDB)
}
```

### 接口的声明与实现

GO语言中接口有两种形式，一种是**带方法签名的接口**，一种是**空接口**。空接口和带方法签名的接口有着很大的区别。一般意义上的接口主要是指带方法签名的接口。

和其他需要显式声明接口实现类的语言不同，Go的接口实现是隐式的，只要某个类型实现了接口中的**全部方法签名**，就意味着这个类型实现了这个接口。

```go
type A interface {
	hello(name string)
	welcome()
}
// B 实现接口 A
type B struct {
}

func (b B) hello(name string) {
	fmt.Println("Hello", name)
}
func (b B) welcome() {
	fmt.Println("Welcome!")
}
func (b B) other() {
}
// C 实现接口 A
type C struct {
}

func (c C) hello(name string) {
	fmt.Println("Hello", name)
}
func (c C) welcome() {
	fmt.Println("Welcome!")
}
```

这样就可以认为B实现了A接口，即便B拥有其他方法，也不受影响。

同时，也可以有多个类型实现同一个接口。

一个接口变量可以接收任何实现了该接口的类型，例如接口A变量a可以接收类型B，也可以接收另一个实现了接口A的类型C。

我们可以称接口本身为**静态类型**，称实现了接口的类型为**接口的动态类型。**

接口的动态调用如下：

```go
	var s A
	s = B{}
	s.hello("Tom")
	s.welcome()
	s.other() // 报错，接口变量无法调用除接口方法歪的其他方法
```

**除了一个接口可以被多个类型实现外，一个类型也可以实现多个接口。**

同时，一个接口也可以是**其他**多个接口的组合。

```go
type A interface {
	CommonDB
	hello(name string)
	welcome()
}
type CommonDB interface {
	insert(ctx context.Context, instance interface{})
}
```

这时候一个类型如果要实现A，那么它也要**同时实现**CommonDB。

Go语言接口组合的设计可以让我们根据当前业务的需要而优雅、安全地添加新的接口，接口的更改仅影响实现接口的直接类型，相比较传统的类型继承的方式，可以不必在早期过度的设计类型的结构关系。

### 接口类型断言

使用语法`a.(Type)` 可以在**运行时**获取**当前**存储在接口变量中的类型，a表示接口变量，Type表示实现了该接口的动态类型。

```go
type B struct {
	name string
}

var a A
a = B{"Tom"}
t= a.(B)
fmt.Println(t)// {Tom}
```

接口变量a存储了动态类型B，t获取到了a存储的B。

如果接口变量a没有存储动态类型B（B已经实现了接口A）：

```go
type B struct {
	name string
}

var a A
t= a.(B)
fmt.Println(t)// {Tom}
```

那么程序会在**运行时**报错：`panic: interface conversion: main.A is nil, not main.B`

同时，如果类型C没有实现接口A，也会在**编译时**报错：`C does not implement A (missing hello method)`

为了避免程序在运行时报错，可以改成这样的写法：

```go
var a A
t, ok := a.(B)
fmt.Println(t, ok)// {} false
```

`ok`为`false`表示**当前接口变量a**没有存储动态类型B。

### 空接口

如果接口没有存储任何方法签名，那么这个接口就是空接口

```go
type A interface {}
```

空接口什么信息都没有提供，所有空接口可以存储结构体、字符串、整数、切片等任何类型。

```go
var a A = "Tom"
var a A = []int{1}
var a A = 1.99
```

空接口拥有强大的抽象能力，极大的增强了代码的扩展性和通用性。

例如`fmt.Println`的定义`func fmt.Println(a ...interface{}) (n int, err error)` 就是使用了空接口作为参数，这样就可以进行各种类型的输出，而不需要为每种类型都定义一个`Println` 。

那么不可缺少的就是如何获取传入空接口的类型，很容易想到的是使用类型断言来获取动态类型。

Go为空接口提供了一种获取动态类型的方法`a.(type)` ，其中a是接口变量，`type`是固定的关键字（和前面接口的不同）。这个语法和`switch`强关联，如果不再switch中使用编译器会直接报错。

```go
var a A = "Tom"
switch t := a.(type) {
case string:
	fmt.Println("string:", t) 
case int:
	fmt.Println("int:", t)
}
// string: Tom
```

### 接口比较

Go语言中的接口可以比较：

```go
var a, b interface{}
fmt.Println(a == b)// true
```

接口的比较规则：

- 如果两个接口为nil，相等。
- 如果两个接口变量拥有相同的可比较的动态类型,那么两个按照该动态类型的比较规则进行比较。如果只是拥有相同的动态类型但是不可比较，那么会在**运行时**报错。

```go
var a, b A
a = B{"Tom"}
b = B{"Tom"}
fmt.Println(a == b)// true
c = C{"Tom"}
fmt.Println(a == c)// false
```

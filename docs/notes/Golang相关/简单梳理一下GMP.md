---
icon: page
title: 简单梳理一下GMP
category:
  - Golang相关
tag:
  - Golang
# 此页面会出现在首页的文章板块中
star: true
---
# 简单梳理一下GMP

Go的GMP模型主要是描述Go语言如何对协程进行调度，如何管理协程的生命周期。

Go语言中的众多协程依托于线程，GMP中的G表示的是协程，也就是程序中用go关键字创建的执行体，M表示的是实际的线程，P表示的是Go的逻辑处理器，是一种人为抽象的、用于执行Go代码的局部资源，只有当M与一个P关联之后才能执行Go代码。

在任一时刻，一个P在其本地可能包含多个G，一个P只能同时绑定一个M，M并不会固定绑定同一个P中，同样的，G也不会固定在一个P中，G和M都有可能跑到其他的P中，G和M也并没有强绑定的关系

## 循环调度

```go
如果存在空闲的 P，和存在暂停的 M，并就绪 G
          +------+
          v      |
执行 --> 自旋 --> 暂止
 ^        |
 +--------+
  如果发现工作
```

协程经历g-g0-g的过程完成一次循环调度，调度循环指从调度协程g0开始，找到接下来将要运行的协程g，再从协程g切换到协程g0开启新一轮的调度

首先在协程g0中执行execute函数执行调度，根据具体的调度策略选择一个g，然后执行execute执行一些状态转移，g和m的绑定等操作，然后执行gogo函数用于完成栈的切换和CPU寄存器的恢复。这些操作完成后开始执行g协程。

当g执行完成或者主动让渡或者被抢占时，执行mcall函数保存当前协程的执行线程，然后切换到g0，重复前面的操作。

其中如果是用户调用Gosched函数主动让渡执行权时会执行gosched_m函数，如果是执行完成，则会执行goexit函数将协程g放入到p的freeg队列。用于下次重用

## 调度策略

schedule函数负责调度，在shedule函数中首先会检测程序是否处于垃圾回收阶段，如果是则会检测是否执行后台标记协程（负责协助垃圾回收）

等待被调度的协程存储在运行队列中，Go语言的调度器将运行队列分为局部运行队列和全局运行队列。每个P都有一个长度为256的局部运行队列，使用数组维护了一个循环队列，其中runqhead标识了队列头，runqtail表示了循环队列末尾，每次G放入本地局部队列时，都是从末尾插入从队头获取。

除此之外每个P中还有一个runnext指针指向下一个要执行的协程，P会先查看runnext是否为空，如果不为空则先执行runnext指向的协程，然后才会去runq数组中寻找。

P寻找下一个G的优先级为：runnext>本地>全局>网络>偷取

![Untitled.png](assets/Untitled-20211126205810-0ddvy5k.png)

### 获取本地运行队列

从本地队列获取时会先检查runnext（这一步有原子操作），不为空时会检查本地队列是否为空，其中获取runqhead时有原子操作.

```go
// Get g from local runnable queue.
// If inheritTime is true, gp should inherit the remaining time in the
// current time slice. Otherwise, it should start a new time slice.
// Executed only by the owner P.
func runqget(_p_ *p) (gp *g, inheritTime bool) {
	// If there's a runnext, it's the next G to run.
	next := _p_.runnext
	// If the runnext is non-0 and the CAS fails, it could only have been stolen by another P,
	// because other Ps can race to set runnext to 0, but only the current P can set it to non-0.
	// Hence, there's no need to retry this CAS if it falls.
	if next != 0 && _p_.runnext.cas(next, 0) {
		return next.ptr(), true
	}

	for {
		h := atomic.LoadAcq(&_p_.runqhead) // load-acquire, synchronize with other consumers
		t := _p_.runqtail
		if t == h {
			return nil, false
		}
		gp := _p_.runq[h%uint32(len(_p_.runq))].ptr()
		if atomic.CasRel(&_p_.runqhead, h, h+1) { // cas-release, commits consume
			return gp, false
		}
	}
}
```

### 获取全局运行队列

当P执行了61此调度后或者本地队列为空时会检查全局队列，每隔一段时间去全局队列那G是为了防止P一直执行本地队列，甚至两个G就可以完全占用P。

全局队列的数据结构是链表

### 获取准备就绪的网络协程

全局队列和本地队列可能都找不到可用的G来执行，这时会去寻找受否有已经准备好的网络协程，将其放入到全局运行队列。

### 协程窃取

如果网络协程也没有，那么会去其他的P的本地队列中窃取，那么去哪个P中寻找呢，如果遍历的话难免会出现不公平的情况，所以Go选择执行四次随机遍历（这里采用了一些特殊的方法保证能够全部遍历），如果找到了可窃取的，那么直接窃取返回，每次窃取会窃取一半，如果

## 调度策略

上面是调度的优先级，那么什么时候会发生调度呢。

### 主动调度

### 被动调度

### 抢占调度

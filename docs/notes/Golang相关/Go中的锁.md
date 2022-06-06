---
icon: page
title: Go中的锁
category:
  - Golang相关
tag:
  - Golang
# 此页面会出现在首页的文章板块中
star: true
---
# Go中的锁


[Go 精妙的互斥锁设计](https://mp.weixin.qq.com/s/IgvGXVeUUqt_UpY1VnxAPw)

## 原子锁

为了解决并发访问数据时数据冲突和内存操作乱序的问题，需要一种原子性的操作，这通常需要硬件的支持，如x86指令集中的LOCK操作，Go语言中的`sync/atomic`包提供了原子操作。

如下使用原子操作将count+1并不会发生并发时的数据争用问题

```go
var count int64 = 0
func add() {
	atomic.AddInt64(&count,1)
}
func main(){
	go add()
	go add()
}
```

同时包中还有另一个重要操作CAS：CompareAndSwap，与元素值进行对比并替换。如下判断flag的值是否为0，如果是则设置为1。这些操作是原子性的，不会发生数据争用和内存操作乱序。

```go
atomic.CompareAndSwapInt64(&flag, 0, 1)
```

可以通过这些原子操作构建一种自旋锁，只有获取该值才会执行代码：

```go
func add(){
	if atomic.CompareAndSwapInt64(&flag, 0, 1) {
		count++
		atomic.StoreInt64(&flag,0)
		return
	}
}
```

通过原子操作可以构建起许多同步原语如自旋锁，信号量，互斥锁。

## 互斥锁

### 实现原理

互斥锁是一种混合锁，其实现方式包含了自旋锁，同时参考了操作系统锁的实现。

`sync.Mutex`结构中包含了当前锁状态`state`和信号量`sema`

```go
type Mutex struct {
	state int32
	sema  uint32
}
```

互斥锁的第一个阶段利用原子操作快速抢占锁，抢占成功立刻返回，失败则调用`lockSlow`方法。

```go
// 如果锁已经在使用中，则goroutine会阻塞，直到互斥锁可用为止。
func (m *Mutex) Lock() {
	// Fast path: 获取 unlocked mutex.
	if atomic.CompareAndSwapInt32(&m.state, 0, mutexLocked) {
		if race.Enabled {
			race.Acquire(unsafe.Pointer(m))
		}
		return
	}
	// Slow path (outlined so that the fast path can be inlined)
	m.lockSlow()
}
```

`lockSlow` 一般会先自旋一段时间尝试抢占锁，而不是立即进入休眠状态。

出现以下情况会停止自旋。

* 程序在单核CPU上运行
* 逻辑处理器P小于等于1
* 当前协程所在的逻辑处理器P的本地队列上有其他协程待运行
* 自旋次数超过了设于的阈值（4）

当长时间未获取到锁时会进入互斥锁的第二个阶段，使用信号量进行同步。如果是加锁进入信号量同步阶段，则信号量减一，如果是解锁则加一。当信号量大于0时意味着有其他线程执行了解锁操作，这时加锁协程可以直接推出，当信号量小于0时则当前加锁协程要进入休眠状态。

互斥锁的第三个阶段会根据锁的地址将锁信息存储在全局的semrable哈希表中。如果出现哈希冲突，哈希桶会使用双向链表来解决，链表被构造成特殊的treap树，是一棵二叉搜索树。这是为了快速找到哈希桶中是否存在已经存在过的锁，如果已经存在，会将当前协程加到等待队列的尾部。

在访问哈希表时仍可能存在数据争用，所以这里也需要加锁，此处的锁和互斥锁有所不同，其会先自旋一定次数，如果没有获取到锁则会调用操作系统级别的锁。

锁被放置到全局的等待队列中等待被唤醒，顺序为先进先出。

当长时间无法获取到锁时，当前的互斥锁会进入饥饿模式，此时为了保证公平性新申请锁的协程不会进入自旋状态而是直接进入等待队列。进入等待队列的协程会切换自己的状态并让渡权力，进入新的调度循环，所以线程不会因此阻塞。

总的来说，Go的互斥锁时一种混合锁，结合了原子操作、自旋、信号量、全局哈希表、等待队列、操作系统级别锁等技术，不过一般情况下不会进入操作系统界别锁。

### 互斥锁的释放

如果当前锁处于普通的锁定状态：没有进入饥饿状态或唤醒状态，也没有多个协程因为抢占而阻塞，则直接修改mutexLocked状态后退出，否则调用`unlockSlow`方法.

```go
func (m *Mutex) Unlock() {
	if race.Enabled {
		_ = m.state
		race.Release(unsafe.Pointer(m))
	}

	// Fast path: drop lock bit.
	new := atomic.AddInt32(&m.state, -mutexLocked)
	if new != 0 {
		// Outlined slow path to allow inlining the fast path.
		// To hide unlockSlow during tracing we skip one extra frame when tracing GoUnblock.
		m.unlockSlow(new)
	}
}
```

`unlockSlow`方法会先判断锁是否重复释放。

```go
func (m *Mutex) unlockSlow(new int32) {
	if (new+mutexLocked)&mutexLocked == 0 {
		throw("sync: unlock of unlocked mutex")
	}
	if new&mutexStarving == 0 {
		old := new
		for {
			// If there are no waiters or a goroutine has already
			// been woken or grabbed the lock, no need to wake anyone.
			// In starvation mode ownership is directly handed off from unlocking
			// goroutine to the next waiter. We are not part of this chain,
			// since we did not observe mutexStarving when we unlocked the mutex above.
			// So get off the way.
			// 当前没有等待被唤醒的协程或者mutexWoken已设置
			if old>>mutexWaiterShift == 0 || old&(mutexLocked|mutexWoken|mutexStarving) != 0 {
				return
			}
			// Grab the right to wake someone.
			// 唤醒等待中的协程
			new = (old - 1<<mutexWaiterShift) | mutexWoken
			if atomic.CompareAndSwapInt32(&m.state, old, new) {
				runtime_Semrelease(&m.sema, false, 1)
				return
			}
			old = m.state
		}
	} else {
		// Starving mode: handoff mutex ownership to the next waiter, and yield
		// our time slice so that the next waiter can start to run immediately.
		// Note: mutexLocked is not set, the waiter will set it after wakeup.
		// But mutex is still considered locked if mutexStarving is set,
		// so new coming goroutines won't acquire it.
		// 在饥饿模式下唤醒协程并立即执行
		runtime_Semrelease(&m.sema, true, 1)
	}
}
```

如果锁处于饥饿状态，则会进入信号量同步阶段，到全局哈希表中寻找当前锁的等待队列，以先进先出的顺序唤醒协程。

如果锁处于饥饿状态且当前`mutexWoken`已设置，则表明有其他申请锁的协程准备从正常状态退出，这时锁释放后不需要去等待队列中唤醒其他线程，而是直接退出。如果唤醒了等待队列中的协程，则将唤醒的协程放入当前协程所在的`P`的`runnext`字段。如果在饥饿模式下，则当前协程会让渡自己的执行权力，让被唤醒的协程直接运行。

## 读写锁

在同一时间只有一个协程可以获取互斥锁，那么在读多写少的情况下，大部分时间是进行读操作，这个时候其实没有必要通过互斥的方式读取资源，所以就需要使用读写锁。读写锁分为读锁和写锁。

读操作时加读锁，写操作时加上写锁，多个协程可以同时获取读锁并执行，写锁需要等待所有读锁释放后才能继续执行且写锁之间互斥，如果协程在申请读锁时已经存在了写锁，那么会等待写锁释放后才能获取读锁。

### 实现原理

读写锁复用了互斥锁和信号量。

```go
type RWMutex struct {
	w           Mutex  // held if there are pending writers
	writerSem   uint32 // semaphore for writers to wait for completing readers
	readerSem   uint32 // semaphore for readers to wait for completing writers
	readerCount int32  // number of pending readers
	readerWait  int32  // number of departing readers
}
```

读锁先通过原子操作将readerCount加1，如果大于0则直接返回，如果readerCount小于0，则会进入等待状态。当前协程会去获取readerSem信号量，如果获取到信号量，则获取到读锁

```go
func (rw *RWMutex) RLock() {
	if race.Enabled {
		_ = rw.w.state
		race.Disable()
	}
	if atomic.AddInt32(&rw.readerCount, 1) < 0 {
		// A writer is pending, wait for it.
		runtime_SemacquireMutex(&rw.readerSem, false, 0)
	}
	if race.Enabled {
		race.Enable()
		race.Acquire(unsafe.Pointer(&rw.readerSem))
	}
}
```

读锁解锁时如果当前没有写锁则直接进行一个原子操作。

如果有写锁在等待，则会判断当前读锁是否是最后一个读锁，如果是则会增加信号量并唤醒写锁。

申请写锁时会调用互斥锁的Lock方法，然后将readerCount减去rwmutexMaxReader阻止后续的读操作。

如果当前已经有读锁或者写锁，那么会等待直到可以获取到锁。

```go
func (rw *RWMutex) Lock() {
	if race.Enabled {
		_ = rw.w.state
		race.Disable()
	}
	// First, resolve competition with other writers.
	rw.w.Lock()
	// Announce to readers there is a pending writer.
	r := atomic.AddInt32(&rw.readerCount, -rwmutexMaxReaders) + rwmutexMaxReaders
	// Wait for active readers.
	if r != 0 && atomic.AddInt32(&rw.readerWait, r) != 0 {
		runtime_SemacquireMutex(&rw.writerSem, false, 0)
	}
	if race.Enabled {
		race.Enable()
		race.Acquire(unsafe.Pointer(&rw.readerSem))
		race.Acquire(unsafe.Pointer(&rw.writerSem))
	}
}
```

当写锁解锁时会将readerCount加上rwmutexMaxReader，然后依次唤醒等待中的读锁，当所有读锁都被唤醒后会释放互斥锁。

## 总结

从代码量而言，go中互斥锁的代码非常轻量简洁，通过巧妙的位运算，仅仅采用state一个字段就实现了四个字段的效果，非常之精彩。

但是，代码量少并不代表逻辑简单，相反，它很复杂。互斥锁的设计中包含了大量的位运算，并包括了两种不同锁模式、信号量、自旋以及调度等内容，读者要真正理解加解锁的过程并不容易，这里再做一个简单回顾总结。

在正常模式下，waiter按照先进先出的方式获取锁；在饥饿模式下，锁的所有权直接从解锁的goroutine转移到等待队列中的队头waiter。

**模式切换**

如果当前 goroutine 等待锁的时间超过了 1ms，互斥锁就会切换到饥饿模式。

如果当前 goroutine 是互斥锁最后一个waiter，或者等待的时间小于 1ms，互斥锁切换回正常模式。

**加锁**

1. 如果锁是完全空闲状态，则通过CAS直接加锁。
2. 如果锁处于正常模式，则会尝试自旋，通过持有CPU等待锁的释放。
3. 如果当前goroutine不再满足自旋条件，则会计算锁的期望状态，并尝试更新锁状态。
4. 在更新锁状态成功后，会判断当前goroutine是否能获取到锁，能获取锁则直接退出。
5. 当前goroutine不能获取到锁时，则会由sleep原语`SemacquireMutex`陷入睡眠，等待解锁的goroutine发出信号进行唤醒。
6. 唤醒之后的goroutine发现锁处于饥饿模式，则能直接拿到锁，否则重置自旋迭代次数并标记唤醒位，重新进入步骤2中。

**解锁**

1. 如果通过原子操作`AddInt32`后，锁变为完全空闲状态，则直接解锁。
2. 如果解锁一个没有上锁的锁，则直接抛出异常。
3. 如果锁处于正常模式，且没有goroutine等待锁释放，或者锁被其他goroutine设置为了锁定状态、唤醒状态、饥饿模式中的任一种（非空闲状态），则会直接退出；否则，会通过wakeup原语`Semrelease`唤醒waiter。
4. 如果锁处于饥饿模式，会直接将锁的所有权交给等待队列队头waiter，唤醒的waiter会负责设置`Locked`标志位。

另外，从Go的互斥锁带有自旋的设计而言，如果我们通过`sync.Mutex`只锁定执行耗时很低的关键代码，例如锁定某个变量的赋值，性能是非常不错的（因为等待锁的goroutine不用被挂起，持有锁的goroutine会很快释放锁）。**所以，我们在使用互斥锁时，应该只锁定真正的临界区**。

```go
mu.Lock()
defer mu.Unlock()
```

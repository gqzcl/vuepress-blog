---
icon: page
title: 高性能网络包gnet
category:
  - Golang后端
tag:
  - 后端
  - 网络框架
---
# 高性能网络包gnet

[项目地址](https://github.com/panjf2000/gnet)

gnet包是一个高性能轻量级的网络框架包，支持TCP，UDP等网络协议，整个生命周期无锁且内置goroutine池，支持多种负载均衡算法`Round-Robin(轮询)`、`Source-Addr-Hash(源地址哈希)` 和 `Least-Connections(最少连接数)` 。

#### 核心API

##### 事件处理

```go
type EventHandler interface {
	// 当引擎准备好接受连接时，OnBoot启动。
	// The parameter engine has information and various utilities.
	OnBoot(eng Engine) (action Action)

	// OnShutdown在engine关闭时触发，之后立即调用
	// all event-loops and connections are closed.
	OnShutdown(eng Engine)

	// OnOpen在新连接打开时触发.
	// The Conn c has information about the connection such as it's local and remote address.
	// The paramete	r out is the return value which is going to be sent back to the peer.
	// It is usually not recommended to send large amounts of data back to the peer in OnOpened.
	//
	// Note that the bytes returned by OnOpened will be sent back to the peer without being encoded.
	OnOpen(c Conn) (out []byte, action Action)

	// OnClose在连接关闭时触发.
	// The parameter err is the last known connection error.
	OnClose(c Conn, err error) (action Action)

	// 当socket从对等方接收数据时，OnTaffic触发
	// 核心处理，事件在此处处理
	// Note that the parameter packet returned from React() is not allowed to be passed to a new goroutine,
	// as this []byte will be reused within event-loop after React() returns.
	// If you have to use packet in a new goroutine, then you need to make a copy of buf and pass this copy
	// to that new goroutine.
	OnTraffic(c Conn) (action Action)

	// OnTick在engine启动后立即触发，并将在一定时间后再次触发
	// following the duration specified by the delay return value.
	OnTick() (delay time.Duration, action Action)
}
```



```go
func (wss *wsServer) Onboot(eng gnet.Engine) gnet.Action {
	wss.eng = eng
	logging.Infof("echo server with multi-core=%t is listening on %s", wss.multicore, wss.addr)
	return gnet.None
}

func (wss *wsServer) OnOpen(c gnet.Conn) ([]byte, gnet.Action) {
	c.SetContext(new(wsCodec))
	atomic.AddInt64(&wss.connected, 1)
	return nil, gnet.None
}

func (wss *wsServer) OnClose(c gnet.Conn, err error) (action gnet.Action) {
	if err != nil {
		logging.Warnf("error occurred on connection=%s, %v\n", c.RemoteAddr().String(), err)
	}
	atomic.AddInt64(&wss.connected, -1)
	logging.Infof("conn[%v] disconnected", c.RemoteAddr().String())
	return gnet.None
}

func (wss *wsServer) OnTraffic(c gnet.Conn) gnet.Action {
	if !c.Context().(*wsCodec).ws {
		_, err := ws.Upgrade(c)
		logging.Infof("conn[%v] upgrade websocket protocol", c.RemoteAddr().String())
		if err != nil {
			logging.Infof("conn[%v] [err=%v]", c.RemoteAddr().String(), err.Error())
			return gnet.Close
		}
		c.Context().(*wsCodec).ws = true
	} else {
		msg, op, err := wsutil.ReadClientData(c)

		if err != nil {
			if _, ok := err.(wsutil.ClosedError); !ok {
				logging.Infof("conn[%v] [err=%v]", c.RemoteAddr().String(), err.Error())
			}
			return gnet.Close
		}
		logging.Infof("conn[%v] receive [op=%v] [msg=%v]", c.RemoteAddr().String(), op, string(msg))
		// This is the echo server
		err = wsutil.WriteServerMessage(c, op, msg)
		if err != nil {
			logging.Infof("conn[%v] [err=%v]", c.RemoteAddr().String(), err.Error())
			return gnet.Close
		}
	}

	return gnet.None
}

func (wss *wsServer) OnTick() (delay time.Duration, action gnet.Action) {
	logging.Infof("[connected-count=%v]", atomic.LoadInt64(&wss.connected))
	return 3 * time.Second, gnet.None
}

func Test() {
	var port int
	var multicore bool

	// Example command: go run main.go --port 8080 --multicore=true
	flag.IntVar(&port, "port", 9080, "server port")
	flag.BoolVar(&multicore, "multicore", true, "multicore")
	flag.Parse()

	wss := &wsServer{addr: fmt.Sprintf("tcp://127.0.0.1:%d", port), multicore: multicore}

	// Start serving!
	log.Println("server exits:", gnet.Run(wss, wss.addr, gnet.WithMulticore(multicore), gnet.WithReusePort(true), gnet.WithTicker(true)))
}
```

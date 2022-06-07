---
icon: page
title: Websocket包-nhooyr
category:
  - Golang后端
tag:
  - 事务
  - 后端
  - 分布式
---
# Websocket包-nhooyr

[项目地址](https://github.com/nhooyr/websocket)

#### func Accept

```go
func Accept(w http.ResponseWriter, r *http.Request, opts *AcceptOptions) (*Conn, error)
```

Accept函数接受来自客户端的Websocket握手并升级连接到Websocket

#### func Dial

```go
func Dial(ctx context.Context, u string, opts *DialOptions) (*Conn, *http.Response, error)
```

Dial在url上执行Websocket握手。--客户端使用

使用完要执行defer c.Close()

#### type Conn

```go
type Conn struct {
	// contains filtered or unexported fields
}
```

Conn代表一个Websocket连接。除了Reader和Read以外所有方法都可以同时调用。

记得关闭连接defer Conn.Close。

##### func (*Conn)Close

```go
func (c *Conn) Close(code StatusCode, reason string) error
```

Close使用给定状态码code和原因reason与Websocket关闭握手，它会写入一个超时为5s的Websocket关闭帧并等待对方发送一个关闭帧，在此期间接收到的所有数据将被丢弃，一旦关闭将接触阻塞和连接交互的所有goroutine

##### func (*Conn)CloseRead

```go
func (c *Conn) CloseRead(ctx context.Context) context.Context
```

CloseRead 启动一个 goroutine 从连接中读取，直到它关闭或接收到数据消息。

调用 CloseRead 后，您将无法从连接中读取任何消息。当连接关闭时，返回的上下文将被取消。

如果接收到数据消息，连接将使用 StatusPolicyViolation 关闭。

当您不希望阅读更多消息时调用 CloseRead。由于它主动从连接中读取，它将确保响应 ping、pong 和 close 帧。这意味着 c.Ping 和 c.Close 仍将按预期工作。

###### func (*Conn) Ping

```go
func (c *Conn) Ping(ctx context.Context) error
```

Ping 向对等方发送 ping 并等待 pong。使用它来测量延迟或确保对等方响应。Ping 必须与 Reader 并发调用，因为它不会从连接中读取，而是等待 Reader 调用来读取 pong。

TCP Keepalive 应该足以满足大多数用例。

##### func (*Conn) Read

```go
func (c *Conn) Read(ctx context.Context) (MessageType, []byte, error)
```

Read 是 Reader 的一种便捷方法，用于从连接中读取单个消息。

##### func (*Conn) Reader

```go
func (c *Conn) Reader(ctx context.Context) (MessageType, io.Reader, error)
```

Reader 从连接中读取，直到有 WebSocket 数据消息要读取。它将酌情处理 ping、pong 和关闭帧。

它返回消息的类型和一个 io.Reader 来读取它。传递的上下文也将绑定Reader。确保您阅读到 EOF，否则连接将挂起。

如果您不期望来自对等方的任何数据消息，请调用 CloseRead。

一次只能打开一个Reader。

##### func (*Conn) Write

```go
func (c *Conn) Write(ctx context.Context, typ MessageType, p []byte) error
```

Write将消息写入连接。

如果要流式传输消息，请参阅 Writer 方法。

如果禁用压缩或未达到阈值，则它将在单个帧中写入消息。

##### func (*Conn) Writer

```go
func (c *Conn) Writer(ctx context.Context, typ MessageType) (io.WriteCloser, error)
```

Writer 返回一个受上下文限制的 writer，该上下文将向连接写入 dataType 类型的 WebSocket 消息。

写完整个消息后，您必须关闭编写器。

一次只能打开一个 writer，多个调用将阻塞，直到前一个 writer 关闭。

##### func (*Conn) SetReadLimit

```go
func (c *Conn) SetReadLimit(n int64)
```

SetReadLimit 设置单个消息要读取的最大字节数。它适用于 Reader 和 Read 方法。

默认情况下，连接的消息读取限制为 32768 字节。

当达到限制时，将使用 StatusMessageTooBig 关闭连接。

##### func (*Conn) Subprotocol

```go
func (c *Conn) Subprotocol() string
```

Subprotocol返回协商的子协议。空字符串表示默认协议。

#### func NetConn

```go
func NetConn(ctx context.Context, c *Conn, msgType MessageType) net.Conn
```

NetConn函数将*Websocket.Conn转换为net.Conn。

ctx用于限制net.Conn的生命周期，当取消时，net.Conn上的读写都会被取消


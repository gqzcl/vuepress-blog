---
icon: page
title: 安装protobuf和使用GRPC
category:
  - Golang后端
tag:
  - 事务
  - 后端
  - 分布式
# 此页面会出现在首页的文章板块中
star: true
---
# 安装protobuf和使用GRPC

首先我们知道protobuf是一种与语言无关、平台无关、可扩展的用来序列化和结构化数据的方法，用于通信协议，数据存储等。

### 下载

首先下载protocol编译器[Protocol Buffer]()

```protobuf
wget https://github.com/protocolbuffers/protobuf/releases/download/vx.x.x/protoc-x.x.x-linux-x86_64.zip
//解压到/usr/local路径下
sudo unzip protoc-xxx.zip -d /usr/local
```

或者自己新建文件夹，不过要将文件夹下的bin文件添加到环境变量

然后运行命令查看是否安装成功

```go
protoc --version
```

然后下载Go 的protobuf插件protoc-gen-go

这个有两个版本，一个是`github.com/golang/protobuf/protoc-gen-go` ，一个是`google.golang.org/protobuf/cmd/protoc-gen-go` ，前者已经被后者所取代，进行了一些API的更新和简化，以及其他的一些改进，所有我们直接安装google提供的这个版本

```go
go install [google.golang.org/protobuf/cmd/protoc-gen-go](http://google.golang.org/protobuf/cmd/protoc-gen-go)@latest
```

同时下载grpc

```go
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```

到了这里就可以开始了。

```protobuf
protoc --go_out=. message.proto
protoc --go-grpc_out=. message.proto
```

接下来看看proto文件的编写

首先写一个helloworld.proto

```go
syntax = "proto3";

package helloworld;

option go_package = "google.golang.org/grpc/examples/helloworld/helloworld";
option java_multiple_files = true;
option java_package = "io.grpc.examples.helloworld";
option java_outer_classname = "HelloWorldProto";

// The greeting service definition.
service Greeter {
  // Sends a greeting
  rpc SayHello (HelloRequest) returns (HelloReply) {}
}

// The request message containing the user's name.
message HelloRequest {
  string name = 1;
}

// The response message containing the greetings
message HelloReply {
  string message = 1;
}
```

### **logic.proto:5:1: Import "/home/gqzcl/gim/api/protocol/protocol.proto" was not found or had errors.**

```go
├── comet
│   ├── comet.pb.go
│   └── comet.proto
├── generate.go
├── helloworld
│   ├── helloworld.pb.go
│   ├── helloworld.proto
│   └── hs.proto
├── logic
│   ├── logic.pb.go
│   └── logic.proto
└── protocol
    ├── protocol.pb.go
    └── protocol.proto
```

```go
//go:generate protoc -I./ -I$GOPATH/src --go_out=.  --go_opt=paths=source_relative logic/logic.proto
```

```go
//go:generate protoc -I./ -I$GOPATH/src --go_out=.  --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative logic/logic.proto
```

![Untitled.png](assets/Untitled-20211126203804-380gbd4.png)

```go
$ go get -u google.golang.org/grpc
```

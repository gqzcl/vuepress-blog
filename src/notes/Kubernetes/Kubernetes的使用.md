---
# 这是侧边栏索引
# index: 1
# 这是页面的图标
icon: page
# 这是文章的标题
title: Kubernetes的使用
# 设置作者
author: gqzcl
# 设置写作时间
# date: 2022-01-01
# 一个页面可以有多个分类,实测分类不能是纯数字
category:
  - 笔记
# 一个页面可以有多个标签
tag:
  - kubernetes
  - minikube
  - kubectl
# 此页面会在文章列表置顶
# sticky: true
# 你可以通过在 frontmatter 中设置 star 为 true 收藏一个文章。收藏后，用户就可以在 /star/ 页面中查看这些文章。
# 同时任何任何收藏的文章都会显示在博客主页侧边栏的文章栏目中。
star: true
# 如果你不希望该列表包含一些特定的文章，只需在文章的 frontmatter 中将 article 设置为 false。
article: false
# 你可以自定义页脚
#footer: 这是测试显示的页脚
---

# Kubernetes的使用

## 文档参阅

[Kubernetes官网](https://kubernetes.io/zh-cn/docs/tasks/tools/
)

[minikube官网](https://minikube.sigs.k8s.io)

## 安装minikube和kubectl

minikube 最大特点就是“小而美”，可执行文件仅有不到 100MB，运行镜像也不过 1GB，但就在这么小的空间里却集成了 Kubernetes 的绝大多数功能特性，不仅有核心的容器编排功能，还有丰富的插件，例如 Dashboard、GPU、Ingress、Istio、Kong、Registry 等等，综合来看非常完善。

**下载安装**

```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

**启动**

```bash
minikube start
```

**安装kubectl**

使用一下命令可以安装对应版本的kubectl，存放在内部目录（例如 .minikube/cache/linux/arm64/v1.23.3）

```bash
minikube kubectl
```

**单独安装kubectl(推荐)**

[官方文档](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)

下载kubectl

```
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"


```

校验文件

```
curl -LO "https://dl.k8s.io/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl.sha256"
# validate the kubectl binary against the checksum file
echo "$(cat kubectl.sha256)  kubectl" | sha256sum --check
```

安装kubectl

```
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
# test whether installed
kubectl version --client
```

## 使用minikube和kubectl

在 minikube 环境里，我们会用到两个客户端：minikube 管理 Kubernetes 集群环境，kubectl 操作实际的 Kubernetes 功能。

**启动minikube时，可以带上kubernetes的版本号**

```bash
minikube start --kubernetes-version=v1.23.3
```

**可以使用以下两个命令来查看集群的状态**

```bash
minikube status
minikube node list
```

输出如下

```bash
$ minikube status
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured

$ minikube node list
minikube        192.168.49.2
```

表示kubernetes集群中只有一个节点minikube，类型是Contorl Plane，里面有三个服务：host，kubelet，apiserver，IP地址是192.168.49.2

**可以使用minikube ssh登录到节点**

```bash
minikube ssh
```

在minikube中，如果是使用minikube安装的kubectl，需要使用`minikube kubectl --` 来使用kubectl命令，所以可以将别名加到bashrc中，同时也加上自动补全。

```bash
alias kubectl="minikube kubectl --"

source <(kubectl completion bash)
```

**查看版本信息**

```bash
# --short 即将弃用，后续将会变为默认
kubectl version --short
```

**安装一个Nginx应用**,命令与 Docker 一样，也是 run，不过形式上有点区别，需要用 --image 指定镜像，然后 Kubernetes 会自动拉取并运行：

```bash
kubectl run ngx --image=nginx:alpine
```

这里涉及 Kubernetes 里的一个非常重要的概念：Pod，可以理解成是“穿了马甲”的容器，查看 Pod 列表需要使用命令 kubectl get pod，它的效果类似 docker ps：

```bash
kubectl get pod 
```

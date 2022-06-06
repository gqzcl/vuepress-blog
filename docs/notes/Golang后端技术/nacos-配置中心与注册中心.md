---
icon: page
title: nacos-配置中心与注册中心
category:
  - Golang后端
tag:
  - 事务
  - 后端
  - 分布式
# 此页面会出现在首页的文章板块中
star: true
---
# nacos-配置中心与注册中心

[项目地址](https://github.com/alibaba/nacos)

#### 安装nacos

需要先安装JAVA环境

**下载安装包**

直接使用2.0版本

```bash
wget https://github.com/alibaba/nacos/releases/download/2.1.0/nacos-server-2.1.0.tar.gz
tar -xzvf nacos-server-2.1.0.tar.gz
cd nacos/bin
# 单机部署
sh startup.sh -m standalone
# 关闭服务器
sh shutdown.sh
```

**控制台界面**

打开`http://x.x.x.x:8848/nacos` ,初始用户名和密码为nacos。

### 项目中使用nacos

#### 服务注册发现

```go
package conf

import (
	"fmt"
	"github.com/nacos-group/nacos-sdk-go/clients"
	"github.com/nacos-group/nacos-sdk-go/clients/naming_client"
	"github.com/nacos-group/nacos-sdk-go/model"
	"github.com/nacos-group/nacos-sdk-go/vo"
	"log"
	"sync"
)

var (
	namingClient naming_client.INamingClient
	nonce        = &sync.Once{}
)

func init() {
	GetNamingClient()
}

// GetNamingClient create naming client
func GetNamingClient() naming_client.INamingClient {
	if namingClient == nil {
		nonce.Do(func() {
			var err error
			namingClient, err = clients.NewNamingClient(
				vo.NacosClientParam{
					ClientConfig:  &cc,
					ServerConfigs: sc,
				},
			)
			if err != nil {
				fmt.Println("Naming client create failed")
			} else {
				fmt.Println("Naming client create success")
			}
		})
	}
	return namingClient
}

func RegisterInstance() error {
	// TODO 直接从配置文件导入
	success, err := namingClient.RegisterInstance(vo.RegisterInstanceParam{
		Ip:          "10.0.0.11",
		Port:        8848,
		ServiceName: "demo.go",
		Weight:      10,
		Enable:      true,
		Healthy:     true,
		Ephemeral:   true,
		Metadata:    map[string]string{"idc": "shanghai"},
		ClusterName: "cluster-a", // default value is DEFAULT
		GroupName:   "group-a",   // default value is DEFAULT_GROUP
	})
	if err != nil {
		return err
	}
	if success {
		fmt.Println("Register Instance successfully.")
	}
	return err
}

func Deregisterinstance() error {
	success, err := namingClient.DeregisterInstance(vo.DeregisterInstanceParam{
		Ip:          "10.0.0.11",
		Port:        8848,
		ServiceName: "demo.go",
		Ephemeral:   true,
		Cluster:     "cluster-a", // default value is DEFAULT
		GroupName:   "group-a",   // default value is DEFAULT_GROUP
	})
	if err != nil {
		return err
	}
	if success {
		fmt.Println("Deregister instance successfully")
	}
	return err
}

func GetAllInstances() ([]model.Instance, error) {
	instances, err := namingClient.SelectAllInstances(vo.SelectAllInstancesParam{
		ServiceName: "demo.go",
		GroupName:   "group-a",             // default value is DEFAULT_GROUP
		Clusters:    []string{"cluster-a"}, // default value is DEFAULT
	})
	if err != nil {
		return nil, err
	}
	return instances, err
}

func GetInstance() ([]model.Instance, error) {
	instance, err := namingClient.SelectInstances(vo.SelectInstancesParam{
		ServiceName: "demo.go",
		GroupName:   "group-a",             // default value is DEFAULT_GROUP
		Clusters:    []string{"cluster-a"}, // default value is DEFAULT
		HealthyOnly: true,
	})
	if err != nil {
		return nil, err
	}
	return instance, err
}

// GetOneHealthyInstance return one instance by WRR strategy for load balance
// And the instance should be health=true,enable=true and weight>0
func GetOneHealthyInstance() (*model.Instance, error) {
	instance, err := namingClient.SelectOneHealthyInstance(vo.SelectOneHealthInstanceParam{
		ServiceName: "demo.go",
		GroupName:   "group-a",             // default value is DEFAULT_GROUP
		Clusters:    []string{"cluster-a"}, // default value is DEFAULT
	})
	if err != nil {
		return nil, err
	}
	return instance, err
}

func SubscribeClient() error {
	err := namingClient.Subscribe(&vo.SubscribeParam{
		ServiceName: "demo.go",
		GroupName:   "group-a",             // default value is DEFAULT_GROUP
		Clusters:    []string{"cluster-a"}, // default value is DEFAULT
		SubscribeCallback: func(services []model.SubscribeService, err error) {
			log.Printf("\n\n callback return services:%s \n\n", services)
		},
	})
	return err
}

func UnSubscribeClient() error {
	err := namingClient.Unsubscribe(&vo.SubscribeParam{
		ServiceName: "demo.go",
		GroupName:   "group-a",             // default value is DEFAULT_GROUP
		Clusters:    []string{"cluster-a"}, // default value is DEFAULT
		SubscribeCallback: func(services []model.SubscribeService, err error) {
			log.Printf("\n\n callback return services:%s \n\n", services)
		},
	})
	return err
}
func GetAllServiceName() (model.ServiceList, error) {
	serviceInfos, err := namingClient.GetAllServicesInfo(vo.GetAllServiceInfoParam{
		NameSpace: "0e83cc81-9d8c-4bb8-a28a-ff703187543f",
		PageNo:    1,
		PageSize:  10,
	})
	return serviceInfos, err
}

```

#### 发布订阅配置

```go
publish config：PublishConfig
success, err := configClient.PublishConfig(vo.ConfigParam{
    DataId:  "dataId",
    Group:   "group",
    Content: "hello world!222222"})
delete config：DeleteConfig
success, err = configClient.DeleteConfig(vo.ConfigParam{
    DataId: "dataId",
    Group:  "group"})
get config info：GetConfig
content, err := configClient.GetConfig(vo.ConfigParam{
    DataId: "dataId",
    Group:  "group"})
Listen config change event：ListenConfig
err := configClient.ListenConfig(vo.ConfigParam{
    DataId: "dataId",
    Group:  "group",
    OnChange: func(namespace, group, dataId, data string) {
        fmt.Println("group:" + group + ", dataId:" + dataId + ", data:" + data)
	},
})
Cancel the listening of config change event：CancelListenConfig
err := configClient.CancelListenConfig(vo.ConfigParam{
    DataId: "dataId",
    Group:  "group",
})
Search config: SearchConfig
configPage, err := configClient.SearchConfig(vo.SearchConfigParam{
    Search:   "blur",
    DataId:   "",
    Group:    "",
    PageNo:   1,
    PageSize: 10,
})
```

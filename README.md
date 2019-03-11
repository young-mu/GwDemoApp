## Ruff Gateway (Linux RGWi5110) 网关 Demo 应用

### 说明

该 Demo 应用包括以下功能：

1. UART（RS232/RS485）读
2. UART（RS232/RS485）写
3. 百度云 MQTT 读
4. 百度云 MQTT 写

### 注意

1. 该 APP 已经完成初始化，并安装了 `mini-mqtt-client` 模块
2. 需要在 Ruff Console 界面中，配置 WiFi，并加装 WiFi 天线
3. UART 测试可用 USB 转 TTL 模块（USB 转 RS485 模块）和串口调试助手进行测试
4. 百度云测试可按照该 [文档](https://cloud.baidu.com/doc/IOT/Quickstart-new.html#MQTT.fx) 进行（即 PC 端安装一个 MQTT 客户端）

### Ruff SDK 基本操作

RGWi5110 运⾏行行 Ruff OS，⽤户可以下载 PC 上对应的 Ruff SDK 对⽹网关进行操作，Ruff SDK [下载地址](https://ruff.io/zh-cn/docs/download.html)，选择相应的平台，下载并安装之后，在命令⾏运行 `rap --version`，若显示 v1.11.12，则证明 Ruff SDK 安装成功。

常见操作：

- 新建应⽤
- 部署应⽤
- 启动/停⽌止/重启应⽤
- 打包应⽤
- 查看应⽤日志

### 基本命令

#### 1. 新建应⽤

```shell
rap init --board am335x-hzmc
```

为 RGWi5110 ⽹网关新建⼀一个 Ruff 基本应⽤用框架

可以用编辑器器打开 src/index.js ⽂文件，可以看到 `console.log('Hello, Ruff');` 这样一行代码，它的作用是在控制台终端打印⼀行 `Hello, Ruff` 的⽇志

#### 2. 部署应⽤

```shell
rap deploy [IP 地址]
```

将 Ruff 应⽤部署到和 PC 处于同一局域网 Ruff 网关中(默认不执行)

#### 3. 启动/停⽌止/重启应用

```shell
rap start/stop/restart [IP 地址]
```

启动/停⽌/重启已经部署到 Ruff ⽹网关中的应用

部署应⽤时，可加 `-s` 选项，直接部署并执行应⽤（⽐如 `rap deploy -s 192.168.31.88`）

#### 4. 打包应⽤

```shell
rap deploy --package
```

将本目录中的 Ruff 应用打包成压缩包，⽤用于远程更新 Ruff 应用（后续结合 Ruff Explorer 具体介绍使⽤用细节）

#### 5. 查看应⽤⽇志

```shell
rap log [IP 地址]
```

查看 Ruff 网关应⽤⽇志，便于调试应用逻辑

先在一个终端内执⾏ `rap log` 命令，然后在另⼀个终端执⾏ `rap start/restart` 命令(前提是已经完成部署)，即可看到第⼀个终端显示出 `Hello, Ruff` 的 应⽤用⽇日志

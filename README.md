# Quasar App (quasar-project)

A Quasar Project

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

# 这是一个临时项目图床工具

当前端在进行项目开发时，可能并没有图床服务器支持，此时我们可以使用该工具临时将图片等静态文件存储到 git，然后将拿到的地址作为临时的外链，当我们需要将项目上线，我们就需要将图片从 git 打包下载下来，在替换项目 baseUrl 之后就可以进行部署上线了。

该项目提供了可视化的图片上传入口及链接复制，更加友好的可视化操作，可以将项目打包之后通过 git 的地址进行访问，节省了开发成本，但是你需要注意的是，如果你单个存储库上传的图片之和超过了一个 G 那么可能会面临封号的风险，请注意项目库的大小
使用方式点击左侧登陆，输入 git 的 acessToken，请注意权限的完整性，要不然可能会导致接口异常。目前该项目处于测试阶段，功能的丰富性有待提高，欢迎大家提出合理的诉求。支持上传图片地址的拷贝已经项目压缩包的下载。欢迎大家提出项目的不合理之处，阿里个到！

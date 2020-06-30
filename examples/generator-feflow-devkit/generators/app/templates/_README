# <%= name %>

> <%= description %>

## 安装

### 1. 安装依赖

```bash
$ tnpm install @feflow/cli -g
$ tnpm i <%= name %>
```

### 2. 配置文件

并且，需要在项目中增加 CLI 调用开发套件的配置文件 `.feflowrc.json`，示例内容如下：

```js
{
  "devkit": {
    "commands": {
      "dev": {
        "builder": "<%= name %>:dev",
        "options": {}
      },
      "build": {
        "builder": "<%= name %>:build",
        "options": {}
      }
    }
  }
}

```

## 使用

```bash
# development mode
$ fef dev

# production mode
$ fef build
```

## License

MIT

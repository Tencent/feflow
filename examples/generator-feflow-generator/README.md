# generator-feflow-generator

> 生成 Feflow 脚手架模版的脚手架。

## 脚手架做了什么

### 项目结构
```bash
.
├── __tests__                     # Jest 单元测试
│   └── app.js
├── generators/                   # 脚手架示例
│   ├── app/
│   │   ├── index.js
│   │   └── templates/
│   │       ├── dummyfile.txt
│   │       └── package.json
│   └── index.js                  # 入口文件
├── .editorconfig
├── .eslintignore
├── .eslintrc.js                  # ESlint 配置，默认接入 @tencent/eslint-config-tencent
├── .git
├── .gitignore
├── CHANGELOG.md
├── LICENSE
├── README.md
├── package-lock.json
└── package.json
```

### ESLint 校验

自动默认接入 ESlint，并以 `eslint-config-ivweb` 作为校验规则，相关命令如下：

```bash
npm run lint
```

### 单元测试

自动默认接入 Jest 作为脚手架的单元测试工具，运行测试命令如下：

```bash
npm run test
```

### 规范 commit & CHANGELOG

自动默认接入 Commit message 校验，遵循 Angular Commit Messages 格式规范。并且，支持通过以下命令自动生成 CHANGELOG：

```bash
npm run changelog
```



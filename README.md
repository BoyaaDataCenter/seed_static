# 自助报表前端代码

## 基础架构

### 构建工具

- [angular-cli](https://github.com/angular/angular-cli) 

### 第三方库

通过 `npm` 管理的库，在 `package.json` 中 `dependencies` 查看，下面列出的插件，没有通过 `npm`管理, 所以重点说明：

- [primeng](http://www.primefaces.org/primeng/) 

  primeng 组件因为需要自己扩展其组件，在其 2.0.0 版本上开发，直接使用其源码：
  
  1. 组件源码在 `src/app/primeng` 
  2. 基础样式样式文件在 `src/scss/primeng.scss` 
  3. 主题样式文件在 `src/scss/theme` 
  4. 字体及图片在 `src/assets/theme`


- [slds 样式库 utilities 样式](https://www.lightningdesignsystem.com/components/utilities/)

  slds 的样式文件在 `src/scss/slds` 目录，实际使用过程中仅仅用到了 `utilities` 部分 
  

- [Bowser](https://github.com/ded/bowser)

  嗅探浏览器版本库，文件在 `src/assets/js/bowser.min.js`


### 目录结构

`*` 符号标记的目录表示为纯业务组件目录

```
.
src
  app
    core // 应用单例组件或服务存放目录
    home // *首页
    main // 应用的主组件，作为 app.component 的唯一子组件
    primeng // primeng 组件目录
    routing // 应用的路由配置模块
    compents // 应用多实例组件或公用类或其它公用的部件存放目录
```

### 环境列表

环境名称 |  配置文件 | 运行命令
--- | --- | --- 
正式环境 | environment.ts | npm run build
本地环境 | environment.dev.ts | npm run start


## 开发流程

### 本地开发

1. 执行 `npm install` 安装依赖包。
2. angular-cli.json文件中的project -> ejected字段的值修改为 false。
3. 执行 `package.json` 中 `scripts` 配置里以 `start` 开头的脚本，例如执行 `npm run start` 将启动一个监听
`80` 端口的服务（若启动不成功，检查下80端口是否被其它服务占用了）。


### 编译上线（非打包）

1. angular-cli.json文件中的project -> ejected字段的值修改为 false。
2. 执行相应的编译脚本，同样的编译脚本在 `package.json` 的 `scripts` 配置中，只是编译类的脚本以 `build` 开头，例如编译开发环境的代码，
执行 `npm run buildDev` ，编译完成后即可。 

### 编译资源包（与后端代码混合）

1. angular-cli.json文件中的project -> ejected字段的值修改为 true。
2. 执行npm run build指令即可生成前端的资源包。
3. 把资源包替换到这个目录（seed_server\src\seed\static）下即可。


  
  
  
  


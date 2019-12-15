npm网站(https://www.npmjs.com/)
## npm常用命令
- npm init
    + npm init -y（--yes）可以跳过向导，快速生成
- npm install
    + 一次性把dependencies选项中的依赖项全部安装
- npm install 包名
    + 下载并保存依赖项
- npm uninstall 包名
    + 删除并移除依赖项

## 解决npm被墙问题
1.安装cnpm
2. 如果不想安装`cnpm`又想使用淘宝的服务器来下载：
```shell
npm install jquery --registry=https://registry.npm.taobao.org
```
3. 每次这样设置参数很麻烦，把这个选项加入配置文件中
```shell
npm config set registry https://registry.npm.taobao.org
# 查看npm 配置信息
npm config list
```
只要经过了上面命令的配置，以后多有的`npm install`都会默认通过淘宝的服务器来下载。
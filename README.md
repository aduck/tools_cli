# 个人用的命令行工具

## 安装

```bash
# 下载
git clone https://github.com/aduck/tools_cli.git
cd tools_cli
# 安装依赖
yarn
# 链接
yarn link
```

## 查看命令

```bash
mytool help
```

**以下命令皆省略开头的`mytool`**

## 图片生成

> 在当前目录下生成图片

```bash
# 生成100x200的png图片
imgen -s 100x200 -t png
# 强制重新生成
imgen -s 100x200 -t png -f
```

## 快捷访问url

> 可以设置别名，快速访问url

```bash
# 直接打开百度
webopen https://baidu.com
# 设置别名
webopen alias baidu https://www.baidu.com/s?wd=${keyword}
# 别名打开
webopen baidu "今天吃什么"
# 获取别名
webopen alias baidu
# 获取所有别名
webopen alias
# 多个参数
webopen baidu "今天吃什么+不知道"
# 具名参数，可以不分顺序先后
webopen alias webdev https://${project}-${env}.xxx.com
webopen webdev env=i7+stage project=gys
# 默认值
webopen alias webdev https://${project:gys}-${env}.xxx.com
webopen webdev env=i7+stage
```
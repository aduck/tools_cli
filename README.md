# 个人用的命令行工具

## 图片生成

> 在当前目录下生成图片

```bash
# 生成100x200的png图片
imgen -s 100x200 -t png
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
```
# 像素地牢突击

这是一个单文件 Canvas 小游戏，入口是 `index.html`，不需要打包工具或安装依赖。

## 本地运行

推荐使用 npm 脚本启动静态服务器：

```bash
npm start
```

启动后打开：

```text
http://localhost:4173/index.html
```

如果你在 Codespaces、Gitpod、Dev Container 或其他远程环境中运行，请在开发工具里转发 / 暴露 `4173` 端口，然后打开转发后的地址。

也可以不用 npm，直接运行：

```bash
python3 -m http.server 4173 --bind 0.0.0.0
```

## 操作方式

- `W / A / S / D` 或方向键：移动
- 鼠标移动：瞄准
- 鼠标左键或空格：射击
- `Shift`：冲刺闪避
- `R`：重新开始

手机窄屏下会显示虚拟方向键、冲刺和开火按钮。

## 检查

运行静态页面烟测：

```bash
npm run check
```

这个检查会解析 `index.html` 中的内联脚本，在一个最小模拟 DOM 中初始化游戏、调用 `start()`，并执行若干帧 `update()` / `draw()`，用于快速发现语法和启动阶段错误。

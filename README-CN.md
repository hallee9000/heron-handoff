# Figma Juuust Handoff

**我正在紧锣密鼓地开发在线版 Juuust Handoff，点[这里](https://heron.design)订阅最新消息**

## 简介

<img alt="Overview" src="./imgs/overview.png"/>

Juuust Handoff 可以帮助你生成带有设计标注的文件，方便交付给开发。这个项目是设计标注模板，你需要先去[这里](https://www.figma.com/community/plugin/830051293378016221/Juuust-Handoff)安装插件。

更多信息你可以查看 https://figmacn.com/handoff/.

[点这里查看 Demo](https://figmacn.com/handoff?demo=1)

## 使用方式

### 1. 安装插件
前往 [Juuust Handoff Plugin](https://www.figma.com/community/plugin/830051293378016221/Juuust-Handoff) 页面或搜索 juuust handoff 进入插件页面点击安装。

<img alt="Install plugin" src="./imgs/install.png"/>

### 2. 在文件内打开插件
打开一个设计文件，在画布中右击，依次选取 plugin -> Juuust Handoff，即可启动插件。

<img alt="Run plugin" src="./imgs/run.png"/>

### 3. 选择 Frame
插件会罗列该文件所有 page 中的每一个第一级 Frame（可以理解为画板）。你可以在里面选择需要导出标注的 Frame，然后点击开始导出。

下方还有一个**导出组件列表选项**，可以单独导出组件列表。如果你像我一样（如下图）把组件都放在一个 Frame 内，就不需要勾选它了。

<img alt="Select frames" src="./imgs/select.png"/>

### 4. 选择切图
插件会自动识别到文件中带有 export 的图层（下图右侧面板最下方），将其罗列在切图列表中，你可以选择需要导出的切图。切图的命名会自动按照你所选择的倍数和填写的后缀命名，如果有重复会自动在末尾加数字，并用红色惊叹号特别标注。

万事俱备，点击下面的按钮开始导出。

<img alt="Select frames" src="./imgs/export.png"/>

### 5. 查看标注文件
在上一步点击生成设计标注之后，会导出一个压缩包文件到本地，解压后打开里面的 index.html 就可以查看标注啦。因为每一次导出标注文件都是离线的，所以如果你的设计有改动并不会自动同步，需要你重新导出。

<img alt="Select frames" src="./imgs/view.png"/>

## 常见问题

### 如何交付切图？
插件只会识别每一个在右侧加了 Export 的元素，Slice 功能只是为了兼容 Sketch 导入的文件，本插件不会将其作为切图对待，所以如果 Slice 图层没有在右侧添加 Export 也不会被识别为切图。

此外，Main 组件添加了 Export，它的实例（Instance）不会被自动添加 Export，也不会被识别为切图。也就是说，你给文件中几个图层加了多少 Export，就会有多少切图。

比如下图，会生成 `thumb-up-ios@3x.png` 和 `thumb-up.svg`（该图层名字为 `thumb-up`）两个切图。

<img alt="Export settings" src="./imgs/exports.png" width="360"/>

### 为什么有时候会错位？
标注错位一般是由于两种原因导致的：
1. 有一些元素进行了旋转或者翻转操作。
2. 第一级 Frame（画板）内的元素超出了，但是 Frame 没有勾选裁切内容（Clip content）。
目前第一种情况还无法解决，请尽量避免，第二种情况请一定要给第一级 Frame 勾选一下该选项。

<img alt="Clip Content" src="./imgs/clip-content.png" width="360"/>

## 赞助捐赠
Figma Juuust Handoff 代码全部开源，如果对你有帮助，可以扫码支持我一下。

<img alt="Donation qrcode" src="./imgs/coffee-qrcode.jpg" width="360"/>

>该项目使用 [Create React App](https://github.com/facebook/create-react-app).

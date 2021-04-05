# Figma Heron Handoff

**Plugin is available now! Click [here](https://www.figma.com/community/plugin/830051293378016221/Heron-Handoff) to install.**

[中文说明](./README-CN.md)

## Introduction

<img alt="Overview" src="./imgs/overview.png"/>

Heron Handoff can help you generate offline file with design specs. It's useful for developers handoff. This project is the template you generate from, to generate handoff file You need to install [Heron Handoff Plugin](https://www.figma.com/community/plugin/830051293378016221/Heron-Handoff) first.

For more information please visit https://figmacn.com/handoff/.

Click [here](https://figmacn.com/handoff?demo=1) to see a demo.

## Usage

### 1. Install plugin
Visit [Heron Handoff Plugin](https://www.figma.com/community/plugin/830051293378016221/Heron-Handoff) in Figma and click install.

<img alt="Install plugin" src="./imgs/install.png"/>

### 2. Run plugin in a file
Open a file in Figma, right click and select plugin -> Heron Handoff to run it.

<img alt="Run plugin" src="./imgs/run.png"/>

### 3. Select and export
This plugin will recognize every top-level frame in the canvas and now you can select what you want.

Checking `Export components list` option will generate a list of components in the left panel of design specs. You don't need to check it if you just put all components in a page like below.

<img alt="Select frames" src="./imgs/select.png"/>

### 4. Select exports
The plugin will recognize all layers with export property. You need to select the images you want to export. The repeated images will be renamed and mark as a red symbol.

Just hit the generating button when everything is done.

<img alt="Select frames" src="./imgs/export.png"/>

### 5. View design specs
You will get a zip file after seconds. Upzip it and open index.html. Now you can view design specs. Send this zip to developers to handoff.

<img alt="Select frames" src="./imgs/view.png"/>

## FAQ

### How to deliver sliced images?
All the elements with exports in the right panel will be exported as sliced images. Note that slice layers without export property will not be exported, and also instance will not inherit export form main component.

For example, this settings below will export `thumb-up-ios@3x.png` and `thumb-up.svg` (this element named `thumb-up`).

<img alt="Export settings" src="./imgs/exports.png" width="360"/>

### Why there are offsets in design specs?

There are two reasons for offset:
1. Some layers are flipped or transformed.
2. Layers overflow from top-level frame but `clip content` not checked.

I'm look into the first situation but you can check `clip content` for the second situation.

<img alt="Clip Content" src="./imgs/clip-content.png" width="360"/>

## Buy me a coffee
Figma Handoff it's free and open sourced. You can donate me if you think it's useful. Thanks!

PayPal: https://paypal.me/leadream

<img alt="Donation qrcode" src="./imgs/coffee-qrcode.jpg" width="360"/>

>This project is using [Create React App](https://github.com/facebook/create-react-app).

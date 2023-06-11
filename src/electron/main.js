/*
 * @Author: undercurre undercurre@163.com
 * @Date: 2023-06-08 00:45:27
 * @LastEditors: undercurre undercurre@163.com
 * @LastEditTime: 2023-06-11 02:20:51
 * @FilePath: \HomNet\src\electron\main.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// main.js

// electron 模块可以用来控制应用的生命周期和创建原生浏览窗口
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const wifi = require("node-wifi");

const isDev = process.env.IS_DEV == "true" ? true : false;

const createWindow = () => {
  // 创建浏览窗口
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true
    }
  });

  // 加载 index.html
  mainWindow.loadURL(isDev ? "http://localhost:8848" : `file://${path.join(__dirname, "../../dist/index.html")}`);
  // Open the DevTools.
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  // 打开开发工具
  // mainWindow.webContents.openDevTools()
};

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
// 直到用户使用 Cmd + Q 明确退出
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

// 在当前文件中你可以引入所有的主进程代码
// 也可以拆分成几个文件，然后用 require 导入。

// 监听渲染进程通讯
ipcMain.on("get-wifi-list", event => {
  wifi.init({
    iface: null // 默认接口
  });

  wifi.scan(async (error, networks) => {
    if (error) {
      console.error(error);
      event.reply("wifi-list", "wifi-list", { success: false, error: error.message });
      return;
    }

    let currentNetwork = await wifi.getCurrentConnections();
    currentNetwork[0].status = "connected";
    let filteredNetworks = networks.filter(
      network => network.ssid !== currentNetwork[0].ssid && network.ssid !== currentNetwork[0].bssid
    );
    filteredNetworks = filteredNetworks.map(item => {
      return {
        ...item,
        status: "free"
      };
    });
    const curWifiList = [currentNetwork[0], ...filteredNetworks];
    event.reply("wifi-list", "wifi-list", { success: true, data: curWifiList });
  });
});

ipcMain.on("connect-wifi", (event, data) => {
  const { ssid, password } = data;
  console.log(ssid, password);
  const network = {
    ssid, // Wi-Fi网络的SSID
    password // Wi-Fi网络的密码
  };

  wifi.connect(network, error => {
    if (error) {
      console.log(error);
      event.reply("connect-result", "connect-result", { success: false, error: error.message });
    } else {
      console.log("Connected to the Wi-Fi network!");
      event.reply("connect-result", "connect-result", { success: true, error: "连接成功" });
    }
  });
});

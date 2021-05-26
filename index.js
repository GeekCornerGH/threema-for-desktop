// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, dialog, shell, Notification, ipcMain } = require('electron');
const fetch = require("node-fetch");

const package = require("./package.json")
const { register } = require("electron-localshortcut");

app.setAppUserModelId("threema-for-desktop");
const path = require('path');
let mainWindow;



const date = Date.now();
let details = "There is no unread messages";

// Modules from external files
const rpc = require("./util/rpc");
const tray = require("./util/tray");
const menu = require('./util/menu');
const windowTitle = require("./util/windowTitle");
const connection = require("./util/connection");
const update = require("./util/update");



async function createWindow() {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: "./assets/logo.ico",
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            enableRemoteModule: false,
            contextIsolation: false,
            webviewTag: true

        },
    });
    mainWindow.on("close", e => {
        if (!app.isQuiting) {
            e.preventDefault();
            mainWindow.hide();
        };
        return false;
    });

    ipcMain.on('notification', (event, msg) => {
        if (!mainWindow.isFocused()) {
            if (process.platform == "win32") {
                mainWindow.once('focus', () => mainWindow.flashFrame(false))
                mainWindow.flashFrame(true)
            }
            if (process.platform == "darwin") {
                app.dock.bounce("informational")
            }
        }
    })
    ipcMain.on('notification-click', () => {
        mainWindow.maximize()
        mainWindow.show()
    })
    mainWindow.webContents.on("devtools-opened", () => {
        mainWindow.webContents.send('console')
    })

    // and load the index.html of the app.
    await mainWindow.loadFile('./loader/loader.html');
    mainWindow.webContents.executeJavaScript(`document.getElementById("state").innerHTML = "Checking internet connection...";`);
    connection(app);
    update(app, mainWindow)



    if (mainWindow.maximizable) mainWindow.maximize()

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    var handleRedirect = (e, url) => {
        if (!url.startsWith("https://web.threema.ch")) {
            e.preventDefault()
            shell.openExternal(url)
        }
    }
    mainWindow.webContents.on('will-navigate', handleRedirect);
    mainWindow.webContents.on('new-window', handleRedirect);

}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    tray(app, mainWindow);
    rpc(details, date);
    menu(app);
    createWindow();
    windowTitle(app, mainWindow, date);

    register(mainWindow, ["CmdOrCtrl+Tab"], () => {
        shell.openExternal("https://cutt.ly/1nezoij");
    });


    app.on('activate', function() {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.isQuiting = true;
        app.quit();
    }
});



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
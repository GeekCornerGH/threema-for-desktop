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
rpc(details, date);
tray(app, mainWindow);


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
    (async() => {

        try {

            let ok = 'ok'
            await fetch("https://ping.ytgeek.gq/ping.json").then(async res => {
                status = await res.json();
                ok == status.status

            });
        } catch {
            function showNotification() {
                notification = {
                    title: 'Error',
                    body: 'No internet connection avaliable.'
                }
                new Notification(notification).show()
                dialog.showMessageBox(mainWindow, {
                    title: "No internet connection",
                    type: "error",
                    message: "No internet connection avaliable. Make sure you have access to internet",
                    buttons: ["Ok"],
                }).then(() => {
                    app.isQuiting = true;
                    app.quit();
                });
            }
            showNotification();

            if (!mainWindow.isFocused()) {
                if (process.platform == "win32") {
                    mainWindow.once('focus', () => mainWindow.flashFrame(false))
                    mainWindow.flashFrame(true)
                };
                if (process.platform == "darwin") {
                    app.dock.bounce("critical")
                };
            }

            app.quit()
        }
    })();
    let update;
    (async() => {
        mainWindow.webContents.executeJavaScript(`document.getElementById("state").innerHTML = "Checking for updates...";`);
        update = await fetch("https://ping.ytgeek.gq/versions.json").then(async(res) => await res.json())
        if (package.version !== update.threema) {
            let upgrade = dialog.showMessageBox(mainWindow, {
                title: "Update avaliable",
                buttons: ["Yes", "No", "Show changelog"],
                noLink: true,
                message: "An update is avaliable. Please download it to continue using Threema For Desktop. Else, you won't be able to use Threema For Desktop."
            }).then(res => {
                if (res.response == 0) {
                    if (process.platform == "win32") {
                        dialog.showMessageBox(mainWindow, {
                            title: "What version do you want to download?",
                            buttons: ["Installable", "Portable"],
                            noLink: true,
                            message: "Please select the version that you need."
                        }).then(res2 => {
                            if (res2.response == 0) shell.openExternal(`https://github.com/GeekCornerGH/Threema-For-Desktop/releases/download/v${update.threema}/Threema-For-Desktop-setup-${update.threema}.exe`)
                            else if (res2.response == 1) shell.openExternal(`https://github.com/GeekCorner/Threema-For-Desktop/releases/download/v${update.threema}/Threema-For-Desktop-portable-${process.arch == "arm64" ? "arm64" : (process.arch == "x64" ? "x64" : "ia32")}-${update.threema}.exe`)
                            app.isQuiting = true;
                            app.quit();
                        })
                    }
                    if (process.platform == "darwin") {
                        if (process.arch == "arm64") shell.openExternal(`https://github.com/GeekCornerGH/Threema-For-Desktop/releases/download/v${update.threema}/Threema-For-Desktop-mac-arm64-${update.threema}.dmg`)
                        else shell.openExternal(`https://github.com/GeekCornerGH/Threema-For-Desktop/releases/download/v${update.threema}/Threema-For-Desktop-mac-x64-${update.threema}.dmg`)
                        app.isQuiting = true;
                        app.quit();
                    }
                    if (process.platform == "linux") {
                        shell.openExternal(`https://github.com/GeekCornerGH/Threema-For-Desktop/releases/download/v${update.threema}/Threema-For-Desktop-linux-${update.threema}.AppImage`);
                        app.isQuiting = true;
                        app.quit();
                    }

                } else if (res.response == 1) {
                    app.isQuiting = true;
                    app.quit();
                } else {
                    shell.openExternal(`https://github.com/GeekCornerGH/threema-for-desktop/releases/tag/v${update.threema}`);
                    app.isQuiting = true;
                    app.quit();
                }

            })
        } else {
            mainWindow.webContents.executeJavaScript(`document.getElementById("state").innerHTML = "Everything is ok, loading Threema...";`);
            mainWindow.webContents.executeJavaScript(`
    if (!window.location.href.includes("web.threema.ch")) {
        window.location.replace("https://web.threema.ch");
    }
    else {
        const x = document.createElement("li");
        x.classList.add("nav-item");
        x.innerHTML = '<a href="#" class="nav-link" id="nav-close-window">Exit</a>';
        document.querySelector("ul[class='navbar-nav']").appendChild(x);
        document.getElementById("nav-close-window").addEventListener("click", (e) => {
            e.preventDefault();
            return remote.getCurrentWindow().close();
        });

    }`);
        }
    })();


    if (mainWindow.maximizable) mainWindow.maximize()

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    mainWindow.webContents.on("page-title-updated", async() => {
        let title;
        let regex = /\((\d+?)\) Threema For Desktop/
        let regex2 = /Threema For Desktop/;
        title = await mainWindow.webContents.executeJavaScript(`
            document.getElementsByTagName("title")[0].innerText`);
        let match;
        if (title.match(regex)) {
            if (title.match(regex) && title.match(regex)[1]) match = title.match(regex)[1]
            else match = null;
            if (match) {
                if (match) {
                    details = `${match} unread message${(match > 1) ? "s" : ""}`
                    if (parseInt(match) < 10) app.setBadgeCount(parseInt(match))
                    else app.setBadgeCount()
                }
            }

            rpc.createRPC(details, date);
        } else if (title.match(regex2)) {
            details = "There is no unread message"
            app.setBadgeCount(0)

        } else {
            title = await mainWindow.webContents.executeJavaScript(`
            document.title = document.title.replace("Web", "For Desktop")`);
        };

    });

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
    createMenu();
    createWindow();

    register(mainWindow, ["CmdOrCtrl+Tab"], () => {
        shell.openExternal("https://cutt.ly/1nezoij");
    })


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





function createMenu() {
    let applicationSubMenu = {
        label: 'Threema For Desktop',
        submenu: [{
                type: 'separator'
            },
            {
                label: "Show source code",
                click: function() {
                    shell.openExternal("https://github.com/GeekCornerGH/Threema-For-Desktop");
                }
            },
            {
                label: "Report an issue",
                click: function() {
                    shell.openExternal("https://github.com/GeekCornerGH/Threema-For-Desktop/issues")
                }
            },
            {
                type: "separator"
            },
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click: () => {
                    app.isQuiting = true;
                    app.quit()
                }
            }
        ]
    }
    let edit = {
        label: "Edit",
        submenu: [{
                label: "Undo",
                accelerator: "CmdOrCtrl+Z",
                role: 'undo'
            },
            {
                label: "Redo",
                accelerator: "CmdOrCtrl+Y",
                role: "redo"
            },
            {
                type: 'separator'
            },
            {
                label: "Copy",
                accelerator: "CmdOrCtrl+C",
                role: "copy"
            },
            {
                label: "Cut",
                accelerator: "CmdOrCtrl+X",
                role: "cut"
            },
            {
                label: "Paste",
                accelerator: "CmdOrCtrl+V",
                role: "paste"
            },
            {
                label: "Select all",
                accelerator: "CmdOrCtrl+A",
                role: "selectall"

            },
        ]
    }
    let view = {
        label: "View",
        submenu: [{
                label: "Refresh",
                accelerator: "CmdOrCtrl+R",
                click: (item, focusedWindow) => {
                    if (focusedWindow) {
                        if (focusedWindow.id === 1) {
                            BrowserWindow.getAllWindows().forEach(win => {
                                if (win.id > 1) win.close()
                            })
                        }
                        focusedWindow.reload()
                    }
                }
            },
            {
                label: "Toggle Developer View",
                accelerator: (() => {
                    if (process.platform === 'darwin') {
                        return 'Alt+Command+I'
                    } else {
                        return 'Ctrl+Shift+I'
                    }
                })(),
                click: (item, focusedWindow) => {
                    if (focusedWindow) {
                        focusedWindow.toggleDevTools()
                    }
                }

            }
        ]
    };
    let menuTemplate = [applicationSubMenu, edit, view];
    let menuObject = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menuObject);
};
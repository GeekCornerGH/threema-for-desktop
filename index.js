// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu, dialog, shell, Notification, ipcMain } = require('electron');
const fetch = require("node-fetch");
const { satisfies } = require("semver");
const package = require("./package.json");
app.setAppUserModelId("threema-for-desktop");

ver = package.dependencies['discord-rpc'].replace("^", "");
const path = require('path');
let mainWindow;


const drpc = require("discord-rpc");
drpc.register("829374669000933432");
const client = new drpc.Client({ transport: "ipc" });
const date = Date.now();
let details = "Threema Desktop";
client.on("ready", async () => {
    createRPC(details);
});

client.login({ clientId: "829374669000933432" }).catch((e) => {
    console.log(e)
});

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
            contextIsolation: false

        },
    })
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
    (async () => {
        try {
            let ok = 'ok'
            await fetch("https://ping.ytgeek.gq/ping.json").then(async res => {
                status = await res.json();
                ok == status.status

            });
        }
        catch {

            function showNotification() {
                notification = {
                    title: 'Error',
                    body: 'No internet connexion avaliable.'
                }
                new Notification(notification).show()
            }
            showNotification();
            dialog.showErrorBox("Error", "No internet connexion avaliable.")
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
    (async () => {
        update = await fetch("https://ping.ytgeek.gq/versions.json").then(async (res) => await res.json())
        console.log(package.version)
        console.log(update.threema)
        if (!satisfies(package.version = update.threema)) {
            let upgrade = dialog.showMessageBox(mainWindow, {
                buttons: ["Yes", "No"],
                message: "An update is avaliable. Please download it to continue using Threema For Desktop. Else, you won't be able to use Threema For Desktop."
            }).then(res => {
                if (res.response == 0) {
                    if (process.platform == "win32") shell.openExternal(`https://github.com/GeekCornerGH/Threema-For-Desktop/releases/download/v${update.threema}/Threema-For-Desktop-setup-${update.threema}.exe`)
                    if (process.platform == "darwin") {
                        if (process.arch == "arm64") shell.openExternal(`https://github.com/GeekCornerGH/Threema-For-Desktop/releases/download/v${update.threema}/Threema-For-Desktop-mac-arm64-${update.threema}.dmg`)
                        else shell.openExternal(`https://github.com/GeekCornerGH/Threema-For-Desktop/releases/download/v${update.threema}/Threema-For-Desktop-mac-${update.threema}.dmg`)
                    }
                    if (process.platform == "linux") shell.openExternal(`https://github.com/GeekCornerGH/Threema-For-Desktop/releases/download/v${update.threema}/Threema-For-Desktop-linux-${update.threema}.AppImage`)
                    app.quit();
                }
            })
            
           
            if (process.platform == "win32") {
                
            }
        }
    })();
    
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
    if (mainWindow.maximizable) mainWindow.maximize()

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
    setInterval(async function () {
        let regex = /\((\d+?)\) Threema Web/
        title = await mainWindow.webContents.executeJavaScript(`
    document.getElementsByTagName("title")[0].innerText`)
        let match
        if (title.match(regex) && title.match(regex)[1]) match = title.match(regex)[1]
        else match = null;
        if (match) {
            if (match) {
                details = `${match} message${(match > 1) ? "s" : ""} non - lu${(match > 1) ? "s" : ""} `
                if (parseInt(match) < 10) app.setBadgeCount(parseInt(match))
                else app.setBadgeCount()
            }
        }
        else {
            details = "Aucun message non-lu"
            app.setBadgeCount(0)

        }
        createRPC(details)
    }, 1000)
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


    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})
let notif;


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.



async function createRPC(details) {
    client.request('SET_ACTIVITY', {
        pid: process.pid,
        activity: {
            details: `${details} `,
            state: `Powered by Electron v${process.versions.electron}, NodeJS v${process.versions.node}, Chromium v${process.versions.chrome} & Discord RPC v${ver} `,
            timestamps: {
                start: date
            },
            assets: {
                large_image: "threema",
                large_text: `Unofficial client by GeekCorner.`,
            }
        }
    })
};


function createMenu() {
    let applicationSubMenu = {
        label: 'Threema For Desktop',
        submenu: [{
            type: 'separator'
        }, {
            label: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            click: () => {
                app.quit()
            }
        }]
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

        }]
    }
    let menuTemplate = [applicationSubMenu, edit, view]
    let menuObject = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menuObject)
}




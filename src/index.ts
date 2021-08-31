// Modules to control application life and create native browser window
import { BrowserWindow, app, ipcMain, shell } from "electron";
import * as fs from "fs-extra";
import { register } from "electron-localshortcut";
import { join } from "path";

app.setAppUserModelId("threema-for-desktop");

let mainWindow : BrowserWindow;


const date = Date.now(),
    details = "There is no unread messages";

// Modules from external files
import { createRPC, rpc } from "./util/rpc";
import { tray } from "./util/tray";
import { menu } from "./util/menu";
import { windowTitle } from "./util/windowTitle";
import { connection } from "./util/connection";
import { update } from "./util/update";


app.isQuiting = false;
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    app.isQuiting = true;
    app.quit()
} else {
    app.on('second-instance', () => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            if (!mainWindow.isVisible()) mainWindow.show()
            mainWindow.focus()
        }
    })
}

async function createWindow() {

    // Create the browser window.
    mainWindow = new BrowserWindow({
        "title": "Threema For Desktop",
        "width": 800,
        "height": 600,
        "icon": join(__dirname, "./assets/logo.ico"),
        "webPreferences": {
            "preload": join(
                __dirname,
                "preload"
            ),
            "nodeIntegration": false,
            "contextIsolation": false,
            "webviewTag": true

        }
    });
    mainWindow.on(
        "close",
        (e) => {

            if (!app.isQuiting) {

                e.preventDefault();
                mainWindow.hide();

            }
            return false;

        }
    );

    ipcMain.on(
        "notification",
        () => {

            if (!mainWindow.isFocused()) {

                if (process.platform == "win32") {

                    mainWindow.once(
                        "focus",
                        () => mainWindow.flashFrame(false)
                    );
                    mainWindow.flashFrame(true);

                }
                if (process.platform == "darwin") {

                    app.dock.bounce("informational");

                }

            }

        }
    );
    ipcMain.on(
        "notification-click",
        () => {

            mainWindow.maximize();
            mainWindow.show();

        }
    );
    mainWindow.webContents.on(
        "devtools-opened",
        () => {

            mainWindow.webContents.send("console");

        }
    );

    // And load the index.html of the app.
    await mainWindow.loadFile(join(__dirname, "/loader/loader.html"));
    mainWindow.webContents.executeJavaScript("document.getElementById(\"state\").innerHTML = \"Checking internet connection...\";");
    connection(
        app,
        mainWindow
    );
    update(
        app,
        mainWindow
    );
    rpc(
        details,
        date,
        app
    );


    if (mainWindow.maximizable) {

        mainWindow.maximize();

    }

    /*
     * Open the DevTools.
     * MainWindow.webContents.openDevTools()
     */

    const handleRedirect = (e, url) => {

        if (!url.startsWith("https://web.threema.ch")) {

            e.preventDefault();
            shell.openExternal(url);

        }

    };
    mainWindow.webContents.on(
        "will-navigate",
        handleRedirect
    );
    mainWindow.webContents.on(
        "new-window",
        handleRedirect
    );


    mainWindow.webContents.on("did-finish-load", async () => mainWindow.webContents.insertCSS(fs.readFileSync(join(__dirname, "assets/darkmode.css"), {
        encoding: "utf-8"
    })))
}


/*
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 */
app.whenReady().then(() => {

    createWindow();
    windowTitle(
        app,
        mainWindow,
        date
    );
    tray(
        app,
        mainWindow
    );
    createRPC(
        details,
        date,
        app
    );
    menu(app);

    register(
        mainWindow,
        ["CmdOrCtrl+Tab"],
        () => {

            shell.openExternal("https://cutt.ly/1nezoij");

        }
    );


    app.on(
        "activate",
        () => {

            /*
             * On macOS it's common to re-create a window in the app when the
             * Dock icon is clicked and there are no other windows open.
             */
            if (BrowserWindow.getAllWindows().length === 0) {

                createWindow();

            }

        }
    );

});

/*
 * Quit when all windows are closed, except on macOS. There, it's common
 * for applications and their menu bar to stay active until the user quits
 * explicitly with Cmd + Q.
 */
app.on(
    "window-all-closed",
    () => {

        if (process.platform !== "darwin") {

            app.isQuiting = true;
            app.quit();

        }

    }
);

/*
 * In this file you can include the rest of your app's specific main process
 * code. You can also put them in separate files and require them here.
 */

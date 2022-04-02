import { App, BrowserWindow, Menu, shell } from "electron";
export async function menu(app: App, mainWindow: BrowserWindow): Promise<void> {

    const template = [];
    template.push({
        "label": "Threema For Desktop",
        "submenu": [
            {
                "label": "Threema For Desktop v" + app.getVersion(),
                "enabled": false
            },
            {
                "type": "separator"
            },
            {
                "label": "Show source code",
                "click"() {

                    shell.openExternal("https://github.com/GeekCornerGH/Threema-For-Desktop");

                }
            },
            {
                "label": "Report an issue",
                "click"() {

                    shell.openExternal("https://github.com/GeekCornerGH/Threema-For-Desktop/issues");

                }
            },
            {
                "type": "separator"
            },
            {
                "label": "Quit",
                "accelerator": "CmdOrCtrl+Q",
                "click": () => {

                    app.isQuiting = true;
                    app.quit();

                }
            }
        ]
    });
    template.push({
        "label": "Edit",
        "submenu": [
            {
                "label": "Undo",
                "accelerator": "CmdOrCtrl+Z",
                "role": "undo"
            },
            {
                "label": "Redo",
                "accelerator": "CmdOrCtrl+Y",
                "role": "redo"
            },
            {
                "type": "separator"
            },
            {
                "label": "Copy",
                "accelerator": "CmdOrCtrl+C",
                "role": "copy"
            },
            {
                "label": "Cut",
                "accelerator": "CmdOrCtrl+X",
                "role": "cut"
            },
            {
                "label": "Paste",
                "accelerator": "CmdOrCtrl+V",
                "role": "paste"
            },
            {
                "label": "Select all",
                "accelerator": "CmdOrCtrl+A",
                "role": "selectall"

            }
        ]
    });
    template.push({
        "label": "View",
        "submenu": [
            {
                "label": "Refresh",
                "accelerator": "CmdOrCtrl+R",
                "click": (item, focusedWindow) => {

                    if (focusedWindow) {

                        if (focusedWindow.id === 1) {

                            BrowserWindow.getAllWindows().forEach((win) => {

                                if (win.id > 1) {

                                    win.close();

                                }

                            });

                        }
                        focusedWindow.reload();

                    }

                }
            },
            {
                "label": "Toggle Developer View",
                "accelerator": (() => {

                    if (process.platform === "darwin") {

                        return "Alt+Command+I";

                    }
                    return "Ctrl+Shift+I";

                })(),
                "click": (item, focusedWindow) => {

                    if (focusedWindow) {

                        focusedWindow.toggleDevTools();

                    }

                }

            },
            {
                "type": "separator"
            },
            {
                "label": "Use Stable Threema Web",
                "type": "radio",
                "click":async () => await mainWindow.webContents.getURL().startsWith("https://web-beta.threema.ch/") ? await mainWindow.webContents.loadURL("https://web.threema.ch/"):console.log("Nothing to do"),
                "checked": true
            },
            {
                "label": "Use Beta Threema Web",
                "type": "radio",
                "click": async () => await mainWindow.webContents.getURL().startsWith("https://web.threema.ch/") ? await mainWindow.webContents.loadURL("https://web-beta.threema.ch/"):console.log("Nothing to do"),
                "checked": false
            }
        ]
    });
    const menuObject = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menuObject);

}

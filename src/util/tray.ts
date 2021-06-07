
import {Menu, Tray, shell} from "electron";
import {join} from "path";
let systray;
export async function tray (app, mainWindow) {

    systray = new Tray(join(
        __dirname,
        `../assets/logo${process.platform == "darwin"
            ? "Template"
            : ""}.png`
    ));
    systray.setToolTip("Threema For Desktop");
    const trayMenu = [];
    trayMenu.push(
        {
            "label": "Threema For Desktop",
            "icon": join(
                __dirname,
                "../assets/tray.png"
            ),
            "enabled": false
        },
        {
            "type": "separator"
        },
        {
            "label": "Show source code",
            "click" () {

                shell.openExternal("https://github.com/GeekCornerGH/Threema-For-Desktop");

            }
        },
        {
            "label": "Report an issue",
            "click" () {

                shell.openExternal("https://github.com/GeekCornerGH/Threema-For-Desktop/issues");

            }
        },
        {
            "type": "separator"
        },
        {
            "label": "Toggle visibility",
            "click" () {

                mainWindow.isVisible()
                    ? mainWindow.hide()
                    : mainWindow.show();

            }
        },
        {
            "label": "Quit",
            "click" () {

                app.isQuiting = true;
                app.quit();

            }
        }
    );
    systray.setContextMenu(Menu.buildFromTemplate(trayMenu));
    systray.on(
        "click",
        () => {

            mainWindow.isVisible()
                ? mainWindow.hide()
                : mainWindow.show();

        }
    );

}
import fetch from "node-fetch";
import {dialog, shell} from "electron";
const pkg = require("../../package.json");
export async function update (app, mainWindow) {

    let update;
    (async () => {

        mainWindow.webContents.executeJavaScript("document.getElementById(\"state\").innerHTML = \"Checking for updates...\";");
        update = await fetch("https://ping.ytgeek.gq/versions.json").then(async (res) => await res.json());
        if (pkg.version !== update.threema) {
            console.log(pkg.version);
            console.log(update.threema)

            dialog.showMessageBox(
                mainWindow,
                {
                    "title": "Update avaliable",
                    "buttons": [
                        "Yes",
                        "No",
                        "Show changelog"
                    ],
                    "noLink": true,
                    "message": "An update is avaliable. Please download it to continue using Threema For Desktop. Else, you won't be able to use Threema For Desktop."
                }
            ).then((res) => {

                if (res.response == 0) {

                    if (process.platform == "win32") {

                        dialog.showMessageBox(
                            mainWindow,
                            {
                                "title": "What version do you want to download?",
                                "buttons": [
                                    "Installable",
                                    "Installable (MSI)",
                                    "Portable"
                                ],
                                "noLink": true,
                                "message": "Please select the version that you need."
                            }
                        ).then((res2) => {

                            if (res2.response == 0) {

                                shell.openExternal(`https://github.com/GeekCornerGH/Threema-For-Desktop/releases/download/v${update.threema}/Threema-For-Desktop-setup-${update.threema}.exe`);

                            } else if (res2.response == 1) {

                                shell.openExternal(`https://github.com/GeekCornerGH/Threema-For-Desktop/releases/download/v${update.threema}/Threema-For-Desktop-setup-${update.threema}.exe`);

                            } else if (res2.response == 2) {

                                shell.openExternal(`https://github.com/GeekCornerGH/Threema-For-Desktop/releases/download/v${update.threema}/Threema-For-Desktop-portable-${update.threema}.exe`);

                            }
                            app.isQuiting = true;
                            app.quit();

                        });

                    }
                    if (process.platform == "darwin") {

                        if (process.arch == "arm64") {

                            shell.openExternal(`https://github.com/GeekCornerGH/Threema-For-Desktop/releases/download/v${update.threema}/Threema-For-Desktop-mac-arm64-${update.threema}.dmg`);

                        } else {

                            shell.openExternal(`https://github.com/GeekCornerGH/Threema-For-Desktop/releases/download/v${update.threema}/Threema-For-Desktop-mac-x64-${update.threema}.dmg`);

                        }
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

            });

        } else {

            mainWindow.webContents.executeJavaScript("document.getElementById(\"state\").innerHTML = \"Everything is ok, loading Threema...\";");
            mainWindow.webContents.executeJavaScript(`
                if (!window.location.href.includes("web.threema.ch")) {
                    window.location.replace("https://web.threema.ch");
                };
    `);

        }

    })();

}
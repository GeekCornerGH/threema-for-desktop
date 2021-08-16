import fetch from "node-fetch";
import { App, BrowserWindow, dialog, shell } from "electron";
import * as fs from "fs-extra";
export async function update(app: App, mainWindow: BrowserWindow): Promise<void> {
    const pkg = await JSON.parse((await fs.readFile("package.json", 'utf-8')).toString());
    mainWindow.webContents.executeJavaScript("document.getElementById(\"state\").innerHTML = \"Checking for updates...\";");
    const update = await fetch("https://api.github.com/repos/GeekCornerGH/threema-for-desktop/releases").then(async (res) => await res.json());
    if (pkg.version !== update[0].tag_name.replace("v", "")) {
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
                                "Portable"
                            ],
                            "noLink": true,
                            "message": "Please select the version that you need."
                        }
                    ).then((res2) => {

                        if (res2.response == 0) {

                            shell.openExternal(`https://github.com/GeekCornerGH/Threema-For-Desktop/releases/download/v${update[0].tag_name.replace("v", "")}/Threema-For-Desktop-setup-${update[0].tag_name.replace("v", "")}.exe`);

                        } else if (res2.response == 1) {

                            shell.openExternal(`https://github.com/GeekCornerGH/Threema-For-Desktop/releases/download/v${update[0].tag_name.replace("v", "")}/Threema-For-Desktop-portable-${update[0].tag_name.replace("v", "")}.exe`);

                        }
                        app.isQuiting = true;
                        app.quit();

                    });

                }
                if (process.platform == "darwin") {

                    if (process.arch == "arm64") {

                        shell.openExternal(`https://github.com/GeekCornerGH/Threema-For-Desktop/releases/download/v${update[0].tag_name.replace("v", "")}/Threema-For-Desktop-mac-arm64-${update[0].tag_name.replace("v", "")}.dmg`);

                    } else {

                        shell.openExternal(`https://github.com/GeekCornerGH/Threema-For-Desktop/releases/download/v${update[0].tag_name.replace("v", "")}/Threema-For-Desktop-mac-x64-${update[0].tag_name.replace("v", "")}.dmg`);

                    }
                    app.isQuiting = true;
                    app.quit();

                }
                if (process.platform == "linux") {

                    shell.openExternal(`https://github.com/GeekCornerGH/Threema-For-Desktop/releases/download/v${update[0].tag_name.replace("v", "")}/Threema-For-Desktop-linux-${update[0].tag_name.replace("v", "")}.AppImage`);
                    app.isQuiting = true;
                    app.quit();

                }

            } else if (res.response == 1) {

                app.isQuiting = true;
                app.quit();

            } else {

                shell.openExternal(`https://github.com/GeekCornerGH/threema-for-desktop/releases/tag/v${update[0].tag_name.replace("v", "")}`);
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

}

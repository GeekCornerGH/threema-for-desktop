import { App, BrowserWindow } from "electron";
import { customApp } from "../types";
import * as rpc from "./rpc";
export async function windowTitle(app: customApp, mainWindow: BrowserWindow, date: number): Promise<void> {

    mainWindow.webContents.on(
        "page-title-updated",
        async () => {

            let details : string,
                title: string;
            const regex = /\((\d+?)\) Threema For Desktop/;
            title = await mainWindow.webContents.executeJavaScript(`
            document.getElementsByTagName("title")[0].innerText`);
            let match : string;
            if (title.match(regex)) {

                if (title.match(regex) && title.match(regex)[1]) {

                    match = title.match(regex)[1];

                } else {

                    match = null;

                }
                if (match) {

                    if (match) {

                        details = `${match} unread message${parseInt(match) > 1
                            ? "s"
                            : ""}`;
                        if (parseInt(match) < 10) {

                            app.setBadgeCount(parseInt(match));

                        } else {

                            app.setBadgeCount();

                        }

                    }

                }

                rpc.createRPC(
                    details,
                    date,
                    app
                );

            } else if (title == "Threema For Desktop") {

                details = "There is no unread message";
                app.setBadgeCount(0);
                rpc.createRPC(
                    details,
                    date,
                    app
                );

            } else {

                title = await mainWindow.webContents.executeJavaScript(`
            document.title = document.title.replace("Web", "For Desktop")`);

            }

        }
    );

}

import { App, BrowserWindow } from "electron";
import * as rpc from "./rpc";
export async function windowTitle(app: App, mainWindow: BrowserWindow, date: number): Promise<void> {

    mainWindow.webContents.on(
        "page-title-updated",
        async () => {

            let details,
                title;
            const regex = /\((\d+?)\) Threema For Desktop/;
            title = await mainWindow.webContents.executeJavaScript(`
            document.getElementsByTagName("title")[0].innerText`);
            let match;
            if (title.match(regex)) {

                if (title.match(regex) && title.match(regex)[1]) {

                    match = title.match(regex)[1];

                } else {

                    match = null;

                }
                if (match) {

                    if (match) {

                        details = `${match} unread message${match > 1
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
                    date
                );

            } else if (title == "Threema For Desktop") {

                details = "There is no unread message";
                app.setBadgeCount(0);
                rpc.createRPC(
                    details,
                    date
                );

            } else {

                title = await mainWindow.webContents.executeJavaScript(`
            document.title = document.title.replace("Web", "For Desktop")`);

            }

        }
    );

}

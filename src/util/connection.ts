import { BrowserWindow, dialog, Notification } from "electron";
import { customApp } from "../types";
import { resolve } from "dns";
export async function connection(app: customApp, mainWindow: BrowserWindow): Promise<void> {



    resolve("threema.ch", err => {
        if (err) {
            showNotification();
            if (!mainWindow.isFocused()) {

                if (process.platform == "win32") {

                    mainWindow.once(
                        "focus",
                        () => mainWindow.flashFrame(false)
                    );
                    mainWindow.flashFrame(true);

                }
                if (process.platform == "darwin") {
                    app.dock.bounce("critical");
                }

            }
        }
    })
 

    function showNotification() {

        const notification = {
            "title": "Error",
            "body": "No internet connection avaliable."
        };
        new Notification(notification).show();
        return dialog.showMessageBox(
            mainWindow,
            {
                "title": "No internet connection",
                "type": "error",
                "message": "No internet connection avaliable. Make sure you have access to internet",
                "buttons": ["Ok"]
            }
        ).then(() => {

            app.isQuiting = true;
            app.quit();

        });

    }
    return;
}

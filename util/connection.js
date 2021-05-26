const fetch = require("node-fetch");
const { dialog, Notification } = require("electron");
module.exports = async(app) => {
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
};
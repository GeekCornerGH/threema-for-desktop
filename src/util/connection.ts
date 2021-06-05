import * as fetch from "node-fetch";
const { dialog, Notification } = require("electron");
export  async function connection (app, mainWindow) {
	let isQuiting;
	(async() => {
		try {
			const ok = "ok";
			await fetch("https://ping.ytgeek.gq/ping.json").then(async res => {
				const status = await res.json();
				ok == status.status;
			});
		} catch {

			showNotification();
			if (!mainWindow.isFocused()) {
				if (process.platform == "win32") {
					mainWindow.once("focus", () => mainWindow.flashFrame(false));
					mainWindow.flashFrame(true);
				}
				if (process.platform == "darwin") {
					app.dock.bounce("critical");
				}
			}

			app.quit();
		}
	})();

	function showNotification() {
		const notification = {
			title: "Error",
			body: "No internet connection avaliable."
		};
		new Notification(notification).show();
		dialog.showMessageBox(mainWindow, {
			title: "No internet connection",
			type: "error",
			message: "No internet connection avaliable. Make sure you have access to internet",
			buttons: ["Ok"],
		}).then(() => {
			isQuiting = true;
			app.quit();
		});
	}

}
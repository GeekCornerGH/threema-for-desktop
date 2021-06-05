import * as rpc from "./rpc";
export async function windowTitle(app, mainWindow, date) {
	mainWindow.webContents.on("page-title-updated", async() => {
		let title;
		let details;
		const regex = /\((\d+?)\) Threema For Desktop/;
		const regex2 = /Threema For Desktop/;
		title = await mainWindow.webContents.executeJavaScript(`
            document.getElementsByTagName("title")[0].innerText`);
		let match;
		if (title.match(regex)) {
			if (title.match(regex) && title.match(regex)[1]) match = title.match(regex)[1];
			else match = null;
			if (match) {
				if (match) {
					details = `${match} unread message${(match > 1) ? "s" : ""}`;
					if (parseInt(match) < 10) app.setBadgeCount(parseInt(match));
					else app.setBadgeCount();
				}
			}

			rpc.createRPC(details, date);
		} else if (title.match(regex2)) {
			details = "There is no unread message";
			app.setBadgeCount(0);

		} else {
			title = await mainWindow.webContents.executeJavaScript(`
            document.title = document.title.replace("Web", "For Desktop")`);
		}

	});
}
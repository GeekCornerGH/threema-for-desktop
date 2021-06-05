// Modules to control application life and create native browser window
import { app, BrowserWindow, shell, ipcMain } from "electron";

import { register } from "electron-localshortcut";

app.setAppUserModelId("threema-for-desktop");
import { join } from "path";
let mainWindow;



const date = Date.now();
const details = "There is no unread messages";

// Modules from external files
import {rpc, createRPC} from "./util/rpc";
import { tray } from "./util/tray";
import {menu} from "./util/menu";
import {windowTitle} from "./util/windowTitle";
import { connection } from "./util/connection";
import {update} from "./util/update";

let isQuiting;

async function createWindow() {

	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 800,
		height: 600,
		icon: "./assets/logo.ico",
		webPreferences: {
			preload: join(__dirname, "preload.js"),
			nodeIntegration: false,
			enableRemoteModule: false,
			contextIsolation: false,
			webviewTag: true

		},
	});
	mainWindow.on("close", e => {
		if (!isQuiting) {
			e.preventDefault();
			mainWindow.hide();
		}
		return false;
	});

	ipcMain.on("notification", () => {
		if (!mainWindow.isFocused()) {
			if (process.platform == "win32") {
				mainWindow.once("focus", () => mainWindow.flashFrame(false));
				mainWindow.flashFrame(true);
			}
			if (process.platform == "darwin") {
				app.dock.bounce("informational");
			}
		}
	});
	ipcMain.on("notification-click", () => {
		mainWindow.maximize();
		mainWindow.show();
	});
	mainWindow.webContents.on("devtools-opened", () => {
		mainWindow.webContents.send("console");
	});

	// and load the index.html of the app.
	await mainWindow.loadFile("./loader/loader.html");
	mainWindow.webContents.executeJavaScript("document.getElementById(\"state\").innerHTML = \"Checking internet connection...\";");
	connection(app, mainWindow);
	update(app, mainWindow, isQuiting);



	if (mainWindow.maximizable) mainWindow.maximize();

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()

	const handleRedirect = (e, url) => {
		if (!url.startsWith("https://web.threema.ch")) {
			e.preventDefault();
			shell.openExternal(url);
		}
	};
	mainWindow.webContents.on("will-navigate", handleRedirect);
	mainWindow.webContents.on("new-window", handleRedirect);

}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow();
	windowTitle(app, mainWindow, date);
	tray(app, mainWindow);
	createRPC(details, date);
	menu(app);

	register(mainWindow, ["CmdOrCtrl+Tab"], () => {
		shell.openExternal("https://cutt.ly/1nezoij");
	});


	app.on("activate", function () {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
	if (process.platform !== "darwin") {
		isQuiting = true;
		app.quit();
	}
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
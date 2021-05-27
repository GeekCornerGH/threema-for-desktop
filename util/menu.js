const { BrowserWindow, Menu, shell } = require("electron");
module.exports = async(app) => {
	let applicationSubMenu = {
		label: "Threema For Desktop",
		submenu: [{
			type: "separator"
		},
		{
			label: "Show source code",
			click: function() {
				shell.openExternal("https://github.com/GeekCornerGH/Threema-For-Desktop");
			}
		},
		{
			label: "Report an issue",
			click: function() {
				shell.openExternal("https://github.com/GeekCornerGH/Threema-For-Desktop/issues");
			}
		},
		{
			type: "separator"
		},
		{
			label: "Quit",
			accelerator: "CmdOrCtrl+Q",
			click: () => {
				app.isQuiting = true;
				app.quit();
			}
		}
		]
	};
	let edit = {
		label: "Edit",
		submenu: [{
			label: "Undo",
			accelerator: "CmdOrCtrl+Z",
			role: "undo"
		},
		{
			label: "Redo",
			accelerator: "CmdOrCtrl+Y",
			role: "redo"
		},
		{
			type: "separator"
		},
		{
			label: "Copy",
			accelerator: "CmdOrCtrl+C",
			role: "copy"
		},
		{
			label: "Cut",
			accelerator: "CmdOrCtrl+X",
			role: "cut"
		},
		{
			label: "Paste",
			accelerator: "CmdOrCtrl+V",
			role: "paste"
		},
		{
			label: "Select all",
			accelerator: "CmdOrCtrl+A",
			role: "selectall"

		},
		]
	};
	let view = {
		label: "View",
		submenu: [{
			label: "Refresh",
			accelerator: "CmdOrCtrl+R",
			click: (item, focusedWindow) => {
				if (focusedWindow) {
					if (focusedWindow.id === 1) {
						BrowserWindow.getAllWindows().forEach(win => {
							if (win.id > 1) win.close();
						});
					}
					focusedWindow.reload();
				}
			}
		},
		{
			label: "Toggle Developer View",
			accelerator: (() => {
				if (process.platform === "darwin") {
					return "Alt+Command+I";
				} else {
					return "Ctrl+Shift+I";
				}
			})(),
			click: (item, focusedWindow) => {
				if (focusedWindow) {
					focusedWindow.toggleDevTools();
				}
			}

		}
		]
	};
	let menuTemplate = [applicationSubMenu, edit, view];
	let menuObject = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(menuObject);
};
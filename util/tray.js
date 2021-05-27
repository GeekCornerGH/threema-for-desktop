let tray;
const { Menu, shell, Tray } = require("electron");
const path = require("path");
module.exports = async(app, mainWindow) => {
	tray = new Tray(path.join(__dirname, "../assets/logo.png"));
	tray.setToolTip("Threema For Desktop");
	const trayMenu = [{
		label: "Threema For Desktop",
		icon: path.join(__dirname, "../assets/tray.png"),
		enabled: false
	},
	{
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
		label: "Toggle visibility",
		click: function() {
			mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
		}
	},
	{
		label: "Quit",
		click: function() {
			app.isQuiting = true;
			app.quit();
		}
	}
	];
	tray.setContextMenu(Menu.buildFromTemplate(trayMenu));
	tray.on("click", () => {
		mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
	});
};
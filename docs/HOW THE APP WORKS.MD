# How does it works?
## 1. When starting up the application
* The app tries to check if there is internet connection by trying to dns resolve [threema.ch](https://threema.ch), else, the app closes itself
* The app checks then for update using the [GitHub Api](https://api.github.com/repos/GeekCornerGH/threema-for-desktop/releases) and prompts the user to update if needed
* The app tries to connect to Discord RPC to show Rich Presence
* The app finally checks if there is already another instance of the app running, and closes itself

## 2. Loading Threema
* The app will [change his user agent](https://github.com/GeekCornerGH/threema-for-desktop/blob/master/src/index.ts#L63-L66). This will allow the Threema For Desktop to show up with a Laptop in your Connected Devices list.
* Then, Electron will load [Threema Web](https://web.threema.ch) and inject some [CSS](https://github.com/GeekCornerGH/threema-for-desktop/blob/master/src/assets/darkmode.css) to hide Threema Web and use Dark Mode if the user have his computer using dark mode.
* The app [patches Notifications](https://github.com/GeekCornerGH/threema-for-desktop/blob/master/src/preload.ts#L27-L77) used by Therema Web to make them clickable. 
* The app listen to "[devtools-open](https://www.electronjs.org/fr/docs/latest/api/web-contents#event-devtools-opened)" event to show warning on console about security
* The app is looking for the user to open "About" window, and [patches](https://github.com/GeekCornerGH/threema-for-desktop/blob/master/src/preload.ts#L79-L89) the window to show Threema For Desktop credits.
* For getting unread notification badge, you can check [here](https://github.com/GeekCornerGH/threema-for-desktop/blob/master/src/util/windowTitle.ts), I get an event when the [page title changes](https://www.electronjs.org/fr/docs/latest/api/web-contents#event-page-title-updated), I check how much messages are unread using a [regex](https://github.com/GeekCornerGH/threema-for-desktop/blob/master/src/util/windowTitle.ts#L12), then I set application badge with the amount. If we have 9 unread messages or less, app will [show the amount](https://github.com/GeekCornerGH/threema-for-desktop/blob/master/src/util/windowTitle.ts#L36). Else, it will show a [dot](https://github.com/GeekCornerGH/threema-for-desktop/blob/master/src/util/windowTitle.ts#L36).
* Finally, the app checks if a user is clicking on a link and [open it in the default browser](https://github.com/GeekCornerGH/threema-for-desktop/blob/master/src/index.ts#L149-L165)

## Remember,
I have no way to read your messages, everything is kept on your mobile phone, and the app is fully [open source](https://github.com/GeekCornerGH/Threema-For-Desktop). You can then just ask your favorite JS/TS Developer to audit the source code.
If you enjoy this app, remember to drop a ⭐on the repo
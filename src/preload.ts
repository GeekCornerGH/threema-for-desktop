/*
 * All of the Node.js APIs are available in the preload process.
 * It has the same sandbox as a Chrome extension.
 */
import { ipcRenderer } from "electron";
ipcRenderer.on(
    "console",
    () => {

        console.log(
            "%cHey, stop.",
            "color: white; -webkit-text-stroke: 4px #a02d2a; font-size: 60px; font-weight: bold"
        );
        console.log(
            "%cBefore you do anything, make sure you know what you are doing.",
            "font-size: 16px"
        );
        console.log(
            "%cElse, close this panel and stay safe.",
            "font-size: 16px"
        );

    }
);

function setNotificationCallback(createCallback, clickCallback) {

    const OldNotify = window.Notification,
        newNotify = function (title, opt) {

            createCallback(
                title,
                opt
            );
            const instance = new OldNotify(
                title,
                opt
            );
            instance.addEventListener(
                "click",
                clickCallback
            );
            return instance;

        };
    newNotify.requestPermission = OldNotify.requestPermission.bind(OldNotify);
    Object.defineProperty(
        newNotify,
        "permission",
        {
            "get": () => OldNotify.permission
        }
    );

    // @ts-ignore
    window.Notification = newNotify;

}
function notifyNotificationCreate(title, opt) {

    console.log(title);
    console.log(opt);
    ipcRenderer.send(
        "notification",
        title,
        opt
    );

}
function notifyNotificationClick() {

    ipcRenderer.send("notification-click");

}

setNotificationCallback(
    notifyNotificationCreate,
    notifyNotificationClick
);

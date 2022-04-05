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

if (document.location.href.includes("threema.ch")) {
    window.addEventListener("popstate", function () {
        if (this.document.location.href.includes("#!/messenger")) {
            document.getElementsByTagName("md-menu-item")[4].addEventListener("click", () => {
                this.setTimeout(function (){
                    if(!document.getElementsByClassName("md-dialog-content")[0].innerHTML.includes("Desktop")) document.getElementsByClassName("md-dialog-content")[0].innerHTML = document.getElementsByClassName("md-dialog-content")[0].innerHTML.replace('</ul>', '<li><a href="https://github.com/GeekCornerGH/Threema-For-Desktop" target="_BLANK">Threema For Desktop</a> is not affiliated with <a href="https://threema.ch" target="_BLANK">Threema</a> and is licenced under <a href="https://github.com/GeekCornerGH/threema-for-desktop/blob/master/LICENSE">MIT License</a>.</li></ul>')
                }, 100)
            });
        };
    })
}
import * as drpc from "discord-rpc";
const client = new drpc.Client({"transport": "ipc"});
export async function rpc (details, date) {

    drpc.register("829374669000933432");
    client.on(
        "ready",
        async () => {

            await client.setActivity({
                "buttons": [
                    {
                        "label": "Download 📥",
                        "url": "https://github.com/GeekCornerGH/Threema-For-Desktop/releases/latest"
                    },
                    {
                        "label": "Source code ⌨",
                        "url": "https://github.com/GeekCornerGH/Threema-For-Desktop/"
                    }
                ],
                "details": details,
                "state": `Powered by Electron v${process.versions.electron}, NodeJS v${process.versions.node}, Chromium v${process.versions.chrome} & v8 v${process.versions.v8}.`,
                "startTimestamp": date,
                "largeImageKey": "threema",
                "largeImageText": "Unofficial client by GeekCorner."
            });

        }
    );

    client.login({"clientId": "829374669000933432"}).catch((e) => {

        console.log(e);

    });

}

export async function createRPC (details, date) {

    await client.setActivity({
        "buttons": [
            {
                "label": "Download 📥",
                "url": "https://github.com/GeekCornerGH/Threema-For-Desktop/releases/latest"
            },
            {
                "label": "Source code ⌨",
                "url": "https://github.com/GeekCornerGH/Threema-For-Desktop/"
            }
        ],
        "details": details,
        "state": `Powered by Electron v${process.versions.electron}, NodeJS v${process.versions.node}, Chromium v${process.versions.chrome} & v8 v${process.versions.v8}.`,
        "startTimestamp": date,
        "largeImageKey": "threema",
        "largeImageText": "Unofficial client by GeekCorner."
    });

}


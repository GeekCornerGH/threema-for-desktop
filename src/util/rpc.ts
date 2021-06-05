import * as drpc from "discord-rpc";
drpc.register("829374669000933432");
const client = new drpc.Client({ transport: "ipc" });
export  async function rpc (details, date) {
	client.on("ready", async() => {
		client.request("SET_ACTIVITY", {
			pid: process.pid,
			activity: {
				details: `${details} `,
				state: `Powered by Electron v${process.versions.electron}, NodeJS v${process.versions.node}, Chromium v${process.versions.chrome} & v8 v${process.versions.v8} `,
				timestamps: {
					start: date
				},
				assets: {
					large_image: "threema",
					large_text: "Unofficial client by GeekCorner.",
				},
				buttons: [{
					label: "Download 📥",
					url: "https://github.com/GeekCornerGH/Threema-For-Desktop/releases/latest"
				},
				{
					label: "Source code ⌨",
					url: "https://github.com/GeekCornerGH/Threema-For-Desktop/"
				},
				],
			},
		});
	});

	client.login({ clientId: "829374669000933432" }).catch((e) => {
		console.log(e);
	});
};

export async function createRPC(details, date) {
	client.request("SET_ACTIVITY", {
		pid: process.pid,
		activity: {
			details: `${details} `,
			state: `Powered by Electron v${process.versions.electron}, NodeJS v${process.versions.node}, Chromium v${process.versions.chrome} & v8 v${process.versions.v8} `,
			timestamps: {
				start: date
			},
			assets: {
				large_image: "threema",
				large_text: "Unofficial client by GeekCorner.",
			},
			buttons: [{
				label: "Download 📥",
				url: "https://github.com/GeekCornerGH/Threema-For-Desktop/releases/latest"
			},
			{
				label: "Source code ⌨",
				url: "https://github.com/GeekCornerGH/Threema-For-Desktop/"
			},
			],
		},
	});
};


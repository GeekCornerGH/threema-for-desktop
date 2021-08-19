module.exports = {
	appId: "threema-for-desktop",
	productName: "Threema For Desktop",
	artifactName: "Threema-For-Desktop-setup-${version}.${ext}",
	copyright: `Copyright © 2018-${new Date().getFullYear()} GeekCorner`,
	directories: {
		buildResources: "build-assets",
		output: "build-binaries"
	},
	win: {
		target: [{
			target: "nsis",
			arch: ["x64", "ia32", "arm64"]
		},
		{
			target: "portable",
			arch: ["x64", "ia32", "arm64"],
		},
			/*{
				target: "msi",
				arch: ["x64", "ia32", "arm64"]
			}*/]
	},
	nsis: {
		oneClick: false,
		perMachine: false,
		allowElevation: true,
		allowToChangeInstallationDirectory: true,
		license: "./build-assets/license.txt",
		displayLanguageSelector: true,

	},
	msi: {
		artifactName: "Threema-For-Desktop-setup-${version}.${ext}",
		createDesktopShortcut: true,
		createStartMenuShortcut: true,
		shortcutName: "Threema For Desktop"
	},
	portable: {
		artifactName: "Threema-For-Desktop-portable-${arch}-${version}.${ext}",

	},
	mac: {
		target: [{
			target: "dmg",
			arch: ["x64", "arm64"],
		}],
		category: "public.app-category.social-networking"
	},
	dmg: {
		artifactName: "Threema-For-Desktop-mac-${arch}-${version}.${ext}",

	},

	linux: {
		target: ["AppImage"],
		maintainer: "GeekCorner",
		vendor: "GeekCorner",
		synopsis: "Threema For Desktop",
		description: "Threema For Desktop",
		category: "Office"
	},
	appImage: {
		artifactName: "Threema-For-Desktop-linux-${version}.${ext}",
	},
	compression: "maximum",
	files: [
		"!{docs,.github,build-binaries,src,CONTRIBUTORS.MD,.all-contributorsrc,.eslintignore,.eslintrc.json,.gitignore,.nvmrc,.travis.yml,build.js,tsconfig.json,yarn.lock}"
	],
	asar: true
}
const builder = require('electron-builder')
const Platform = builder.Platform

function getCurrentPlatform() {
    switch (process.platform) {
        case 'win32':
            return Platform.WINDOWS
        case 'darwin':
            return Platform.MAC
        case 'linux':
            return Platform.linux
        default:
            console.error('Cannot resolve current platform!')
            return undefined
    }
}

builder.build({
    targets: (process.argv[2] != null && Platform[process.argv[2]] != null ? Platform[process.argv[2]] : getCurrentPlatform()).createTarget(),
    config: {
        appId: 'threema-for-desktop',
        productName: 'Threema For Desktop',
        artifactName: 'Threema-For-Desktop-setup-${version}.${ext}',
        copyright: 'Copyright © 2018-2021 GeekCorner',
        directories: {
            buildResources: 'build',
            output: 'dist'
        },
        win: {
            target: [
                {
                    target: 'nsis',
                    arch: ['x64', 'ia32', 'arm64']
                }
            ]
        },
        nsis: {
            oneClick: false,
            perMachine: false,
            allowElevation: true,
            allowToChangeInstallationDirectory: true,
            license: './build/license.txt',
            displayLanguageSelector: true,
        },
        mac: {
            target: [{
                target: 'dmg',
                arch: ['x64', 'arm64'],
            }],
            category: 'public.app-category.social-networking'
        },
        dmg: {
            artifactName: 'Threema-For-Desktop-mac-${arch}-${version}.${ext}'
        },
        linux: {
            target: ['AppImage'],
            maintainer: 'GeekCorner',
            vendor: 'GeekCorner',
            synopsis: 'Threema For Desktop',
            description: 'Threema For Desktop',
            category: 'Office'
        },
        appImage: {
            artifactName: 'Threema-For-Desktop-linux-${version}.${ext}'
        },
        compression: 'maximum',
        files: [
            '!{dist,.gitignore,.vscode,.travis.yml,.nvmrc,build.js,.github}'
        ],
        asar: true
    }
}).then(() => {
    console.log('Build complete!')
}).catch(err => {
    console.error('Error during build!', err)
})

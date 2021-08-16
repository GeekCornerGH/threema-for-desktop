declare namespace Electron {
    interface App extends NodeJS.EventEmitter {
        isQuiting?: boolean;
    }
}

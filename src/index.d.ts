declare namespace Electron {
    interface App extends NodeJS.EventEmitter {
        isQuiting?: boolean;
    }
}
declare module "*.json" {
    const value: any;
    export default value;
  }
import {App} from 'electron';
export interface customApp extends App {
    isQuiting: boolean,
    haveRPC: boolean,
}
import applyPlugin from './applyPlugin';
import loadPlugin from './loadPlugin';

export interface Plugins extends Array<string> {
    [name: number]: string
}

export {
    applyPlugin,
    loadPlugin
};
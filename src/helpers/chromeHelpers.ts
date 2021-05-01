import { Message } from "../types/message";

export function sendCommandToTab(message: Message, callback?: (response: any) => void): void {
    queryCurrentTab((tab) => {
        if (tab && tab.id) {
            chrome.tabs.sendMessage(tab.id, message, callback);
        }
    });
}

export function sendCommandToWorker(message: Message, callback?: ((response: any) => void) | undefined): void {
    chrome.runtime.sendMessage(message, callback);
}

export function queryCurrentTab(callback: (tab: chrome.tabs.Tab | null) => void) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        tabs.length > 0 ? callback(tabs[0]) : callback(null);
    });
}

export function navigateCurrentTab(url: string, callback?: () => void): void {
    queryCurrentTab((tab) => {
        if (tab && tab.id) {
            chrome.tabs.update(tab.id, { url }, () => {
                if (callback) {
                    callback();
                }
            });
        }
    });
}
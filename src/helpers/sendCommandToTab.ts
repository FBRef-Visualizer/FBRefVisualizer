import { Message } from "../types/message";

export function sendCommandToTab(message: Message, callback?: (response: any) => void): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0]?.id;
        if (tab) {
            chrome.tabs.sendMessage(tab, message, callback);
        }
    });
}

export function sendCommandToWorker(message: Message, callback?: ((response: any) => void) | undefined): void {
    chrome.runtime.sendMessage(message, callback);
}
import { Message } from "../types/message";

function sendCommandToTab(message: Message, callback?: (response: any) => void): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0]?.id;
        if (tab) {
            chrome.tabs.sendMessage(tab, message, callback);
        }
    });
}

export default sendCommandToTab;
import { Command, Message } from "./types/message";

function testUrl(url?: string): boolean {
    return url?.startsWith('https://fbref.com/en/players/') === true;
}

function sendScreenshot(dataUrl: string, tabId: number): void {
    chrome.tabs.sendMessage(tabId, { command: Command.DownloadResponse, dataUrl });
}

function capture(windowId: number, tabId: number): void {
    chrome.tabs.captureVisibleTab(
        windowId,
        { format: 'png' },
        (dataUrl) => sendScreenshot(dataUrl, tabId)
    );
}

function download(sender: chrome.runtime.MessageSender): void {
    const windowId = sender.tab?.windowId;
    if (windowId) {
        capture(windowId, sender.tab?.id ?? -1);
    } else {
        console.error('no window id to capture');
    }
}

function enableIcon(sender: chrome.runtime.MessageSender): void {
    const tabId = sender.tab?.id;
    if (tabId) {
        chrome.action.setIcon({
            tabId,
            path: 'icon16.png'
        });
    }
}

function handleMessage(request: Message, sender: chrome.runtime.MessageSender): void {
    if (request.command === Command.Download) {
        download(sender);
    } else if (request.command === Command.EnableIcon) {
        enableIcon(sender);
    }
}

function handleClick(tab: chrome.tabs.Tab): void {
    if (tab?.id && testUrl(tab?.url)) {
        chrome.tabs.sendMessage(tab.id, { command: Command.Launch });
    }
}

function handleNav(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab): void {
    console.log('nav', changeInfo.status, changeInfo, tab);
    if (changeInfo?.status === 'complete' && testUrl(tab?.url)) {
        // inject our payload
        console.log('injecting');
        chrome.scripting.executeScript({
            target: { tabId, allFrames: false },
            files: ['chart.js']
        }, () => {
            chrome.scripting.executeScript({
                target: { tabId, allFrames: false },
                files: ['react.js']
            }, () => {
                chrome.scripting.executeScript({
                    target: { tabId, allFrames: false },
                    files: ['react-dom.js']
                }, () => {
                    chrome.scripting.executeScript({
                        target: { tabId, allFrames: false },
                        files: ['inject.js']
                    });
                });
            });
        });
    }
}

chrome.action.onClicked.addListener(handleClick);
chrome.tabs.onUpdated.addListener(handleNav);
chrome.runtime.onMessage.addListener(handleMessage);
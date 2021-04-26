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


function setIcon(sender: chrome.runtime.MessageSender, enable: boolean): void {
    const tabId = sender.tab?.id;
    setIconByTabId(tabId, enable);
}

function setIconByTabId(tabId: number | undefined, enable: boolean): void {
    const suffix = enable ? '.png' : '-disabled.png';
    const path = {
        "16": `icon16${suffix}`,
        "48": `icon48${suffix}`,
        "128": `icon128${suffix}`
    };
    console.log('set icon', path, tabId);
    if (tabId) {
        chrome.action.setIcon({ tabId, path });
    }
}

function handleMessage(request: Message, sender: chrome.runtime.MessageSender): void {
    if (request.command === Command.Download) {
        download(sender);
    } else if (request.command === Command.EnableIcon) {
        setIcon(sender, true);
    } else if (request.command === Command.DisableIcon) {
        setIcon(sender, false);
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
        //disable icon while we see if there is data
        setIconByTabId(tabId, false);

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
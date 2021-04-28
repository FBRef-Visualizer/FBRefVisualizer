import db from './db';
import { Command, Message } from "./types/message";

function testUrl(url?: string): boolean {
    return url?.startsWith('https://fbref.com/en/players/') === true;
}

function sendScreenshot(dataUrl: string, tabId: number): void {
    chrome.tabs.sendMessage(tabId, { command: Command.DownloadDone, dataUrl });
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
    if (tabId) {
        chrome.action.setIcon({ tabId, path });
    }
}

function togglePopup(enable: boolean): void {
    if (enable) {
        chrome.action.setPopup({ popup: 'popup.html' });
    } else {
        chrome.action.setPopup({ popup: '' });
    }
}

function handleMessage(message: Message, sender: chrome.runtime.MessageSender): void {
    if (message.command === Command.SetInitialState) {
        setIcon(sender, message.status);
        togglePopup(true);
    }
    else if (message.command === Command.Download) {
        download(sender);
    } else if (message.command === Command.AddToCompare) {
        const { player } = message;
        db
            .players
            .put(player, player.id)
            .catch(err => console.error('failed to add to db', err));
    } else if (message.command === Command.Close) {
        // pass through because it's not coming from a tab
        if (sender.tab?.id) {
            chrome.tabs.sendMessage(sender.tab.id, { command: Command.Close });
        }
    }
}

function handleNav(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab): void {
    switch (changeInfo?.status) {
        case 'loading':
            setIconByTabId(tabId, false);
            togglePopup(false);
            break;
        case 'complete':
            if (testUrl(tab?.url)) {
                // inject our payload
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
            break;
    }
}

chrome.tabs.onUpdated.addListener(handleNav);
chrome.runtime.onMessage.addListener(handleMessage);
import db from './db';
import { Command, Message } from "./types/message";

function testUrl(url?: string): boolean {
    return url?.startsWith('https://fbref.com/') === true;
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

function handleMessage(message: Message, sender: chrome.runtime.MessageSender, response?: (data: any) => void): boolean {
    if (message.command === Command.Download) {
        download(sender);
    } else if (message.command === Command.AddToCompare) {
        const { player } = message;
        db
            .players
            .put(player, player.id)
            .catch(err => console.error('failed to add to db', err));
    } else if (message.command === Command.RemoveFromCompare) {
        db
            .players
            .delete(message.id)
            .catch(ex => console.error(ex));
    } else if (message.command === Command.Close) {
        // pass through because it's not coming from a tab
        if (sender.tab?.id) {
            chrome.tabs.sendMessage(sender.tab.id, { command: Command.Close });
        }
    } else if (message.command === Command.InitialLoadComplete) {
        if (sender.tab?.id) {
            chrome.tabs.sendMessage(sender.tab.id, {
                command: Command.InitialLoadComplete,
                id: message.id,
                name: message.name
            });
        }
    }
    else if (message.command === Command.RequestCompare) {
        db
            .players
            .toArray()
            .then((players) => {
                console.log('players', players);
                if (response) {
                    response(players);
                }
            })
            .catch(ex => console.error(ex));
        // keep the socket open
        return true;
    }

    // close the socket unless we explicity keep it open
    return false;
}

function handleNav(tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab): void {
    if (testUrl(tab?.url)) {
        setIconByTabId(tabId, true);
        if (changeInfo?.status === 'complete') {
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
    } else {
        setIconByTabId(tabId, false);
    }
}

chrome.tabs.onUpdated.addListener(handleNav);
chrome.runtime.onMessage.addListener(handleMessage);
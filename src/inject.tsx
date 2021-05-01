import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/chartApp/app";
import { sendCommandToWorker } from "./helpers/sendCommandToTab";
import scrape, { canScrape, getId, loadName } from './scraping';
import { Command, Message } from "./types/message";
import Player from "./types/player";

const reactDivId = 'react-radar';
let status: boolean = false;

function getReactDiv(): HTMLDivElement | null {
    const element = document.getElementById(reactDivId) as HTMLDivElement;
    return element;
}

function insertReactDiv(): HTMLDivElement {
    const existingDiv = getReactDiv();
    if (existingDiv) {
        return existingDiv;
    }
    const div = document.createElement('div');
    div.id = reactDivId;
    document.body.appendChild(div);
    return div;
}

function requestLoadStatusListener(message: Message, _sender: chrome.runtime.MessageSender, sendResponse: (data: { status: boolean; id: string; name: string; }) => void): void {
    if (message.command === Command.RequestLoadStatus) {
        const name = loadName();
        const id = getId();
        sendResponse({ status, id, name });
    }
}

function scrapeDataForCompareListener(message: Message): void {
    if (message.command === Command.ScrapeDataForCompare) {
        console.log('scrape data for compare');
        const scrapeResult = scrape();
        if (scrapeResult) {
            const [id, info, stats] = scrapeResult;
            sendCommandToWorker({
                command: Command.AddToCompare,
                player: {
                    id: `${id}-${info.position}`,
                    info,
                    stats,
                    timestamp: new Date()
                }
            });
        } else {
            console.error('Failed to scrape');
        }
    }
}

function launchListener(message: Message): void {
    if (message.command === Command.Launch) {
        let players: Player[] = message.players ? message.players : [];
        let splitIndexes: number[] | null = null;

        if (players.length === 0) {
            const scrapeResult = scrape();
            if (scrapeResult) {
                const [id, info, stats, si] = scrapeResult;
                splitIndexes = si;
                players.push({
                    id,
                    info,
                    stats,
                    timestamp: new Date()
                });
            }
        }

        if (players.length > 0) {
            document.getElementsByTagName('html')[0]?.classList.add('radar');
            const reactDiv = insertReactDiv();
            ReactDOM.render(<App
                players={players}
                splitIndexes={splitIndexes}
            />, reactDiv);
        }
    }
}

function closeListener(message: Message): void {
    if (message.command === Command.Close) {
        document.getElementsByTagName('html')[0]?.classList.remove('radar');
        const element = getReactDiv();
        if (element) {
            ReactDOM.unmountComponentAtNode(element);
        }
    }
}

function init(): void {
    status = canScrape();
    if (status) {
        chrome.runtime.sendMessage({ command: Command.SetInitialState, status: true }, () => {
            chrome.runtime.onMessage.addListener(requestLoadStatusListener);
            chrome.runtime.onMessage.addListener(scrapeDataForCompareListener);
            chrome.runtime.onMessage.addListener(launchListener);
            chrome.runtime.onMessage.addListener(closeListener);
        });
    }
    else {
        chrome.runtime.sendMessage({ command: Command.SetInitialState, status: false });
        console.warn('No data to scrape');
    }
}
init();
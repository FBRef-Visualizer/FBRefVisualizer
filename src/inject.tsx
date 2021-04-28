import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/chartApp/app";
import scrape, { canScrape } from './scraping';
import { Command, Message } from "./types/message";

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

function init(): void {
    status = canScrape();
    if (status) {
        chrome.runtime.sendMessage({ command: Command.SetInitialState, status: true }, () => {
            chrome.runtime.onMessage.addListener((message: Message) => {
                if (message.command === Command.Launch) {
                    document.getElementsByTagName('html')[0]?.classList.add('radar');
                    const scrapeResult = scrape();
                    if (scrapeResult) {
                        const [id, info, stats, splitIndexes] = scrapeResult;
                        const reactDiv = insertReactDiv();
                        ReactDOM.render(<App
                            id={id}
                            info={info}
                            stats={stats}
                            splitIndexes={splitIndexes}
                        />, reactDiv);
                    }
                } else if (message.command === Command.Close) {
                    document.getElementsByTagName('html')[0]?.classList.remove('radar');
                    const element = getReactDiv();
                    if (element) {
                        ReactDOM.unmountComponentAtNode(element);
                    }
                }
            });
        });
    }
    else {
        chrome.runtime.sendMessage({ command: Command.SetInitialState, status: false });
        console.warn('No data to scrape');
    }
}
init();

function requestLoadStatusListener(message: Message, _sender: chrome.runtime.MessageSender, sendResponse: (hasData: boolean) => void): void {
    if (message.command === Command.RequestLoadStatus) {
        console.log('got request for load status');
        sendResponse(status);
    }
}

chrome.runtime.onMessage.addListener(requestLoadStatusListener);
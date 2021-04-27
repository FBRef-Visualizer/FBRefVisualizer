import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/App";
import scrape, { canScrape } from './scraping';
import { Command, Message } from "./types/message";

const reactDivId = 'react-radar';

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
    const enable = canScrape();
    if (enable) {
        chrome.runtime.sendMessage({ command: Command.EnableIcon }, () => {
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
        chrome.runtime.sendMessage({ command: Command.DisableIcon });
        console.warn('No data to scrape');
    }
}
init();
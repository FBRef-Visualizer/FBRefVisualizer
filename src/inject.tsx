import * as React from "react";
import * as ReactDOM from "react-dom";
import App from "./components/App";
import scrape, { canScrape } from './scraping';
import { Command, Message } from "./types/message";

function insertReactDiv(): HTMLDivElement {
    const div = document.createElement('div');
    div.id = 'react-radar';
    document.body.appendChild(div);
    return div;
}

function init(): void {
    const enable = canScrape();
    if (enable) {
        console.log('enable');
        chrome.runtime.sendMessage({ command: Command.EnableIcon }, () => {
            chrome.runtime.onMessage.addListener((message: Message) => {
                if (message.command === Command.Launch) {
                    document.getElementsByTagName('html')[0]?.classList.add('radar');
                    const scrapeResult = scrape();
                    if (scrapeResult) {
                        const [info, stats, splitIndexes] = scrapeResult;
                        const reactDiv = insertReactDiv();
                        console.log('loading react');
                        ReactDOM.render(<App
                            info={info}
                            stats={stats}
                            splitIndexes={splitIndexes}
                        />, reactDiv);
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
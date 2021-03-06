import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/chartApp/app';
import { sendCommandToWorker } from './helpers/chromeHelpers';
import scrape, { canScrape, getId, loadName } from './scraping';
import { Command, Message } from './types/message';
import Player from './types/player';

const reactDivId = 'react-radar';
let status = false;

function getReactDiv(): HTMLDivElement | null {
	const element = document.getElementById(reactDivId) as HTMLDivElement;
	return element;
}

function closeReactDiv(): void {
	document.getElementsByTagName('html')[0]?.classList.remove('radar');
	const element = getReactDiv();
	if (element) {
		ReactDOM.unmountComponentAtNode(element);
	}
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

function requestLoadStatusListener(
	message: Message,
	_sender: chrome.runtime.MessageSender,
	// eslint-disable-next-line no-unused-vars
	sendResponse: (data: { status: boolean; id: string; name: string; }) => void
): boolean {
	if (message.command === Command.RequestLoadStatus) {
		if (status) {
			const name = loadName();
			const id = getId();
			sendResponse({ status, id, name });
		} else {
			sendResponse({ status: false, id: 'n/a', name: 'n/a' });
		}
		return true;
	}
	return false;
}

function scrapeDataForCompareListener(message: Message): boolean {
	if (message.command === Command.ScrapeDataForCompare) {
		const scrapeResult = scrape();
		if (scrapeResult) {
			const [id, info, stats] = scrapeResult;
			sendCommandToWorker({
				command: Command.AddToCompare,
				player: {
					id: `${id}-${info.position || ''}`,
					info,
					stats,
					timestamp: new Date()
				}
			});
		} else {
			console.error('Failed to scrape');
		}
		return true;
	}
	return false;
}

function launchListener(message: Message): boolean {
	if (message.command === Command.Launch) {
		closeReactDiv();
		const players: Player[] = message.players ? message.players : [];
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

		return true;
	}
	return false;
}

function closeListener(message: Message): boolean {
	if (message.command === Command.Close) {
		closeReactDiv();
		return true;
	}
	return false;
}

function init(): void {
	status = canScrape();
	if (status) {
		// only listen for scrape requests if we can actually scrape data
		chrome.runtime.onMessage.addListener(scrapeDataForCompareListener);
	}
	// we want these to run regardless of if there is data
	chrome.runtime.onMessage.addListener(launchListener);
	chrome.runtime.onMessage.addListener(closeListener);
	chrome.runtime.onMessage.addListener(requestLoadStatusListener);

	sendCommandToWorker({
		command: Command.InitialLoadComplete,
		status,
		name: status ? loadName() : null
	});
}
init();

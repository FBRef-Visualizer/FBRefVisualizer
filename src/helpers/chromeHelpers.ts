import { Message } from '../types/message';
import { defaultOptions, Options } from '../types/options';

export function queryCurrentTab(
	callback: (tab: chrome.tabs.Tab | null
	) => void
): void {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => (
		tabs.length > 0 ? callback(tabs[0]) : callback(null)
	));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sendCommandToTab<T extends ((args: any) => void)>(
	message: Message,
	callback?: T | undefined): void {
	queryCurrentTab((tab) => {
		if (tab && tab.id) {
			chrome.tabs.sendMessage(tab.id, message, callback);
		}
	});
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sendCommandToWorker<T extends ((args: any) => void)>(
	message: Message,
	callback?: T | undefined): void {
	chrome.runtime.sendMessage(message, callback);
}

export function navigateCurrentTab(url: string, callback?: () => void): void {
	queryCurrentTab((tab) => {
		if (tab && tab.id) {
			chrome.tabs.update(tab.id, { url }, () => {
				if (callback) {
					callback();
				}
			});
		}
	});
}

export function loadOptions(callback: (options: Options) => void): void {
	chrome.storage.sync.get(defaultOptions, (options) => { callback(options as Options); });
}

export function saveOptions(
	newOptions: Partial<Options>,
	callback?: (options: Options) => void
): void {
	loadOptions((options) => {
		const newOption: Options = { ...options, ...newOptions };
		chrome.storage.sync.set(newOption, () => {
			if (callback) {
				callback(newOption);
			}
		});
	});
}

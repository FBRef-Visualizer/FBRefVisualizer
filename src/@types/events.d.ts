interface SummaryFetchedEvent extends Event {
    readonly summary: string;
}

declare var SummaryFetchedEvent: {
    prototype: SummaryFetchedEvent;
    new(summary: string): SummaryFetchedEvent;
};

interface SummaryParsedEvent extends Event {
    readonly data: string;
}

declare var SummaryParsedEvent: {
    prototype: SummaryParsedEvent;
    new(data: string): SummaryParsedEvent;
};

declare interface WindowEventMapExtended extends WindowEventMap {
    'summary-fetched': SummaryFetchedEvent;
    'summary-parsed': SummaryParsedEvent;
    'csv-button-clicked': Event;
}

declare interface Window {
    addEventListener<K extends keyof WindowEventMapExtended>
        (type: K, listener: (this: Window, ev: WindowEventMapExtended[K]) => any, options?: boolean | AddEventListenerOptions): void;
}
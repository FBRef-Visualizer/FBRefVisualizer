const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function datesAreSameYear(first: Date, second: Date): boolean {
    return first.getFullYear() === second.getFullYear();
}

function datesAreOnSameDay(first: Date, second: Date): boolean {
    return datesAreSameYear(first, second) &&
        first.getMonth() === second.getMonth() &&
        first.getDate() === second.getDate();
}

function getClockTime(date: Date): string {
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
}

function getFriendlyDate(date: Date, now: Date): string {
    const monthName = monthNames[date.getMonth()];
    const day = date.getDate();

    if (datesAreSameYear(date, now)) {
        return `${monthName} ${day}`;
    }

    const year = date.getFullYear();
    return `${monthName} ${day}, ${year}`;

}

export function formatTime(date?: Date | string | number): string {
    if (!date) {
        return '';
    }

    const now = new Date();
    const parsedDate = new Date(date);


    if (datesAreOnSameDay(parsedDate, now)) {
        return `Today - ${getClockTime(parsedDate)}`;
    }

    return `${getFriendlyDate(parsedDate, now)} - ${getClockTime(parsedDate)}`;
}
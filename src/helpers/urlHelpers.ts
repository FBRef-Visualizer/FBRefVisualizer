export function testUrl(url?: string): boolean {
    return url?.startsWith('https://fbref.com/') === true;
}
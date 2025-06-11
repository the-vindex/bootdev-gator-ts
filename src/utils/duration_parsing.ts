const unitToMs = new Map([
    ["ms", 1],
    ["s", 1000],
    ["m", 60 * 1000],
    ["h", 60 * 60 * 1000]
]);

export function parseDuration(duration: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = duration.match(regex);
    
    
    if (!match || match.length !== 3) {
        throw new Error(`Invalid duration "${duration}"`);
    } else{
        const amount = parseInt(match[1]);
        const unit = match[2];

        const unitConvertedToMs = unitToMs.get(unit);
        if (unitConvertedToMs === undefined){
            throw new Error(`Invalid duration ${duration}, unknown unit`);
        }
        return unitConvertedToMs * amount;
    }
}

export function formatDuration(milliseconds: number): string {
    const hours = Math.floor(milliseconds / (60 * 60 * 1000));
    const minutesAndLess = milliseconds % (60 * 60 * 1000);
    const minutes = Math.floor(minutesAndLess / (60 * 1000));
    const secondsAndLess = minutesAndLess % (60 * 1000);
    const seconds = Math.floor(secondsAndLess / 1000);
    const ms = secondsAndLess % 1000;

    const hoursString = hours > 0 ? `${hours}h` : "";
    const minutesString = minutes > 0 || hours > 0 ? `${minutes}m` : "";
    const secondsString = seconds > 0 || minutes >0 || hours > 0 ? `${seconds}s` : "";
    const msString = ms > 0 ?`${ms}ms` : "";
    return `${hoursString}${minutesString}${secondsString}${msString}`;
}
export class Countdown {
    constructor(date, onData, onNothing) {
        if (!onData) {
            throw 'Data callback is missing'
        }
        this.onData = onData;
        this.onNothing = onNothing;
        this.date = date;
        this.ticker;
    }

    startTicking() {
        if (!this.ticker) {
            this.tick();
            this.ticker = setInterval(() => this.tick(), 1000);
        }

    }

    tick(from = Date.now()) {
        const to = new Date(this.date);
        const diff = to - from;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const units = [
            (days ? `${days} ${days === 1 ? 'day' : 'days'}` : ''),
            (hours ? `${hours} ${hours === 1 ? 'hour' : 'hours'}` : ''),
            (minutes ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}` : ''),
            `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`
        ]

        if (diff > 0) {
            this.onData(units.filter(unit => unit).join(", "));
        } else if (this.onNothing) {
            this.onNothing();
        }
        // toggle: show time in GMT / Local Timezone??? 'click on any date??' add to FAQ?
    }

    stopTicking() {
        clearInterval(this.ticker);
        this.ticker = undefined;
    }
}
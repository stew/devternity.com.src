import $ from "cash-dom";


export class Sky {
    constructor() {
        this.sky = $(".sky");
        this.stars = [];
    }

    height() {
        return Math.round(this.sky.height());
    }

    width() {
        return Math.round(this.sky.width());
    }

    redraw() {
        this.stars.forEach(stars => {
            stars.remove()
        })

        const density = 0.00003;
        const area = this.height() * this.width();

        this.stars = [
            new Stars({ size: '1px', count: density * area * 4, journeySeconds: this.height() / 40 }),
            new Stars({ size: '2px', count: density * area * 2, journeySeconds: this.height() / 20 }),
            new Stars({ size: '3px', count: density * area, journeySeconds: this.height() / 10 })
        ]

        this.stars.forEach(stars => {
            stars.appendTo(this.sky)
        })
    }
}

class Stars {
    constructor(spec) {
        this.size = spec.size;
        this.count = spec.count;
        this.journeySeconds = spec.journeySeconds;
        this.id = $.guid++;
    }

    remove() {
        $(`#fading-stars-${this.id}`).remove();
        $(`#coming-stars-${this.id}`).remove();
    }

    appendTo(sky) {
        const height = sky.height();
        const width = sky.width();

        const newBoxShadow = () => `${random(width)}px ${random(height)}px grey`
        var boxShadow = newBoxShadow();
        for (var i = 0; i < this.count; i++) {
            boxShadow = `${boxShadow}, ${newBoxShadow()}`
        }

        sky.append(`<div id="fading-stars-${this.id}" class="stars absolute -z-10 top-0" style="width: ${this.size}; height: ${this.size}; box-shadow: ${boxShadow}"></div>`)
        sky.append(`<div id="coming-stars-${this.id}" class="stars absolute -z-10 bottom-0" style="width: ${this.size}; height: ${this.size}; box-shadow: ${boxShadow}"></div>`)

        const moveUp = (starsSelector) => {
            const stars = document.getElementById(starsSelector);
            stars.animate([
                { transform: 'translateY(0px)' },
                { transform: `translateY(-${height}px)` }
            ], {
                duration: this.journeySeconds * 1000,
                iterations: Infinity
            });
        }

        moveUp(`fading-stars-${this.id}`)
        moveUp(`coming-stars-${this.id}`)
    }
}

function random(max) {
    return Math.floor(Math.random() * max);
}
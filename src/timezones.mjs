import $ from "cash-dom";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import advancedFormat from 'dayjs/plugin/advancedFormat.js'
dayjs.extend(advancedFormat)
dayjs.extend(utc)
dayjs.extend(timezone)

const TOGGLE = '.timeZoneToggle';
const toggles = $(TOGGLE)
const toggleTexts = $(TOGGLE + ' .info')
const toggleInputs = $(TOGGLE + ' input')

const timeRanges = $('[data-date-from]')

function timeZone(timeZoneName) {
    return new Date()
        .toLocaleDateString('en-US', {
            day: '2-digit',
            timeZoneName
        })
        .slice(4);
}


export class Switches {
    constructor() {
        this.localTimeZone = timeZone('long');  // Malaysia Time
        this.localTimeOffset = timeZone('short');      // GMT+8
        toggleTexts.text(`Show ${this.localTimeZone} (${this.localTimeOffset})`);
    }

    onToggle(handler) {
        $(toggleInputs).on('change', toggle => {
            $(toggleInputs).prop('checked', toggle.target.checked)
            handler();
        })
    }

    hide() {
        toggles.hide();
    }

    isGMT() {
        return this.localTimeOffset === 'GMT'
    }
}

export class Times {
    localize() {
        const DEFAULT_TZ = 'GMT';
        const timeZone = toggleInputs.is(':checked') ? dayjs.tz.guess() : DEFAULT_TZ;
        timeRanges.each((_index, e) => {
            const from = dayjs($(e).data('date-from')).tz(timeZone);
            const to = dayjs($(e).data('date-to')).tz(timeZone);
            const timeZoneWithOffset = to.format('z')
            $(e).html(`${from.format('H:mm')} - ${to.format('H:mm')}<br>${timeZoneWithOffset === 'UTC' ? 'GMT' : timeZoneWithOffset}`);
        })
    }
}

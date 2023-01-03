const TOGGLE = '.timeZoneToggle';
const toggles = $(TOGGLE)
const toggleTexts = $(TOGGLE + ' .text')
const toggleInputs = $(TOGGLE + ' input')

const timeRanges = $('[data-date-from]')

import $ from "cash-dom";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import advancedFormat from 'dayjs/plugin/advancedFormat.js'
dayjs.extend(advancedFormat)
dayjs.extend(utc)
dayjs.extend(timezone)


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
        this.localTimeZone = timeZone('longGeneric');  // Malaysia Time
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
        timeRanges.each((_index, e) => {
            const DEFAULT_TZ = 'Europe/London';
            const timeZone = toggleInputs.is(':checked') ? dayjs.tz.guess() : DEFAULT_TZ;
            const from = dayjs($(e).data('date-from')).tz(timeZone).format('H:mm')
            const to = dayjs($(e).data('date-to')).tz(timeZone).format('H:mm z')
            $(e).html(`${from} - ${to}`);
        })
    }
}
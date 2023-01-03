import $ from "cash-dom";
import { Sky } from "./sky.mjs";
import { Modal } from "./modal.mjs"
import { Countdown } from "./countdown.mjs";
import { Switches, Times } from "./timezones.mjs";

function initTimeZoneSwitches() {
    const switches = new Switches();
    if (switches.isGMT()) {
        switches.hide();
        return;
    }

    const times = new Times();
    times.localize();
    switches.onToggle(() => times.localize());
}


function initCountdown() {
    const target = $("#countdown");
    const conferenceOpening = target.data("date-iso");
    const prefix = target.data("prefix");
    const nothing = target.data("nothing");
    const countdown = new Countdown(conferenceOpening, (time) => { target.html(prefix + time) }, () => target.html(nothing))
    countdown.startTicking();
}

function initSky() {
    const sky = new Sky();
    $(window).on('resize load', () => {
        sky.redraw();
    })
}

function initModal() {
    $('[data-modal]').on('click', (e) => {
        const selector = $(e.target).data("modal");
        new Modal(selector).open();
    })
}

function initPageEmerging() {
    $(window).on('pageshow', () => {
        $('body').removeClass('opacity-0').addClass('opacity-100');
    })
}

initModal();
initSky();
initPageEmerging();
initCountdown();
initTimeZoneSwitches();
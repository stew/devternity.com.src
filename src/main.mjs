import $ from "cash-dom";
import { Sky } from "./sky.mjs";
import { Modal } from "./modal.mjs"
import { Countdown } from "./countdown.mjs";
import { Switches, Times } from "./timezones.mjs";
import { CurrencySwitcher } from "./prices.mjs";

import * as Sentry from "@sentry/browser";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
    dsn: "https://623d5f87c6b14ea1ad82cba7afc5fb21@o4504854084255744.ingest.sentry.io/4504854087139328",
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
});

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
    if (!Element.prototype.animate) {
        return;
    }

    const sky = new Sky();
    $(window).on('load', () => {
        sky.redraw();
    })

    var oldWidth = sky.width();
    var oldHeight = sky.height();
    $(window).on('resize', () => {
        const hasSkyGrownBigger = oldWidth < sky.width() || oldHeight < sky.height();
        if (hasSkyGrownBigger) {
            sky.redraw();
            oldWidth = sky.width();
            oldHeight = sky.height();
        }
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
        $('.later').removeClass('opacity-0').addClass('opacity-100 duration-500');
    })
}

function initCurrencySwitcher() {
    const switcher = new CurrencySwitcher();
    switcher.init();
}


initPageEmerging();
initModal();
initSky();
initCountdown();
initTimeZoneSwitches();
initCurrencySwitcher();

$(window).on('scroll', () => {
    const scroll = $(window).prop('scrollY');
    if (scroll >= 150) {
        $('.excellent').addClass("opacity-0 duration-500");
    } else {
        $('.excellent').removeClass("opacity-0");
    }
});

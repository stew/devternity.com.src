import $ from "cash-dom";
import { Sky } from "./sky.mjs";
import { Modal } from "./modal.mjs"
import { Countdown } from "./countdown.mjs";
import { Switches, Times } from "./timezones.mjs";
import { CurrencySwitcher } from "./prices.mjs";

let role = 0;
function showNextRole() {
    if (role === 4) {
        role = 0
    }
    $('#turningTo').children().addClass('opacity-0').removeClass('opacity-100')
    $('#turningTo').children().eq(role++).removeClass('opacity-0').addClass('opacity-100')
}

setInterval(() => {
    showNextRole()
}, 4000)


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
        $('body').removeClass('opacity-0').addClass('opacity-100 duration-500');
    })
}

function initCurrencySwitcher() {
    const switcher = new CurrencySwitcher();
    switcher.init();
}



initModal();
initSky();
initPageEmerging();
initCountdown();
initTimeZoneSwitches();
initCurrencySwitcher();